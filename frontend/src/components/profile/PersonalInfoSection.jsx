// frontend/src/components/profile/PersonalInfoSection.jsx
import React, { useState } from 'react';
import { User, Edit2, Save, X } from 'lucide-react';

const PersonalInfoSection = ({ userData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  const handleEdit = () => {
    setFormData({ ...userData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2 text-pink-600" />
          Personal Information
        </h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-500 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {isEditing ? (
                <input
                  type={key === 'email' ? 'email' : key === 'mobile' || key === 'phone' ? 'tel' : 'text'}
                  value={value || ''}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{value || 'N/A'}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;