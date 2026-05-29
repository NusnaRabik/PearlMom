import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, AlertCircle, ChevronRight, Eye, Plus, X, Calendar, User, Droplet, Phone, MapPin, Activity, Heart, Loader, CheckCircle2, Download } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ProviderChatWidget from '../../components/provider/ProviderChatWidget';

const MothersListPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMother, setSelectedMother] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [mothers, setMothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [addSuccessData, setAddSuccessData] = useState(null);

  const [newMother, setNewMother] = useState({
    mother_code: '',
    full_name: '',
    nic: '',
    dob: '',
    age: '',
    phone_no: '',
    email: '',
    address: '',
    district: '',
    gs_division: '',
    blood_group: '',
    lmp_date: '',
    expected_delivery_date: '',
    current_weight: '',
    height: '',
    pregnancy_status: 'pregnant',
    gravida: '1',
    para: '0',
    is_high_risk: false,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_relationship: '',
    husband_name: '',
    husband_contact: '',
    allergies: '',
    chronic_diseases: ''
  });

  // Fetch mothers on load
  useEffect(() => {
    fetchMothers();
  }, []);

  const fetchMothers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/providers/mothers');
      if (response.data.success) {
        const mothersData = response.data.data.mothers || [];
        const formattedMothers = mothersData.map(mother => ({
          id: mother.mother_code,
          name: mother.full_name,
          pregnancy: `${mother.gravida}${getOrdinal(mother.gravida)} Pregnancy`,
          age: calculateAge(mother.dob),
          edd: mother.expected_delivery_date ? formatDate(mother.expected_delivery_date, 'short') : '—',
          status: mother.is_high_risk ? 'High-risk' : (mother.pregnancy_status === 'postnatal' ? 'Postnatal' : 'Normal'),
          statusType: mother.is_high_risk ? 'high-risk' : (mother.pregnancy_status === 'postnatal' ? 'postnatal' : 'normal'),
          lastVisit: mother.updated_at ? getRelativeTime(mother.updated_at) : 'Never',
          color: mother.is_high_risk ? 'red' : (mother.pregnancy_status === 'postnatal' ? 'blue' : 'green'),
          bloodGroup: mother.blood_group || 'N/A',
          phone: mother.emergency_contact_phone || 'N/A',
          address: mother.address || 'N/A',
          weeks: mother.weeks || 0,
          bp: 'N/A',
          weight: mother.current_weight ? `${mother.current_weight} kg` : 'N/A',
          fhr: 'N/A',
          lastVisitDate: mother.updated_at,
          mother_id: mother.mother_id,
          nic: mother.nic,
          dob: mother.dob,
          height: mother.height,
          lmp_date: mother.lmp_date,
          gravida: mother.gravida,
          para: mother.para,
          emergency_contact_name: mother.emergency_contact_name,
          emergency_contact_phone: mother.emergency_contact_phone,
          emergency_relationship: mother.emergency_relationship,
          husband_name: mother.husband_name,
          husband_contact: mother.husband_contact,
          allergies: mother.allergies,
          chronic_diseases: mother.chronic_diseases,
          district: mother.district,
          gs_division: mother.gs_division,
          email: mother.email,
          phone_no: mother.phone_no,
          current_weight: mother.current_weight,
          expected_delivery_date: mother.expected_delivery_date,
          pregnancy_status: mother.pregnancy_status
        }));
        setMothers(formattedMothers);
      }
    } catch (error) {
      console.error('Error fetching mothers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getOrdinal = (n) => {
    if (!n) return '';
    const ordinals = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]);
  };

  const getRelativeTime = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const then = new Date(date);
    const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week ago`;
    return formatDate(date, 'short');
  };

  const calculateAgeFromDOB = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateEDD = (lmpDate) => {
    if (!lmpDate) return '';
    const lmp = new Date(lmpDate);
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);
    return edd.toISOString().split('T')[0];
  };

  const handleNewMotherChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setNewMother(prev => ({ ...prev, [name]: newValue }));
    
    if (name === 'dob') {
      const age = calculateAgeFromDOB(value);
      setNewMother(prev => ({ ...prev, age: age.toString() }));
    }
    
    if (name === 'lmp_date') {
      const edd = calculateEDD(value);
      setNewMother(prev => ({ ...prev, expected_delivery_date: edd }));
    }
  };

  const handleAddMother = async () => {
    // Required fields validation (mother_code is auto-generated, so not required)
    const requiredFields = ['full_name', 'nic', 'dob', 'phone_no', 'address', 'district', 'blood_group', 'lmp_date', 'emergency_contact_name', 'emergency_contact_phone', 'emergency_relationship'];
    const missingFields = requiredFields.filter(field => !newMother[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      // Don't send mother_code - let backend generate it
      const { mother_code, ...dataToSend } = newMother;
      
      const response = await api.post('/mothers/add', dataToSend);
      if (response.data.success) {
        setGeneratedPassword(response.data.data.default_password);
        setAddSuccessData(response.data.data.mother);
        setAddSuccess(true);
        await fetchMothers();
        setTimeout(() => {
          setShowAddModal(false);
          setAddSuccess(false);
          setAddSuccessData(null);
          setGeneratedPassword('');
          setNewMother({
            mother_code: '',
            full_name: '',
            nic: '',
            dob: '',
            age: '',
            phone_no: '',
            email: '',
            address: '',
            district: '',
            gs_division: '',
            blood_group: '',
            lmp_date: '',
            expected_delivery_date: '',
            current_weight: '',
            height: '',
            pregnancy_status: 'pregnant',
            gravida: '1',
            para: '0',
            is_high_risk: false,
            emergency_contact_name: '',
            emergency_contact_phone: '',
            emergency_relationship: '',
            husband_name: '',
            husband_contact: '',
            allergies: '',
            chronic_diseases: ''
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding mother:', error);
      alert(error.response?.data?.message || 'Failed to add mother');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewProfile = (mother) => {
    setSelectedMother(mother);
    setShowProfileModal(true);
  };

  const handleDownloadPDF = () => {
    if (!selectedMother) return;

    // Create new PDF document
    const doc = new jsPDF();
    
    // Add header with pink color
    doc.setFillColor(236, 72, 153);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Mother's Health Record", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 32, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Profile Header
    doc.setFillColor(253, 242, 248);
    doc.rect(14, 50, 182, 40, 'F');
    doc.setDrawColor(236, 72, 153);
    doc.setLineWidth(0.5);
    doc.rect(14, 50, 182, 40);
    
    doc.setFontSize(16);
    doc.setTextColor(236, 72, 153);
    doc.text(selectedMother.name || 'N/A', 105, 65, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`ID: ${selectedMother.id || 'N/A'}`, 105, 75, { align: 'center' });
    
    // Status badge
    const statusColor = selectedMother.statusType === 'high-risk' ? [220, 38, 38] : 
                        selectedMother.statusType === 'postnatal' ? [37, 99, 235] : [22, 163, 74];
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(80, 80, 50, 6, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(selectedMother.status || 'Normal', 105, 85, { align: 'center' });
    
    let yPos = 100;
    
    // Personal Information Section (without emoji)
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Personal Information", 14, yPos);
    doc.setFont('helvetica', 'normal');
    
    const personalData = [
      ["Full Name", selectedMother.name || 'N/A'],
      ["Mother ID", selectedMother.id || 'N/A'],
      ["NIC", selectedMother.nic || 'N/A'],
      ["Date of Birth", selectedMother.dob ? formatDate(selectedMother.dob, 'long') : 'N/A'],
      ["Age", `${selectedMother.age || 'N/A'} years`],
      ["Blood Group", selectedMother.bloodGroup || 'N/A'],
      ["Phone Number", selectedMother.phone_no || selectedMother.phone || 'N/A'],
      ["Email", selectedMother.email || 'N/A'],
      ["Address", selectedMother.address || 'N/A'],
      ["District", selectedMother.district || 'N/A'],
      ["GS Division", selectedMother.gs_division || 'N/A']
    ];
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Field', 'Information']],
      body: personalData,
      theme: 'striped',
      headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [253, 242, 248] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 110 }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Pregnancy Details Section (without emoji)
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Pregnancy Details", 14, yPos);
    doc.setFont('helvetica', 'normal');
    
    const pregnancyData = [
      ["LMP Date", selectedMother.lmp_date ? formatDate(selectedMother.lmp_date, 'long') : 'N/A'],
      ["Expected Due Date (EDD)", selectedMother.edd || (selectedMother.expected_delivery_date ? formatDate(selectedMother.expected_delivery_date, 'long') : 'N/A')],
      ["Current Week", `${selectedMother.weeks || 'N/A'} Weeks`],
      ["Gravida", selectedMother.gravida || 'N/A'],
      ["Para", selectedMother.para || 'N/A'],
      ["Current Weight", selectedMother.current_weight ? `${selectedMother.current_weight} kg` : selectedMother.weight || 'N/A'],
      ["Height", selectedMother.height ? `${selectedMother.height} cm` : 'N/A'],
      ["Pregnancy Status", selectedMother.pregnancy_status ? selectedMother.pregnancy_status.charAt(0).toUpperCase() + selectedMother.pregnancy_status.slice(1) : selectedMother.status || 'N/A']
    ];
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Field', 'Information']],
      body: pregnancyData,
      theme: 'striped',
      headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [253, 242, 248] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 110 }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Emergency Contact Section (without emoji)
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Emergency Contact", 14, yPos);
    doc.setFont('helvetica', 'normal');
    
    const emergencyData = [
      ["Contact Name", selectedMother.emergency_contact_name || 'N/A'],
      ["Contact Phone", selectedMother.emergency_contact_phone || 'N/A'],
      ["Relationship", selectedMother.emergency_relationship || 'N/A']
    ];
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Field', 'Information']],
      body: emergencyData,
      theme: 'striped',
      headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [253, 242, 248] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 110 }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Family Information (if available) (without emoji)
    if (selectedMother.husband_name || selectedMother.husband_contact) {
      doc.setTextColor(236, 72, 153);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Family Information", 14, yPos);
      doc.setFont('helvetica', 'normal');
      
      const familyData = [
        ["Husband Name", selectedMother.husband_name || 'N/A'],
        ["Husband Contact", selectedMother.husband_contact || 'N/A']
      ];
      
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Field', 'Information']],
        body: familyData,
        theme: 'striped',
        headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [253, 242, 248] },
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { cellWidth: 110 }
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Medical History (if available) (without emoji)
    if (selectedMother.allergies || selectedMother.chronic_diseases) {
      doc.setTextColor(236, 72, 153);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Medical History", 14, yPos);
      doc.setFont('helvetica', 'normal');
      
      const medicalData = [
        ["Allergies", selectedMother.allergies || 'None'],
        ["Chronic Diseases", selectedMother.chronic_diseases || 'None']
      ];
      
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Field', 'Information']],
        body: medicalData,
        theme: 'striped',
        headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [253, 242, 248] },
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { cellWidth: 110 }
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `This is a computer-generated document. No signature required. © ${new Date().getFullYear()} Maternal Health System - Clinical Record`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save(`Mother_Profile_${selectedMother.id || selectedMother.name.replace(/\s/g, '_')}.pdf`);
  };

  const filteredMothers = useMemo(() => {
    return mothers.filter((mother) => {
      const searchMatch = searchTerm === '' || 
        mother.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mother.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === 'all' || mother.statusType === filterStatus;
      return searchMatch && statusMatch;
    });
  }, [searchTerm, filterStatus, mothers]);

  const highRiskOverdue = mothers.filter(
    m => m.statusType === 'high-risk' && m.lastVisit !== 'Today' && m.lastVisit !== 'Yesterday'
  ).length;

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
          <h1 className="text-3xl font-bold text-gray-900">Assigned Patients</h1>
          <p className="text-gray-500 mt-1">Manage and monitor the health progress of mothers under your clinical care.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors whitespace-nowrap flex items-center space-x-2">
          <Plus size={16} /><span>Add New Mother</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Mother ID or Name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white">
            <option value="all">All Status</option>
            <option value="high-risk">High Risk</option>
            <option value="normal">Normal</option>
            <option value="postnatal">Postnatal</option>
          </select>
        </div>
      </div>

      {/* Alert for High Risk Overdue */}
      {highRiskOverdue > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Clinical Priority Alert</h3>
              <p className="text-sm text-yellow-700 mt-1">There are {highRiskOverdue} high-risk {highRiskOverdue === 1 ? 'mother' : 'mothers'} whose last visit was over a week ago. It is recommended to schedule an immediate check-up.</p>
            </div>
            <button className="text-sm font-medium text-yellow-600 hover:text-yellow-800 whitespace-nowrap transition-colors">Review High-Risk List →</button>
          </div>
        </div>
      )}

      {/* Mothers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mother ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EDD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMothers.length > 0 ? filteredMothers.map((mother) => (
                <tr key={mother.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-mono text-gray-900">{mother.id}</span></td>
                  <td className="px-6 py-4"><div><p className="text-sm font-medium text-gray-900">{mother.name}</p></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-900">{mother.age}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-900">{mother.edd}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mother.color === 'red' ? 'bg-red-100 text-red-800' : mother.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{mother.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${mother.lastVisit === 'Today' ? 'bg-green-400' : mother.lastVisit === 'Yesterday' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                      <span className="text-sm text-gray-500">{mother.lastVisit}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleViewProfile(mother)} className="text-pink-600 hover:text-pink-900 font-medium text-sm transition-colors">
                      View Profile
                    </button>
                   </td>
                 </tr>
              )) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No mothers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Mother Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <User className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Mother</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {addSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mother Added Successfully!</h3>
                  <p className="text-sm text-gray-500">Mother Code: <strong className="text-pink-600">{addSuccessData?.mother_code || 'Generated'}</strong></p>
                  <p className="text-sm text-gray-500 mt-1">Default password: <strong className="text-pink-600">{generatedPassword}</strong></p>
                  <p className="text-xs text-gray-400 mt-2">Mother can login using Full Name and this password</p>
                </div>
              ) : (
                <>
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-3 flex items-center"><User className="mr-2 text-pink-500" size={18} /> Basic Information <span className="text-red-500 ml-1">*</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother ID</label>
                        <input
                          type="text"
                          name="mother_code"
                          value={newMother.mother_code}
                          onChange={handleNewMotherChange}
                          placeholder="Auto-generated"
                          disabled
                          className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Auto-generated. Leave empty for automatic generation.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" name="full_name" value={newMother.full_name} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIC <span className="text-red-500">*</span></label>
                        <input type="text" name="nic" value={newMother.nic} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                        <input type="date" name="dob" value={newMother.dob} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input type="text" name="age" value={newMother.age} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone_no" value={newMother.phone_no} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                        <input type="email" name="email" value={newMother.email} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Pregnancy Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-3 flex items-center"><Heart className="mr-2 text-pink-500" size={18} /> Pregnancy Details <span className="text-red-500">*</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LMP Date <span className="text-red-500">*</span></label>
                        <input type="date" name="lmp_date" value={newMother.lmp_date} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Due Date</label>
                        <input type="date" name="expected_delivery_date" value={newMother.expected_delivery_date} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg) <span className="text-red-500">*</span></label>
                        <input type="number" step="0.1" name="current_weight" value={newMother.current_weight} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) <span className="text-red-500">*</span></label>
                        <input type="number" step="0.1" name="height" value={newMother.height} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group <span className="text-red-500">*</span></label>
                        <select name="blood_group" value={newMother.blood_group} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required>
                          <option value="">Select</option>
                          <option value="A+">A+</option><option value="A-">A-</option>
                          <option value="B+">B+</option><option value="B-">B-</option>
                          <option value="O+">O+</option><option value="O-">O-</option>
                          <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy Status</label>
                        <select name="pregnancy_status" value={newMother.pregnancy_status} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg">
                          <option value="pregnant">Pregnant</option>
                          <option value="postnatal">Postnatal</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gravida (No. of pregnancies)</label>
                        <input type="number" name="gravida" value={newMother.gravida} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Para (No. of deliveries)</label>
                        <input type="number" name="para" value={newMother.para} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" name="is_high_risk" checked={newMother.is_high_risk} onChange={handleNewMotherChange} className="w-4 h-4 mr-2" />
                        <label className="text-sm text-gray-700">High Risk Pregnancy</label>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-3 flex items-center"><MapPin className="mr-2 text-green-500" size={18} /> Location <span className="text-red-500">*</span></h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                        <textarea name="address" value={newMother.address} onChange={handleNewMotherChange} rows="2" className="w-full px-3 py-2 border rounded-lg" required></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">District <span className="text-red-500">*</span></label>
                        <input type="text" name="district" value={newMother.district} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GS Division</label>
                        <input type="text" name="gs_division" value={newMother.gs_division} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-3 flex items-center"><Phone className="mr-2 text-red-500" size={18} /> Emergency Contact <span className="text-red-500">*</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name <span className="text-red-500">*</span></label>
                        <input type="text" name="emergency_contact_name" value={newMother.emergency_contact_name} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone <span className="text-red-500">*</span></label>
                        <input type="tel" name="emergency_contact_phone" value={newMother.emergency_contact_phone} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship <span className="text-red-500">*</span></label>
                        <input type="text" name="emergency_relationship" value={newMother.emergency_relationship} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" required />
                      </div>
                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-3">Family / Spouse Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Husband Name</label>
                        <input type="text" name="husband_name" value={newMother.husband_name} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Husband Contact</label>
                        <input type="tel" name="husband_contact" value={newMother.husband_contact} onChange={handleNewMotherChange} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-3">Medical History</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                        <textarea name="allergies" value={newMother.allergies} onChange={handleNewMotherChange} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="List any allergies"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Diseases</label>
                        <textarea name="chronic_diseases" value={newMother.chronic_diseases} onChange={handleNewMotherChange} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="List any chronic diseases"></textarea>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!addSuccess && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={handleAddMother} disabled={submitting} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Mother'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && selectedMother && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Mother Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} className="text-gray-500" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-pink-600">{selectedMother.name?.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMother.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMother.id}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${selectedMother.color === 'red' ? 'bg-red-100 text-red-800' : selectedMother.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{selectedMother.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg"><div className="flex items-center space-x-2 mb-1"><Calendar size={16} className="text-gray-400" /><span className="text-xs text-gray-500">EDD</span></div><p className="text-sm font-semibold text-gray-900">{selectedMother.edd}</p></div>
                <div className="p-3 bg-gray-50 rounded-lg"><div className="flex items-center space-x-2 mb-1"><Droplet size={16} className="text-gray-400" /><span className="text-xs text-gray-500">Blood Group</span></div><p className="text-sm font-semibold text-gray-900">{selectedMother.bloodGroup}</p></div>
                <div className="p-3 bg-gray-50 rounded-lg"><div className="flex items-center space-x-2 mb-1"><User size={16} className="text-gray-400" /><span className="text-xs text-gray-500">Age</span></div><p className="text-sm font-semibold text-gray-900">{selectedMother.age} years</p></div>
                <div className="p-3 bg-gray-50 rounded-lg"><div className="flex items-center space-x-2 mb-1"><Activity size={16} className="text-gray-400" /><span className="text-xs text-gray-500">Pregnancy Week</span></div><p className="text-sm font-semibold text-gray-900">{selectedMother.weeks} Weeks</p></div>
              </div>

              <div><h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4><div className="space-y-2"><div className="flex items-center space-x-3"><Phone size={16} className="text-gray-400" /><span className="text-sm text-gray-900">{selectedMother.phone}</span></div><div className="flex items-center space-x-3"><MapPin size={16} className="text-gray-400" /><span className="text-sm text-gray-900">{selectedMother.address}</span></div></div></div>

              <div><h4 className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact</h4><div className="space-y-1"><p className="text-sm text-gray-900"><strong>Name:</strong> {selectedMother.emergency_contact_name || 'N/A'}</p><p className="text-sm text-gray-900"><strong>Phone:</strong> {selectedMother.emergency_contact_phone || 'N/A'}</p><p className="text-sm text-gray-900"><strong>Relationship:</strong> {selectedMother.emergency_relationship || 'N/A'}</p></div></div>

              {(selectedMother.husband_name || selectedMother.husband_contact) && (<div><h4 className="text-sm font-semibold text-gray-700 mb-3">Family Information</h4><div className="space-y-1"><p className="text-sm text-gray-900"><strong>Husband:</strong> {selectedMother.husband_name || 'N/A'}</p><p className="text-sm text-gray-900"><strong>Contact:</strong> {selectedMother.husband_contact || 'N/A'}</p></div></div>)}

              {(selectedMother.allergies || selectedMother.chronic_diseases) && (<div><h4 className="text-sm font-semibold text-gray-700 mb-3">Medical History</h4><div className="space-y-1"><p className="text-sm text-gray-900"><strong>Allergies:</strong> {selectedMother.allergies || 'None'}</p><p className="text-sm text-gray-900"><strong>Chronic Diseases:</strong> {selectedMother.chronic_diseases || 'None'}</p></div></div>)}
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ProviderChatWidget />
    </div>
  );
};

export default MothersListPage;