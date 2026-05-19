import React, { useState } from 'react';
import { 
  Users, Search, Shield, Settings, 
  Database, Eye, Edit2, Trash2,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Plus, Download, X, UserPlus, Stethoscope, UserCog,
  Power, PowerOff
} from 'lucide-react';

const UserSystemMgmtPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [addUserSuccess, setAddUserSuccess] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 'M-8821',
      name: 'Elena Chambers',
      email: 'elena.c@example.com',
      role: 'Mother',
      status: 'Active',
      lastActive: '2 hours ago',
      phone: '+94 77 123 4567',
      address: 'Colombo 07'
    },
    {
      id: 'P-1042',
      name: 'Dr. Marcus Webb',
      email: 'm.webb@maternal.sys',
      role: 'Provider',
      status: 'Active',
      lastActive: '5 mins ago',
      phone: '+94 71 234 5678',
      address: 'Kandy'
    },
    {
      id: 'M-9104',
      name: 'Sarah Lofton',
      email: 's.lofton@example.com',
      role: 'Mother',
      status: 'Pending',
      lastActive: 'Never',
      phone: '+94 76 345 6789',
      address: 'Galle'
    },
    {
      id: 'A-001',
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@pearlmom.health',
      role: 'Admin',
      status: 'Active',
      lastActive: 'Current',
      phone: '+94 70 456 7890',
      address: 'Colombo 03'
    },
    {
      id: 'P-1089',
      name: 'Nurse Elena Rodriguez',
      email: 'e.rodriguez@maternal.sys',
      role: 'Provider',
      status: 'Active',
      lastActive: '1 hour ago',
      phone: '+94 77 567 8901',
      address: 'Jaffna'
    },
    {
      id: 'M-1201',
      name: 'Priya Fernando',
      email: 'priya.f@example.com',
      role: 'Mother',
      status: 'Active',
      lastActive: '30 mins ago',
      phone: '+94 71 678 9012',
      address: 'Negombo'
    },
    {
      id: 'P-1120',
      name: 'Dr. James Wilson',
      email: 'j.wilson@maternal.sys',
      role: 'Provider',
      status: 'Active',
      lastActive: '3 hours ago',
      phone: '+94 76 789 0123',
      address: 'Matara'
    }
  ]);

  // Count stats
  const totalUsers = users.length;
  const totalMothers = users.filter(u => u.role === 'Mother').length;
  const totalProviders = users.filter(u => u.role === 'Provider' || u.role === 'Admin').length;
  const pendingApprovals = users.filter(u => u.status === 'Pending').length;

  // Form states for different user types
  const [providerForm, setProviderForm] = useState({
    providerId: '',
    fullName: '',
    email: '',
    designation: '',
    clinic: '',
    emergencyContact: ''
  });

  const [doctorForm, setDoctorForm] = useState({
    doctorId: '',
    fullName: '',
    email: '',
    designation: '',
    clinic: '',
    emergencyContact: '',
    specialization: '',
    licenseNumber: ''
  });

  const [adminForm, setAdminForm] = useState({
    adminId: '',
    fullName: '',
    email: ''
  });

  const permissionMatrix = [
    { action: 'Edit Users', admin: true, provider: true, mother: false },
    { action: 'Post Articles', admin: true, provider: true, mother: true },
    { action: 'View Medical', admin: true, provider: true, mother: true },
    { action: 'Export Data', admin: true, provider: false, mother: false },
    { action: 'System Config', admin: true, provider: false, mother: false }
  ];

  const contentStats = {
    publishedArticles: 142,
    activeSchedules: 12,
    faqItems: 88
  };

  const filteredUsers = users.filter(user => {
    const searchMatch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const roleMatch = filterRole === 'all' || user.role === filterRole;
    const statusMatch = filterStatus === 'all' || user.status === filterStatus;
    
    return searchMatch && roleMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Deactivated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-pink-100 text-pink-800';
      case 'Provider': return 'bg-blue-100 text-blue-800';
      case 'Mother': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportReport = () => {
    const reportContent = `
═══════════════════════════════════════════════════════
         PEARL MOM - USER SYSTEM REPORT
═══════════════════════════════════════════════════════
Generated: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}
═══════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Users:     ${totalUsers}
  Total Mothers:   ${totalMothers}
  Total Providers: ${totalProviders}
  Pending:         ${pendingApprovals}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER DETAILS BY ROLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  MOTHERS (${totalMothers}):
  ${users.filter(u => u.role === 'Mother').map(u => `  - ${u.name} (${u.id}) | ${u.email} | ${u.status}`).join('\n  ')}

  PROVIDERS (${users.filter(u => u.role === 'Provider').length}):
  ${users.filter(u => u.role === 'Provider').map(u => `  - ${u.name} (${u.id}) | ${u.email} | ${u.status}`).join('\n  ')}

  ADMINS (${users.filter(u => u.role === 'Admin').length}):
  ${users.filter(u => u.role === 'Admin').map(u => `  - ${u.name} (${u.id}) | ${u.email} | ${u.status}`).join('\n  ')}

═══════════════════════════════════════════════════════
  © ${new Date().getFullYear()} PearlMom. All rights reserved.
═══════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PearlMom_User_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleOpenAddUserModal = () => {
    setSelectedUserType(null);
    setAddUserSuccess(false);
    setProviderForm({ providerId: '', fullName: '', email: '', designation: '', clinic: '', emergencyContact: '' });
    setDoctorForm({ doctorId: '', fullName: '', email: '', designation: '', clinic: '', emergencyContact: '', specialization: '', licenseNumber: '' });
    setAdminForm({ adminId: '', fullName: '', email: '' });
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setSelectedUserType(null);
    setAddUserSuccess(false);
  };

  const handleSelectUserType = (type) => {
    setSelectedUserType(type);
    setAddUserSuccess(false);
  };

  const handleAddProvider = () => {
    if (!providerForm.providerId || !providerForm.fullName || !providerForm.email || 
        !providerForm.designation || !providerForm.clinic || !providerForm.emergencyContact) {
      alert('Please fill in all fields');
      return;
    }
    setAddUserSuccess(true);
    setTimeout(() => { handleCloseAddUserModal(); }, 1500);
  };

  const handleAddDoctor = () => {
    if (!doctorForm.doctorId || !doctorForm.fullName || !doctorForm.email || 
        !doctorForm.designation || !doctorForm.clinic || !doctorForm.emergencyContact ||
        !doctorForm.specialization || !doctorForm.licenseNumber) {
      alert('Please fill in all fields');
      return;
    }
    setAddUserSuccess(true);
    setTimeout(() => { handleCloseAddUserModal(); }, 1500);
  };

  const handleAddAdmin = () => {
    if (!adminForm.adminId || !adminForm.fullName || !adminForm.email) {
      alert('Please fill in all fields');
      return;
    }
    setAddUserSuccess(true);
    setTimeout(() => { handleCloseAddUserModal(); }, 1500);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } 
        : u
    ));
    setShowDeactivateConfirm(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User & System Management</h1>
          <p className="text-gray-500 mt-1">Managing {totalUsers} maternal records and system integrity.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
          <button 
            onClick={handleOpenAddUserModal}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="text-pink-500" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="text-purple-500" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalMothers}</p>
              <p className="text-xs text-gray-500">Total Mothers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="text-blue-500" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalProviders}</p>
              <p className="text-xs text-gray-500">Total Providers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-yellow-500" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
              <p className="text-xs text-gray-500">Pending Approvals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Name, or Email"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Provider">Provider</option>
            <option value="Mother">Mother</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{user.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                      {user.status === 'Pending' && <Clock size={12} className="mr-1" />}
                      {user.status === 'Deactivated' && <XCircle size={12} className="mr-1" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{user.lastActive}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded transition-colors" 
                        title="View"
                      >
                        <Eye size={16} className="text-gray-400 hover:text-pink-500" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors" 
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-gray-400 hover:text-pink-500" />
                      </button>
                      <button 
                        onClick={() => setShowDeactivateConfirm(user.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors" 
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'Active' ? (
                          <PowerOff size={16} className="text-gray-400 hover:text-red-500" />
                        ) : (
                          <Power size={16} className="text-gray-400 hover:text-green-500" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="mr-2 text-gray-400" size={20} />
          Permission Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Mother</th>
              </tr>
            </thead>
            <tbody>
              {permissionMatrix.map((perm, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{perm.action}</td>
                  <td className="text-center py-3">
                    {perm.admin ? <CheckCircle size={16} className="text-pink-500 mx-auto" /> : <XCircle size={16} className="text-gray-300 mx-auto" />}
                  </td>
                  <td className="text-center py-3">
                    {perm.provider ? <CheckCircle size={16} className="text-pink-500 mx-auto" /> : <XCircle size={16} className="text-gray-300 mx-auto" />}
                  </td>
                  <td className="text-center py-3">
                    {perm.mother ? <CheckCircle size={16} className="text-pink-500 mx-auto" /> : <XCircle size={16} className="text-gray-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Repository */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Content Repository</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
            <p className="text-3xl font-bold text-pink-600">{contentStats.publishedArticles}</p>
            <p className="text-sm text-gray-600 mt-1">Published Articles</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
            <p className="text-3xl font-bold text-pink-600">{contentStats.activeSchedules}</p>
            <p className="text-sm text-gray-600 mt-1">Active Schedules</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
            <p className="text-3xl font-bold text-pink-600">{contentStats.faqItems}</p>
            <p className="text-sm text-gray-600 mt-1">FAQ Items</p>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg shadow-sm p-6 border border-pink-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
            <p className="text-sm text-gray-600 mt-1">All protocols are running within optimal maternal-safety parameters.</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-pink-600">99.9%</p>
            <p className="text-sm text-gray-500">UPTIME</p>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500">
                  <option value="Mother">Mother</option>
                  <option value="Provider">Provider</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirm Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to {users.find(u => u.id === showDeactivateConfirm)?.status === 'Active' ? 'deactivate' : 'activate'} this user account?
              </p>
              <div className="flex space-x-3">
                <button onClick={() => setShowDeactivateConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={() => handleToggleStatus(showDeactivateConfirm)} className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal (same as before) */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
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
                    <button onClick={() => handleSelectUserType('provider')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-center group">
                      <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-200 transition-colors">
                        <Stethoscope size={28} className="text-pink-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Provider / Doctor</h3>
                      <p className="text-xs text-gray-500 mt-1">Add a healthcare provider or doctor</p>
                    </button>
                    <button onClick={() => handleSelectUserType('nurse')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-center group">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                        <UserPlus size={28} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Nurse / Midwife</h3>
                      <p className="text-xs text-gray-500 mt-1">Add a nurse or midwife</p>
                    </button>
                    <button onClick={() => handleSelectUserType('admin')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-center group">
                      <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                        <UserCog size={28} className="text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Admin</h3>
                      <p className="text-xs text-gray-500 mt-1">Add an administrator</p>
                    </button>
                  </div>
                </div>
              ) : selectedUserType === 'provider' ? (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <button onClick={() => setSelectedUserType(null)} className="text-sm text-pink-600 hover:text-pink-700 font-medium">← Back to selection</button>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">Add Provider / Doctor</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Provider ID *</label><input type="text" value={providerForm.providerId} onChange={(e) => setProviderForm({...providerForm, providerId: e.target.value})} placeholder="e.g., P-2024-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={providerForm.fullName} onChange={(e) => setProviderForm({...providerForm, fullName: e.target.value})} placeholder="e.g., Dr. Marcus Webb" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input type="email" value={providerForm.email} onChange={(e) => setProviderForm({...providerForm, email: e.target.value})} placeholder="e.g., m.webb@maternal.sys" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label><input type="text" value={providerForm.designation} onChange={(e) => setProviderForm({...providerForm, designation: e.target.value})} placeholder="e.g., Senior Obstetrician" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary Clinic/Area *</label><input type="text" value={providerForm.clinic} onChange={(e) => setProviderForm({...providerForm, clinic: e.target.value})} placeholder="e.g., Green Valley Maternal Center" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label><input type="tel" value={providerForm.emergencyContact} onChange={(e) => setProviderForm({...providerForm, emergencyContact: e.target.value})} placeholder="e.g., +1 (555) 999-8877" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                  </div>
                </div>
              ) : selectedUserType === 'nurse' ? (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <button onClick={() => setSelectedUserType(null)} className="text-sm text-pink-600 hover:text-pink-700 font-medium">← Back to selection</button>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">Add Doctor</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID *</label><input type="text" value={doctorForm.doctorId} onChange={(e) => setDoctorForm({...doctorForm, doctorId: e.target.value})} placeholder="e.g., D-2024-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={doctorForm.fullName} onChange={(e) => setDoctorForm({...doctorForm, fullName: e.target.value})} placeholder="e.g., Dr. Sarah Chen" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input type="email" value={doctorForm.email} onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})} placeholder="e.g., s.chen@maternal.sys" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label><input type="text" value={doctorForm.specialization} onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})} placeholder="e.g., Obstetrics" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label><input type="text" value={doctorForm.licenseNumber} onChange={(e) => setDoctorForm({...doctorForm, licenseNumber: e.target.value})} placeholder="e.g., MED-2024-8829" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label><input type="text" value={doctorForm.designation} onChange={(e) => setDoctorForm({...doctorForm, designation: e.target.value})} placeholder="e.g., Consultant Obstetrician" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary Clinic/Area *</label><input type="text" value={doctorForm.clinic} onChange={(e) => setDoctorForm({...doctorForm, clinic: e.target.value})} placeholder="e.g., Central Hospital" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label><input type="tel" value={doctorForm.emergencyContact} onChange={(e) => setDoctorForm({...doctorForm, emergencyContact: e.target.value})} placeholder="e.g., +1 (555) 888-7766" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <button onClick={() => setSelectedUserType(null)} className="text-sm text-pink-600 hover:text-pink-700 font-medium">← Back to selection</button>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">Add Administrator</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin ID *</label><input type="text" value={adminForm.adminId} onChange={(e) => setAdminForm({...adminForm, adminId: e.target.value})} placeholder="e.g., A-2024-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={adminForm.fullName} onChange={(e) => setAdminForm({...adminForm, fullName: e.target.value})} placeholder="e.g., Dr. Sarah Jenkins" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input type="email" value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} placeholder="e.g., s.jenkins@pearlmom.health" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" /></div>
                  </div>
                </div>
              )}
            </div>

            {!addUserSuccess && selectedUserType && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button onClick={handleCloseAddUserModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={() => { if (selectedUserType === 'provider') handleAddProvider(); else if (selectedUserType === 'nurse') handleAddDoctor(); else if (selectedUserType === 'admin') handleAddAdmin(); }} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">Add User</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSystemMgmtPage;