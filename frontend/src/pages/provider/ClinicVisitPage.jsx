// frontend/src/pages/provider/ClinicVisitPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Heart, FlaskConical, BookOpen, Calendar, ChevronDown, 
  Search, User, Clock, ArrowRight, AlertCircle, CheckCircle2, Users,
  Loader, Save, FileText, Phone, MapPin, Droplet, Activity, Edit3, Eye,
  Syringe, Plus, X, CalendarPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ClinicVisitPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [assignedMothers, setAssignedMothers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [draftVisit, setDraftVisit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewVisitForm, setShowNewVisitForm] = useState(false);
  const [previousVisits, setPreviousVisits] = useState([]);
  const [selectedPreviousVisit, setSelectedPreviousVisit] = useState(null);
  const [stats, setStats] = useState({
    todayVisits: 0,
    pending: 0,
    overdue: 0,
    thisWeek: 0
  });

  // Vaccination state
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [vaccinationForm, setVaccinationForm] = useState({
    mother_id: '',
    vaccine_name: '',
    dose_number: 1,
    given_date: new Date().toISOString().split('T')[0],
    batch_number: '',
    notes: ''
  });
  const [vaccinationLoading, setVaccinationLoading] = useState(false);
  const [vaccinationSuccess, setVaccinationSuccess] = useState(false);
  const [existingVaccinations, setExistingVaccinations] = useState([]);
  const [showVaccinationHistory, setShowVaccinationHistory] = useState(true);

  // Appointment state
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    mother_id: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '',
    appointment_type: 'antenatal',
    notes: ''
  });
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [showAppointmentHistory, setShowAppointmentHistory] = useState(true);

  // Form state for new visit
  const [visitForm, setVisitForm] = useState({
    visit_date: new Date().toISOString().split('T')[0],
    visit_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    gestational_weeks: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    weight_kg: '',
    fetal_heart_rate: '',
    fundal_height_cm: '',
    edema: 'none',
    fetal_movement: 'normal',
    hemoglobin_level: '',
    urine_albumin: 'Normal',
    urine_sugar: 'Normal',
    patient_complaints: '',
    clinical_notes: '',
    referrals: '',
    next_visit_date: '',
    health_education_checklist: []
  });

  // Fetch assigned mothers on load
  useEffect(() => {
    if (user && (user.role === 'midwife' || user.role === 'doctor')) {
      fetchAssignedMothers();
    }
  }, [user]);

  const fetchAssignedMothers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clinic-visits/assigned-mothers');
      if (response.data.success) {
        setAssignedMothers(response.data.data.mothers || []);
        calculateStats(response.data.data.mothers || []);
      }
    } catch (error) {
      console.error('Error fetching assigned mothers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (mothers) => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const todayVisits = mothers.filter(m => m.nextSchedule === today).length;
    const thisWeekCount = mothers.filter(m => {
      const scheduleDate = new Date(m.nextSchedule);
      return scheduleDate >= thisWeek && scheduleDate <= nextWeek;
    }).length;

    setStats({
      todayVisits,
      pending: mothers.filter(m => m.visitStatus === 'upcoming').length,
      overdue: mothers.filter(m => m.nextSchedule && new Date(m.nextSchedule) < new Date()).length,
      thisWeek: thisWeekCount
    });
  };

  const fetchMotherDetails = async (motherId) => {
    try {
      setLoading(true);
      const response = await api.get(`/clinic-visits/mother/${motherId}`);
      if (response.data.success) {
        const data = response.data.data;
        setPatientDetails(data);
        setPreviousVisits(data.visitHistory || []);
        
        // Fetch existing vaccinations for this mother
        await fetchMotherVaccinations(motherId);
        
        // Fetch existing appointments for this mother
        await fetchMotherAppointments(motherId);
        
        if (!data.visitHistory || data.visitHistory.length === 0) {
          setSelectedPreviousVisit(null);
        } else {
          setSelectedPreviousVisit(data.visitHistory[0]);
        }
        
        setShowNewVisitForm(false);
        setVisitForm({
          visit_date: new Date().toISOString().split('T')[0],
          visit_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          gestational_weeks: data.mother?.weeks || '',
          blood_pressure_systolic: '',
          blood_pressure_diastolic: '',
          weight_kg: data.vitals?.weight !== '--' ? data.vitals.weight : '',
          fetal_heart_rate: '',
          fundal_height_cm: '',
          edema: 'none',
          fetal_movement: 'normal',
          hemoglobin_level: '',
          urine_albumin: 'Normal',
          urine_sugar: 'Normal',
          patient_complaints: '',
          clinical_notes: '',
          referrals: '',
          next_visit_date: '',
          health_education_checklist: data.healthEducation || []
        });
        
        if (data.draftVisit) {
          setDraftVisit(data.draftVisit);
        }
      }
    } catch (error) {
      console.error('Error fetching mother details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMotherVaccinations = async (motherId) => {
    try {
      const response = await api.get(`/vaccinations/mother/${motherId}`);
      if (response.data.success) {
        setExistingVaccinations(response.data.data.vaccinations || []);
      }
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    }
  };

  const fetchMotherAppointments = async (motherId) => {
    try {
      const response = await api.get(`/appointments/mother/${motherId}`);
      if (response.data.success) {
        setExistingAppointments(response.data.data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSearch = async () => {
    setHasSearched(true);
    if (searchTerm.trim()) {
      const found = assignedMothers.find(
        p => p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (found) {
        setSelectedPatient(found);
        await fetchMotherDetails(found.id);
      } else {
        setSelectedPatient(null);
        setPatientDetails(null);
        setPreviousVisits([]);
      }
    } else {
      setSelectedPatient(null);
      setPatientDetails(null);
      setPreviousVisits([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedPatient(null);
    setPatientDetails(null);
    setPreviousVisits([]);
    setHasSearched(false);
    setShowNewVisitForm(false);
    setSelectedPreviousVisit(null);
  };

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setHasSearched(true);
    await fetchMotherDetails(patient.id);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setVisitForm(prev => ({ ...prev, [name]: value }));
  };

  const handleHealthEducationToggle = (id) => {
    setVisitForm(prev => ({
      ...prev,
      health_education_checklist: prev.health_education_checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleSaveDraft = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    
    try {
      const response = await api.post(`/clinic-visits/draft/${selectedPatient.id}`, visitForm);
      if (response.data.success) {
        alert('Draft saved successfully!');
        setDraftVisit(response.data.data.draft);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteVisit = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    
    try {
      const response = await api.post(`/clinic-visits/complete/${selectedPatient.id}`, visitForm);
      if (response.data.success) {
        alert('Visit completed successfully!');
        setShowNewVisitForm(false);
        await fetchMotherDetails(selectedPatient.id);
        await fetchAssignedMothers();
      }
    } catch (error) {
      console.error('Error completing visit:', error);
      alert('Failed to complete visit');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewPreviousVisit = (visit) => {
    setSelectedPreviousVisit(visit);
  };

  // Vaccination handlers
  const handleVaccinationInputChange = (e) => {
    const { name, value } = e.target;
    setVaccinationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVaccination = async () => {
    if (!vaccinationForm.vaccine_name || !vaccinationForm.given_date) {
      alert('Please fill in all required fields');
      return;
    }

    setVaccinationLoading(true);
    try {
      const response = await api.post(`/vaccinations/mother/${selectedPatient?.id}`, {
        vaccine_name: vaccinationForm.vaccine_name,
        dose_number: vaccinationForm.dose_number,
        given_date: vaccinationForm.given_date,
        batch_number: vaccinationForm.batch_number,
        notes: vaccinationForm.notes
      });

      if (response.data.success) {
        setVaccinationSuccess(true);
        await fetchMotherVaccinations(selectedPatient?.id);
        // Reset form
        setVaccinationForm({
          mother_id: selectedPatient?.id || '',
          vaccine_name: '',
          dose_number: 1,
          given_date: new Date().toISOString().split('T')[0],
          batch_number: '',
          notes: ''
        });
        setTimeout(() => {
          setVaccinationSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding vaccination:', error);
      alert(error.response?.data?.message || 'Failed to add vaccination');
    } finally {
      setVaccinationLoading(false);
    }
  };

  // Appointment handlers
  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async () => {
    if (!appointmentForm.appointment_date || !appointmentForm.appointment_type) {
      alert('Please fill in all required fields');
      return;
    }

    setAppointmentLoading(true);
    try {
      const response = await api.post(`/appointments/mother/${selectedPatient?.id}`, {
        appointment_date: appointmentForm.appointment_date,
        appointment_time: appointmentForm.appointment_time,
        appointment_type: appointmentForm.appointment_type,
        notes: appointmentForm.notes
      });

      if (response.data.success) {
        setAppointmentSuccess(true);
        await fetchMotherAppointments(selectedPatient?.id);
        // Reset form
        setAppointmentForm({
          mother_id: selectedPatient?.id || '',
          appointment_date: new Date().toISOString().split('T')[0],
          appointment_time: '',
          appointment_type: 'antenatal',
          notes: ''
        });
        setTimeout(() => {
          setAppointmentSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert(error.response?.data?.message || 'Failed to add appointment');
    } finally {
      setAppointmentLoading(false);
    }
  };

  if (loading && assignedMothers.length === 0) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 mb-3">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Clinic Visit Management
            </h1>

            <p className="text-gray-500 mt-1">
              Track patient visits, appointments, and maternal healthcare records
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="max-w-3xl mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Search Patient by ID or Name
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Patient ID (e.g., MOM-26-0009) or Name"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm 
                         focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                         placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg text-sm font-medium 
                       hover:bg-pink-700 transition-colors whitespace-nowrap"
            >
              Search Patient
            </button>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium 
                         text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* No Patient Selected - Show Overview */}
      {!selectedPatient && !hasSearched && (
        <>
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-pink-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Today's Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayVisits}</p>
                </div>
                <CheckCircle2 className="text-pink-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-rose-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <Clock className="text-rose-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                </div>
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-fuchsia-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                </div>
                <Calendar className="text-fuchsia-500" size={24} />
              </div>
            </div>
          </div>

          {/* All Assigned Mothers Overview Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="mr-2 text-pink-500" size={20} />
                All Assigned Mothers - Visit Overview
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedMothers.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-pink-600">
                              {patient.name?.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{patient.weeks}w</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{patient.lastVisit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{patient.nextSchedule}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.visitStatus === 'recent' 
                            ? 'bg-green-100 text-green-800'
                            : patient.visitStatus === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {patient.visitStatus === 'recent' ? 'Recent' : 
                           patient.visitStatus === 'overdue' ? 'Overdue' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePatientSelect(patient)}
                          className="text-pink-600 hover:text-pink-900 font-medium text-sm flex items-center space-x-1 transition-colors"
                        >
                          <span>Start Visit</span>
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Access Recent Patients */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Quick Access - Recent Patients
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {assignedMothers.slice(0, 3).map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg 
                           hover:border-pink-300 hover:bg-pink-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pink-200 transition-colors">
                    <span className="text-sm font-semibold text-pink-600">
                      {patient.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                    <p className="text-xs text-gray-500">{patient.id} • {patient.weeks} Weeks</p>
                    <p className="text-xs text-gray-400 mt-1">Last: {patient.lastVisit}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* No Patient Found */}
      {!selectedPatient && hasSearched && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Found</h3>
          <p className="text-gray-500 mb-4">
            No patient matches "{searchTerm}". Please try a different Patient ID or Name.
          </p>
          <button
            onClick={handleClearSearch}
            className="text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            Clear Search & View All Patients
          </button>
        </div>
      )}

      {/* Patient Found - Show Details */}
      {selectedPatient && patientDetails && (
        <>
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-pink-600">
                    {selectedPatient.name?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-sm text-gray-500">
                    ID: {selectedPatient.id} | {patientDetails.mother?.weeks || selectedPatient.weeks} Weeks Pregnant
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearSearch}
                className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ← Back to All Patients
              </button>
            </div>
          </div>

          {/* Previous Visits Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-blue-500" size={20} />
              Previous Clinic Visits
            </h3>
            
            {previousVisits.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No previous visits found</p>
                <p className="text-sm text-gray-400 mt-1">This will be the first visit for this patient</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                  {previousVisits.map((visit, index) => (
                    <button
                      key={index}
                      onClick={() => handleViewPreviousVisit(visit)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        selectedPreviousVisit === visit
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {visit.date}
                    </button>
                  ))}
                </div>
                
                {selectedPreviousVisit && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Visit Date: {selectedPreviousVisit.date}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye size={12} className="mr-1" /> View Only
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">BP</p>
                        <p className="text-sm font-semibold">{selectedPreviousVisit.bp}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="text-sm font-semibold">{selectedPreviousVisit.weight}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">FHR</p>
                        <p className="text-sm font-semibold">{selectedPreviousVisit.fhr}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Notes</p>
                        <p className="text-sm text-gray-600 italic">{selectedPreviousVisit.notes || 'No notes'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ==================== NEW CLINIC VISIT SECTION ==================== */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-pink-200">
            <div 
              className="px-6 py-4 bg-pink-50 cursor-pointer hover:bg-pink-100 transition-colors border-b border-pink-200"
              onClick={() => setShowNewVisitForm(!showNewVisitForm)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center text-pink-700">
                  <Edit3 className="mr-2 text-pink-500" size={20} />
                  New Clinic Visit
                </h3>
                <ChevronDown className={`transform transition-transform text-pink-500 ${showNewVisitForm ? 'rotate-180' : ''}`} size={30} />
              </div>
            </div>
            
            {showNewVisitForm && (
              <div className="max-h-[600px] overflow-y-auto">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Vitals */}
                      <div>
                        <h4 className="text-md font-semibold mb-3 flex items-center text-pink-600">
                          <Heart className="mr-2 text-pink-500" size={18} />
                          Vitals
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">BP (mmHg)</p>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                name="blood_pressure_systolic"
                                value={visitForm.blood_pressure_systolic}
                                onChange={handleFormChange}
                                placeholder="SYS"
                                className="w-1/2 px-2 py-1 border rounded"
                              />
                              <span className="flex items-center">/</span>
                              <input
                                type="number"
                                name="blood_pressure_diastolic"
                                value={visitForm.blood_pressure_diastolic}
                                onChange={handleFormChange}
                                placeholder="DIA"
                                className="w-1/2 px-2 py-1 border rounded"
                              />
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Weight (kg)</p>
                            <input
                              type="number"
                              step="0.1"
                              name="weight_kg"
                              value={visitForm.weight_kg}
                              onChange={handleFormChange}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Fetal HR (bpm)</p>
                            <input
                              type="number"
                              name="fetal_heart_rate"
                              value={visitForm.fetal_heart_rate}
                              onChange={handleFormChange}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Fundal Height (cm)</p>
                            <input
                              type="number"
                              step="0.1"
                              name="fundal_height_cm"
                              value={visitForm.fundal_height_cm}
                              onChange={handleFormChange}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Gestational Weeks</p>
                            <input
                              type="number"
                              name="gestational_weeks"
                              value={visitForm.gestational_weeks}
                              onChange={handleFormChange}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lab Tests */}
                      <div>
                        <h4 className="text-md font-semibold mb-3 flex items-center text-pink-600">
                          <FlaskConical className="mr-2 text-pink-500" size={18} />
                          Lab Tests
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">Hb Level (g/dL)</p>
                            <input
                              type="number"
                              step="0.1"
                              name="hemoglobin_level"
                              value={visitForm.hemoglobin_level}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">Urine Test</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Protein:</span>
                                <select
                                  name="urine_albumin"
                                  value={visitForm.urine_albumin}
                                  onChange={handleFormChange}
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="Normal">Normal</option>
                                  <option value="Trace">Trace</option>
                                  <option value="1+">1+</option>
                                  <option value="2+">2+</option>
                                  <option value="3+">3+</option>
                                </select>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sugar:</span>
                                <select
                                  name="urine_sugar"
                                  value={visitForm.urine_sugar}
                                  onChange={handleFormChange}
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="Normal">Normal</option>
                                  <option value="Trace">Trace</option>
                                  <option value="1+">1+</option>
                                  <option value="2+">2+</option>
                                  <option value="3+">3+</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visit Notes */}
                      <div>
                        <h4 className="text-md font-semibold mb-3 text-pink-600">Visit Notes</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Edema</label>
                            <select
                              name="edema"
                              value={visitForm.edema}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border rounded-lg"
                            >
                              <option value="none">None</option>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="severe">Severe</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fetal Movement</label>
                            <select
                              name="fetal_movement"
                              value={visitForm.fetal_movement}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border rounded-lg"
                            >
                              <option value="normal">Normal</option>
                              <option value="decreased">Decreased</option>
                              <option value="increased">Increased</option>
                              <option value="absent">Absent</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Complaints</label>
                          <textarea
                            name="patient_complaints"
                            value={visitForm.patient_complaints}
                            onChange={handleFormChange}
                            rows="2"
                            className="w-full px-3 py-2 border rounded-lg resize-none"
                            placeholder="Document any complaints or symptoms reported by the patient..."
                          ></textarea>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                          <textarea
                            name="clinical_notes"
                            value={visitForm.clinical_notes}
                            onChange={handleFormChange}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-lg resize-none"
                            placeholder="Enter clinical observations, findings, and recommendations..."
                          ></textarea>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Referrals (if any)</label>
                          <textarea
                            name="referrals"
                            value={visitForm.referrals}
                            onChange={handleFormChange}
                            rows="2"
                            className="w-full px-3 py-2 border rounded-lg resize-none"
                            placeholder="e.g., Specialist consultation, Ultrasound, Lab tests"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Health Education */}
                      <div>
                        <h4 className="text-md font-semibold mb-3 flex items-center text-pink-600">
                          <BookOpen className="mr-2 text-pink-500" size={18} />
                          Health Education
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {visitForm.health_education_checklist?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">{item.title}</span>
                              <button
                                onClick={() => handleHealthEducationToggle(item.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  item.completed ? 'bg-pink-500 border-pink-500' : 'border-gray-300'
                                }`}
                              >
                                {item.completed && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Bottom Right */}
                  <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="px-6 py-2 border border-pink-300 rounded-lg text-sm font-medium text-pink-700 hover:bg-pink-50 transition-colors flex items-center gap-2"
                    >
                      <Save size={16} />
                      {isSaving ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button
                      onClick={handleCompleteVisit}
                      disabled={isSaving}
                      className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Complete Visit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================== VACCINATION MANAGEMENT SECTION ==================== */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-rose-200">
            <div 
              className="px-6 py-4 bg-rose-0 cursor-pointer hover:bg-rose-50 transition-colors border-b border-rose-200"
              onClick={() => setShowVaccinationForm(!showVaccinationForm)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center text-rose-700">
                  <Syringe className="mr-2 text-rose-500" size={20} />
                  Vaccination Management
                </h3>
                <ChevronDown className={`transform transition-transform text-rose-500 ${showVaccinationForm ? 'rotate-180' : ''}`} size={30} />
              </div>
            </div>
            
            {showVaccinationForm && (
              <div className="max-h-[600px] overflow-y-auto">
                <div className="p-6">
                  {/* Add Vaccination Form */}
                  <div className="mb-6 p-4 bg-rose-0 rounded-lg">
                    <h4 className="text-md font-semibold mb-4 flex items-center text-rose-700">
                      <Plus className="mr-2 text-rose-500" size={18} />
                      Add New Vaccination
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Name *</label>
                        <select 
                          name="vaccine_name" 
                          value={vaccinationForm.vaccine_name} 
                          onChange={handleVaccinationInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        >
                          <option value="">Select Vaccine</option>
                          <option value="Tetanus Toxoid (TT1)">Tetanus Toxoid (TT1)</option>
                          <option value="Tetanus Toxoid (TT2)">Tetanus Toxoid (TT2)</option>
                          <option value="Tetanus Toxoid (TT Booster)">Tetanus Toxoid (TT Booster)</option>
                          <option value="Tdap Vaccine">Tdap Vaccine</option>
                          <option value="Influenza Vaccine">Influenza Vaccine</option>
                          <option value="COVID-19 Vaccine">COVID-19 Vaccine</option>
                          <option value="Hepatitis B Vaccine">Hepatitis B Vaccine</option>
                          <option value="Rubella Vaccine">Rubella Vaccine</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dose Number</label>
                        <select 
                          name="dose_number" 
                          value={vaccinationForm.dose_number} 
                          onChange={handleVaccinationInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="1">Dose 1</option>
                          <option value="2">Dose 2</option>
                          <option value="3">Dose 3</option>
                          <option value="Booster">Booster</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Given Date *</label>
                        <input 
                          type="date" 
                          name="given_date" 
                          value={vaccinationForm.given_date} 
                          onChange={handleVaccinationInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                        <input 
                          type="text" 
                          name="batch_number" 
                          value={vaccinationForm.batch_number} 
                          onChange={handleVaccinationInputChange}
                          placeholder="e.g., BATCH-2024-001"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea 
                          name="notes" 
                          value={vaccinationForm.notes} 
                          onChange={handleVaccinationInputChange}
                          rows="2"
                          placeholder="Any additional notes about the vaccination..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                        ></textarea>
                      </div>
                    </div>
                    {vaccinationSuccess && (
                      <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center">
                        <CheckCircle2 size={16} className="mr-2" />
                        Vaccination added successfully!
                      </div>
                    )}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleAddVaccination}
                        disabled={vaccinationLoading || !vaccinationForm.vaccine_name || !vaccinationForm.given_date}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2 ${
                          vaccinationLoading || !vaccinationForm.vaccine_name || !vaccinationForm.given_date
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-rose-600 hover:bg-rose-700'
                        }`}
                      >
                        {vaccinationLoading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                        {vaccinationLoading ? 'Adding...' : 'Add Vaccination'}
                      </button>
                    </div>
                  </div>

                  {/* Vaccination History */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => setShowVaccinationHistory(!showVaccinationHistory)}
                    >
                      <h4 className="text-md font-semibold flex items-center text-rose-700">
                        <FileText className="mr-2 text-rose-500" size={16} />
                        Vaccination History
                      </h4>
                      <ChevronDown className={`transform transition-transform text-rose-500 ${showVaccinationHistory ? 'rotate-180' : ''}`} size={20} />
                    </div>
                    
                    {showVaccinationHistory && (
                      <div className="border-t border-rose-200 pt-3">
                        {existingVaccinations.length > 0 ? (
                          <div className="overflow-x-auto max-h-64 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaccine Name</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dose</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Given Date</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Number</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {existingVaccinations.map((vacc, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">{vacc.vaccine_name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">Dose {vacc.dose_number}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{vacc.given_date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{vacc.batch_number || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{vacc.notes || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <Syringe size={40} className="mx-auto text-gray-300 mb-2" />
                            <p>No vaccination records found for this patient</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================== APPOINTMENT MANAGEMENT SECTION ==================== */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-fuchsia-200">
            <div 
              className="px-6 py-4 bg-fuchsia-0 cursor-pointer hover:bg-fuchsia-50 transition-colors border-b border-fuchsia-200"
              onClick={() => setShowAppointmentForm(!showAppointmentForm)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center text-fuchsia-700">
                  <Calendar className="mr-2 text-fuchsia-500" size={20} />
                  Appointment Management
                </h3>
                <ChevronDown className={`transform transition-transform text-fuchsia-500 ${showAppointmentForm ? 'rotate-180' : ''}`} size={30} />
              </div>
            </div>
            
            {showAppointmentForm && (
              <div className="max-h-[600px] overflow-y-auto">
                <div className="p-6">
                  {/* Add Appointment Form */}
                  <div className="mb-6 p-4 bg-fuchsia-0 rounded-lg">
                    <h4 className="text-md font-semibold mb-4 flex items-center text-fuchsia-700">
                      <CalendarPlus className="mr-2 text-fuchsia-500" size={18} />
                      Add New Appointment
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
                        <input 
                          type="date" 
                          name="appointment_date" 
                          value={appointmentForm.appointment_date} 
                          onChange={handleAppointmentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                        <input 
                          type="time" 
                          name="appointment_time" 
                          value={appointmentForm.appointment_time} 
                          onChange={handleAppointmentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type *</label>
                        <select 
                          name="appointment_type" 
                          value={appointmentForm.appointment_type} 
                          onChange={handleAppointmentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="antenatal">Antenatal</option>
                          <option value="postnatal">Postnatal</option>
                          <option value="vaccination">Vaccination</option>
                          <option value="checkup">Check-up</option>
                          <option value="home_visit">Home Visit</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea 
                          name="notes" 
                          value={appointmentForm.notes} 
                          onChange={handleAppointmentInputChange}
                          rows="2"
                          placeholder="Any additional notes about the appointment..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                        ></textarea>
                      </div>
                    </div>
                    {appointmentSuccess && (
                      <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center">
                        <CheckCircle2 size={16} className="mr-2" />
                        Appointment scheduled successfully!
                      </div>
                    )}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleAddAppointment}
                        disabled={appointmentLoading || !appointmentForm.appointment_date || !appointmentForm.appointment_type}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2 ${
                          appointmentLoading || !appointmentForm.appointment_date || !appointmentForm.appointment_type
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-fuchsia-600 hover:bg-fuchsia-700'
                        }`}
                      >
                        {appointmentLoading ? <Loader size={16} className="animate-spin" /> : <CalendarPlus size={16} />}
                        {appointmentLoading ? 'Adding...' : 'Add Appointment'}
                      </button>
                    </div>
                  </div>

                  {/* Appointment History */}
                  <div>
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => setShowAppointmentHistory(!showAppointmentHistory)}
                    >
                      <h4 className="text-md font-semibold flex items-center text-fuchsia-700">
                        <FileText className="mr-2 text-fuchsia-500" size={16} />
                        Appointment History
                      </h4>
                      <ChevronDown className={`transform transition-transform text-fuchsia-500 ${showAppointmentHistory ? 'rotate-180' : ''}`} size={20} />
                    </div>
                    
                    {showAppointmentHistory && (
                      <div className="border-t border-fuchsia-200 pt-3">
                        {existingAppointments.length > 0 ? (
                          <div className="overflow-x-auto max-h-64 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {existingAppointments.map((app, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">{app.appointment_date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{app.appointment_time || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">{app.appointment_type}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        app.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                        app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                        app.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {app.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{app.notes || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <Calendar size={40} className="mx-auto text-gray-300 mb-2" />
                            <p>No appointment records found for this patient</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicVisitPage;