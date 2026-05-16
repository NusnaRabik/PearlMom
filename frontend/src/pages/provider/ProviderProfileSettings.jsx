// frontend/src/pages/provider/ProviderProfileSettings.jsx
import React, { useState } from 'react';
import { 
  Camera, Shield, Clock, Smartphone, Monitor, Tablet,
  Eye, EyeOff, Lock, Mail, Check, X, Edit2, Save,
  Plus, Trash2, AlertCircle, KeyRound
} from 'lucide-react';

const ProviderProfileSettings = () => {
  const [formData, setFormData] = useState({
    fullName: 'Dr. Sarah Jenkins',
    email: 's.jenkins@pearlmom.health',
    mobile: '+1 (555) 012-3456',
    employeeId: 'PM-9942-MED',
    designation: 'Senior Obstetrician',
    clinic: 'Green Valley Maternal Center',
    emergencyContact: '+1 (555) 999-8877'
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

  // Forgot Password Modal State
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Schedule Edit State
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

  // Clinical Alerts State
  const [clinicalAlerts, setClinicalAlerts] = useState({
    newAppointments: true,
    highRiskAlerts: true,
    missedVisits: true,
    labResults: true,
    vaccinationReminders: false
  });

  const clinicNetwork = [
    'North Hub Main',
    'Community Outreach Unit B',
    'Riverside Maternity'
  ];

  const accessHistory = [
    { device: 'MacBook Pro', browser: 'Chrome 120', location: 'London, UK', ip: '192.168.1.1', time: 'Current Session', icon: Monitor, status: 'active' },
    { device: 'iPad Pro', browser: 'Safari 17', location: 'London, UK', ip: '192.168.1.2', time: '2 hours ago', icon: Tablet, status: 'expired' },
    { device: 'Mobile App', browser: 'PearlMom iOS', location: 'London, UK', ip: '10.0.0.1', time: 'Yesterday, 09:15', icon: Smartphone, status: 'expired' },
    { device: 'Windows PC', browser: 'Edge 120', location: 'Manchester, UK', ip: '172.16.0.1', time: 'Dec 15, 2024, 14:30', icon: Monitor, status: 'expired' }
  ];

  // Handle Password Change
  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
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

    // Simulate API call
    setTimeout(() => {
      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordSuccess('');
      }, 1500);
    }, 1000);
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setForgotPasswordMessage('Please enter your email address');
      return;
    }

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setForgotPasswordMessage('Password reset link has been sent to your email address.');
      setIsSending(false);
      setTimeout(() => {
        setIsForgotPasswordModalOpen(false);
        setForgotEmail('');
        setForgotPasswordMessage('');
      }, 2000);
    }, 1500);
  };

  // Handle Schedule Update
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

  const handleSaveSchedule = () => {
    setIsEditingSchedule(false);
    // Add API call here
  };

  const getDayName = (key) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return days[key];
  };

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
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">SJ</span>
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <Camera size={14} className="text-gray-600" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Profile Photo</p>
                <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                  Change Photo
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FULL NAME</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MOBILE (OTP ENABLED)</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
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
                  value={formData.employeeId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DESIGNATION</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PRIMARY CLINIC/AREA</label>
                <input
                  type="text"
                  value={formData.clinic}
                  onChange={(e) => setFormData({...formData, clinic: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMERGENCY CONTACT</label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Preferences - Editable Schedule */}
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
                  className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <Save size={16} />
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

          {/* Security Settings - Without 2FA */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-gray-400" size={20} />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500 mt-1">Last changed 42 days ago</p>
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
        <h2 className="text-lg font-semibold mb-6">Clinical Alerts & Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <p className="text-sm font-medium text-gray-900">Missed Visits</p>
              <p className="text-xs text-gray-500 mt-1">Alert for patient follow-up</p>
            </div>
            <button
              onClick={() => setClinicalAlerts({...clinicalAlerts, missedVisits: !clinicalAlerts.missedVisits})}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                clinicalAlerts.missedVisits ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                clinicalAlerts.missedVisits ? 'left-6' : 'left-0.5'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-200 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Lab Results</p>
              <p className="text-xs text-gray-500 mt-1">New lab report notifications</p>
            </div>
            <button
              onClick={() => setClinicalAlerts({...clinicalAlerts, labResults: !clinicalAlerts.labResults})}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                clinicalAlerts.labResults ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                clinicalAlerts.labResults ? 'left-6' : 'left-0.5'
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

      {/* Access History - Full Width */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <Clock className="mr-2 text-gray-400" size={20} />
            Access History
          </h2>
          <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
            View Full Security Audit →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Browser/App</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessHistory.map((access, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <access.icon size={20} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{access.device}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{access.browser}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{access.location}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-500">{access.ip}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{access.time}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      access.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {access.status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 sticky bottom-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
              >
                Change Password
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <KeyRound size={20} className="text-blue-600" />
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
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
                  isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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