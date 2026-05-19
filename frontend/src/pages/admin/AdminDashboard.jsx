import React, { useState } from 'react';
import { 
  Users, Activity, Shield, TrendingUp, 
  CheckCircle, AlertTriangle,
  Database, Server, Heart, Calendar, Download
} from 'lucide-react';
import { LineChart, BarChart } from '../../components/charts';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const systemStats = [
    {
      title: 'Total Mothers',
      value: '14,282',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Providers',
      value: '842',
      change: '+4.2%',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'High-risk Cases',
      value: '328',
      change: '+12',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Vaccination Coverage',
      value: '94.8%',
      change: '+2.1%',
      icon: Shield,
      color: 'purple'
    }
  ];

  const deliveryStats = [
    { name: 'Safe Deliveries', value: 98.2, color: '#EC4899' },
    { name: 'Referred Cases', value: 1.5, color: '#F472B6' },
    { name: 'Complications', value: 0.3, color: '#FBCFE8' }
  ];

  const monthlyData = [
    { month: 'Jan', total: 2100 },
    { month: 'Feb', total: 2250 },
    { month: 'Mar', total: 2400 },
    { month: 'Apr', total: 2350 },
    { month: 'May', total: 2500 },
    { month: 'Jun', total: 2682 }
  ];

  // Monthly data for mothers and providers separately
  const motherMonthlyData = [
    { month: 'Jan', total: 1800 },
    { month: 'Feb', total: 1920 },
    { month: 'Mar', total: 2050 },
    { month: 'Apr', total: 2000 },
    { month: 'May', total: 2150 },
    { month: 'Jun', total: 2300 }
  ];

  const providerMonthlyData = [
    { month: 'Jan', total: 300 },
    { month: 'Feb', total: 330 },
    { month: 'Mar', total: 350 },
    { month: 'Apr', total: 350 },
    { month: 'May', total: 350 },
    { month: 'Jun', total: 382 }
  ];

  const regionalData = [
    { name: 'Central Province', value: 4102, color: '#EC4899' },
    { name: 'Eastern Province', value: 2840, color: '#F472B6' },
    { name: 'Northern Province', value: 1920, color: '#FB923C' },
    { name: 'Southern Province', value: 1650, color: '#FBBF24' },
    { name: 'Western Province', value: 3770, color: '#A78BFA' }
  ];

  const recentActivity = [
    {
      timestamp: '10:24 AM',
      user: 'Dr. Sarah Chen',
      action: 'Updated Patient #9928',
      status: 'success'
    },
    {
      timestamp: '09:55 AM',
      user: 'Admin Marcus',
      action: 'Bulk Data Export (CSV)',
      status: 'success'
    },
    {
      timestamp: '09:12 AM',
      user: 'Nurse Elena',
      action: 'New Registry: "Amara K."',
      status: 'success'
    },
    {
      timestamp: '08:45 AM',
      user: 'SystemBot',
      action: 'Nightly Backup Routine',
      status: 'success'
    },
    {
      timestamp: '07:30 AM',
      user: 'Dr. James Wilson',
      action: 'Login Attempt Failed',
      status: 'failed'
    }
  ];

  const handleExportReport = () => {
    const reportContent = `
═══════════════════════════════════════════════════════
         PEARL MOM - SYSTEM PERFORMANCE REPORT
═══════════════════════════════════════════════════════
Generated: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}
═══════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Mothers Registered:    14,282  (+12%)
  Active Providers:               842  (+4.2%)
  High-risk Cases:                328  (+12)
  Vaccination Coverage:          94.8%  (+2.1%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOTHER REGISTRATION TRENDS (Monthly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${motherMonthlyData.map(d => `  ${d.month}:  ${d.total} mothers`).join('\n  ')}

  Total: ${motherMonthlyData.reduce((sum, d) => sum + d.total, 0)} mothers registered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROVIDER REGISTRATION TRENDS (Monthly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${providerMonthlyData.map(d => `  ${d.month}:  ${d.total} providers`).join('\n  ')}

  Total: ${providerMonthlyData.reduce((sum, d) => sum + d.total, 0)} providers registered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERY SUCCESS RATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Safe Deliveries:    98.2%
  Referred Cases:      1.5%
  Complications:       0.3%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGIONAL PROVIDER PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Central Province:    4,102 mothers
  Eastern Province:    2,840 mothers
  Northern Province:   1,920 mothers
  Southern Province:   1,650 mothers
  Western Province:    3,770 mothers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECENT SYSTEM ACTIVITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ${recentActivity.map(a => `  [${a.timestamp}] ${a.user} - ${a.action} (${a.status})`).join('\n  ')}

═══════════════════════════════════════════════════════
  System Status: OPERATIONAL  |  Uptime: 99.9%
  Security: HIPAA Compliant   |  Encryption: AES-256
═══════════════════════════════════════════════════════
  © ${new Date().getFullYear()} PearlMom. All rights reserved.
  This report is confidential and intended for authorized personnel only.
═══════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PearlMom_System_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Custom Doughnut Chart Component
  const DeliveryDoughnutChart = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: '280px', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={deliveryStats}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {deliveryStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">98.2%</span>
            <span className="text-sm text-gray-500 mt-1">Safe</span>
            <span className="text-sm text-gray-500">Deliveries</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="ml-8 space-y-4">
          {deliveryStats.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.value}%</p>
                <p className="text-xs text-gray-500">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pearl Mom Performance</h1>
          <p className="text-gray-500 mt-1">System-wide health metrics and provider efficiency overview for Pearl Mom network.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* System Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => {
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            red: 'bg-red-50 text-red-600',
            purple: 'bg-purple-50 text-purple-600'
          };
          const isPositive = stat.change.startsWith('+');
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp size={16} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Registration Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">Monthly Registration Trends</h2>
          <p className="text-xs text-gray-500 mb-4">Intake volume over the last 6 months</p>
          <LineChart data={monthlyData} />
        </div>
        
        {/* Delivery Success - Doughnut Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">Delivery Success</h2>
          <p className="text-xs text-gray-500 mb-4">Clinical outcome rates</p>
          <DeliveryDoughnutChart />
        </div>
      </div>

      {/* Regional Performance & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Regional Provider Performance</h2>
          <BarChart data={regionalData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent System Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <span className="text-xs text-gray-400">{activity.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Server className="text-green-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">99.9% Uptime</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="text-pink-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">1,284 Records</p>
              <p className="text-xs text-gray-500">Active maternal records</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Heart className="text-pink-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">98.2% Safe</p>
              <p className="text-xs text-gray-500">Delivery success rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="text-pink-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">842 Active</p>
              <p className="text-xs text-gray-500">Providers this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg shadow-sm p-6 border border-pink-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield size={24} className="text-pink-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Maternal Health Matrix Security</h3>
              <p className="text-sm text-gray-600 mt-1">All clinical data is encrypted and HIPAA compliant. Supporting the PearlMom network with secure administration tools.</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Last Security Audit: Today</p>
            <p>Encryption: AES-256</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;