import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  User, Shield, Smartphone, Monitor, ChevronRight, Lock, 
  Eye, EyeOff, Camera, Edit2, Save, X, AlertCircle, 
  CheckCircle2, Heart, Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const MotherProfileSettings = () => {
  const { user, updateProfile: updateAuthProfile, logout } = useAuth();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Password states
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

  // Personal Info states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    motherId: '',
    nic: '',
    dob: '',
    bloodGroup: '',
    expectedDeliveryDate: '',
    currentWeight: '',
    height: '',
    husbandName: '',
    husbandContact: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    district: ''
  });

  // Edit form states
  const [editForm, setEditForm] = useState({ ...personalInfo });
  const [maternalData, setMaternalData] = useState({
    pregnancyStatus: '',
    edd: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // Fetch mother data on component mount
  useEffect(() => {
    fetchMotherData();
  }, []);

  const fetchMotherData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mothers/profile');
      
      console.log('Full API Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.success) {
        // Handle different response structures
        let motherData = null;
        let userData = null;
        
        // Check the structure of response.data.data
        if (response.data.data) {
          if (response.data.data.mother) {
            motherData = response.data.data.mother;
            userData = response.data.data.user;
          } else if (response.data.data.mother_data) {
            motherData = response.data.data.mother_data;
            userData = response.data.data.user_data;
          } else {
            // If data is directly in data
            motherData = response.data.data;
            userData = response.data.data.user;
          }
        } else if (response.data.mother) {
          motherData = response.data.mother;
          userData = response.data.user;
        }
        
        console.log('Extracted Mother Data:', motherData);
        console.log('Extracted User Data:', userData);
        
        if (motherData) {
          setPersonalInfo({
            fullName: motherData.full_name || userData?.name || '',
            email: userData?.email || '',
            mobile: userData?.phone_no || '',
            address: motherData.address || '',
            motherId: motherData.mother_code || '',
            nic: motherData.nic || '',
            dob: motherData.dob ? motherData.dob.split('T')[0] : '',
            bloodGroup: motherData.blood_group || '',
            expectedDeliveryDate: motherData.expected_delivery_date ? motherData.expected_delivery_date.split('T')[0] : '',
            currentWeight: motherData.current_weight || '',
            height: motherData.height || '',
            husbandName: motherData.husband_name || '',
            husbandContact: motherData.husband_contact || '',
            emergencyContactName: motherData.emergency_contact_name || '',
            emergencyContactPhone: motherData.emergency_contact_phone || '',
            district: motherData.district || ''
          });
          
          setMaternalData({
            pregnancyStatus: motherData.pregnancy_status || 'pregnant',
            edd: motherData.expected_delivery_date || '',
            bloodGroup: motherData.blood_group || '',
            emergencyContact: motherData.emergency_contact_name || '',
            emergencyPhone: motherData.emergency_contact_phone || ''
          });
          
          if (userData?.profile_picture_url) {
            setProfileImage(userData.profile_picture_url);
          }
          
          // Initialize edit form
          setEditForm({
            fullName: motherData.full_name || userData?.name || '',
            email: userData?.email || '',
            mobile: userData?.phone_no || '',
            address: motherData.address || '',
            motherId: motherData.mother_code || '',
            nic: motherData.nic || '',
            dob: motherData.dob ? motherData.dob.split('T')[0] : '',
            bloodGroup: motherData.blood_group || '',
            expectedDeliveryDate: motherData.expected_delivery_date ? motherData.expected_delivery_date.split('T')[0] : '',
            currentWeight: motherData.current_weight || '',
            height: motherData.height || '',
            husbandName: motherData.husband_name || '',
            husbandContact: motherData.husband_contact || '',
            emergencyContactName: motherData.emergency_contact_name || '',
            emergencyContactPhone: motherData.emergency_contact_phone || '',
            district: motherData.district || ''
          });
        } else {
          console.error('No mother data found in response');
          setError('No mother data found');
        }
      } else {
        console.error('API response unsuccessful:', response.data);
      }
    } catch (err) {
      console.error('Error fetching mother data:', err);
      console.error('Error response:', err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfileImage(reader.result);
        
        try {
          await api.put('/mothers/upload-profile-picture', {
            profile_picture_url: reader.result
          });
        } catch (err) {
          console.error('Error uploading profile picture:', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setEditForm({ ...personalInfo });
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      const response = await api.put('/mothers/profile', {
        full_name: editForm.fullName,
        email: editForm.email,
        mobile: editForm.mobile,
        address: editForm.address,
        nic: editForm.nic,
        dob: editForm.dob,
        blood_group: editForm.bloodGroup,
        expected_delivery_date: editForm.expectedDeliveryDate,
        current_weight: editForm.currentWeight,
        height: editForm.height,
        husband_name: editForm.husbandName,
        husband_contact: editForm.husbandContact,
        emergency_contact_name: editForm.emergencyContactName,
        emergency_contact_phone: editForm.emergencyContactPhone,
        district: editForm.district
      });
      
      if (response.data.success) {
        setPersonalInfo({ ...editForm });
        updateAuthProfile({ 
          fullName: editForm.fullName,
          email: editForm.email,
          mobile: editForm.mobile
        });
        setIsEditingPersonal(false);
        alert('Profile updated successfully!');
        fetchMotherData(); // Refresh data
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Error saving profile: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ ...personalInfo });
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
      const response = await api.put('/mothers/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordSuccess('');
          setPasswordError('');
        }, 1500);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      const response = await api.delete('/mothers/deactivate');
      if (response.data.success) {
        alert('Account deactivated successfully');
        logout();
      }
    } catch (err) {
      console.error('Error deactivating account:', err);
      alert('Error deactivating account: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDiscardChanges = () => {
    setEditForm({ ...personalInfo });
    setIsEditingPersonal(false);
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h2>
        <p className="text-gray-500">Manage your maternal health profile and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-3 text-pink-600" /> Personal Information
                </h3>
                {!isEditingPersonal ? (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSavePersonal}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                )}
              </div>
               
              {/* Profile Photo */}
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div 
                    className="h-20 w-20 rounded-full border-4 border-white shadow-md bg-cover bg-center cursor-pointer bg-gray-200"
                    style={{ backgroundImage: `url(${profileImage || 'https://via.placeholder.com/150'})` }}
                    onClick={() => fileInputRef.current?.click()}
                  ></div>
                  <button 
                    className="absolute bottom-0 right-0 h-7 w-7 bg-pink-600 rounded-full text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-pink-700 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="ml-6">
                  <h4 className="font-bold text-gray-900 text-lg">Profile Photo</h4>
                  <p className="text-sm text-gray-500">Click to upload. Recommended size 400x400px</p>
                </div>
              </div>

              {isEditingPersonal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      Mother ID 
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-2 font-normal">(READ-ONLY)</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={editForm.motherId}
                        readOnly 
                        className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed outline-none" 
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">NIC</label>
                    <input 
                      type="text" 
                      value={editForm.nic}
                      onChange={(e) => setEditForm({...editForm, nic: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth</label>
                    <input 
                      type="date" 
                      value={editForm.dob}
                      onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Blood Group</label>
                    <select
                      value={editForm.bloodGroup}
                      onChange={(e) => setEditForm({...editForm, bloodGroup: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Expected Delivery Date</label>
                    <input 
                      type="date" 
                      value={editForm.expectedDeliveryDate}
                      onChange={(e) => setEditForm({...editForm, expectedDeliveryDate: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Current Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={editForm.currentWeight}
                      onChange={(e) => setEditForm({...editForm, currentWeight: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={editForm.height}
                      onChange={(e) => setEditForm({...editForm, height: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">District</label>
                    <input 
                      type="text" 
                      value={editForm.district}
                      onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Home Address</label>
                    <textarea 
                      rows="2" 
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Husband's Name</label>
                    <input 
                      type="text" 
                      value={editForm.husbandName}
                      onChange={(e) => setEditForm({...editForm, husbandName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Husband's Contact</label>
                    <input 
                      type="text" 
                      value={editForm.husbandContact}
                      onChange={(e) => setEditForm({...editForm, husbandContact: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Emergency Contact Name</label>
                    <input 
                      type="text" 
                      value={editForm.emergencyContactName}
                      onChange={(e) => setEditForm({...editForm, emergencyContactName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Emergency Contact Phone</label>
                    <input 
                      type="text" 
                      value={editForm.emergencyContactPhone}
                      onChange={(e) => setEditForm({...editForm, emergencyContactPhone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none" 
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
                    <p className="text-sm text-gray-900 font-medium">{personalInfo.fullName || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Email Address</label>
                    <p className="text-sm text-gray-900 font-medium">{personalInfo.email || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Mobile Number</label>
                    <p className="text-sm text-gray-900 font-medium">{personalInfo.mobile || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center">
                      Mother ID 
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-2 font-normal">(READ-ONLY)</span>
                    </label>
                    <p className="text-sm text-gray-500 font-mono">{personalInfo.motherId || 'Not assigned'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">NIC</label>
                    <p className="text-sm text-gray-900">{personalInfo.nic || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-sm text-gray-900">{personalInfo.dob || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Blood Group</label>
                    <p className="text-sm text-gray-900">{personalInfo.bloodGroup || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Expected Delivery Date</label>
                    <p className="text-sm text-gray-900">{personalInfo.expectedDeliveryDate || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Current Weight (kg)</label>
                    <p className="text-sm text-gray-900">{personalInfo.currentWeight || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Height (cm)</label>
                    <p className="text-sm text-gray-900">{personalInfo.height || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">District</label>
                    <p className="text-sm text-gray-900">{personalInfo.district || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Home Address</label>
                    <p className="text-sm text-gray-900">{personalInfo.address || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Husband's Name</label>
                    <p className="text-sm text-gray-900">{personalInfo.husbandName || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Husband's Contact</label>
                    <p className="text-sm text-gray-900">{personalInfo.husbandContact || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Emergency Contact Name</label>
                    <p className="text-sm text-gray-900">{personalInfo.emergencyContactName || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Emergency Contact Phone</label>
                    <p className="text-sm text-gray-900">{personalInfo.emergencyContactPhone || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-3 text-pink-600" /> Security & Privacy
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-pink-600" />
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900">Change Password</p>
                      <p className="text-xs text-gray-500">Update your password</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Deactivate Account */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {!showDeleteConfirm ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-red-700">Deactivate Account</p>
                        <p className="text-xs text-red-500">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-red-400" />
                  </button>
                ) : (
                  <div className="p-4 bg-red-50 rounded-xl border-2 border-red-300">
                    <p className="text-sm font-semibold text-red-800 mb-3">
                      Are you sure you want to deactivate your account? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDeactivateAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Yes, Deactivate My Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Maternal Profile */}
        <div>
          <Card className="bg-gradient-to-br from-pink-600 to-rose-700 text-white border-none shadow-md overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <CardContent className="p-6 relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Heart className="h-5 w-5 mr-3" /> Maternal Profile
              </h3>
              
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-rose-200 mb-1 font-semibold">Pregnancy Status</p>
                <p className="text-xl font-bold capitalize">{maternalData.pregnancyStatus || 'Not specified'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-rose-200 mb-1 font-semibold">EDD</p>
                  <p className="text-base font-bold">{maternalData.edd ? new Date(maternalData.edd).toLocaleDateString() : 'Not set'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-rose-200 mb-1 font-semibold">Blood Group</p>
                  <p className="text-base font-bold">{maternalData.bloodGroup || 'Not specified'}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <p className="text-xs font-semibold mb-3">Emergency Contact</p>
                <div>
                  <p className="font-bold text-lg">{maternalData.emergencyContact || 'Not set'}</p>
                  <p className="text-sm text-rose-200">{maternalData.emergencyPhone || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Save/Cancel Buttons - Only show when editing */}
      {isEditingPersonal && (
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="ghost" onClick={handleDiscardChanges} className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg font-bold px-8">
            Discard
          </Button>
          <Button onClick={handleSavePersonal} disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold px-8">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Lock className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-green-700">{passwordSuccess}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, oldPassword: e.target.value});
                      setPasswordError('');
                    }}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Enter old password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, newPassword: e.target.value});
                      setPasswordError('');
                    }}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({...passwordData, confirmPassword: e.target.value});
                      setPasswordError('');
                    }}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotherProfileSettings;