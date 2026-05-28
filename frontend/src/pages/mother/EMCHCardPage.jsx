import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, FileText, Syringe, ChevronRight, Phone, X, Calendar, Droplet, Loader, Edit, Save, XCircle, Eye, AlertCircle, Heart, CheckCircle2, Activity, TrendingUp, ActivitySquare, Clock, MapPin, Bell, FolderOpen, FlaskRound as Flask, Microscope, Stethoscope } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EMCHCardPage = () => {
  const { user } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [motherData, setMotherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [vitalSigns, setVitalSigns] = useState(null);
  const [clinicVisits, setClinicVisits] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [labReports, setLabReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    dob: '',
    blood_group: '',
    expected_delivery_date: '',
    current_weight: '',
    height: '',
    nic: '',
    address: '',
    district: '',
    husband_name: '',
    husband_contact: ''
  });

  useEffect(() => {
    if (user && user.role === 'mother') {
      fetchEMCHCardData();
    } else if (user && user.role !== 'mother') {
      setError('This page is only for mothers');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchEMCHCardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching EMCH card data...');
      const response = await api.get('/mothers/emch-card-data');
      
      console.log('API Response:', response);
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        
        if (data.mother) {
          setMotherData(data.mother);
          setEditFormData({
            full_name: data.mother.full_name || '',
            dob: data.mother.dob ? data.mother.dob.split('T')[0] : '',
            blood_group: data.mother.blood_group || '',
            expected_delivery_date: data.mother.expected_delivery_date ? data.mother.expected_delivery_date.split('T')[0] : '',
            current_weight: data.mother.current_weight || '',
            height: data.mother.height || '',
            nic: data.mother.nic || '',
            address: data.mother.address || '',
            district: data.mother.district || '',
            husband_name: data.mother.husband_name || '',
            husband_contact: data.mother.husband_contact || ''
          });
        }
        
        if (data.vitalSigns) {
          setVitalSigns(data.vitalSigns);
        }
        
        if (data.clinicVisits && data.clinicVisits.length > 0) {
          setClinicVisits(data.clinicVisits.slice(0, 2));
        }
        
        if (data.nextAppointment) {
          setNextAppointment(data.nextAppointment);
        }
        
        if (data.labReports && data.labReports.length > 0) {
          setLabReports(data.labReports);
        }
      } else {
        setError(response.data?.message || 'Failed to load EMCH card data');
      }
    } catch (err) {
      console.error('Error fetching EMCH card data:', err);
      setError(err.response?.data?.message || 'Could not load EMCH card information');
    } finally {
      setLoading(false);
    }
  };

  const updateMotherProfile = async (profileData) => {
    try {
      const response = await api.put('/mothers/profile', profileData);
      
      if (response.data.success) {
        setIsEditing(false);
        await fetchEMCHCardData();
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (motherData) {
      setEditFormData({
        full_name: motherData.full_name || '',
        dob: motherData.dob ? motherData.dob.split('T')[0] : '',
        blood_group: motherData.blood_group || '',
        expected_delivery_date: motherData.expected_delivery_date ? motherData.expected_delivery_date.split('T')[0] : '',
        current_weight: motherData.current_weight || '',
        height: motherData.height || '',
        nic: motherData.nic || '',
        address: motherData.address || '',
        district: motherData.district || '',
        husband_name: motherData.husband_name || '',
        husband_contact: motherData.husband_contact || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    updateMotherProfile(editFormData);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fixed PDF download for individual report
  const handleDownloadReport = async (report) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const primaryColor = [219, 39, 119];
      
      // Header
      doc.setFillColor(253, 242, 248);
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Pearl Mom', 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text('Laboratory Report', 20, 32);
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 45, 20);
      doc.line(20, 45, pageWidth - 20, 45);
      
      let yPos = 60;
      
      // Report Details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Report Details', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(`Test Name: ${report.test_name || 'N/A'}`, 20, yPos);
      yPos += 7;
      doc.text(`Collected Date: ${report.collected_date ? formatDate(report.collected_date, 'long') : 'Not specified'}`, 20, yPos);
      yPos += 7;
      if (report.test_value) {
        doc.text(`Result: ${report.test_value} ${report.unit || ''}`, 20, yPos);
        yPos += 7;
      }
      if (report.notes) {
        doc.text(`Notes: ${report.notes}`, 20, yPos);
        yPos += 7;
      }
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(`Pearl Mom Lab Report - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }
      
      doc.save(`${report.test_name?.replace(/\s/g, '_') || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  // Fixed PDF download for category
  const handleDownloadCategory = async (categoryReports, categoryName) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const primaryColor = [219, 39, 119];
      
      // Header
      doc.setFillColor(253, 242, 248);
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Pearl Mom', 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text(categoryName, 20, 32);
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 45, 20);
      doc.line(20, 45, pageWidth - 20, 45);
      
      let yPos = 60;
      
      // Table of reports
      const tableData = categoryReports.map(report => [
        report.test_name || 'N/A',
        report.collected_date ? formatDate(report.collected_date, 'short') : 'N/A',
        report.test_value || 'N/A',
        report.unit || ''
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Test Name', 'Date', 'Result', 'Unit']],
        body: tableData,
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
        doc.text(`Pearl Mom Report - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }
      
      doc.save(`${categoryName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error downloading reports:', error);
      alert('Failed to download reports');
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleViewCategory = (categoryReports) => {
    setSelectedCategory(categoryReports);
    setShowReportModal(true);
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'NORMAL':
      case 'COMPLETE':
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
      case 'PENDING REVIEW':
        return 'warning';
      case 'ABNORMAL':
      case 'CRITICAL':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getAppointmentTypeLabel = (type) => {
    const types = {
      'antenatal': 'Antenatal',
      'postnatal': 'Postnatal',
      'vaccination': 'Vaccination',
      'checkup': 'Check-up',
      'home_visit': 'Home Visit'
    };
    return types[type] || type;
  };

  // Categorize lab reports by trimester
  const categorizeReports = () => {
    const firstTrimester = [];
    const secondTrimester = [];
    const thirdTrimester = [];
    
    labReports.forEach(report => {
      const collectedDate = new Date(report.collected_date);
      const lmpDate = motherData?.lmp_date ? new Date(motherData.lmp_date) : null;
      
      if (lmpDate && collectedDate) {
        const weeksDiff = Math.floor((collectedDate - lmpDate) / (1000 * 60 * 60 * 24 * 7));
        
        if (weeksDiff <= 12) {
          firstTrimester.push(report);
        } else if (weeksDiff <= 27) {
          secondTrimester.push(report);
        } else {
          thirdTrimester.push(report);
        }
      } else {
        thirdTrimester.push(report);
      }
    });
    
    const categorizeByType = (reports) => {
      return {
        bloodTests: reports.filter(r => 
          r.test_name?.toLowerCase().includes('blood') || 
          r.test_name?.toLowerCase().includes('cbc') ||
          r.test_name?.toLowerCase().includes('group') ||
          r.test_name?.toLowerCase().includes('rubella') ||
          r.test_name?.toLowerCase().includes('hepatitis') ||
          r.test_name?.toLowerCase().includes('vdrl') ||
          r.test_name?.toLowerCase().includes('hiv') ||
          r.test_name?.toLowerCase().includes('iron') ||
          r.test_name?.toLowerCase().includes('vitamin')
        ),
        urineTests: reports.filter(r => 
          r.test_name?.toLowerCase().includes('urine')
        ),
        ultrasoundScans: reports.filter(r => 
          r.test_name?.toLowerCase().includes('ultrasound') ||
          r.test_name?.toLowerCase().includes('scan')
        ),
        otherTests: reports.filter(r => 
          !r.test_name?.toLowerCase().includes('blood') &&
          !r.test_name?.toLowerCase().includes('urine') &&
          !r.test_name?.toLowerCase().includes('ultrasound') &&
          !r.test_name?.toLowerCase().includes('scan')
        )
      };
    };
    
    return {
      firstTrimester: categorizeByType(firstTrimester),
      secondTrimester: categorizeByType(secondTrimester),
      thirdTrimester: categorizeByType(thirdTrimester)
    };
  };

  const emergencyContacts = [
    { name: 'Emergency Ambulance', role: 'Suwa Seriya', phone: '1990', available: '24/7', type: 'emergency' },
    { name: 'National Hospital', role: 'Maternity Ward', phone: '+94 11 269 1111', available: '24/7', type: 'hospital' }
  ];

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your health information...</p>
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
            onClick={() => fetchEMCHCardData()} 
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!motherData) {
    return (
      <div className="p-6 min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-yellow-600">No mother profile found. Please complete your registration.</p>
        </div>
      </div>
    );
  }

  const categorizedReports = categorizeReports();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
      
      {/* Main Profile Card */}
      <Card className="overflow-hidden border-none shadow-sm animate-fadeIn">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {motherData?.full_name?.charAt(0) || 'M'}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{motherData?.full_name || 'Mother'}</h2>
                  <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">{motherData?.mother_code || 'Not assigned'}</span>
                    <span className="hidden sm:inline">|</span>
                    <span>Age: {calculateAge(motherData?.dob)}</span>
                    <span className="hidden sm:inline">|</span>
                    <span>Blood Group: <strong className="text-gray-900">{motherData?.blood_group || 'Not specified'}</strong></span>
                  </div>
                  {motherData?.nic && (
                    <p className="text-xs text-gray-500 mt-1">NIC: {motherData.nic}</p>
                  )}
                </div>
                <button onClick={handleEditClick} className="text-pink-600 hover:text-pink-700 transition-transform hover:scale-110">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100 flex-shrink-0 animate-pulse-slow">
             <p className="text-xs tracking-wider uppercase text-green-700 font-semibold mb-1">Expected Delivery Date</p>
             <p className="text-2xl text-green-800 font-bold">
               {motherData?.expected_delivery_date ? formatDate(motherData.expected_delivery_date, 'long') : 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
              <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={editFormData.full_name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                  <input
                    type="text"
                    name="nic"
                    value={editFormData.nic}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={editFormData.dob}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    name="blood_group"
                    value={editFormData.blood_group}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    name="expected_delivery_date"
                    value={editFormData.expected_delivery_date}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="current_weight"
                    value={editFormData.current_weight}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="height"
                    value={editFormData.height}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={editFormData.district}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    rows="2"
                    value={editFormData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Name</label>
                  <input
                    type="text"
                    name="husband_name"
                    value={editFormData.husband_name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Contact</label>
                  <input
                    type="text"
                    name="husband_contact"
                    value={editFormData.husband_contact}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vital Signs & Trends */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Vital Signs & Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideInUp" style={{ animationDelay: '0ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Blood Pressure (Avg)</p>
                <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900 transition-all duration-500 hover:text-blue-600">
                  {vitalSigns?.blood_pressure_systolic && vitalSigns?.blood_pressure_diastolic 
                    ? `${vitalSigns.blood_pressure_systolic}/${vitalSigns.blood_pressure_diastolic}`
                    : '--/--'}
                </span>
                <span className="ml-2 text-sm text-green-600 font-medium">
                  {vitalSigns?.blood_pressure_systolic ? 'Recorded' : 'Not recorded'}
                </span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideInUp" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Weight Progress (kg)</p>
                <TrendingUp className="h-4 w-4 text-green-500 animate-bounce" />
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900 transition-all duration-500 hover:text-green-600">
                  {vitalSigns?.weight_kg || motherData?.current_weight || '--'}
                </span>
                <span className="ml-2 text-sm text-gray-500 font-medium">kg</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slideInUp" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Fetal Heart Rate (bpm)</p>
                <ActivitySquare className="h-4 w-4 text-pink-500 animate-pulse" />
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900 transition-all duration-500 hover:text-pink-600">
                  {vitalSigns?.fetal_heart_rate || '--'}
                </span>
                <span className="ml-2 text-sm text-gray-600 font-medium">
                  {vitalSigns?.fetal_heart_rate ? 'bpm' : 'Not recorded'}
                </span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full transition-all duration-1000" style={{ width: '78%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-5 border border-pink-200 animate-slideInUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center text-sm font-bold animate-pulse-slow">!</div>
              <div>
                <h4 className="font-semibold text-pink-900">Next Appointment</h4>
                <p className="text-sm text-pink-800">
                  Your {getAppointmentTypeLabel(nextAppointment.appointment_type)} check-up is scheduled for <strong>
                    {formatDate(nextAppointment.appointment_date, 'long')} {nextAppointment.appointment_time ? `at ${nextAppointment.appointment_time}` : ''}
                  </strong>.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAppointmentModal(true)} 
              className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center flex-shrink-0 transition-transform hover:translate-x-1"
            >
              View Details <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentModal && nextAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                  <p className="text-xs text-gray-500">Complete information about your upcoming visit</p>
                </div>
              </div>
              <button onClick={() => setShowAppointmentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-center">
                <Badge variant="warning" className="text-lg px-4 py-2">
                  {getAppointmentTypeLabel(nextAppointment.appointment_type)} Check-up
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Calendar className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(nextAppointment.appointment_date, 'long')}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Clock className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="font-semibold text-gray-900">{nextAppointment.appointment_time || 'Not specified'}</p>
                </div>
              </div>

              {nextAppointment.Clinic && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Location</p>
                      <p className="text-sm text-gray-700">{nextAppointment.Clinic.clinic_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{nextAppointment.Clinic.address}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">Appointment Status</p>
                <Badge variant="warning" className="capitalize">{nextAppointment.status}</Badge>
              </div>

              {nextAppointment.notes && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Additional Notes</p>
                  <p className="text-sm text-gray-700">{nextAppointment.notes}</p>
                </div>
              )}

              <div className="bg-green-50 rounded-xl p-4 text-center">
                <Bell className="h-5 w-5 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">You will receive a reminder notification before your appointment.</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <Button onClick={() => setShowAppointmentModal(false)} className="bg-pink-600 text-white hover:bg-pink-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Antenatal Visit Timeline - Last 2 Visits */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Antenatal Visit Timeline (Last 2 Visits)</h3>
        <Card className="bg-white">
          <CardContent className="p-6">
            {clinicVisits.length > 0 ? (
              <div className="relative border-l border-gray-200 ml-3 space-y-10 py-2">
                {clinicVisits.map((visit, index) => (
                  <div key={visit.visit_id} className="relative pl-8 animate-slideInLeft" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-[#0369a1] border-2 border-white ring-2 ring-[#0369a1]"></div>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-semibold text-[#0369a1] tracking-wider uppercase">
                          Visit #{clinicVisits.length - index} - {visit.gestational_weeks || '?'} Weeks
                        </p>
                        <span className="text-sm text-gray-500">{formatDate(visit.visit_date, 'short')}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">
                        {visit.visit_type?.replace('_', ' ').toUpperCase() || 'Routine Check'}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                          <p className="text-xs text-gray-500 mb-1">BP</p>
                          <p className="font-semibold text-gray-900">
                            {visit.blood_pressure_systolic && visit.blood_pressure_diastolic 
                              ? `${visit.blood_pressure_systolic}/${visit.blood_pressure_diastolic}`
                              : '--/--'}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                          <p className="text-xs text-gray-500 mb-1">Weight</p>
                          <p className="font-semibold text-gray-900">{visit.weight_kg || motherData?.current_weight || '--'} kg</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center text-blue-900">
                          <p className="text-xs text-blue-600 mb-1">FHR</p>
                          <p className="font-semibold">{visit.fetal_heart_rate || '--'} bpm</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center text-green-900">
                          <p className="text-xs text-green-600 mb-1">Fundal Ht.</p>
                          <p className="font-semibold">{visit.fundal_height_cm || '--'} cm</p>
                        </div>
                      </div>
                      {visit.clinical_notes && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <FileText className="h-4 w-4 mr-2 text-gray-400" /> Clinical Notes
                          </div>
                          <p className="text-sm text-gray-600 italic">{visit.clinical_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No visit records found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Laboratory Reports - Organized by Trimester */}
      <div>
        <div className="mb-4 flex items-center">
          <div className="h-8 w-8 rounded bg-pink-100 text-pink-600 flex items-center justify-center mr-3">
            <Syringe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Laboratory Reports</h3>
            <p className="text-xs text-gray-500">Recent clinical findings and screenings organized by trimester</p>
          </div>
        </div>
        
        {/* First Trimester */}
        {(categorizedReports.firstTrimester.bloodTests.length > 0 || 
          categorizedReports.firstTrimester.urineTests.length > 0 || 
          categorizedReports.firstTrimester.ultrasoundScans.length > 0) && (
          <div className="mb-8">
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-green-600">1</span>
              </div>
              First Trimester Investigations (0–12 Weeks)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Blood Tests */}
              {categorizedReports.firstTrimester.bloodTests.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Droplet className="h-5 w-5 text-red-500" />
                        <h5 className="font-semibold text-gray-900">Blood Tests</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.firstTrimester.bloodTests.length} tests</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.firstTrimester.bloodTests.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Not available'} {test.unit || ''}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.firstTrimester.bloodTests)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.firstTrimester.bloodTests, 'First_Trimester_Blood_Tests')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Urine Tests */}
              {categorizedReports.firstTrimester.urineTests.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Flask className="h-5 w-5 text-yellow-500" />
                        <h5 className="font-semibold text-gray-900">Urine Tests</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.firstTrimester.urineTests.length} tests</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.firstTrimester.urineTests.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Not available'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.firstTrimester.urineTests)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.firstTrimester.urineTests, 'First_Trimester_Urine_Tests')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ultrasound Scans */}
              {categorizedReports.firstTrimester.ultrasoundScans.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Microscope className="h-5 w-5 text-purple-500" />
                        <h5 className="font-semibold text-gray-900">Ultrasound Scans</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.firstTrimester.ultrasoundScans.length} scans</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.firstTrimester.ultrasoundScans.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Normal'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.firstTrimester.ultrasoundScans)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.firstTrimester.ultrasoundScans, 'First_Trimester_Ultrasound_Scans')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Second Trimester */}
        {(categorizedReports.secondTrimester.bloodTests.length > 0 || 
          categorizedReports.secondTrimester.urineTests.length > 0 || 
          categorizedReports.secondTrimester.ultrasoundScans.length > 0) && (
          <div className="mb-8">
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              Second Trimester Investigations (13–27 Weeks)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Blood Tests */}
              {categorizedReports.secondTrimester.bloodTests.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Droplet className="h-5 w-5 text-red-500" />
                        <h5 className="font-semibold text-gray-900">Blood Tests</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.secondTrimester.bloodTests.length} tests</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.secondTrimester.bloodTests.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Not available'} {test.unit || ''}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.secondTrimester.bloodTests)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.secondTrimester.bloodTests, 'Second_Trimester_Blood_Tests')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Urine Tests */}
              {categorizedReports.secondTrimester.urineTests.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Flask className="h-5 w-5 text-yellow-500" />
                        <h5 className="font-semibold text-gray-900">Urine Tests</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.secondTrimester.urineTests.length} tests</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.secondTrimester.urineTests.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Not available'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.secondTrimester.urineTests)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.secondTrimester.urineTests, 'Second_Trimester_Urine_Tests')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ultrasound Scans */}
              {categorizedReports.secondTrimester.ultrasoundScans.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Microscope className="h-5 w-5 text-purple-500" />
                        <h5 className="font-semibold text-gray-900">Ultrasound Scans</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.secondTrimester.ultrasoundScans.length} scans</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.secondTrimester.ultrasoundScans.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Normal'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.secondTrimester.ultrasoundScans)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.secondTrimester.ultrasoundScans, 'Second_Trimester_Ultrasound_Scans')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Third Trimester */}
        {(categorizedReports.thirdTrimester.bloodTests.length > 0 || 
          categorizedReports.thirdTrimester.urineTests.length > 0 || 
          categorizedReports.thirdTrimester.ultrasoundScans.length > 0) && (
          <div className="mb-8">
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-purple-600">3</span>
              </div>
              Third Trimester Investigations (28 Weeks & Above)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Blood Tests */}
              {categorizedReports.thirdTrimester.bloodTests.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Droplet className="h-5 w-5 text-red-500" />
                        <h5 className="font-semibold text-gray-900">Blood Tests</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.thirdTrimester.bloodTests.length} tests</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.thirdTrimester.bloodTests.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Not available'} {test.unit || ''}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.thirdTrimester.bloodTests)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.thirdTrimester.bloodTests, 'Third_Trimester_Blood_Tests')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Urine Tests */}
              {categorizedReports.thirdTrimester.urineTests.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Flask className="h-5 w-5 text-yellow-500" />
                        <h5 className="font-semibold text-gray-900">Urine Tests</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.thirdTrimester.urineTests.length} tests</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.thirdTrimester.urineTests.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Not available'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.thirdTrimester.urineTests)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.thirdTrimester.urineTests, 'Third_Trimester_Urine_Tests')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ultrasound Scans */}
              {categorizedReports.thirdTrimester.ultrasoundScans.length > 0 && (
                <Card className="hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Microscope className="h-5 w-5 text-purple-500" />
                        <h5 className="font-semibold text-gray-900">Ultrasound Scans</h5>
                      </div>
                      <Badge variant="success">{categorizedReports.thirdTrimester.ultrasoundScans.length} scans</Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categorizedReports.thirdTrimester.ultrasoundScans.map((test, idx) => (
                        <div key={idx} className="text-sm border-b border-gray-100 pb-2">
                          <p className="font-medium text-gray-800">{test.test_name}</p>
                          <p className="text-xs text-gray-500">Completed: {test.collected_date ? formatDate(test.collected_date, 'short') : 'Date not set'}</p>
                          <p className="text-xs text-gray-600">Result: {test.test_value || 'Normal'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-pink-600 flex-1" onClick={() => handleViewCategory(categorizedReports.thirdTrimester.ultrasoundScans)}>
                        <Eye className="h-3 w-3 mr-1" /> View All
                      </Button>
                      <Button size="sm" className="bg-pink-600 text-white flex-1" onClick={() => handleDownloadCategory(categorizedReports.thirdTrimester.ultrasoundScans, 'Third_Trimester_Ultrasound_Scans')}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {labReports.length === 0 && (
          <div className="col-span-full text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No laboratory reports found</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/mother/vaccination" className="p-5 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group flex items-center justify-between ">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Syringe className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">Vaccination Schedule</h4>
                <p className="text-xs text-gray-500">View upcoming doses</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/mother/nutrition" className="p-5 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group flex items-center justify-between ">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">Nutrition Tracker</h4>
                <p className="text-xs text-gray-500">Diet & wellness plans</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button onClick={() => setShowEmergencyModal(true)} className="p-5 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group flex items-center justify-between text-left ">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">Emergency Contacts</h4>
                <p className="text-xs text-gray-500">Important numbers</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg animate-pulse"><Phone className="h-5 w-5 text-red-600" /></div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
                  <p className="text-xs text-gray-500">Important numbers for your care</p>
                </div>
              </div>
              <button onClick={() => setShowEmergencyModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className={`p-4 rounded-xl border transform transition-all hover:scale-105 animate-slideInUp ${contact.type === 'emergency' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {contact.name}
                        {contact.type === 'emergency' && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">Emergency</span>}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{contact.role}</p>
                      <p className="text-xs text-gray-400 mt-1">{contact.available}</p>
                    </div>
                    <a href={`tel:${contact.phone}`} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 flex items-center space-x-1 ${contact.type === 'emergency' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-pink-600 text-white hover:bg-pink-700'}`}>
                      <Phone className="h-4 w-4" /><span>{contact.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">In case of life-threatening emergency, call <strong className="text-red-600 animate-pulse">1990</strong> immediately</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Details Modal for Category */}
      {showReportModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg"><FolderOpen className="h-5 w-5 text-pink-600" /></div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Test Reports</h2>
                  <p className="text-xs text-gray-500">{selectedCategory.length} reports found</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {selectedCategory.map((report, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{report.test_name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Collected: {report.collected_date ? formatDate(report.collected_date, 'long') : 'Not specified'}
                        </p>
                        {report.test_value && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Result:</span> {report.test_value} {report.unit || ''}
                          </p>
                        )}
                        {report.notes && (
                          <p className="text-xs text-gray-600 mt-2 italic">{report.notes}</p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-pink-600"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <Button onClick={() => setShowReportModal(false)} className="bg-pink-600 text-white hover:bg-pink-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EMCHCardPage;