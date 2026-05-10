// frontend/src/pages/provider/NutritionMgmtPage.jsx
import React, { useState } from 'react';
import { Calculator, Package, FileText, Download, TrendingUp, ChevronRight } from 'lucide-react';
import ThriposhaCriteria from '../../components/provider/ThriposhaCriteria';

const NutritionMgmtPage = () => {
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [bmi, setBmi] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const recentLogs = [
    {
      name: 'Kushani Mendis',
      id: '#MM-7721',
      week: '28th Week',
      packets: 2,
      date: 'Oct 24, 2024'
    },
    {
      name: 'Nilanthi Perera',
      id: '#MM-8842',
      week: '14th Week',
      packets: 1,
      date: 'Oct 23, 2024'
    },
    {
      name: 'Anura Kumari',
      id: '#MM-98234',
      week: '32nd Week',
      packets: 2,
      date: 'Oct 22, 2024'
    }
  ];

  const calculateEligibility = () => {
    if (pregnancyWeek && bmi) {
      // Simple eligibility logic - can be replaced with actual Thriposha criteria
      if (parseFloat(bmi) < 18.5 || parseFloat(bmi) > 30) {
        setEligibilityResult({
          eligible: true,
          packets: 2,
          message: 'Based on current parameters, this mother qualifies for 2 packets per distribution cycle.'
        });
      } else {
        setEligibilityResult({
          eligible: true,
          packets: 1,
          message: 'Based on current parameters, this mother qualifies for 1 packet per distribution cycle.'
        });
      }
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
        {/* Eligibility Calculator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calculator className="mr-2 text-blue-500" size={20} />
              Eligibility Calculator
            </h2>
            <p className="text-sm text-gray-500 mb-4">Quick validation for nutritional support programs.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PREGNANCY WEEK</label>
                <input
                  type="number"
                  placeholder="e.g., 24"
                  value={pregnancyWeek}
                  onChange={(e) => setPregnancyWeek(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <button
                onClick={calculateEligibility}
                className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
              >
                Calculate Status
              </button>
            </div>

            {/* Eligibility Result */}
            {eligibilityResult && (
              <div className={`mt-4 p-4 rounded-lg ${eligibilityResult.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {eligibilityResult.eligible ? '✅ Eligible for Thriposha' : '❌ Not Eligible'}
                </h3>
                <p className="text-sm text-gray-600">{eligibilityResult.message}</p>
                {eligibilityResult.eligible && (
                  <p className="text-xs text-green-700 mt-2 font-medium">
                    Recommended: {eligibilityResult.packets} {eligibilityResult.packets === 1 ? 'packet' : 'packets'} per cycle
                  </p>
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
                        <button className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors">
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.name}</p>
                    <p className="text-xs text-gray-500">{log.id} - {log.week}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">{log.date}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.packets === 2 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.packets} Packets
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionMgmtPage;