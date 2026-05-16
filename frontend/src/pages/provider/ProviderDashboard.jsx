// frontend/src/pages/provider/ProviderDashboard.jsx
import React from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Shield,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import KPICard from '../../components/provider/KPICard';
import { LineChart, BarChart, PieChart } from '../../components/charts';

const ProviderDashboard = () => {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Dr. Mitchell. Here's your real-time health overview.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">
            Add New Patient
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Registered Mothers by Month</h2>
          <LineChart />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Appointment Attendance Status</h2>
          <PieChart data={appointmentData} />
        </div>
      </div>

      {/* Risk Distribution & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Maternal Risk Distribution</h2>
          <BarChart data={riskDistribution} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Deliveries Scheduled This Week</h2>
          <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">View Schedule →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="font-medium text-gray-900">Monday</p>
                <p className="text-sm text-gray-500">3 deliveries</p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="font-medium text-gray-900">Wednesday</p>
                <p className="text-sm text-gray-500">5 deliveries</p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="font-medium text-gray-900">Friday</p>
                <p className="text-sm text-gray-500">2 deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;