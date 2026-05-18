import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Shield,
  TrendingUp,
  Calendar,
  Clock,
  Download,
  X,
  Baby,
  MapPin,
  Phone
} from 'lucide-react';
import KPICard from '../../components/provider/KPICard';
import { LineChart, BarChart, PieChart } from '../../components/charts';

const ProviderDashboard = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const stats = [
    {
      title: 'Total Mothers',
      value: '1,240',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Pregnancies',
      value: '892',
      change: '+8%',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'High-Risk Cases',
      value: '42',
      change: '-5%',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Vaccination Rate',
      value: '94%',
      change: '+3%',
      icon: Shield,
      color: 'purple'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'critical',
      message: 'Critical BP spike detected for Patient MTH-102 (Elara Vance)',
      time: '5 mins ago',
      action: 'Call Now'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Patient MTH-881 missed their 24-hour vitals log',
      time: '1 hour ago',
      action: 'Follow Up'
    },
    {
      id: 3,
      type: 'info',
      message: 'Missed Check-in: Patient MTH-445',
      time: '3 hours ago',
      action: 'Reschedule'
    }
  ];

  const appointmentData = [
    { name: 'Completed', value: 70, color: '#10B981' },
    { name: 'Rescheduled', value: 15, color: '#F59E0B' },
    { name: 'No-show', value: 15, color: '#EF4444' }
  ];

  const riskDistribution = [
    { name: 'Stable Routine', value: 62, color: '#3B82F6' },
    { name: 'Observation', value: 28, color: '#F59E0B' },
    { name: 'Urgent', value: 10, color: '#EF4444' }
  ];

  // This week's deliveries data
  const weeklyDeliveries = {
    Monday: [
      { id: 'MTH-102', name: 'Elara Vance', time: '9:00 AM', location: 'Green Valley Center', type: 'Normal', phone: '+94 77 123 4567' },
      { id: 'MTH-205', name: 'Priya Fernando', time: '11:30 AM', location: 'Green Valley Center', type: 'Normal', phone: '+94 71 234 5678' },
      { id: 'MTH-308', name: 'Kushani Mendis', time: '2:00 PM', location: 'Green Valley Center', type: 'C-Section', phone: '+94 76 345 6789' }
    ],
    Tuesday: [
      { id: 'MTH-401', name: 'Nilanthi Perera', time: '8:30 AM', location: 'Riverside Maternity', type: 'Normal', phone: '+94 70 456 7890' },
      { id: 'MTH-502', name: 'Anura Kumari', time: '1:00 PM', location: 'Riverside Maternity', type: 'Normal', phone: '+94 77 567 8901' }
    ],
    Wednesday: [
      { id: 'MTH-603', name: 'Samantha Silva', time: '7:00 AM', location: 'Central Hospital', type: 'Emergency', phone: '+94 71 678 9012' },
      { id: 'MTH-704', name: 'Dilani Perera', time: '10:00 AM', location: 'Green Valley Center', type: 'Normal', phone: '+94 76 789 0123' },
      { id: 'MTH-805', name: 'Maria Santos', time: '12:30 PM', location: 'Central Hospital', type: 'C-Section', phone: '+94 70 890 1234' },
      { id: 'MTH-906', name: 'Jennifer Adams', time: '3:00 PM', location: 'Green Valley Center', type: 'Normal', phone: '+94 77 901 2345' },
      { id: 'MTH-1007', name: 'Sarah Mitchell', time: '5:00 PM', location: 'Riverside Maternity', type: 'Induced', phone: '+94 71 012 3456' }
    ],
    Thursday: [
      { id: 'MTH-1108', name: 'Amara Okafor', time: '9:30 AM', location: 'Central Hospital', type: 'Normal', phone: '+94 76 123 4567' },
      { id: 'MTH-1209', name: 'Fatima Hassan', time: '2:00 PM', location: 'Green Valley Center', type: 'Normal', phone: '+94 70 234 5678' }
    ],
    Friday: [
      { id: 'MTH-1310', name: 'Isabella Chen', time: '8:00 AM', location: 'Riverside Maternity', type: 'C-Section', phone: '+94 77 345 6789' },
      { id: 'MTH-1411', name: 'Grace Williams', time: '11:00 AM', location: 'Central Hospital', type: 'Normal', phone: '+94 71 456 7890' }
    ],
    Saturday: [
      { id: 'MTH-1512', name: 'Rose Fernando', time: '10:00 AM', location: 'Green Valley Center', type: 'Normal', phone: '+94 76 567 8901' }
    ],
    Sunday: []
  };

  const getTotalDeliveries = () => {
    return Object.values(weeklyDeliveries).reduce((total, deliveries) => total + deliveries.length, 0);
  };

  const getDeliveryTypeColor = (type) => {
    switch(type) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'C-Section': return 'bg-yellow-100 text-yellow-800';
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Induced': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportReport = () => {
    const reportContent = `
PEARL MOM - PROVIDER PERFORMANCE REPORT
========================================
Generated: ${new Date().toLocaleDateString()}

SYSTEM OVERVIEW
---------------
Total Mothers Registered: 1,240
Active Pregnancy Count: 892 (+8%)
Urgent High-Risk Cases: 42 (-5%)
Population Vaccination Coverage: 94% (+3%)

MATERNAL RISK DISTRIBUTION
--------------------------
Stable Routine Care: 62%
Observation Required: 28%
Urgent Clinical Intervention: 10%

APPOINTMENT ATTENDANCE
----------------------
Completed: 70%
Rescheduled: 15%
No-show: 15%

DELIVERIES THIS WEEK
--------------------
Total Scheduled: ${getTotalDeliveries()}

${Object.entries(weeklyDeliveries).map(([day, deliveries]) => 
  deliveries.length > 0 ? `${day}:\n${deliveries.map(d => `  - ${d.name} (${d.id}) at ${d.time} - ${d.type} - ${d.location}`).join('\n')}` : `${day}: No deliveries scheduled`
).join('\n\n')}

RECENT ALERTS
-------------
${recentAlerts.map(a => `[${a.type.toUpperCase()}] ${a.message} - ${a.time}`).join('\n')}

Report generated by PearlMom Provider Dashboard
© 2024 PearlMom. All rights reserved.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PearlMom_Provider_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Dr. Mitchell. Here's your real-time health overview.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center space-x-2 transition-colors"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <KPICard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Registered Mothers by Month</h2>
          <LineChart />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Appointment Attendance Status</h2>
          <PieChart data={appointmentData} />
        </div>
      </div>

      {/* Risk Distribution & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Maternal Risk Distribution</h2>
          <BarChart data={riskDistribution} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg ${
                alert.type === 'critical' ? 'bg-red-50 border border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      alert.type === 'critical' ? 'text-red-800' :
                      alert.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
                <button className={`mt-2 text-xs font-medium ${
                  alert.type === 'critical' ? 'text-red-600 hover:text-red-800' :
                  alert.type === 'warning' ? 'text-yellow-600 hover:text-yellow-800' :
                  'text-blue-600 hover:text-blue-800'
                }`}>
                  {alert.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Deliveries Scheduled This Week</h2>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            View Schedule →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { day: 'Monday', count: weeklyDeliveries.Monday.length },
            { day: 'Wednesday', count: weeklyDeliveries.Wednesday.length },
            { day: 'Friday', count: weeklyDeliveries.Friday.length }
          ].map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="text-pink-500" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{item.day}</p>
                  <p className="text-sm text-gray-500">{item.count} {item.count === 1 ? 'delivery' : 'deliveries'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Deliveries Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Baby className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Weekly Delivery Schedule</h2>
                  <p className="text-xs text-gray-500">Total: {getTotalDeliveries()} deliveries this week</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {Object.entries(weeklyDeliveries).map(([day, deliveries]) => (
                <div key={day}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                      {day}
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'}
                    </span>
                  </div>
                  
                  {deliveries.length > 0 ? (
                    <div className="space-y-2">
                      {deliveries.map((delivery, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-pink-200 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-pink-600">
                                  {delivery.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{delivery.name}</h4>
                                <p className="text-xs text-gray-500">{delivery.id}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                  <span className="text-xs text-gray-600 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> {delivery.time}
                                  </span>
                                  <span className="text-xs text-gray-600 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" /> {delivery.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeliveryTypeColor(delivery.type)}`}>
                                {delivery.type}
                              </span>
                              <a 
                                href={`tel:${delivery.phone}`}
                                className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center"
                              >
                                <Phone className="h-3 w-3 mr-1" /> Call
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-400">No deliveries scheduled</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  All deliveries are subject to change based on clinical assessment.
                </p>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;