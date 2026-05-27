import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Shield, Eye, EyeOff, Lock, Mail, Check, X, Edit2, Save,
  AlertCircle, KeyRound, Loader, User, Phone, MapPin, Briefcase, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProviderProfileSettings = () => {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    mobile: ''
  });

  const [editPersonalInfo, setEditPersonalInfo] = useState({ ...personalInfo });

  const [professionalInfo, setProfessionalInfo] = useState({
    employeeId: '',
    designation: '',
    clinic: '',
    emergencyContact: ''
  });

  // Work Preferences State
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [schedule, setSchedule] = useState({
    monday: { start: '08:00', end: '16:00', active: true },
    tuesday: { start: '08:00', end: '16:00', active: true },
    wednesday: { start: '08:00', end: '16:00', active: true },
    thursday: { start: '10:00', end: '18:00', active: true },
    friday: { start: '08:00', end: '14:00', active: true },
    saturday: { start: '', end: '', active: false },
    sunday: { start: '', end: '', active: false }
  });
  const [clinicNetwork, setClinicNetwork] = useState([
    'North Hub Main',
    'Community Outreach Unit B',
    'Riverside Maternity'
  ]);

  // Clinical Alerts State
  const [clinicalAlerts, setClinicalAlerts] = useState({
    newAppointments: true,
    highRiskAlerts: true,
    vaccinationReminders: false
  });

  // Password Change Modal State
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

  // Forgot Password Modal State
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Fetch provider data on load
  useEffect(() => {
    fetchProviderData();
    fetchWorkPreferences();
    fetchNotificationPreferences();
  }, []);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/providers/profile');
      if (response.data.success) {
        const { user: userData, provider } = response.data.data;
        
        setPersonalInfo({
          fullName: userData.name || '',
          email: userData.email || '',
          mobile: userData.phone_no || ''
        });
        
        setProfessionalInfo({
          employeeId: provider.employee_id || '',
          designation: provider.qualification || '',
          clinic: provider.assigned_area || '',
          emergencyContact: provider.contact_number || ''
        });
        
        if (userData.profile_picture_url) {
          setProfileImage(userData.profile_picture_url);
        }
        
        setEditPersonalInfo({
          fullName: userData.name || '',
          email: userData.email || '',
          mobile: userData.phone_no || ''
        });
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkPreferences = async () => {
    try {
      const response = await api.get('/providers/work-preferences');
      if (response.data.success) {
        const prefs = response.data.data.work_preferences;
        if (prefs) {
          if (prefs.schedule) setSchedule(prefs.schedule);
          if (prefs.assigned_clinic_network) setClinicNetwork(prefs.assigned_clinic_network);
        }
      }
    } catch (error) {
      console.error('Error fetching work preferences:', error);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const response = await api.get('/providers/notification-preferences');
      if (response.data.success) {
        const prefs = response.data.data.notification_preferences;
        if (prefs) {
          setClinicalAlerts({
            newAppointments: prefs.new_appointments ?? true,
            highRiskAlerts: prefs.high_risk_alerts ?? true,
            vaccinationReminders: prefs.vaccination_reminders ?? false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfileImage(reader.result);
        try {
          await api.post('/profile/upload-photo', { photoUrl: reader.result });
        } catch (error) {
          console.error('Error uploading photo:', error);
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
      const response = await api.put('/providers/profile', {
        full_name: editPersonalInfo.fullName,
        email: editPersonalInfo.email,
        phone_number: editPersonalInfo.mobile,
        role_type: professionalInfo.designation,
        assigned_area: professionalInfo.clinic,
        district: ''
      });
      
      if (response.data.success) {
        setPersonalInfo({ ...editPersonalInfo });
        setIsEditingPersonal(false);
        updateAuthProfile({ fullName: editPersonalInfo.fullName, email: editPersonalInfo.email });
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPersonal = () => {
    setEditPersonalInfo({ ...personalInfo });
    setIsEditingPersonal(false);
  };

  const handleSaveProfessional = async () => {
    setSaving(true);
    try {
      const response = await api.put('/providers/profile', {
        full_name: personalInfo.fullName,
        email: personalInfo.email,
        phone_number: professionalInfo.emergencyContact,
        role_type: professionalInfo.designation,
        assigned_area: professionalInfo.clinic,
        district: ''
      });
      
      if (response.data.success) {
        alert('Professional information updated successfully!');
        await fetchProviderData();
      }
    } catch (error) {
      console.error('Error saving professional info:', error);
      alert('Failed to update professional information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      const response = await api.put('/providers/work-preferences', {
        schedule: schedule,
        assigned_clinic_network: clinicNetwork
      });
      
      if (response.data.success) {
        setIsEditingSchedule(false);
        alert('Schedule updated successfully!');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to update schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotificationPreferences = async () => {
    setSaving(true);
    try {
      const response = await api.put('/providers/notification-preferences', {
        new_appointments: clinicalAlerts.newAppointments,
        high_risk_alerts: clinicalAlerts.highRiskAlerts,
        vaccination_reminders: clinicalAlerts.vaccinationReminders
      });
      
      if (response.data.success) {
        alert('Notification preferences updated successfully!');
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      alert('Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllChanges = async () => {
    setSaving(true);
    try {
      // Save profile
      await api.put('/providers/profile', {
        full_name: personalInfo.fullName,
        email: personalInfo.email,
        phone_number: professionalInfo.emergencyContact,
        role_type: professionalInfo.designation,
        assigned_area: professionalInfo.clinic,
        district: ''
      });
      
      // Save work preferences
      await api.put('/providers/work-preferences', {
        schedule: schedule,
        assigned_clinic_network: clinicNetwork
      });
      
      // Save notification preferences
      await api.put('/providers/notification-preferences', {
        new_appointments: clinicalAlerts.newAppointments,
        high_risk_alerts: clinicalAlerts.highRiskAlerts,
        vaccination_reminders: clinicalAlerts.vaccinationReminders
      });
      
      alert('All changes saved successfully!');
    } catch (error) {
      console.error('Error saving all changes:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
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
      const response = await api.put('/providers/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordSuccess('');
          setPasswordError('');
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
      // Implement forgot password API call
      const response = await api.post('/auth/forgot-password', { email: forgotEmail });
      if (response.data.success) {
        setForgotPasswordMessage('Password reset link has been sent to your email address.');
        setTimeout(() => {
          setIsForgotPasswordModalOpen(false);
          setForgotEmail('');
          setForgotPasswordMessage('');
        }, 2000);
      }
    } catch (error) {
      setForgotPasswordMessage('Error sending reset link. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleToggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active
      }
    }));
  };

  const getDayName = (key) => {
    const days = {
      monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
      thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
    };
    return days[key];
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
        <h1 className="text-2xl font-bold text-gray-900">Provider Settings</h1>
        <p className="text-gray-500 mt-1">Manage your clinical profile, work preferences, and security protocols.</p>
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
                    {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save size={16} />}
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
                    {personalInfo.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
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
                <p className="text-sm font-medium text-gray-900">Profile Photo</p>
                <button 
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {isEditingPersonal ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">FULL NAME</label>
                    <input
                      type="text"
                      value={editPersonalInfo.fullName}
                      onChange={(e) => setEditPersonalInfo({...editPersonalInfo, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={editPersonalInfo.email}
                      onChange={(e) => setEditPersonalInfo({...editPersonalInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MOBILE (OTP ENABLED)</label>
                    <input
                      type="tel"
                      value={editPersonalInfo.mobile}
                      onChange={(e) => setEditPersonalInfo({...editPersonalInfo, mobile: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">FULL NAME</label>
                    <p className="text-sm text-gray-900">{personalInfo.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">EMAIL ADDRESS</label>
                    <p className="text-sm text-gray-900">{personalInfo.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">MOBILE (OTP ENABLED)</label>
                    <p className="text-sm text-gray-900">{personalInfo.mobile}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Professional Credentials */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Professional Credentials</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMPLOYEE ID (READ ONLY)</label>
                <input
                  type="text"
                  value={professionalInfo.employeeId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DESIGNATION</label>
                <input
                  type="text"
                  value={professionalInfo.designation}
                  onChange={(e) => setProfessionalInfo({...professionalInfo, designation: e.target.value})}
                  onBlur={handleSaveProfessional}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PRIMARY CLINIC/AREA</label>
                <input
                  type="text"
                  value={professionalInfo.clinic}
                  onChange={(e) => setProfessionalInfo({...professionalInfo, clinic: e.target.value})}
                  onBlur={handleSaveProfessional}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMERGENCY CONTACT</label>
                <input
                  type="tel"
                  value={professionalInfo.emergencyContact}
                  onChange={(e) => setProfessionalInfo({...professionalInfo, emergencyContact: e.target.value})}
                  onBlur={handleSaveProfessional}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Work Preferences</h2>
              {!isEditingSchedule ? (
                <button
                  onClick={() => setIsEditingSchedule(true)}
                  className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  <Edit2 size={16} />
                  <span>Edit Schedule</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveSchedule}
                  disabled={saving}
                  className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  <span>Save Schedule</span>
                </button>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Current Schedule</h3>
              <div className="space-y-2">
                {Object.entries(schedule).map(([day, data]) => (
                  <div key={day} className={`p-3 rounded-lg border ${
                    data.active ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-100 opacity-60'
                  }`}>
                    {isEditingSchedule ? (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleDay(day)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            data.active ? 'bg-pink-500 text-white' : 'bg-gray-300 text-gray-500'
                          }`}
                        >
                          {data.active ? <Check size={16} /> : <X size={16} />}
                        </button>
                        <span className="text-sm font-medium text-gray-900 w-24">{getDayName(day)}</span>
                        {data.active ? (
                          <>
                            <input
                              type="time"
                              value={data.start}
                              onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-sm text-gray-500">to</span>
                            <input
                              type="time"
                              value={data.end}
                              onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Not available</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{getDayName(day)}</span>
                        <span className={`text-sm ${data.active ? 'text-gray-600' : 'text-gray-400'}`}>
                          {data.active ? `${data.start} - ${data.end}` : 'Not Available'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Assigned Clinic Network</h3>
              <div className="space-y-2">
                {clinicNetwork.map((clinic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">{clinic}</span>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-gray-400" size={20} />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500 mt-1">Update your account password</p>
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
        </div>
      </div>

      {/* Clinical Alerts - Full Width */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Clinical Alerts & Notifications</h2>
          <button
            onClick={handleSaveNotificationPreferences}
            disabled={saving}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader className="h-4 w-4 animate-spin" /> : 'Save Preferences'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-200 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">New Appointments</p>
              <p className="text-xs text-gray-500 mt-1">Real-time booking notifications</p>
            </div>
            <button
              onClick={() => setClinicalAlerts({...clinicalAlerts, newAppointments: !clinicalAlerts.newAppointments})}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                clinicalAlerts.newAppointments ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                clinicalAlerts.newAppointments ? 'left-6' : 'left-0.5'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-200 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">High-Risk Alerts</p>
              <p className="text-xs text-gray-500 mt-1">Critical vitals & lab results</p>
            </div>
            <button
              onClick={() => setClinicalAlerts({...clinicalAlerts, highRiskAlerts: !clinicalAlerts.highRiskAlerts})}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                clinicalAlerts.highRiskAlerts ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                clinicalAlerts.highRiskAlerts ? 'left-6' : 'left-0.5'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-200 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Vaccination Reminders</p>
              <p className="text-xs text-gray-500 mt-1">Upcoming vaccination alerts</p>
            </div>
            <button
              onClick={() => setClinicalAlerts({...clinicalAlerts, vaccinationReminders: !clinicalAlerts.vaccinationReminders})}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                clinicalAlerts.vaccinationReminders ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                clinicalAlerts.vaccinationReminders ? 'left-6' : 'left-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button - Fixed at Bottom */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveAllChanges}
          disabled={saving}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {saving && <Loader className="h-4 w-4 animate-spin" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
                    placeholder="Enter new password"
                  />
                  <button
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
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
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setIsForgotPasswordModalOpen(true);
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Forgot Password?
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                disabled={isSending}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
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

export default ProviderProfileSettings;