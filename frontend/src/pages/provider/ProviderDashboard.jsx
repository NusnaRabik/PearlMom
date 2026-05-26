import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, AlertTriangle, Shield, TrendingUp,
  Calendar, Clock, Download, X, Baby, MapPin, Phone,
  CheckCircle2, Briefcase, Heart, Loader
} from 'lucide-react';
import KPICard from '../../components/provider/KPICard';
import { LineChart, BarChart, PieChart } from '../../components/charts';
import { formatDate } from '../../utils/formatDate';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [providerInfo, setProviderInfo] = useState({
    full_name: '',
    employee_id: '',
    email: '',
    phone_number: '',
    assigned_area: '',
    district: '',
    qualification: ''
  });

  // Profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    employee_id: '',
    email: '',
    role_type: '',
    phone_number: '',
    assigned_area: '',
    district: ''
  });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Fetch provider data
  useEffect(() => {
    if (user && (user.role === 'midwife' || user.role === 'doctor')) {
      fetchProviderData();
      fetchDashboardData();
    }
  }, [user]);

  // Check if profile needs to be completed
  useEffect(() => {
    const isNewRegistration = localStorage.getItem('pearlmom_provider_new_registration');
    const isProfileComplete = localStorage.getItem('pearlmom_provider_profile_complete');
    
    if (isNewRegistration === 'true' && !isProfileComplete) {
      setShowProfileModal(true);
    } else {
      setProfileCompleted(true);
      if (isProfileComplete) {
        localStorage.removeItem('pearlmom_provider_new_registration');
      }
    }
  }, []);

  const fetchProviderData = async () => {
    try {
      const response = await api.get('/providers/profile');
      console.log('Provider profile response:', response.data);
      
      if (response.data.success) {
        const { user: userData, provider } = response.data.data;
        
        // Set provider info for header display
        setProviderInfo({
          full_name: userData.name || provider.full_name || '',
          employee_id: provider.employee_id || '',
          email: userData.email || '',
          phone_number: userData.phone_no || provider.contact_number || '',
          assigned_area: provider.assigned_area || '',
          district: provider.district || '',
          qualification: provider.qualification || ''
        });
        
        // Set profile data for the form
        setProfileData({
          full_name: userData.name || provider.full_name || '',
          employee_id: provider.employee_id || '',
          email: userData.email || '',
          role_type: provider.qualification || '',
          phone_number: userData.phone_no || provider.contact_number || '',
          assigned_area: provider.assigned_area || '',
          district: provider.district || ''
        });
        
        if (provider.profile_completed) {
          setProfileCompleted(true);
          localStorage.setItem('pearlmom_provider_profile_complete', 'true');
        }
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/providers/dashboard');
      console.log('Dashboard response:', response.data);
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setProfileError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setSaving(true);

    const requiredFields = ['full_name', 'email', 'role_type', 'phone_number', 'assigned_area', 'district'];
    const emptyFields = requiredFields.filter(field => !profileData[field]);
    
    if (emptyFields.length > 0) {
      setProfileError(`Please fill in all required fields: ${emptyFields.map(f => f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}`);
      setSaving(false);
      return;
    }

    try {
      const response = await api.put('/providers/profile', {
        full_name: profileData.full_name,
        email: profileData.email,
        phone_number: profileData.phone_number,
        role_type: profileData.role_type,
        assigned_area: profileData.assigned_area,
        district: profileData.district
      });
      
      console.log('Profile update response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('pearlmom_provider_profile_complete', 'true');
        localStorage.removeItem('pearlmom_provider_new_registration');
        
        setProfileSuccess(true);
        setProfileCompleted(true);
        
        // Update provider info
        setProviderInfo(prev => ({
          ...prev,
          full_name: profileData.full_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          assigned_area: profileData.assigned_area,
          district: profileData.district,
          qualification: profileData.role_type
        }));
        
        setTimeout(() => {
          setShowProfileModal(false);
          setProfileSuccess(false);
        }, 2000);
        
        fetchProviderData();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Profile save error:', error);
      setProfileError(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSkipProfile = () => {
    setShowProfileModal(false);
  };

  // Calculate stats from real data
  const stats = [
    { title: 'Total Mothers', value: dashboardData?.stats?.totalMothers?.toLocaleString() || '0', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Pregnancies', value: dashboardData?.stats?.activePregnancies?.toLocaleString() || '0', change: '+8%', icon: Activity, color: 'green' },
    { title: 'High-Risk Cases', value: dashboardData?.stats?.highRiskMothers?.toLocaleString() || '0', change: '-5%', icon: AlertTriangle, color: 'red' },
    { title: 'Vaccination Rate', value: `${dashboardData?.stats?.vaccinationRate || 94}%`, change: '+3%', icon: Shield, color: 'purple' }
  ];

  const recentAlerts = dashboardData?.recentAlerts?.slice(0, 3).map(alert => ({
    id: alert.record_id,
    type: alert.is_high_risk ? 'critical' : 'warning',
    message: alert.doctors_notes || 'Routine checkup completed',
    time: formatDate(alert.created_at, 'relative') || 'Recently',
    action: 'View Details'
  })) || [
    { id: 1, type: 'info', message: 'No recent alerts', time: 'All good', action: 'View Dashboard' }
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

  // Group deliveries by day
  const weeklyDeliveries = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };

  dashboardData?.weeklyDeliveries?.forEach(delivery => {
    if (delivery.expected_delivery_date) {
      const date = new Date(delivery.expected_delivery_date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (weeklyDeliveries[dayName]) {
        weeklyDeliveries[dayName].push({
          id: delivery.mother_code,
          name: delivery.full_name,
          time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          location: 'Maternity Ward',
          type: delivery.is_high_risk ? 'High Risk' : 'Normal',
          phone: '+94 77 123 4567'
        });
      }
    }
  });

  const getTotalDeliveries = () => Object.values(weeklyDeliveries).reduce((total, deliveries) => total + deliveries.length, 0);

  const getDeliveryTypeColor = (type) => {
    switch(type) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'C-Section': return 'bg-yellow-100 text-yellow-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      case 'Emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportReport = () => {
    const reportContent = `
PEARL MOM - PROVIDER PERFORMANCE REPORT
========================================
Generated: ${formatDate(new Date(), 'dateTime')}
Provider: ${providerInfo.full_name || user?.fullName || 'Provider'}
Employee ID: ${providerInfo.employee_id || 'N/A'}

SYSTEM OVERVIEW
---------------
Total Mothers Registered: ${dashboardData?.stats?.totalMothers || 0}
Active Pregnancy Count: ${dashboardData?.stats?.activePregnancies || 0}
Urgent High-Risk Cases: ${dashboardData?.stats?.highRiskMothers || 0}
Population Vaccination Coverage: ${dashboardData?.stats?.vaccinationRate || 94}%

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

Report generated on ${formatDate(new Date(), 'full')}
© ${new Date().getFullYear()} PearlMom. All rights reserved.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PearlMom_Provider_Report_${formatDate(new Date(), 'short').replace(/[, ]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {providerInfo.full_name || user?.fullName || 'Provider'}. 
            Employee ID: <span className="font-semibold text-pink-600">{providerInfo.employee_id || 'Not set'}</span> | 
            Here's your real-time health overview for {formatDate(new Date(), 'long')}.
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExportReport} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center space-x-2 transition-colors">
            <Download size={16} /><span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Profile Completion Reminder Banner */}
      {!profileCompleted && !showProfileModal && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-800">Complete Your Provider Profile</p>
              <p className="text-xs text-yellow-600">Please fill in your professional information to get started.</p>
            </div>
          </div>
          <button onClick={() => setShowProfileModal(true)} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
            Complete Now
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (<KPICard key={index} {...stat} />))}
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
              <div key={alert.id} className={`p-3 rounded-lg ${alert.type === 'critical' ? 'bg-red-50 border border-red-200' : alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${alert.type === 'critical' ? 'text-red-800' : alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}`}>{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                <button className={`mt-2 text-xs font-medium ${alert.type === 'critical' ? 'text-red-600 hover:text-red-800' : alert.type === 'warning' ? 'text-yellow-600 hover:text-yellow-800' : 'text-blue-600 hover:text-blue-800'}`}>{alert.action} →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Deliveries Scheduled This Week</h2>
          <button onClick={() => setShowScheduleModal(true)} className="text-sm text-pink-600 hover:text-pink-700 font-medium">View Schedule →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(weeklyDeliveries).filter(([_, deliveries]) => deliveries.length > 0).slice(0, 3).map(([day, deliveries]) => (
            <div key={day} className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="text-pink-500" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{day}</p>
                  <p className="text-sm text-gray-500">{deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'}</p>
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg"><Baby className="h-5 w-5 text-pink-600" /></div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Weekly Delivery Schedule</h2>
                  <p className="text-xs text-gray-500">Total: {getTotalDeliveries()} deliveries this week</p>
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(weeklyDeliveries).map(([day, deliveries]) => (
                <div key={day}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center"><Calendar className="h-4 w-4 mr-2 text-pink-500" />{day}</h3>
                    <span className="text-xs text-gray-500 font-medium">{deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'}</span>
                  </div>
                  {deliveries.length > 0 ? (
                    <div className="space-y-2">
                      {deliveries.map((delivery, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-pink-200 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-pink-600">{delivery.name.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{delivery.name}</h4>
                                <p className="text-xs text-gray-500">{delivery.id}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                  <span className="text-xs text-gray-600 flex items-center"><Clock className="h-3 w-3 mr-1" /> {delivery.time}</span>
                                  <span className="text-xs text-gray-600 flex items-center"><MapPin className="h-3 w-3 mr-1" /> {delivery.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeliveryTypeColor(delivery.type)}`}>{delivery.type}</span>
                              <a href={`tel:${delivery.phone}`} className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center"><Phone className="h-3 w-3 mr-1" /> Call</a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center"><p className="text-sm text-gray-400">No deliveries scheduled</p></div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">All deliveries are subject to change based on clinical assessment.</p>
                <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Complete Your Provider Profile</h2>
                  <p className="text-xs text-gray-500">This information is required to set up your provider account</p>
                </div>
              </div>
              <button onClick={handleSkipProfile} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {profileSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Completed!</h3>
                  <p className="text-gray-500">Your provider information has been saved successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  {profileError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{profileError}</div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" name="full_name" value={profileData.full_name} onChange={handleProfileInputChange}
                        placeholder="e.g., Dr. Sarah Jenkins"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                      <input type="text" name="employee_id" value={profileData.employee_id} 
                        readOnly
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
                      <p className="text-xs text-gray-400 mt-1">This ID is auto-generated and cannot be edited</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input type="email" name="email" value={profileData.email} onChange={handleProfileInputChange}
                        placeholder="e.g., s.jenkins@pearlmom.health"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role Type *</label>
                      <select name="role_type" value={profileData.role_type} onChange={handleProfileInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                        <option value="">Select Role</option>
                        <option value="Midwife">Midwife</option>
                        <option value="Medical Officer">Medical Officer</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Specialist">Specialist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="tel" name="phone_number" value={profileData.phone_number} onChange={handleProfileInputChange}
                        placeholder="e.g., +94 77 123 4567"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Area *</label>
                      <input type="text" name="assigned_area" value={profileData.assigned_area} onChange={handleProfileInputChange}
                        placeholder="e.g., Colombo North"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                      <input type="text" name="district" value={profileData.district} onChange={handleProfileInputChange}
                        placeholder="e.g., Colombo"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button type="button" onClick={handleSkipProfile} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                      Skip for now
                    </button>
                    <div className="flex space-x-3">
                      <button type="button" onClick={handleSkipProfile}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        Remind Later
                      </button>
                      <button type="submit" disabled={saving}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;