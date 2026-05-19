// frontend/src/components/profile/PrivacySection.jsx
import React, { useState } from 'react';
import { Shield, Download, AlertCircle, FileText, Trash2, Eye, EyeOff } from 'lucide-react';

const PrivacySection = ({ onDeactivate, onExportData }) => {
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      onExportData?.();
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  const handleDeactivate = () => {
    onDeactivate?.();
    setShowDeactivateConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Shield className="h-5 w-5 mr-2 text-pink-600" />
        Privacy & Data
      </h2>

      <div className="space-y-4">
        {/* Export Data */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
              <Download size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Export Your Data</p>
              <p className="text-xs text-gray-500">Download all your personal data and health records</p>
            </div>
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              exportSuccess
                ? 'bg-green-500 text-white'
                : isExporting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            {exportSuccess ? 'Exported!' : isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>

        {/* Download Format */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <FileText size={16} className="mr-2 text-pink-500" />
            Download Format
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors">
              PDF Format
            </button>
            <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
              JSON Format
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors">
              CSV Format
            </button>
          </div>
        </div>

        {/* Data Visibility */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Eye size={16} className="mr-2 text-pink-500" />
            Data Visibility
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Share health data with provider</span>
              <button className="relative w-12 h-6 bg-pink-500 rounded-full">
                <div className="absolute top-0.5 left-6 w-5 h-5 bg-white rounded-full shadow"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Anonymous data for research</span>
              <button className="relative w-12 h-6 bg-gray-300 rounded-full">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Deactivate Account */}
        <div className="pt-4 border-t border-gray-200">
          {!showDeactivateConfirm ? (
            <button
              onClick={() => setShowDeactivateConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-600">
                  <Trash2 size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-red-700">Deactivate Account</p>
                  <p className="text-xs text-red-500">Permanently delete your account and all data</p>
                </div>
              </div>
              <AlertCircle size={20} className="text-red-400" />
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-xl border-2 border-red-300">
              <div className="flex items-start space-x-3 mb-4">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Are you absolutely sure?</p>
                  <p className="text-xs text-red-600 mt-1">
                    This action cannot be undone. All your personal data, health records, and account information will be permanently deleted.
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Yes, Deactivate My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;