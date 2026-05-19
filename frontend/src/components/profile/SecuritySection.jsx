// frontend/src/components/profile/SecuritySection.jsx
import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';

const SecuritySection = ({ onPasswordChange }) => {
  const [showModal, setShowModal] = useState(false);
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = () => {
    setError('');
    setSuccess('');

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setError('New password must be different from old password');
      return;
    }

    onPasswordChange?.(passwordData);
    setSuccess('Password changed successfully!');
    
    setTimeout(() => {
      setShowModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Shield className="h-5 w-5 mr-2 text-pink-600" />
        Security
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-900">Change Password</p>
            <p className="text-xs text-gray-500 mt-1">Last changed 42 days ago</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Lock className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <Check size={16} className="text-green-500" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {['old', 'new', 'confirm'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field === 'old' ? 'Old Password' : field === 'new' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords[field] ? 'text' : 'password'}
                      value={passwordData[`${field}Password`]}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, [`${field}Password`]: e.target.value });
                        setError('');
                      }}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                      placeholder={`Enter ${field === 'old' ? 'old' : field === 'new' ? 'new' : 'confirm new'} password`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {field === 'new' && <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySection;