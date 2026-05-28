import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Shield, Settings, 
  Database, Eye, Edit2, Trash2,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Plus, Download, X, UserPlus, Stethoscope, UserCog,
  Power, PowerOff, Loader, Calendar, MapPin, Phone, Mail, Heart, Droplet, FileText,
  UserCheck, UserX, Filter, RefreshCw, Info, Activity, Baby, Briefcase, User as UserIcon
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserSystemMgmtPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('active');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [addUserSuccess, setAddUserSuccess] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [viewUserDetails, setViewUserDetails] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalMothers: 0, totalProviders: 0, pendingApprovals: 0, deactivatedUsers: 0 });
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form states for different user types
  const [motherForm, setMotherForm] = useState({
    mother_id: '',
    full_name: '',
    nic: '',
    dob: '',
    phone_no: '',
    email: '',
    lmp_date: '',
    expected_delivery_date: '',
    current_weight: '',
    height: '',
    blood_group: '',
    pregnancy_status: 'pregnant',
    gravida: 1,
    para: 0,
    is_high_risk: false,
    address: '',
    district: '',
    gs_division: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_relationship: '',
    husband_name: '',
    husband_contact: '',
    allergies: '',
    chronic_diseases: ''
  });

  const [midwifeForm, setMidwifeForm] = useState({
    employee_id: '',
    full_name: '',
    contact_number: '',
    email: '',
    assigned_area: '',
    district: '',
    qualification: ''
  });

  const [adminForm, setAdminForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_no: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchUsers();
    await fetchStats();
    setRefreshing(false);
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/user-stats');
      if (response.data.success) {
        const statsData = response.data.data.stats;
        setStats({
          totalUsers: statsData.active_users || 0,
          totalMothers: statsData.total_mothers || 0,
          totalProviders: statsData.total_providers || 0,
          pendingApprovals: statsData.pending_approvals || 0,
          deactivatedUsers: statsData.inactive_users || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update stats when users data changes
  useEffect(() => {
    if (users.length > 0) {
      const activeCount = users.filter(u => u.is_active).length;
      const inactiveCount = users.filter(u => !u.is_active).length;
      const motherCount = users.filter(u => u.role === 'mother' && u.is_active).length;
      const providerCount = users.filter(u => (u.role === 'midwife' || u.role === 'doctor') && u.is_active).length;
      
      setStats(prev => ({
        ...prev,
        totalUsers: activeCount,
        deactivatedUsers: inactiveCount,
        totalMothers: motherCount,
        totalProviders: providerCount
      }));
    }
  }, [users]);

  // View User Details Function
  const handleViewUser = async (userItem) => {
    setViewingUser(userItem);
    setViewLoading(true);
    setIsViewModalOpen(true);

    try {
      const response = await api.get(`/admin/users/${userItem.user_id}/details`);

      if (response.data.success) {
        const { user, roleDetails } = response.data.data;
        const merged = {
          ...user,
          ...(roleDetails || {})
        };
        setViewUserDetails(merged);
      } else {
        setViewUserDetails(userItem);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setViewUserDetails(userItem);
    } finally {
      setViewLoading(false);
    }
  };

  // Download User PDF Function
  const handleDownloadUserPDF = async (userItem) => {
    // First fetch full details (same as view modal)
    let fullUser = { ...userItem };

    try {
      const response = await api.get(`/admin/users/${userItem.user_id}/details`);
      if (response.data.success) {
        const { user, roleDetails } = response.data.data;
        fullUser = { ...user, ...(roleDetails || {}) };
      }
    } catch (error) {
      console.error('Error fetching user details for PDF:', error);
      // Falls back to basic userItem data
    }

    // Now generate PDF with full data
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryColor = [219, 39, 119];
    const grayColor = [107, 114, 128];

    // ── Header ──────────────────────────────────────────────────────────────
    doc.setFillColor(253, 242, 248);
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Pearl Mom', 20, 18);

    doc.setFontSize(13);
    doc.setTextColor(31, 41, 55);
    doc.text('User Profile Report', 20, 30);

    doc.setFontSize(8);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);
    doc.text(`Generated by: ${user?.name || 'Admin'}`, pageWidth - 20, 40, { align: 'right' });

    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 50, pageWidth - 20, 50);

    let y = 62;

    // ── Section helper ───────────────────────────────────────────────────────
    const drawSection = (title, fields, bgColor = [249, 250, 251]) => {
      // Page break check before starting section
      if (y > pageHeight - 50) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text(title, 20, y);
      y += 5;

      const rowH = 8;
      const sectionH = Math.ceil(fields.length / 2) * rowH + 8;
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(18, y - 2, pageWidth - 36, sectionH, 2, 2, 'F');

      fields.forEach(([label, value], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = col === 0 ? 22 : pageWidth / 2 + 4;
        const fy = y + row * rowH + 4;

        // Page break mid-section
        if (fy > pageHeight - 20) {
          doc.addPage();
          y = 20;
          return;
        }

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text(String(label), x, fy);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(17, 24, 39);

        const raw = (value !== null && value !== undefined && value !== '') ? String(value) : '—';
        const maxWidth = pageWidth / 2 - 16;
        // Split long text across lines
        const lines = doc.splitTextToSize(raw, maxWidth);
        doc.text(lines[0], x, fy + 4.5); // Only first line to keep layout tight
      });

      y += sectionH + 10;
    };

    // ── Role & Status badges ─────────────────────────────────────────────────
    const roleLabel =
      fullUser.role === 'midwife' ? 'Provider' :
      fullUser.role ? fullUser.role.charAt(0).toUpperCase() + fullUser.role.slice(1) : 'Unknown';
    const statusLabel = fullUser.is_active ? 'Active' : 'Deactivated';

    const badgeColor =
      fullUser.role === 'admin'  ? [252, 231, 243] :
      fullUser.role === 'midwife'? [219, 234, 254] :
                                  [237, 233, 254];
    const badgeText =
      fullUser.role === 'admin'  ? [157,  23,  77] :
      fullUser.role === 'midwife'? [ 29,  78, 216] :
                                  [109,  40, 217];

    doc.setFillColor(...badgeColor);
    doc.roundedRect(20, y - 6, 30, 9, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...badgeText);
    doc.text(roleLabel, 35, y - 0.5, { align: 'center' });

    const statusBg = fullUser.is_active ? [209, 250, 229] : [254, 226, 226];
    const statusFg = fullUser.is_active ? [6, 95, 70]     : [153, 27,  27];
    doc.setFillColor(...statusBg);
    doc.roundedRect(54, y - 6, 26, 9, 2, 2, 'F');
    doc.setTextColor(...statusFg);
    doc.text(statusLabel, 67, y - 0.5, { align: 'center' });

    y += 12;

    // ── Basic Information ────────────────────────────────────────────────────
    drawSection('Basic Information', [
      ['User ID',            fullUser.user_id],
      ['Full Name',          fullUser.name],
      ['Email',              fullUser.email],
      ['Phone Number',       fullUser.phone_no],
      ['Role',               roleLabel],
      ['Status',             statusLabel],
      ['Last Login',         fullUser.last_login ? new Date(fullUser.last_login).toLocaleString() : 'Never'],
      ['Profile Completed',  fullUser.profile_completed ? 'Yes' : 'No'],
      ['Account Created',    fullUser.created_at ? new Date(fullUser.created_at).toLocaleDateString() : 'N/A'],
    ]);

    // ── Mother-specific sections ─────────────────────────────────────────────
    if (fullUser.role === 'mother') {
      drawSection('Pregnancy Details', [
        ['Mother Code',        fullUser.mother_code],
        ['NIC',                fullUser.nic],
        ['Date of Birth',      fullUser.dob ? new Date(fullUser.dob).toLocaleDateString() : null],
        ['Blood Group',        fullUser.blood_group],
        ['Pregnancy Status',   fullUser.pregnancy_status
                                ? fullUser.pregnancy_status.charAt(0).toUpperCase() + fullUser.pregnancy_status.slice(1)
                                : null],
        ['Current Week',       fullUser.weeks != null ? `${fullUser.weeks} weeks` : null],
        ['LMP Date',           fullUser.lmp_date ? new Date(fullUser.lmp_date).toLocaleDateString() : null],
        ['Expected Delivery',  fullUser.expected_delivery_date ? new Date(fullUser.expected_delivery_date).toLocaleDateString() : null],
        ['Current Weight',     fullUser.current_weight != null ? `${fullUser.current_weight} kg` : null],
        ['Height',             fullUser.height != null ? `${fullUser.height} cm` : null],
        ['Gravida',            fullUser.gravida],
        ['Para',               fullUser.para],
        ['High Risk',          fullUser.is_high_risk ? 'Yes' : 'No'],
      ], [255, 242, 248]);

      drawSection('Address & Contact', [
        ['Address',            fullUser.address],
        ['District',           fullUser.district],
        ['GS Division',        fullUser.gs_division],
        ['Emergency Contact',  fullUser.emergency_contact_name],
        ['Emergency Phone',    fullUser.emergency_contact_phone],
        ['Relationship',       fullUser.emergency_relationship],
        ['Husband Name',       fullUser.husband_name],
        ['Husband Contact',    fullUser.husband_contact],
      ]);

      drawSection('Medical History', [
        ['Allergies',          fullUser.allergies   || 'None'],
        ['Chronic Diseases',   fullUser.chronic_diseases || 'None'],
      ], [255, 247, 237]);
    }

    // ── Midwife-specific section ─────────────────────────────────────────────
    if (fullUser.role === 'midwife') {
      drawSection('Provider Details', [
        ['Employee ID',        fullUser.employee_id],
        ['Qualification',      fullUser.qualification],
        ['Years of Experience',fullUser.years_of_experience != null ? `${fullUser.years_of_experience} years` : null],
        ['Assigned Area',      fullUser.assigned_area],
        ['District',           fullUser.district],
      ], [239, 246, 255]);
    }

    // ── Footer on every page ─────────────────────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(249, 250, 251);
      doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(
        `Pearl Mom User Report  •  Page ${i} of ${totalPages}  •  © ${new Date().getFullYear()} PearlMom. All rights reserved.`,
        pageWidth / 2,
        pageHeight - 4,
        { align: 'center' }
      );
    }

    // ── Save ─────────────────────────────────────────────────────────────────
    const safeName = (fullUser.name || 'user').replace(/\s+/g, '_');
    doc.save(`PearlMom_${safeName}_${fullUser.user_id}.pdf`);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const primaryColor = [219, 39, 119];

      doc.setFillColor(245, 245, 250);
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Pearl Mom', 20, 20);
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text('User & System Management Report', 20, 35);
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 50, 20);
      doc.line(20, 50, pageWidth - 20, 50);

      let yPos = 65;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('System Statistics', 20, yPos);
      yPos += 8;

      const statsData = [
        ['Total Active Users:', stats.totalUsers.toString()],
        ['Total Mothers:', stats.totalMothers.toString()],
        ['Total Providers:', stats.totalProviders.toString()],
        ['Deactivated Users:', stats.deactivatedUsers.toString()],
        ['Pending Approvals:', stats.pendingApprovals.toString()]
      ];

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      statsData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPos);
        yPos += 7;
      });

      yPos += 10;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Active Users', 20, yPos);
      yPos += 8;

      const activeUsers = users.filter(u => u.is_active);
      const activeTableData = activeUsers.map(u => [
        u.user_id?.toString() || u.id || 'N/A',
        u.name,
        u.role === 'midwife' ? 'Provider' : u.role,
        'Active',
        u.email || ''
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['ID', 'Name', 'Role', 'Status', 'Email']],
        body: activeTableData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 20 },
        width: pageWidth - 40
      });

      yPos = doc.lastAutoTable.finalY + 10;

      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Deactivated Users', 20, yPos);
      yPos += 8;

      const deactivatedUsers = users.filter(u => !u.is_active);
      const deactivatedTableData = deactivatedUsers.map(u => [
        u.user_id?.toString() || u.id || 'N/A',
        u.name,
        u.role === 'midwife' ? 'Provider' : u.role,
        'Inactive',
        u.email || ''
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['ID', 'Name', 'Role', 'Status', 'Email']],
        body: deactivatedTableData,
        theme: 'striped',
        headStyles: { fillColor: [156, 163, 175], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 20 },
        width: pageWidth - 40
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(`Pearl Mom User Report - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        doc.text(`© ${new Date().getFullYear()} PearlMom. All rights reserved.`, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });
      }

      doc.save(`PearlMom_User_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    } finally {
      setExporting(false);
    }
  };

  const handleAddMother = async () => {
    if (!motherForm.full_name || !motherForm.nic || !motherForm.phone_no || !motherForm.current_weight || !motherForm.height) {
      alert('Please fill in all required fields: Full Name, NIC, Phone, Weight, Height');
      return;
    }

    try {
      const response = await api.post('/admin/add-mother', {
        full_name: motherForm.full_name,
        nic: motherForm.nic,
        dob: motherForm.dob,
        phone_no: motherForm.phone_no,
        email: motherForm.email,
        address: motherForm.address,
        district: motherForm.district,
        gs_division: motherForm.gs_division,
        blood_group: motherForm.blood_group,
        lmp_date: motherForm.lmp_date,
        expected_delivery_date: motherForm.expected_delivery_date,
        current_weight: motherForm.current_weight,
        height: motherForm.height,
        pregnancy_status: motherForm.pregnancy_status,
        gravida: motherForm.gravida,
        para: motherForm.para,
        is_high_risk: motherForm.is_high_risk,
        emergency_contact_name: motherForm.emergency_contact_name,
        emergency_contact_phone: motherForm.emergency_contact_phone,
        emergency_relationship: motherForm.emergency_relationship,
        husband_name: motherForm.husband_name,
        husband_contact: motherForm.husband_contact,
        allergies: motherForm.allergies,
        chronic_diseases: motherForm.chronic_diseases
      });

      if (response.data.success) {
        const { default_password, mother } = response.data.data;
        setAddUserSuccess(true);
        setTimeout(() => {
          alert(`✅ Mother added!\n\nMother Code: ${mother.mother_code}\nPhone: ${motherForm.phone_no}\nPassword: ${default_password}`);
          handleCloseAddUserModal();
          refreshData();
        }, 800);
      }
    } catch (error) {
      alert('Error adding mother: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddMidwife = async () => {
    if (!midwifeForm.full_name || !midwifeForm.contact_number || !midwifeForm.email) {
      alert('Please fill in all required fields: Full Name, Contact Number, Email');
      return;
    }

    try {
      const response = await api.post('/admin/add-provider', {
        full_name: midwifeForm.full_name,
        contact_number: midwifeForm.contact_number,
        email: midwifeForm.email,
        assigned_area: midwifeForm.assigned_area,
        district: midwifeForm.district,
        qualification: midwifeForm.qualification
      });

      if (response.data.success) {
        const { default_password, midwife } = response.data.data;
        setAddUserSuccess(true);
        setTimeout(() => {
          alert(`✅ Provider added!\n\nEmployee ID: ${midwife.employee_id}\nEmail: ${midwifeForm.email}\nPassword: ${default_password}`);
          handleCloseAddUserModal();
          refreshData();
        }, 800);
      }
    } catch (error) {
      alert('Error adding provider: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddAdmin = async () => {
    if (!adminForm.full_name || !adminForm.email || !adminForm.password) {
      alert('Please fill in all required fields: Full Name, Email, Password');
      return;
    }
    if (adminForm.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    try {
      const response = await api.post('/admin/add-admin', {
        full_name: adminForm.full_name,
        email: adminForm.email,
        password: adminForm.password,
        phone_no: adminForm.phone_no
      });

      if (response.data.success) {
        setAddUserSuccess(true);
        setTimeout(() => {
          alert(`✅ Admin added successfully!\n\nEmail: ${adminForm.email}\nPassword: ${adminForm.password}`);
          handleCloseAddUserModal();
          refreshData();
        }, 800);
      }
    } catch (error) {
      alert('Error adding admin: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditUser = (userItem) => {
    setEditingUser({ ...userItem });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/admin/users/${editingUser.user_id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role.toLowerCase(),
        is_active: editingUser.is_active === true || editingUser.status === 'Active'
      });
      if (response.data.success) {
        refreshData();
        setIsEditModalOpen(false);
        setEditingUser(null);
      }
    } catch (error) {
      alert('Error updating user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? false : true;
    try {
      const response = await api.put(`/admin/users/${userId}`, { is_active: newStatus });
      if (response.data.success) {
        setUsers(prev =>
          prev.map(u =>
            u.user_id === userId ? { ...u, is_active: newStatus } : u
          )
        );
        setShowDeactivateConfirm(null);
      } else {
        alert('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, { is_active: true });
      if (response.data.success) {
        setUsers(prev =>
          prev.map(u =>
            u.user_id === userId ? { ...u, is_active: true } : u
          )
        );
        alert('User reactivated successfully!');
      } else {
        alert('Failed to reactivate user. Please try again.');
      }
    } catch (error) {
      console.error('Error reactivating user:', error);
      alert('Error reactivating user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenAddUserModal = () => {
    setSelectedUserType(null);
    setAddUserSuccess(false);
    setMotherForm({
      mother_id: '',
      full_name: '',
      nic: '',
      dob: '',
      phone_no: '',
      email: '',
      lmp_date: '',
      expected_delivery_date: '',
      current_weight: '',
      height: '',
      blood_group: '',
      pregnancy_status: 'pregnant',
      gravida: 1,
      para: 0,
      is_high_risk: false,
      address: '',
      district: '',
      gs_division: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_relationship: '',
      husband_name: '',
      husband_contact: '',
      allergies: '',
      chronic_diseases: ''
    });
    setMidwifeForm({
      employee_id: '',
      full_name: '',
      contact_number: '',
      email: '',
      assigned_area: '',
      district: '',
      qualification: ''
    });
    setAdminForm({
      full_name: '',
      email: '',
      password: '',
      phone_no: ''
    });
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setSelectedUserType(null);
    setAddUserSuccess(false);
  };

  const filteredByStatus = users.filter(u => activeTab === 'active' ? u.is_active : !u.is_active);
  const filteredUsers = filteredByStatus.filter(u => {
    const searchMatch = searchTerm === '' || 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.user_id?.toString().includes(searchTerm);
    const roleMatch = filterRole === 'all' || (u.role?.toLowerCase() === filterRole.toLowerCase());
    return searchMatch && roleMatch;
  });

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-800';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role) => {
    if (role === 'Admin') return 'bg-pink-100 text-pink-800';
    if (role === 'midwife' || role === 'doctor') return 'bg-blue-100 text-blue-800';
    return 'bg-purple-100 text-purple-800';
  };

  const permissionMatrix = [
    { action: 'View Dashboard', admin: true, provider: true, mother: true },
    { action: 'View Medical Records', admin: true, provider: true, mother: true },
    { action: 'Edit Medical Records', admin: true, provider: true, mother: false },
    { action: 'Manage Users', admin: true, provider: false, mother: false },
    { action: 'Manage Vaccinations', admin: true, provider: true, mother: false },
    { action: 'Manage Thriposha', admin: true, provider: true, mother: false },
    { action: 'View Reports', admin: true, provider: true, mother: true },
    { action: 'Export Data', admin: true, provider: false, mother: false },
    { action: 'System Configuration', admin: true, provider: false, mother: false },
    { action: 'Post Articles', admin: true, provider: true, mother: false }
  ];

  const contentStats = {
    publishedArticles: 142,
    activeSchedules: 12,
    faqItems: 88
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User & System Management</h1>
          <p className="text-gray-500 mt-1">Managing {stats.totalUsers} active records and system integrity.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={refreshData} disabled={refreshing} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleExportPDF} disabled={exporting} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center space-x-2">
            {exporting ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
            <span>Export PDF</span>
          </button>
          <button onClick={handleOpenAddUserModal} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3"><Users className="text-pink-500" size={24} /><div><p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p><p className="text-xs text-gray-500">Total Active Users</p></div></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3"><Heart className="text-purple-500" size={24} /><div><p className="text-2xl font-bold text-gray-900">{stats.totalMothers}</p><p className="text-xs text-gray-500">Total Mothers</p></div></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3"><Stethoscope className="text-blue-500" size={24} /><div><p className="text-2xl font-bold text-gray-900">{stats.totalProviders}</p><p className="text-xs text-gray-500">Total Providers</p></div></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3"><UserX className="text-red-500" size={24} /><div><p className="text-2xl font-bold text-gray-900">{stats.deactivatedUsers}</p><p className="text-xs text-gray-500">Deactivated</p></div></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3"><AlertTriangle className="text-yellow-500" size={24} /><div><p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p><p className="text-xs text-gray-500">Pending Approvals</p></div></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-300">
          <button onClick={() => setActiveTab('active')} className={`flex-1 px-6 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${activeTab === 'active' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/100' : 'text-gray-700 hover:text-gray-700 hover:bg-gray-50'}`}>
            <UserCheck size={18} /><span>Active Users</span><span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{users.filter(u => u.is_active).length}</span>
          </button>
          <button onClick={() => setActiveTab('deactivated')} className={`flex-1 px-6 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${activeTab === 'deactivated' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/100' : 'text-gray-700 hover:text-gray-700 hover:bg-gray-50'}`}>
            <UserX size={18} /><span>Deactivated Users</span><span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{users.filter(u => !u.is_active).length}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by ID, Name, or Email" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500">
            <option value="all">All Roles</option><option value="admin">Admin</option><option value="midwife">Provider</option><option value="mother">Mother</option>
          </select>
          <button onClick={() => { setSearchTerm(''); setFilterRole('all'); }} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter size={16} /><span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No {activeTab === 'active' ? 'active' : 'deactivated'} users found</td></tr>
              ) : (
                filteredUsers.map((userItem) => (
                  <tr key={userItem.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono text-gray-900">{userItem.user_id}</span></td>
                    <td className="px-6 py-4"><div><p className="text-sm font-medium text-gray-900">{userItem.name}</p><p className="text-xs text-gray-500">{userItem.email}</p></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>{userItem.role === 'midwife' ? 'Provider' : userItem.role}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userItem.is_active ? 'Active' : 'Inactive')}`}>{userItem.is_active ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}{userItem.is_active ? 'Active' : 'Deactivated'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-500">{userItem.last_login ? new Date(userItem.last_login).toLocaleString() : 'Never'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleViewUser(userItem)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="View"><Eye size={16} className="text-gray-400 hover:text-blue-500" /></button>
                        <button onClick={() => handleEditUser(userItem)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit"><Edit2 size={16} className="text-gray-400 hover:text-pink-500" /></button>
                        <button onClick={() => handleDownloadUserPDF(userItem)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Download PDF"><Download size={16} className="text-gray-400 hover:text-green-500" /></button>
                        {activeTab === 'active' ? (
                          <button onClick={() => setShowDeactivateConfirm(userItem.user_id)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Deactivate"><PowerOff size={16} className="text-gray-400 hover:text-red-500" /></button>
                        ) : (
                          <button onClick={() => handleReactivateUser(userItem.user_id)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Reactivate"><Power size={16} className="text-gray-400 hover:text-green-500" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center"><Shield className="mr-2 text-gray-400" size={20} />Permission Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead><tr><th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Action</th><th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Admin</th><th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Provider</th><th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Mother</th></tr></thead>
            <tbody>{permissionMatrix.map((perm, index) => (<tr key={index}><td className="py-3 text-sm text-gray-900">{perm.action}</td><td className="text-center py-3">{perm.admin ? <CheckCircle size={16} className="text-pink-500 mx-auto" /> : <XCircle size={16} className="text-gray-300 mx-auto" />}</td><td className="text-center py-3">{perm.provider ? <CheckCircle size={16} className="text-pink-500 mx-auto" /> : <XCircle size={16} className="text-gray-300 mx-auto" />}</td><td className="text-center py-3">{perm.mother ? <CheckCircle size={16} className="text-pink-500 mx-auto" /> : <XCircle size={16} className="text-gray-300 mx-auto" />}</td></tr>))}</tbody>
          </table>
        </div>
      </div>

      {/* Content Repository */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Content Repository</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200"><p className="text-3xl font-bold text-pink-600">{contentStats.publishedArticles}</p><p className="text-sm text-gray-600 mt-1">Published Articles</p></div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200"><p className="text-3xl font-bold text-pink-600">{contentStats.activeSchedules}</p><p className="text-sm text-gray-600 mt-1">Active Schedules</p></div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200"><p className="text-3xl font-bold text-pink-600">{contentStats.faqItems}</p><p className="text-sm text-gray-600 mt-1">FAQ Items</p></div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg shadow-sm p-6 border border-pink-200">
        <div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-gray-900">System Health</h2><p className="text-sm text-gray-600 mt-1">All protocols are running within optimal maternal-safety parameters.</p></div><div className="text-right"><p className="text-3xl font-bold text-pink-600">99.9%</p><p className="text-sm text-gray-500">UPTIME</p></div></div>
      </div>

      {/* View User Modal - Simplified for brevity, but keep your existing modal code */}
      {isViewModalOpen && viewUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3"><div className="p-2 bg-blue-100 rounded-lg"><Info size={24} className="text-blue-600" /></div><div><h2 className="text-xl font-semibold text-gray-900">User Details</h2><p className="text-xs text-gray-500">Complete user information</p></div></div>
              <button onClick={() => setIsViewModalOpen(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            {viewLoading ? (
              <div className="p-12 text-center"><Loader className="h-12 w-12 animate-spin text-pink-600 mx-auto" /><p>Loading user details...</p></div>
            ) : (
              <div className="p-6">
                <div className="mb-6"><h3 className="text-lg font-semibold mb-4">Basic Information</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                  <div><p className="text-xs text-gray-500">User ID</p><p className="font-medium text-gray-900">{viewUserDetails.user_id}</p></div>
                  <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium text-gray-900">{viewUserDetails.name}</p></div>
                  <div><p className="text-xs text-gray-500">Role</p><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(viewUserDetails.role)}`}>{viewUserDetails.role === 'midwife' ? 'Provider' : viewUserDetails.role}</span></div>
                  <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-gray-900">{viewUserDetails.email || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Phone Number</p><p className="font-medium text-gray-900">{viewUserDetails.phone_no || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewUserDetails.is_active ? 'Active' : 'Inactive')}`}>{viewUserDetails.is_active ? 'Active' : 'Deactivated'}</span></div>
                  <div><p className="text-xs text-gray-500">Last Login</p><p className="font-medium text-gray-900">{viewUserDetails.last_login ? new Date(viewUserDetails.last_login).toLocaleString() : 'Never'}</p></div>
                  <div><p className="text-xs text-gray-500">Profile Completed</p><p className="font-medium text-gray-900">{viewUserDetails.profile_completed ? 'Yes' : 'No'}</p></div>
                </div></div>
              </div>
            )}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end"><button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Close</button></div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-900">Edit User</h2><button onClick={() => setIsEditModalOpen(false)}><X size={20} className="text-gray-500" /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="mother">Mother</option><option value="midwife">Provider</option><option value="admin">Admin</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={editingUser.is_active ? 'Active' : 'Inactive'} onChange={(e) => setEditingUser({...editingUser, is_active: e.target.value === 'Active'})} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50"><button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={handleSaveEdit} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Save Changes</button></div>
          </div>
        </div>
      )}

      {/* Deactivate Confirm Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-orange-500" /></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to deactivate this user account?</p>
              <div className="flex space-x-3"><button onClick={() => setShowDeactivateConfirm(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => handleToggleStatus(showDeactivateConfirm, 'Active')} className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg">Confirm</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal - Complete Working Version */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <UserPlus size={24} className="text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              </div>
              <button onClick={handleCloseAddUserModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {addUserSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Added Successfully!</h3>
                  <p className="text-gray-500">The new user has been added to the system.</p>
                </div>
              ) : !selectedUserType ? (
                <div>
                  <p className="text-sm text-gray-500 mb-6">Select the type of user you want to add:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={() => setSelectedUserType('mother')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-center group">
                      <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-200 transition-colors">
                        <Heart size={28} className="text-pink-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Mother</h3>
                      <p className="text-xs text-gray-500 mt-1">Add a pregnant mother</p>
                    </button>
                    <button onClick={() => setSelectedUserType('midwife')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-center group">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                        <Stethoscope size={28} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Midwife / Provider</h3>
                      <p className="text-xs text-gray-500 mt-1">Add a healthcare provider</p>
                    </button>
                    <button onClick={() => setSelectedUserType('admin')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-center group">
                      <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                        <UserCog size={28} className="text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Admin</h3>
                      <p className="text-xs text-gray-500 mt-1">Add an administrator</p>
                    </button>
                  </div>
                </div>
              ) : selectedUserType === 'mother' ? (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <button onClick={() => setSelectedUserType(null)} className="text-sm text-pink-600 hover:text-pink-700 font-medium">← Back to selection</button>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">Add Mother</span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mother ID</label><input type="text" value="Auto-generated" disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-500" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={motherForm.full_name} onChange={(e) => setMotherForm({...motherForm, full_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">NIC *</label><input type="text" value={motherForm.nic} onChange={(e) => setMotherForm({...motherForm, nic: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label><input type="date" value={motherForm.dob} onChange={(e) => setMotherForm({...motherForm, dob: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label><input type="tel" value={motherForm.phone_no} onChange={(e) => setMotherForm({...motherForm, phone_no: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label><input type="email" value={motherForm.email} onChange={(e) => setMotherForm({...motherForm, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      </div>
                    </div>

                    {/* Pregnancy Details - Add more fields as needed */}
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Pregnancy Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg) *</label><input type="number" step="0.1" value={motherForm.current_weight} onChange={(e) => setMotherForm({...motherForm, current_weight: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label><input type="number" step="0.1" value={motherForm.height} onChange={(e) => setMotherForm({...motherForm, height: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label><select value={motherForm.blood_group} onChange={(e) => setMotherForm({...motherForm, blood_group: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                        </select></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedUserType === 'midwife' ? (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <button onClick={() => setSelectedUserType(null)} className="text-sm text-pink-600 hover:text-pink-700 font-medium">← Back to selection</button>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">Add Midwife / Provider</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label><input type="text" value="Auto-generated" disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={midwifeForm.full_name} onChange={(e) => setMidwifeForm({...midwifeForm, full_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label><input type="tel" value={midwifeForm.contact_number} onChange={(e) => setMidwifeForm({...midwifeForm, contact_number: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={midwifeForm.email} onChange={(e) => setMidwifeForm({...midwifeForm, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Assigned Area *</label><input type="text" value={midwifeForm.assigned_area} onChange={(e) => setMidwifeForm({...midwifeForm, assigned_area: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">District *</label><input type="text" value={midwifeForm.district} onChange={(e) => setMidwifeForm({...midwifeForm, district: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label><input type="text" value={midwifeForm.qualification} onChange={(e) => setMidwifeForm({...midwifeForm, qualification: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <button onClick={() => setSelectedUserType(null)} className="text-sm text-pink-600 hover:text-pink-700 font-medium">← Back to selection</button>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">Add Admin</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={adminForm.full_name} onChange={(e) => setAdminForm({...adminForm, full_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input type="password" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label><input type="tel" value={adminForm.phone_no} onChange={(e) => setAdminForm({...adminForm, phone_no: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., +94 77 123 4567" /></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!addUserSuccess && selectedUserType && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button onClick={handleCloseAddUserModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={() => { 
                  if (selectedUserType === 'mother') handleAddMother();
                  else if (selectedUserType === 'midwife') handleAddMidwife();
                  else if (selectedUserType === 'admin') handleAddAdmin();
                }} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">Add User</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSystemMgmtPage;