import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Shield, Eye, EyeOff, Lock, Mail, Check, X, Edit2, Save,
  AlertCircle, KeyRound, Loader, User, Phone
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    mobile: ''
  });

  const [editPersonalInfo, setEditPersonalInfo] = useState({ ...personalInfo });

  const [formData, setFormData] = useState({
    employeeId: '',
    adminLevel: '',
    lastAccessUpdate: ''
  });

  // Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Forgot Password Modal
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Alert Preferences
  const [alertPreferences, setAlertPreferences] = useState({
    criticalSystemAlerts: true,
    securityLoginAlerts: true,
    newUserRegistration: true
  });

  // Security Audit Logs
  const [securityLogs, setSecurityLogs] = useState([
    {
      event: 'System Login',
      location: 'San Francisco, CA',
      ip: '192.168.1.45',
      time: '2 mins ago',
      status: 'active'
    },
    {
      event: 'Password Reset Attempt',
      location: 'Unknown',
      ip: '45.12.88.2',
      time: 'Yesterday, 11:42 PM',
      status: 'blocked'
    },
    {
      event: '2FA Verified',
      location: 'San Francisco, CA',
      ip: '192.168.1.45',
      time: 'Yesterday, 08:15 AM',
      status: 'success'
    }
  ]);

  // Fetch admin profile data
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const userData = response.data.data.user;
        
        setPersonalInfo({
          fullName: userData.name || '',
          email: userData.email || '',
          mobile: userData.phone_no || ''
        });
        
        setEditPersonalInfo({
          fullName: userData.name || '',
          email: userData.email || '',
          mobile: userData.phone_no || ''
        });
        
        // Set admin identity data
        setFormData({
          employeeId: userData.employee_id || `ADMIN-${userData.user_id}`,
          adminLevel: userData.role === 'admin' ? 'Tier 3 (Super Admin)' : 'Admin',
          lastAccessUpdate: userData.last_login 
            ? new Date(userData.last_login).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });
        
        if (userData.profile_picture_url) {
          setProfileImage(userData.profile_picture_url);
        }
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        
        // Upload to backend
        try {
          const response = await api.put('/mothers/upload-profile-picture', {
            profile_picture_url: imageData
          });
          if (response.data.success) {
            console.log('Profile picture updated');
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPersonalClick = () => {
    setEditPersonalInfo({ ...personalInfo });
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      // Change this endpoint
      const response = await api.put('/auth/update-profile', {
        name: editPersonalInfo.fullName,
        email: editPersonalInfo.email,
        phone_no: editPersonalInfo.mobile
      });
      
      if (response.data.success) {
        setPersonalInfo({ ...editPersonalInfo });
        setIsEditingPersonal(false);
        
        // Update auth context
        if (updateUser) {
          updateUser({
            name: editPersonalInfo.fullName,
            email: editPersonalInfo.email,
            phone_no: editPersonalInfo.mobile
          });
        }
        
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPersonal = () => {
    setEditPersonalInfo({ ...personalInfo });
    setIsEditingPersonal(false);
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from old password');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await api.put('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordSuccess('');
        }, 1500);
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotPasswordMessage('Please enter your email address');
      return;
    }

    setIsSending(true);
    try {
      const response = await api.post('/auth/forgot-password', {
        email: forgotEmail
      });
      
      setForgotPasswordMessage('Password reset link has been sent to your email.');
      setTimeout(() => {
        setIsForgotPasswordModalOpen(false);
        setForgotEmail('');
        setForgotPasswordMessage('');
      }, 2000);
    } catch (error) {
      setForgotPasswordMessage(error.response?.data?.message || 'Error sending reset link');
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveAllChanges = async () => {
    setSaving(true);
    try {
      // Save alert preferences
      const alertResponse = await api.put('/admin/alert-preferences', alertPreferences);
      
      if (alertResponse.data.success) {
        alert('All changes saved successfully!');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-500 mt-1">Manage your administrative profile, security protocols, and system access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              {!isEditingPersonal ? (
                <button
                  onClick={handleEditPersonalClick}
                  className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancelPersonal}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 font-medium"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSavePersonal}
                    disabled={saving}
                    className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                  style={profileImage ? { backgroundImage: `url(${profileImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!profileImage && <span className="text-2xl font-semibold text-white">
                    {personalInfo.fullName?.charAt(0) || 'A'}
                  </span>}
                </div>
                <button 
                  className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={14} className="text-gray-600" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{personalInfo.fullName}</p>
                <p className="text-xs text-pink-600 font-medium">Active Administrator</p>
                <button 
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium mt-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </button>
              </div>
            </div>

            {isEditingPersonal ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editPersonalInfo.fullName}
                    onChange={(e) => setEditPersonalInfo({...editPersonalInfo, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editPersonalInfo.email}
                    onChange={(e) => setEditPersonalInfo({...editPersonalInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={editPersonalInfo.mobile}
                    onChange={(e) => setEditPersonalInfo({...editPersonalInfo, mobile: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-sm text-gray-900">{personalInfo.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-sm text-gray-900">{personalInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                  <p className="text-sm text-gray-900">{personalInfo.mobile}</p>
                </div>
              </div>
            )}
          </div>

          {/* Admin Identity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Admin Identity</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID (READ ONLY)</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Level (READ ONLY)</label>
                <input
                  type="text"
                  value={formData.adminLevel}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Access Update</label>
                <input
                  type="text"
                  value={formData.lastAccessUpdate}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security & Authentication */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-gray-400" size={20} />
              Security & Authentication
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500 mt-1">Last changed {new Date().toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Alert Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Alert Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Critical System Alerts</span>
                <button
                  onClick={() => setAlertPreferences({...alertPreferences, criticalSystemAlerts: !alertPreferences.criticalSystemAlerts})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    alertPreferences.criticalSystemAlerts ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    alertPreferences.criticalSystemAlerts ? 'left-6' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Security & Login Alerts</span>
                <button
                  onClick={() => setAlertPreferences({...alertPreferences, securityLoginAlerts: !alertPreferences.securityLoginAlerts})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    alertPreferences.securityLoginAlerts ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    alertPreferences.securityLoginAlerts ? 'left-6' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">New User Registration Activity</span>
                <button
                  onClick={() => setAlertPreferences({...alertPreferences, newUserRegistration: !alertPreferences.newUserRegistration})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    alertPreferences.newUserRegistration ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    alertPreferences.newUserRegistration ? 'left-6' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Security Audit Logs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Security Audit Logs</h2>
            <div className="space-y-3">
              {securityLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      log.status === 'active' ? 'bg-green-400' :
                      log.status === 'blocked' ? 'bg-red-400' : 'bg-pink-400'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.event}</p>
                      <p className="text-xs text-gray-500">{log.location} ({log.ip})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status === 'active' ? 'Active Session' :
                       log.status === 'blocked' ? 'Suspicious Blocked' : 'Success'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Access Summary - Full Width */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Access Summary</h2>
        <p className="text-sm text-gray-500">
          These permissions are assigned by the central hospital administration and are read-only for your current profile level.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button 
          onClick={handleSaveAllChanges}
          disabled={saving}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader size={16} className="animate-spin inline mr-2" /> : null}
          Save Changes
        </button>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Lock size={20} className="text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <Check size={16} className="text-green-500" />
                  <p className="text-sm text-green-700">{passwordSuccess}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Enter old password"
                  />
                  <button
                    onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setIsForgotPasswordModalOpen(true);
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50"
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <KeyRound size={20} className="text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Forgot Password</h2>
              </div>
              <button
                onClick={() => setIsForgotPasswordModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {forgotPasswordMessage && (
                <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                  forgotPasswordMessage.includes('sent') 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  {forgotPasswordMessage.includes('sent') ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <AlertCircle size={16} className="text-yellow-500" />
                  )}
                  <p className={`text-sm ${
                    forgotPasswordMessage.includes('sent') ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {forgotPasswordMessage}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setIsForgotPasswordModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                disabled={isSending}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                  isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
                }`}
              >
                {isSending ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfileSettings;