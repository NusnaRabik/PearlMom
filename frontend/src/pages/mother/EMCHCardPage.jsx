import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, FileText, Syringe, ChevronRight, Phone, X, Calendar, Droplet, Loader, Edit, Save, XCircle } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const EMCHCardPage = () => {
  const { user } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [motherData, setMotherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
      fetchMotherData();
    } else if (user && user.role !== 'mother') {
      setError('This page is only for mothers');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMotherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching mother profile...');
      const response = await api.get('/mothers/profile');
      
      console.log('Full API Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.success) {
        let motherProfile = null;
        
        // Handle different response structures
        if (response.data.data && response.data.data.mother) {
          motherProfile = response.data.data.mother;
        } else if (response.data.data) {
          motherProfile = response.data.data;
        } else if (response.data.mother) {
          motherProfile = response.data.mother;
        } else {
          motherProfile = response.data;
        }
        
        console.log('Extracted Mother Profile:', motherProfile);
        setMotherData(motherProfile);
        
        // Initialize edit form with current data
        if (motherProfile) {
          setEditFormData({
            full_name: motherProfile.full_name || '',
            dob: motherProfile.dob ? motherProfile.dob.split('T')[0] : '',
            blood_group: motherProfile.blood_group || '',
            expected_delivery_date: motherProfile.expected_delivery_date ? motherProfile.expected_delivery_date.split('T')[0] : '',
            current_weight: motherProfile.current_weight || '',
            height: motherProfile.height || '',
            nic: motherProfile.nic || '',
            address: motherProfile.address || '',
            district: motherProfile.district || '',
            husband_name: motherProfile.husband_name || '',
            husband_contact: motherProfile.husband_contact || ''
          });
        }
      } else {
        setError(response.data?.message || 'Failed to load mother data');
      }
    } catch (err) {
      console.error('Error fetching mother data:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Could not load mother information');
    } finally {
      setLoading(false);
    }
  };

  const updateMotherProfile = async (profileData) => {
    try {
      const response = await api.put('/mothers/profile', profileData);
      
      if (response.data.success) {
        console.log('Profile updated successfully');
        setIsEditing(false);
        await fetchMotherData();
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

  // Calculate age from date of birth
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

  const emergencyContacts = [
    { name: 'Dr. Sarah Perera', role: 'Primary Obstetrician', phone: '+94 77 123 4567', available: '24/7', type: 'doctor' },
    { name: 'Green Valley Maternity Clinic', role: 'Main Clinic', phone: '+94 11 234 5678', available: '8 AM - 6 PM', type: 'clinic' },
    { name: 'Nurse Priya Fernando', role: 'Assigned Midwife', phone: '+94 71 987 6543', available: '24/7', type: 'midwife' },
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
            onClick={() => fetchMotherData()} 
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

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      
      {/* Main Profile Card */}
      <Card className="overflow-hidden border-none shadow-sm">
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
                <button onClick={handleEditClick} className="text-pink-600 hover:text-pink-700">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100 flex-shrink-0">
             <p className="text-xs tracking-wider uppercase text-green-700 font-semibold mb-1">Expected Delivery Date</p>
             <p className="text-2xl text-green-800 font-bold">
               {motherData?.expected_delivery_date ? formatDate(motherData.expected_delivery_date, 'long') : 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
              <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-lg">
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

      {/* Rest of your existing JSX remains the same */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Vital Signs & Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Blood Pressure (Avg)</p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">119/79</span>
                <span className="ml-2 text-sm text-green-600 font-medium">Stable</span>
              </div>
              <div className="flex gap-1 h-8 items-end">
                <div className="flex-1 bg-gray-100 h-4 rounded-sm"></div>
                <div className="flex-1 bg-gray-200 h-5 rounded-sm"></div>
                <div className="flex-1 bg-blue-200 h-6 rounded-sm"></div>
                <div className="flex-1 bg-[#0369a1] h-6 rounded-sm"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Weight Progress (kg)</p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">{motherData?.current_weight || '--'}</span>
                <span className="ml-2 text-sm text-rose-500 font-medium">+2.1kg</span>
              </div>
               <div className="flex gap-1 h-8 items-end">
                <div className="flex-1 bg-gray-100 h-2 rounded-sm"></div>
                <div className="flex-1 bg-gray-200 h-4 rounded-sm"></div>
                <div className="flex-1 bg-green-200 h-6 rounded-sm"></div>
                <div className="flex-1 bg-[#0f766e] h-8 rounded-sm"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Fetal Heart Rate (bpm)</p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">145</span>
                <span className="ml-2 text-sm text-gray-600 font-medium">Healthy Range</span>
              </div>
               <div className="flex gap-1 h-8 items-end">
                <div className="flex-1 bg-gray-100 h-5 rounded-sm"></div>
                <div className="flex-1 bg-gray-200 h-5 rounded-sm"></div>
                <div className="flex-1 bg-blue-200 h-6 rounded-sm"></div>
                <div className="flex-1 bg-[#0ea5e9] h-5 rounded-sm"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-pink-50 rounded-xl p-5 border border-pink-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center text-sm font-bold">!</div>
            <div>
              <h4 className="font-semibold text-pink-900">Next Appointment</h4>
              <p className="text-sm text-pink-800">
                Your 28-week routine check-up is scheduled for <strong>{formatDate('2024-11-10', 'long')} at 10:00 AM</strong>.
              </p>
            </div>
          </div>
          <button className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center flex-shrink-0">
            View Details <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Antenatal Visit Timeline</h3>
        <Card className="bg-white">
          <CardContent className="p-6">
             <div className="relative border-l border-gray-200 ml-3 space-y-10 py-2">
               <div className="relative pl-8">
                 <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-[#0369a1] border-2 border-white ring-2 ring-[#0369a1]"></div>
                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-xs font-semibold text-[#0369a1] tracking-wider uppercase">Visit #3 - 24 Weeks</p>
                      <span className="text-sm text-gray-500">{formatDate('2024-10-12', 'short')}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Routine Second Trimester Check</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 mb-1">BP</p>
                        <p className="font-semibold text-gray-900">120/80</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 mb-1">Weight</p>
                        <p className="font-semibold text-gray-900">{motherData?.current_weight || '65.2'} kg</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center text-blue-900">
                        <p className="text-xs text-blue-600 mb-1">FHR</p>
                        <p className="font-semibold">145 bpm</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center text-green-900">
                        <p className="text-xs text-green-600 mb-1">Fundal Ht.</p>
                        <p className="font-semibold">24 cm</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                       <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                         <FileText className="h-4 w-4 mr-2 text-gray-400" /> Health Education Summary
                       </div>
                       <p className="text-sm text-gray-600 italic">Discussed sleep positioning, breastfeeding initiation benefits, and signs of pre-eclampsia to watch for in the coming weeks.</p>
                    </div>
                 </div>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center">
           <div className="h-8 w-8 rounded bg-pink-100 text-pink-600 flex items-center justify-center mr-3">
             <Syringe className="h-4 w-4" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-gray-900">Laboratory Reports</h3>
             <p className="text-xs text-gray-500">Recent clinical findings and screenings</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Full Blood Count (FBC)", date: "2024-10-05", id: "#77821", status: "NORMAL" },
            { name: "Glucose Tolerance Test (GTT)", date: "2024-09-20", id: "#76994", status: "PENDING REVIEW" },
            { name: "Anatomy Ultrasound Scan (PDF)", date: "2024-09-14", id: "#RAD-401", status: "COMPLETE" }
          ].map((report, i) => (
            <Card key={i} className="hover:border-pink-200 transition-colors h-full">
              <CardContent className="p-5 flex flex-col h-full">
                 <div className="flex items-start space-x-3 mb-4">
                   <div className="p-2 bg-gray-100 rounded text-gray-500 flex-shrink-0">
                     <FileText className="h-5 w-5" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-medium text-gray-900 truncate">{report.name}</h4>
                     <p className="text-xs text-gray-500 mt-0.5">Completed: {formatDate(report.date, 'short')}</p>
                     <p className="text-xs text-gray-400">Lab ID: {report.id}</p>
                   </div>
                 </div>
                 <div className="mt-auto">
                   <div className="mb-3">
                     <Badge variant={report.status === 'NORMAL' || report.status === 'COMPLETE' ? 'success' : 'warning'}>
                       {report.status}
                     </Badge>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 flex-1">View</Button>
                     <Button variant="outline" size="sm" className="bg-pink-600 text-white hover:bg-pink-700 border-pink-600">
                       <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Download</span>
                     </Button>
                   </div>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/mother/vaccination" className="p-5 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                <Syringe className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">Vaccination Schedule</h4>
                <p className="text-xs text-gray-500">View upcoming doses</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500" />
          </Link>
          <Link to="/mother/nutrition" className="p-5 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">Nutrition Tracker</h4>
                <p className="text-xs text-gray-500">Diet & wellness plans</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500" />
          </Link>
          <button onClick={() => setShowEmergencyModal(true)} className="p-5 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group flex items-center justify-between text-left">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">Emergency Contacts</h4>
                <p className="text-xs text-gray-500">Important numbers</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500" />
          </button>
        </div>
      </div>

      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg"><Phone className="h-5 w-5 text-red-600" /></div>
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
                <div key={index} className={`p-4 rounded-xl border ${contact.type === 'emergency' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {contact.name}
                        {contact.type === 'emergency' && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Emergency</span>}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{contact.role}</p>
                      <p className="text-xs text-gray-400 mt-1">{contact.available}</p>
                    </div>
                    <a href={`tel:${contact.phone}`} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1 ${contact.type === 'emergency' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-pink-600 text-white hover:bg-pink-700'}`}>
                      <Phone className="h-4 w-4" /><span>{contact.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">In case of life-threatening emergency, call <strong className="text-red-600">1990</strong> immediately</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMCHCardPage;