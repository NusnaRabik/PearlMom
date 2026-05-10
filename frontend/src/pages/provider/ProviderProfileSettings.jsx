// frontend/src/pages/provider/ProviderProfileSettings.jsx
import React, { useState } from 'react';
import { Camera, Shield, Clock, Smartphone, Monitor, Tablet } from 'lucide-react';

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

  const schedule = {
    monday: '08:00 - 16:00',
    tuesday: '08:00 - 16:00',
    wednesday: '08:00 - 16:00',
    thursday: '10:00 - 18:00',
    friday: '08:00 - 14:00'
  };

  const clinicNetwork = [
    'North Hub Main',
    'Community Outreach Unit B',
    'Riverside Maternity'
  ];

  const accessHistory = [
    { device: 'MacBook Pro', location: 'London, UK', time: 'Current Session', icon: Monitor },
    { device: 'iPad Pro', location: 'London, UK', time: '2 hours ago', icon: Tablet },
    { device: 'Mobile App', location: 'London, UK', time: 'Yesterday, 09:15', icon: Smartphone }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Provider Settings</h1>
        <p className="text-gray-500 mt-1">Manage your clinical profile, work preferences, and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-pink-600">SJ</span>
                </div>
                <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow">
                  <Camera size={14} className="text-gray-600" />
                </button>
              </div>
              <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                Change Photo
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FULL NAME</label>
                <input
                  type="text"
                  value={formData.fullName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MOBILE (OTP ENABLED)</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Professional Credentials */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Professional Credentials</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMPLOYEE ID (READ ONLY)</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DESIGNATION</label>
                <input
                  type="text"
                  value={formData.designation}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PRIMARY CLINIC/AREA</label>
                <input
                  type="text"
                  value={formData.clinic}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMERGENCY CONTACT</label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Work Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Current Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">MON - WED</p>
                  <p className="text-sm text-gray-500">{schedule.monday}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">THU</p>
                  <p className="text-sm text-gray-500">{schedule.thursday}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">FRI</p>
                  <p className="text-sm text-gray-500">{schedule.friday}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Assigned Clinic Network</h3>
              <div className="space-y-2">
                {clinicNetwork.map((clinic, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">{clinic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-gray-400" size={20} />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500">Last changed 42 days ago</p>
                </div>
                <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">Update</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Auth</p>
                  <p className="text-xs text-gray-500">SMS & Email Authentication</p>
                </div>
                <div className="w-10 h-6 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Clinical Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">New Appointments</span>
                <div className="w-10 h-6 bg-pink-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">High-Risk Alerts</span>
                <div className="w-10 h-6 bg-pink-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Missed Visits</span>
                <div className="w-10 h-6 bg-pink-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Access History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="mr-2 text-gray-400" size={20} />
              Access History
            </h2>
            <div className="space-y-3">
              {accessHistory.map((access, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <access.icon size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{access.device}</p>
                      <p className="text-xs text-gray-500">{access.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{access.time}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-pink-600 hover:text-pink-700 font-medium">
              View Full Security Audit
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProviderProfileSettings;