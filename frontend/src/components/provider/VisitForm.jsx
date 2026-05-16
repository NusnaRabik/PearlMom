// frontend/src/components/provider/VisitForm.jsx
import React, { useState } from 'react';
import { Save, Clipboard, AlertCircle } from 'lucide-react';

const VisitForm = ({ patientId }) => {
  const [visitData, setVisitData] = useState({
    bloodPressure: '',
    weight: '',
    fetalHeartRate: '',
    fundalHeight: '',
    edema: 'none',
    fetalMovement: 'normal',
    complaints: '',
    clinicalNotes: '',
    nextVisitRecommendation: '',
    referrals: ''
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Vitals Update */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Pressure (mmHg)
          </label>
          <input
            type="text"
            name="bloodPressure"
            value={visitData.bloodPressure}
            onChange={handleChange}
            placeholder="e.g., 120/80"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={visitData.weight}
            onChange={handleChange}
            placeholder="e.g., 68.5"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fetal Heart Rate (bpm)
          </label>
          <input
            type="number"
            name="fetalHeartRate"
            value={visitData.fetalHeartRate}
            onChange={handleChange}
            placeholder="e.g., 145"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      {/* Clinical Observations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fundal Height (cm)
          </label>
          <input
            type="number"
            name="fundalHeight"
            value={visitData.fundalHeight}
            onChange={handleChange}
            placeholder="e.g., 24"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edema
          </label>
          <select
            name="edema"
            value={visitData.edema}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="none">None</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fetal Movement
          </label>
          <select
            name="fetalMovement"
            value={visitData.fetalMovement}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="normal">Normal</option>
            <option value="reduced">Reduced</option>
            <option value="excessive">Excessive</option>
            <option value="absent">Absent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Visit Recommendation
          </label>
          <select
            name="nextVisitRecommendation"
            value={visitData.nextVisitRecommendation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Select...</option>
            <option value="1-week">1 Week</option>
            <option value="2-weeks">2 Weeks</option>
            <option value="4-weeks">4 Weeks</option>
            <option value="urgent">Urgent Referral</option>
          </select>
        </div>
      </div>

      {/* Complaints & Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Patient Complaints
        </label>
        <textarea
          name="complaints"
          value={visitData.complaints}
          onChange={handleChange}
          rows="3"
          placeholder="Document any complaints or symptoms reported by the patient..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Clinical Notes
        </label>
        <textarea
          name="clinicalNotes"
          value={visitData.clinicalNotes}
          onChange={handleChange}
          rows="3"
          placeholder="Enter clinical observations, findings, and recommendations..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Referrals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Referrals (if any)
        </label>
        <input
          type="text"
          name="referrals"
          value={visitData.referrals}
          onChange={handleChange}
          placeholder="e.g., Specialist consultation, Ultrasound, Lab tests"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Risk Assessment Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={18} />
          <div>
            <p className="text-sm font-medium text-yellow-800">Clinical Decision Support</p>
            <p className="text-xs text-yellow-700 mt-1">
              Patient is at 24 weeks. Ensure all second-trimester screenings are completed.
              Verify tetanus vaccination status and iron/folic acid supplementation.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2 ${
            saving ? 'bg-gray-400' : 'bg-pink-600 hover:bg-pink-700'
          }`}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : saved ? (
            <>
              <Clipboard size={16} />
              <span>Saved ✓</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Complete Visit</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VisitForm;