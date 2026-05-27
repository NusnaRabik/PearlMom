import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, Shield, TrendingUp, 
  CheckCircle, AlertTriangle,
  Database, Server, Heart, Calendar, Download, Loader
} from 'lucide-react';
import { LineChart, BarChart } from '../../components/charts';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data.stats);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!dashboardData) return;
    
    setExporting(true);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Colors
      const primaryColor = [219, 39, 119]; // pink-600
      
      // Header
      doc.setFillColor(245, 245, 250);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Title
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Pearl Mom', 20, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text('System Performance Report', 20, 35);
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 50, 20);
      
      // Line separator
      doc.setDrawColor(229, 231, 235);
      doc.line(20, 50, pageWidth - 20, 50);
      
      let yPos = 65;
      
      // ==================== SYSTEM OVERVIEW ====================
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.text('System Overview', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      
      const overviewData = [
        ['Total Mothers Registered:', dashboardData.totalMothers?.toLocaleString() || '0'],
        ['Active Providers:', dashboardData.activeProviders?.toLocaleString() || '0'],
        ['High-risk Cases:', dashboardData.highRiskCases?.toLocaleString() || '0'],
        ['Vaccination Coverage:', dashboardData.vaccinationCoverage || '0%'],
        ['Active Maternal Records:', dashboardData.activeMaternalRecords?.toLocaleString() || '0'],
        ['Providers This Month:', dashboardData.providersThisMonth?.toLocaleString() || '0']
      ];
      
      overviewData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPos);
        yPos += 7;
      });
      
      yPos += 5;
      
      // ==================== MOTHER REGISTRATION TRENDS ====================
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Mother Registration Trends (Last 6 Months)', 20, yPos);
      yPos += 8;
      
      const monthlyTableData = dashboardData.monthlyData?.map(m => [m.month, m.total.toString()]) || [];
      autoTable(doc, {
        startY: yPos,
        head: [['Month', 'Mothers Registered']],
        body: monthlyTableData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20 },
        width: pageWidth - 40
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
      
      // ==================== DELIVERY SUCCESS RATES ====================
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Delivery Success Rates', 20, yPos);
      yPos += 8;
      
      const deliveryData = [
        ['Safe Deliveries', '98.2%'],
        ['Referred Cases', '1.5%'],
        ['Complications', '0.3%']
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [['Outcome', 'Percentage']],
        body: deliveryData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20 },
        width: pageWidth - 40
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
      
      // ==================== REGIONAL PROVIDER PERFORMANCE ====================
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Regional Provider Performance', 20, yPos);
      yPos += 8;
      
      const regionalData = [
        ['Central Province', '4,102'],
        ['Eastern Province', '2,840'],
        ['Northern Province', '1,920'],
        ['Southern Province', '1,650'],
        ['Western Province', '3,770']
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [['Region', 'Mothers Served']],
        body: regionalData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20 },
        width: pageWidth - 40
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
      
      // ==================== RECENT SYSTEM ACTIVITY ====================
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Recent System Activity', 20, yPos);
      yPos += 8;
      
      const activityData = dashboardData.recentActivity?.map(a => [
        a.timestamp,
        a.user,
        a.action,
        a.status.toUpperCase()
      ]) || [];
      
      autoTable(doc, {
        startY: yPos,
        head: [['Time', 'User', 'Action', 'Status']],
        body: activityData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 20 },
        width: pageWidth - 40,
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 80 },
          3: { cellWidth: 25 }
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
      
      // ==================== SYSTEM HEALTH ====================
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('System Health', 20, yPos);
      yPos += 8;
      
      const healthData = [
        ['System Uptime', `${dashboardData.uptime || '99.9'}%`],
        ['Last Security Audit', dashboardData.lastAudit || 'Today'],
        ['Encryption Standard', dashboardData.encryption || 'AES-256'],
        ['Delivery Success Rate', dashboardData.deliverySuccessRate || '98.2%'],
        ['Active Maternal Records', dashboardData.activeMaternalRecords?.toLocaleString() || '0']
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: healthData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20 },
        width: pageWidth - 40
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Pearl Mom System Report - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.text(
          `© ${new Date().getFullYear()} PearlMom. All rights reserved.`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 5,
          { align: 'center' }
        );
      }
      
      // Save PDF
      doc.save(`PearlMom_System_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const systemStats = dashboardData ? [
    {
      title: 'Total Mothers',
      value: dashboardData.totalMothers?.toLocaleString() || '0',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Providers',
      value: dashboardData.activeProviders?.toLocaleString() || '0',
      change: '+4.2%',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'High-risk Cases',
      value: dashboardData.highRiskCases?.toLocaleString() || '0',
      change: '+12',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Vaccination Coverage',
      value: dashboardData.vaccinationCoverage || '0%',
      change: '+2.1%',
      icon: Shield,
      color: 'purple'
    }
  ] : [];

  const deliveryStats = [
    { name: 'Safe Deliveries', value: 98.2, color: '#EC4899' },
    { name: 'Referred Cases', value: 1.5, color: '#F472B6' },
    { name: 'Complications', value: 0.3, color: '#FBCFE8' }
  ];

  const monthlyData = dashboardData?.monthlyData || [
    { month: 'Jan', total: 0 },
    { month: 'Feb', total: 0 },
    { month: 'Mar', total: 0 },
    { month: 'Apr', total: 0 },
    { month: 'May', total: 0 },
    { month: 'Jun', total: 0 }
  ];

  const motherMonthlyData = dashboardData?.monthlyData || monthlyData;
  
  const providerMonthlyData = [
    { month: 'Jan', total: 300 },
    { month: 'Feb', total: 330 },
    { month: 'Mar', total: 350 },
    { month: 'Apr', total: 350 },
    { month: 'May', total: 350 },
    { month: 'Jun', total: dashboardData?.providersThisMonth || 382 }
  ];

  const regionalData = [
    { name: 'Central Province', value: 4102, color: '#EC4899' },
    { name: 'Eastern Province', value: 2840, color: '#F472B6' },
    { name: 'Northern Province', value: 1920, color: '#FB923C' },
    { name: 'Southern Province', value: 1650, color: '#FBBF24' },
    { name: 'Western Province', value: 3770, color: '#A78BFA' }
  ];

  const recentActivity = dashboardData?.recentActivity || [];

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

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button 
            onClick={fetchDashboardData} 
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
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
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
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
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Health & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Server className="text-green-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">{dashboardData?.uptime || '99.9'}% Uptime</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="text-pink-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">{dashboardData?.activeMaternalRecords?.toLocaleString() || '0'} Records</p>
              <p className="text-xs text-gray-500">Active maternal records</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Heart className="text-pink-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">{dashboardData?.deliverySuccessRate || '98.2'}% Safe</p>
              <p className="text-xs text-gray-500">Delivery success rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="text-pink-500" size={24} />
            <div>
              <p className="text-sm font-medium text-gray-900">{dashboardData?.providersThisMonth?.toLocaleString() || '0'} Active</p>
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
            <p>Last Security Audit: {dashboardData?.lastAudit || 'Today'}</p>
            <p>Encryption: {dashboardData?.encryption || 'AES-256'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;