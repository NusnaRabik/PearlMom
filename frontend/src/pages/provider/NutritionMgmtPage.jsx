// frontend/src/pages/provider/NutritionMgmtPage.jsx
import React, { useState } from 'react';
import { 
  Calculator, Package, FileText, Download, TrendingUp, 
  ChevronRight, CheckCircle, X, User, Calendar, Phone, 
  MapPin, Activity, Heart, Info
} from 'lucide-react';
import ThriposhaCriteria from '../../components/provider/ThriposhaCriteria';

const NutritionMgmtPage = () => {
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [bmi, setBmi] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherId, setMotherId] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const recentLogs = [
    {
      name: 'Kushani Mendis',
      id: '#MM-7721',
      week: '28th Week',
      packets: 2,
      date: 'Oct 24, 2024',
      bmi: '17.8',
      phone: '+94 77 123 4567',
      address: '42, Galle Road, Colombo 03',
      status: 'Active',
      lastDistribution: 'Oct 24, 2024',
      nextEligible: 'Nov 24, 2024',
      notes: 'Patient showing good weight gain. Continue current supplementation.'
    },
    {
      name: 'Nilanthi Perera',
      id: '#MM-8842',
      week: '14th Week',
      packets: 1,
      date: 'Oct 23, 2024',
      bmi: '22.5',
      phone: '+94 77 987 6543',
      address: '15, Kandy Road, Kandy',
      status: 'Active',
      lastDistribution: 'Oct 23, 2024',
      nextEligible: 'Nov 23, 2024',
      notes: 'Normal BMI. Maintaining well with 1 packet.'
    },
    {
      name: 'Anura Kumari',
      id: '#MM-98234',
      week: '32nd Week',
      packets: 2,
      date: 'Oct 22, 2024',
      bmi: '31.2',
      phone: '+94 71 456 7890',
      address: '8, Main Street, Jaffna',
      status: 'High Risk',
      lastDistribution: 'Oct 22, 2024',
      nextEligible: 'Nov 22, 2024',
      notes: 'High BMI case. Monitoring for gestational diabetes. 2 packets recommended.'
    }
  ];

  const calculateEligibility = () => {
    if (pregnancyWeek && bmi && motherName && motherId) {
      setIsCalculating(true);
      
      // Simulate calculation delay
      setTimeout(() => {
        if (parseFloat(bmi) < 18.5 || parseFloat(bmi) > 30) {
          setEligibilityResult({
            eligible: true,
            packets: 2,
            message: 'Based on current parameters, this mother qualifies for 2 packets per distribution cycle.',
            icon: 'success',
            color: 'green'
          });
        } else if (parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 24.9) {
          setEligibilityResult({
            eligible: true,
            packets: 1,
            message: 'Based on current parameters, this mother qualifies for 1 packet per distribution cycle.',
            icon: 'success',
            color: 'green'
          });
        } else {
          setEligibilityResult({
            eligible: true,
            packets: 1,
            message: 'Based on current parameters, this mother qualifies for 1 packet per distribution cycle.',
            icon: 'success',
            color: 'green'
          });
        }
        setIsCalculating(false);
      }, 1500);
    } else {
      setEligibilityResult({
        eligible: false,
        packets: 0,
        message: 'Please fill in all fields: Mother Name, ID, Pregnancy Week, and BMI.',
        icon: 'warning',
        color: 'yellow'
      });
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handleDistribute = () => {
    if (eligibilityResult && eligibilityResult.eligible) {
      // Add distribution logic here
      alert(`Successfully distributed ${eligibilityResult.packets} packet(s) to ${motherName}`);
      // Reset form
      setMotherName('');
      setMotherId('');
      setPregnancyWeek('');
      setBmi('');
      setEligibilityResult(null);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition & Wellness Log</h1>
          <p className="text-gray-500 mt-1">Streamline your maternal support flow. Monitor Thriposha distribution and ensure every mother receives the care they need.</p>
        </div>
        <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors whitespace-nowrap">
          New Distribution
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility Calculator - Made Bigger */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Calculator className="mr-3 text-blue-500" size={24} />
                Eligibility Calculator
              </h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                Thriposha Program
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Quick validation for nutritional support programs. Enter mother's details below.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MOTHER'S FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g., Kushani Mendis"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MOTHER'S ID</label>
                <input
                  type="text"
                  placeholder="e.g., #MM-7721"
                  value={motherId}
                  onChange={(e) => setMotherId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PREGNANCY WEEK</label>
                <input
                  type="number"
                  placeholder="e.g., 24"
                  value={pregnancyWeek}
                  onChange={(e) => setPregnancyWeek(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BODY MASS INDEX (BMI)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 18.5"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <p className="text-xs text-gray-400 mt-1">Normal BMI range: 18.5 - 24.9</p>
              </div>
              <button
                onClick={calculateEligibility}
                disabled={isCalculating}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isCalculating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  'Calculate Eligibility'
                )}
              </button>
            </div>

            {/* Eligibility Result */}
            {eligibilityResult && (
              <div className={`mt-6 p-6 rounded-lg border-2 ${
                eligibilityResult.color === 'green' 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  {eligibilityResult.eligible ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                  ) : (
                    <Info className="text-yellow-500" size={24} />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {eligibilityResult.eligible ? 'Eligible for Thriposha' : 'Information Required'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{eligibilityResult.message}</p>
                {eligibilityResult.eligible && (
                  <>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Recommended Packets:</span>
                        <span className="text-2xl font-bold text-pink-600">{eligibilityResult.packets}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Distribution Cycle:</span>
                        <span className="text-sm font-medium text-gray-900">Monthly</span>
                      </div>
                    </div>
                    <button
                      onClick={handleDistribute}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Confirm & Distribute Now
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Thriposha Criteria */}
          <div className="mt-4">
            <ThriposhaCriteria />
          </div>
        </div>

        {/* Distribution Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="mr-2 text-orange-500" size={20} />
              Quick Distribution Log
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient Name/ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Issue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Packets</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.name}</p>
                          <p className="text-xs text-gray-500">{log.id} - {log.week}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{log.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.packets === 2 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.packets} {log.packets === 1 ? 'PACKET' : 'PACKETS'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleViewDetails(log)}
                          className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show if no logs */}
            {recentLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm">No distribution logs yet</p>
              </div>
            )}
          </div>

          {/* Reports & Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-green-500" size={20} />
              Reports & Insights
            </h2>
            <p className="text-sm text-gray-500 mb-4">Generate compliant documentation for ministry review.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Monthly Distribution</p>
                    <p className="text-xs text-gray-500">OCTOBER 2024</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                <div className="flex items-center space-x-3">
                  <Package size={20} className="text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Inventory Audit</p>
                    <p className="text-xs text-gray-500">CSV EXPORT</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                <div className="flex items-center space-x-3">
                  <TrendingUp size={20} className="text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Custom Analytics</p>
                    <p className="text-xs text-gray-500">VIEW HUB</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Recent Logs Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Logs</h2>
            <div className="space-y-3">
              {recentLogs.map((log, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(log)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.name}</p>
                      <p className="text-xs text-gray-500">{log.id} - {log.week}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-400">{log.date}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.packets === 2 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.packets} Packets
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Distribution Details</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Recipient Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-pink-600">
                    {selectedLog.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedLog.name}</h3>
                  <p className="text-sm text-gray-500">{selectedLog.id}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    selectedLog.status === 'High Risk' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Pregnancy Week</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.week}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">BMI</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.bmi}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Phone</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Package size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Packets</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.packets} Packets</p>
                </div>
              </div>

              {/* Address */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Address</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{selectedLog.address}</p>
              </div>

              {/* Distribution Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">Last Distribution</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.lastDistribution}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 font-medium mb-1">Next Eligible</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.nextEligible}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <Info size={16} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-yellow-600 font-medium mb-1">Clinical Notes</p>
                    <p className="text-sm text-gray-700">{selectedLog.notes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
                Edit Distribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionMgmtPage;