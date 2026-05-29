import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Phone, MapPin, Calendar, FileText, Syringe, ChevronRight,
  Video, Droplet, Apple, Download, X, CheckCircle2, User,
  Heart, AlertCircle, Loader
} from 'lucide-react';
import { useNotificationsHook } from '../../hooks/useNotifications';
import { formatDate, getRelativeTime } from '../../utils/formatDate';
import authService from '../../services/authService';
import { calculateWeeksFromEDD, calculateWeeksFromLMP } from '../../utils/calculateWeeks';
import motherService from '../../services/motherService';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ChatWidget from '../../components/common/ChatWidget';

// ─── Constants ────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const REQUIRED_FIELDS = [
  'full_name', 'nic', 'dob', 'address', 'district', 'blood_group',
  'pregnancy_status', 'lmp_date', 'expected_delivery_date',
  'current_weight', 'height', 'gravida', 'emergency_contact_name',
  'emergency_contact_phone', 'husband_name', 'husband_contact',
  'para', 'allergies', 'chronic_diseases', 'emergency_relationship', 'weeks',
];

const EMPTY_PROFILE = {
  full_name: '', nic: '', dob: '', address: '', district: '',
  gs_division: '', blood_group: '', pregnancy_status: 'pregnant',
  lmp_date: '', expected_delivery_date: '', current_weight: '',
  height: '', gravida: 1, para: 0, allergies: '', chronic_diseases: '',
  emergency_contact_name: '', emergency_contact_phone: '',
  emergency_relationship: '', husband_name: '', husband_contact: '', weeks: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTrimester = (w) => {
  if (!w) return { trimester: 'N/A', weekText: 'Week ? of 40' };
  const trimester = w <= 13 ? '1st Trimester' : w <= 26 ? '2nd Trimester' : '3rd Trimester';
  return { trimester, weekText: `Week ${w} of 40` };
};

const getBabySize = (w) => {
  if (!w) return 'your little one';
  if (w <= 4) return 'a poppy seed';
  if (w <= 8) return 'a raspberry';
  if (w <= 12) return 'a lime';
  if (w <= 16) return 'an avocado';
  if (w <= 20) return 'a banana';
  if (w <= 24) return 'an ear of corn';
  if (w <= 28) return 'a large eggplant';
  if (w <= 32) return 'a squash';
  if (w <= 36) return 'a honeydew melon';
  if (w <= 40) return 'a small pumpkin';
  return 'ready to meet the world';
};

const getDaysUntilDue = (edd) => {
  if (!edd) return 0;
  return Math.ceil((new Date(edd) - new Date()) / 86400000);
};

// ─── Component ────────────────────────────────────────────────────────────────
const MotherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeks, setWeeks] = useState(0);
  const [pregnancyProgress, setPregnancyProgress] = useState(0);
  const { notifications, unreadCount, markAllAsRead } = useNotificationsHook();

  // EMCH data
  const [emchData, setEmchData] = useState(null);
  const [emchLoading, setEmchLoading] = useState(true);

  // Profile completion modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(EMPTY_PROFILE);
  const [missingFields, setMissingFields] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // UI toggles
  const [showVisitSummary, setShowVisitSummary] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // ── On mount: check profile then load data ──────────────────────────────
  useEffect(() => {
    if (user?.role === 'mother') {
      checkProfileCompletion();
    } else {
      setLoading(false);
    }
  }, [user]);

  // ── Profile completion check (pure frontend → API call) ─────────────────
  /**
   * Calls GET /api/mothers/check-profile-completion
   * Expected response shape:
   * {
   *   success: true,
   *   data: {
   *     is_complete: boolean,
   *     missing_fields: string[],
   *     current_data: { ...motherFields }
   *   }
   * }
   */
  const checkProfileCompletion = async () => {
    try {
      const token = localStorage.getItem('pearlmom_token');
      const response = await fetch(`${API_URL}/mothers/check-profile-completion`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If endpoint not available yet fall through to dashboard load
        console.warn('Profile-completion check returned', response.status);
        fetchDashboardData();
        fetchEmchData();
        return;
      }

      const result = await response.json();

      if (result.success) {
        const { is_complete, missing_fields = [], current_data = {} } = result.data;

        if (!is_complete) {
          // Pre-fill modal with whatever data already exists
          setProfileData((prev) => ({ ...prev, ...current_data }));
          setMissingFields(missing_fields);
          setShowProfileModal(true);
        }
      }
    } catch (err) {
      console.error('Profile completion check error:', err);
    } finally {
      // Always load dashboard regardless of profile status
      fetchDashboardData();
      fetchEmchData();
    }
  };

  // ── Fetch dashboard data ────────────────────────────────────────────────
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await motherService.getDashboard();

      if (result.success) {
        setDashboardData(result.data);
        const mother = result.data?.mother || result.data;

        let calculatedWeeks =
          mother?.weeks ||
          (mother?.gestational_weeks ? parseInt(mother.gestational_weeks) : 0) ||
          (mother?.lmp_date ? calculateWeeksFromLMP(mother.lmp_date) : 0) ||
          (mother?.expected_delivery_date ? calculateWeeksFromEDD(mother.expected_delivery_date) : 0);

        setWeeks(calculatedWeeks);
        setPregnancyProgress(calculatedWeeks ? Math.round((calculatedWeeks / 40) * 100) : 0);
      } else {
        setError(result.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.response?.data?.message || 'Could not load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch EMCH data ─────────────────────────────────────────────────────
  const fetchEmchData = async () => {
    try {
      setEmchLoading(true);
      const result = await motherService.getEmchCardData();
      if (result.success) setEmchData(result.data);
    } catch (err) {
      console.error('Error fetching EMCH data:', err);
    } finally {
      setEmchLoading(false);
    }
  };

  // ── Profile form handlers ───────────────────────────────────────────────
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileError('');
  };

  /**
   * Validates all required fields on the client before sending.
   * Returns array of field names that are still empty.
   */
  const getLocalMissingFields = () =>
    REQUIRED_FIELDS.filter((f) => {
      const v = profileData[f];
      return v === null || v === undefined || v === '';
    });

  /**
   * Submits profile data to POST /api/mothers/complete-profile
   * Backend should update Mother + User tables and set profile_completed = true.
   */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');

    // Client-side validation
    const stillMissing = getLocalMissingFields();
    if (stillMissing.length > 0) {
      setMissingFields(stillMissing);
      setProfileError(
        `Please fill in: ${stillMissing.map((f) => f.replace(/_/g, ' ')).join(', ')}`
      );
      return;
    }

    setProfileLoading(true);
    try {
      const token = localStorage.getItem('pearlmom_token');

      // Coerce numeric fields before sending
      const payload = {
        ...profileData,
        current_weight: parseFloat(profileData.current_weight) || 0,
        height: parseFloat(profileData.height) || 0,
        gravida: parseInt(profileData.gravida) || 1,
        para: parseInt(profileData.para) || 0,
        weeks: parseInt(profileData.weeks) || 0,
      };

      const response = await fetch(`${API_URL}/mothers/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setProfileSuccess(true);
        setTimeout(() => {
          setShowProfileModal(false);
          setProfileSuccess(false);
          setMissingFields([]);
          // Refresh dashboard with updated data
          fetchDashboardData();
          fetchEmchData();
        }, 1800);
      } else {
        setProfileError(result.message || 'Failed to save profile');
      }
    } catch (err) {
      console.error('Profile save error:', err);
      setProfileError('An error occurred while saving your profile: ' + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Derived values ──────────────────────────────────────────────────────
  const mother = dashboardData?.mother || dashboardData;
  const { trimester, weekText } = getTrimester(weeks);
  const babySize = getBabySize(weeks);
  const daysUntilDue = getDaysUntilDue(mother?.expected_delivery_date);
  const isHighRisk = mother?.is_high_risk || false;

  const nextAppointment = emchData?.nextAppointment || null;
  const lastClinicVisit = emchData?.clinicVisits?.[0] || null;
  const labReports = emchData?.labReports || [];
  const vitalSigns = emchData?.vitalSigns || null;
  const displayedLabResults = labReports.slice(0, 3);

  // ── Loading / error states ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={() => { fetchDashboardData(); fetchEmchData(); }}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left / Main column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 text-white p-8 shadow-lg">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-4 border-white/10 opacity-30" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full border-4 border-white/10 opacity-20" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4 px-3 py-1">
                  <span className="mr-1">❤️</span> {trimester}
                </Badge>
                <h2 className="text-4xl font-bold mb-2">{weekText}</h2>
                <p className="text-pink-100 max-w-sm mb-6 leading-relaxed">
                  Your baby is the size of {babySize}.{' '}
                  {daysUntilDue > 0 ? `${daysUntilDue} days until your due date!` : 'Almost there!'}
                </p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-pink-200 mb-1 uppercase tracking-wider">Status</p>
                    <p className="font-semibold flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${isHighRisk ? 'bg-red-300' : 'bg-green-300'}`} />
                      {isHighRisk ? 'High Risk' : 'Low Risk'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-pink-200 mb-1 uppercase tracking-wider">EDD</p>
                    <p className="font-semibold">
                      {mother?.expected_delivery_date ? formatDate(mother.expected_delivery_date, 'long') : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-pink-200 mb-1 uppercase tracking-wider">Gestational Weeks</p>
                    <p className="font-semibold">{weeks > 0 ? `${weeks} weeks` : 'Not calculated'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 relative">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(pregnancyProgress / 100) * 326.73} 326.73`}
                      className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{pregnancyProgress}%</span>
                    <span className="text-xs text-pink-100">Complete</span>
                  </div>
                </div>
                <p className="text-center text-xs text-pink-200 mt-2 uppercase tracking-wide">Pregnancy Progress</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:border-pink-300 cursor-pointer transition-all">
              <Link to="/mother/emch-card">
                <CardContent className="p-5 flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">View E-MCH Card</h4>
                    <p className="text-xs text-gray-500">Digital health ID</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:border-pink-300 cursor-pointer transition-all">
              <Link to="/mother/vaccination">
                <CardContent className="p-5 flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                    <Syringe className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Vaccination Schedule</h4>
                    <p className="text-xs text-gray-500">View all doses</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Appointment + Vaccination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Badge variant={nextAppointment ? 'success' : 'secondary'}>
                    {nextAppointment ? 'CONFIRMED' : 'NONE'}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">NEXT APPOINTMENT</p>
                {emchLoading ? (
                  <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ) : nextAppointment ? (
                  <>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {formatDate(nextAppointment.appointment_date, 'long')}
                      {nextAppointment.appointment_time ? `, ${nextAppointment.appointment_time}` : ''}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {nextAppointment.appointment_type || 'Consultation'}
                      {nextAppointment.Clinic?.clinic_name && (
                        <> at <span className="font-medium text-pink-600">{nextAppointment.Clinic.clinic_name}</span></>
                      )}
                    </p>
                    {nextAppointment.notes && <p className="text-xs text-gray-400 mt-1">{nextAppointment.notes}</p>}
                  </>
                ) : (
                  <>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">No upcoming appointment</h4>
                    <p className="text-sm text-gray-600">Contact your midwife to schedule one.</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <Syringe className="h-5 w-5" />
                  </div>
                  <Badge variant="warning">DUE SOON</Badge>
                </div>
                <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">VACCINATION DUE</p>
                <h4 className="text-xl font-bold text-gray-900 mb-1">TDAP Booster</h4>
                <p className="text-sm text-gray-600">Recommended by <span className="font-medium">Week 30</span></p>
              </CardContent>
            </Card>
          </div>

          {/* Clinic Visit + Vital Signs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-500">LAST CLINIC VISIT</h4>
                  <span className="text-xs text-gray-400">
                    {emchLoading ? '...' : lastClinicVisit ? formatDate(lastClinicVisit.visit_date, 'short') : 'No visits'}
                  </span>
                </div>
                {emchLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                ) : lastClinicVisit ? (
                  <>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                      "{lastClinicVisit.notes || lastClinicVisit.clinical_notes || 'No notes recorded for this visit.'}"
                    </p>
                    <button
                      onClick={() => setShowVisitSummary(true)}
                      className="text-sm font-medium text-pink-600 flex items-center hover:underline"
                    >
                      VIEW FULL SUMMARY <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm italic">No clinic visits recorded yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-500">LATEST VITAL SIGNS</h4>
                  <Badge variant="success">{vitalSigns ? 'UPDATED' : 'PENDING'}</Badge>
                </div>
                {emchLoading ? (
                  <div className="animate-pulse space-y-4 flex-grow">
                    {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-gray-200 rounded w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-4 flex-grow">
                    {[
                      { label: 'Blood Pressure', value: vitalSigns?.blood_pressure_systolic && vitalSigns?.blood_pressure_diastolic ? `${vitalSigns.blood_pressure_systolic}/${vitalSigns.blood_pressure_diastolic}` : 'Not recorded' },
                      { label: 'Weight', value: vitalSigns?.weight_kg ? `${vitalSigns.weight_kg} kg` : 'Not recorded' },
                      { label: 'Fetal Heart Rate', value: vitalSigns?.fetal_heart_rate ? `${vitalSigns.fetal_heart_rate} bpm` : 'Not recorded' },
                      { label: 'Fundal Height', value: vitalSigns?.fundal_height_cm ? `${vitalSigns.fundal_height_cm} cm` : 'Not recorded' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {displayedLabResults.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">LABORATORY REPORTS</p>
                    <div className="space-y-2">
                      {displayedLabResults.map((report, i) => (
                        <div key={report.lab_report_id || i} className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{report.test_name}</span>
                          <Badge variant="success" className="text-[10px]">
                            {report.status?.toUpperCase() || 'COMPLETED'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    const doc = new jsPDF('p', 'mm', 'a4');
                    const pw = doc.internal.pageSize.getWidth();
                    const pink = [219, 39, 119];
                    doc.setFillColor(253, 242, 248);
                    doc.rect(0, 0, pw, 45, 'F');
                    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...pink); doc.text('Pearl Mom', 20, 20);
                    doc.setFontSize(13); doc.setTextColor(31, 41, 55);
                    doc.text('Laboratory Report', 20, 32);
                    doc.setFontSize(8); doc.setTextColor(107, 114, 128);
                    doc.text(`Generated: ${new Date().toLocaleString()}`, pw - 50, 20, { align: 'right' });
                    doc.setDrawColor(...pink); doc.setLineWidth(0.5); doc.line(20, 50, pw - 20, 50);
                    let y = 65;
                    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(31, 41, 55);
                    doc.text('Patient Information', 20, y); y += 8;
                    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(75, 85, 99);
                    doc.text(`Name: ${mother?.full_name || 'N/A'}`, 20, y);
                    doc.text(`Age: ${weeks > 0 ? weeks + ' weeks pregnant' : 'N/A'}`, 100, y); y += 6;
                    doc.text(`EDD: ${mother?.expected_delivery_date ? formatDate(mother.expected_delivery_date, 'long') : 'N/A'}`, 20, y); y += 15;
                    if (labReports.length > 0) {
                      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(31, 41, 55);
                      doc.text('Laboratory Reports', 20, y); y += 8;
                      autoTable(doc, {
                        startY: y,
                        head: [['Test Name', 'Date', 'Status']],
                        body: labReports.map((r) => [r.test_name || 'N/A', r.collected_date ? formatDate(r.collected_date, 'short') : 'N/A', r.status?.toUpperCase() || 'Completed']),
                        theme: 'striped',
                        headStyles: { fillColor: pink, textColor: 255, fontSize: 9 },
                        bodyStyles: { fontSize: 8 }, margin: { left: 20 },
                      });
                    } else {
                      doc.setFontSize(10); doc.setTextColor(107, 114, 128);
                      doc.text('No laboratory reports available.', 20, y);
                    }
                    const pc = doc.internal.getNumberOfPages();
                    for (let i = 1; i <= pc; i++) {
                      doc.setPage(i); doc.setFontSize(8); doc.setTextColor(156, 163, 175);
                      doc.text(`Pearl Mom Lab Report - Page ${i} of ${pc} - © ${new Date().getFullYear()} PearlMom`, pw / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
                    }
                    doc.save(`Lab_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                  }}
                  className="w-full mt-4 py-2 border border-pink-200 rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>DOWNLOAD LAB REPORT</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Right / Sidebar column ── */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-pink-600 flex items-center mb-4">
              <span className="text-xl mr-2">📍</span> Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/mother/clinic-locator')}
                className="w-full rounded-xl bg-gray-100 p-4 text-gray-900 flex items-center hover:bg-pink-50 transition"
              >
                <div className="bg-white p-2 rounded-lg mr-4 text-gray-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold">Find Hospital</p>
                  <p className="text-xs text-gray-500">Nearest: 1.2km</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Alerts & Tips */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Alerts &amp; Tips</h3>
                <button onClick={markAllAsRead} className="text-xs font-medium text-pink-600 hover:underline">
                  MARK ALL READ {unreadCount > 0 && `(${unreadCount})`}
                </button>
              </div>
              <div className="space-y-6">
                {[
                  { Icon: Calendar, bg: 'bg-pink-50', fg: 'text-pink-600', title: 'Clinic Schedule Update', body: 'The Friday clinic will now start at 8:00 AM instead of 9:00 AM.', ago: Date.now() - 7200000 },
                  { Icon: Droplet, bg: 'bg-green-50', fg: 'text-green-600', title: 'Maternal Wellness Tip', body: 'Stay hydrated! Drinking 2.5L of water daily helps maintain amniotic fluid levels.', ago: Date.now() - 86400000 },
                  { Icon: Apple, bg: 'bg-orange-50', fg: 'text-orange-600', title: 'Nutrition Guide', body: 'Add more leafy greens to your dinner for a natural folic acid boost.', ago: Date.now() - 172800000 },
                ].map(({ Icon, bg, fg, title, body, ago }) => (
                  <div key={title} className="flex">
                    <div className="mr-4 mt-1">
                      <div className={`h-8 w-8 rounded-full ${bg} flex items-center justify-center ${fg}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-snug">{body}</p>
                      <p className="text-xs text-gray-400 mt-2">{getRelativeTime(new Date(ago))}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 flex justify-center items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                View All Notifications <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </CardContent>
          </Card>

          {/* Video guide */}
          <div
            className="rounded-2xl overflow-hidden relative group cursor-pointer h-48 bg-gradient-to-br from-pink-600 to-rose-700"
            onClick={() => setShowVideo(true)}
          >
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555252117-426bf85fc585?auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-white/20 text-white border-none mb-2 backdrop-blur-sm tracking-wider uppercase text-[10px]">VIDEO GUIDE</Badge>
              <h3 className="font-bold text-white text-lg leading-tight group-hover:text-pink-200 transition-colors">
                Pregnancy: A Month-By-Month Guide
              </h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Profile Completion Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Complete Your Health Profile</h2>
                  <p className="text-xs text-gray-500">This information helps us provide personalised care</p>
                </div>
              </div>
              {/* Only allow closing after a deliberate choice; X still available */}
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Skip for now"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* ── Success state ── */}
              {profileSuccess ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Completed!</h3>
                  <p className="text-gray-500">Your health information has been saved successfully.</p>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleProfileSubmit} className="space-y-5">

                  {/* Errors / warnings */}
                  {profileError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{profileError}</span>
                    </div>
                  )}
                  {missingFields.length > 0 && !profileError && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                      <strong>Please complete:</strong>{' '}
                      {missingFields.map((f) => f.replace(/_/g, ' ')).join(', ')}
                    </div>
                  )}

                  {/* ── Section: Personal Details ── */}
                  <fieldset className="space-y-4">
                    <legend className="text-sm font-semibold text-pink-700 uppercase tracking-wider pb-1 border-b border-pink-100 w-full">
                      Personal Details
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Full Name *" name="full_name" type="text" value={profileData.full_name} onChange={handleProfileInputChange} />
                      <Field label="NIC Number *" name="nic" type="text" value={profileData.nic} onChange={handleProfileInputChange} />
                      <Field label="Date of Birth *" name="dob" type="date" value={profileData.dob} onChange={handleProfileInputChange} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                        <select name="blood_group" value={profileData.blood_group} onChange={handleProfileInputChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500">
                          <option value="">Select Blood Group</option>
                          {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map((g) => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Home Address *</label>
                      <textarea name="address" value={profileData.address} onChange={handleProfileInputChange} rows="2"
                        placeholder="Enter your residential address"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-pink-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                        <select name="district" value={profileData.district} onChange={handleProfileInputChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500">
                          <option value="">Select District</option>
                          {['Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya','Galle','Matara','Hambantota',
                            'Jaffna','Kilinochchi','Mannar','Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
                            'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla','Moneragala','Ratnapura','Kegalle']
                            .map((d) => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <Field label="GS Division" name="gs_division" type="text" placeholder="e.g., 123A"
                        value={profileData.gs_division} onChange={handleProfileInputChange} />
                    </div>
                  </fieldset>

                  {/* ── Section: Pregnancy Details ── */}
                  <fieldset className="space-y-4">
                    <legend className="text-sm font-semibold text-pink-700 uppercase tracking-wider pb-1 border-b border-pink-100 w-full">
                      Pregnancy Details
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy Status *</label>
                        <select name="pregnancy_status" value={profileData.pregnancy_status} onChange={handleProfileInputChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500">
                          <option value="pregnant">Pregnant</option>
                          <option value="postnatal">Postnatal</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <Field label="LMP Date *" name="lmp_date" type="date" value={profileData.lmp_date} onChange={handleProfileInputChange} />
                      <Field label="Expected Delivery Date *" name="expected_delivery_date" type="date"
                        value={profileData.expected_delivery_date} onChange={handleProfileInputChange} />
                      <Field label="Gestational Weeks *" name="weeks" type="number" placeholder="e.g., 28"
                        min="1" max="42" value={profileData.weeks} onChange={handleProfileInputChange} />
                      <Field label="Current Weight (kg) *" name="current_weight" type="number" step="0.1" placeholder="e.g., 65"
                        value={profileData.current_weight} onChange={handleProfileInputChange} />
                      <Field label="Height (cm) *" name="height" type="number" step="0.1" placeholder="e.g., 160"
                        value={profileData.height} onChange={handleProfileInputChange} />
                      <Field label="Gravida (No. of pregnancies) *" name="gravida" type="number"
                        value={profileData.gravida} onChange={handleProfileInputChange} />
                      <Field label="Para (No. of deliveries) *" name="para" type="number"
                        value={profileData.para} onChange={handleProfileInputChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Allergies *</label>
                        <textarea name="allergies" value={profileData.allergies} onChange={handleProfileInputChange} rows="2"
                          placeholder="List any allergies (or 'None')"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-pink-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Diseases *</label>
                        <textarea name="chronic_diseases" value={profileData.chronic_diseases} onChange={handleProfileInputChange} rows="2"
                          placeholder="List any chronic diseases (or 'None')"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-pink-500" />
                      </div>
                    </div>
                  </fieldset>

                  {/* ── Section: Family / Emergency ── */}
                  <fieldset className="space-y-4">
                    <legend className="text-sm font-semibold text-pink-700 uppercase tracking-wider pb-1 border-b border-pink-100 w-full">
                      Family &amp; Emergency Contact
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Emergency Contact Name *" name="emergency_contact_name" type="text"
                        placeholder="e.g., Saman Perera" value={profileData.emergency_contact_name} onChange={handleProfileInputChange} />
                      <Field label="Emergency Contact Phone *" name="emergency_contact_phone" type="tel"
                        placeholder="e.g., 0771234567" value={profileData.emergency_contact_phone} onChange={handleProfileInputChange} />
                      <Field label="Emergency Relationship *" name="emergency_relationship" type="text"
                        placeholder="e.g., Husband, Father, Mother" value={profileData.emergency_relationship} onChange={handleProfileInputChange} />
                      <Field label="Husband Name *" name="husband_name" type="text"
                        placeholder="e.g., Saman Fernando" value={profileData.husband_name} onChange={handleProfileInputChange} />
                      <Field label="Husband Contact *" name="husband_contact" type="tel"
                        placeholder="e.g., 0777000100" value={profileData.husband_contact} onChange={handleProfileInputChange} />
                    </div>
                  </fieldset>

                  {/* ── Footer buttons ── */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="text-sm text-gray-400 hover:text-gray-600 font-medium"
                    >
                      Skip for now
                    </button>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowProfileModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Remind Later
                      </button>
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {profileLoading ? (
                          <><Loader className="h-4 w-4 animate-spin" /> Saving…</>
                        ) : (
                          'Save Profile'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Clinic Visit Summary Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {showVisitSummary && lastClinicVisit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Clinic Visit Summary</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {lastClinicVisit.visit_date ? formatDate(lastClinicVisit.visit_date, 'long') : 'Date not recorded'}
                </p>
              </div>
              <button onClick={() => setShowVisitSummary(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {lastClinicVisit.visit_type && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Visit Type</p>
                  <p className="text-sm text-gray-800 font-medium">{lastClinicVisit.visit_type}</p>
                </div>
              )}
              {(lastClinicVisit.weight_kg || lastClinicVisit.blood_pressure_systolic || lastClinicVisit.fetal_heart_rate || lastClinicVisit.fundal_height_cm) && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vital Signs</p>
                  <div className="grid grid-cols-2 gap-3">
                    {lastClinicVisit.weight_kg && <VitalBox label="Weight" value={`${lastClinicVisit.weight_kg} kg`} />}
                    {lastClinicVisit.blood_pressure_systolic && lastClinicVisit.blood_pressure_diastolic && (
                      <VitalBox label="Blood Pressure" value={`${lastClinicVisit.blood_pressure_systolic}/${lastClinicVisit.blood_pressure_diastolic} mmHg`} />
                    )}
                    {lastClinicVisit.fetal_heart_rate && <VitalBox label="Fetal Heart Rate" value={`${lastClinicVisit.fetal_heart_rate} bpm`} />}
                    {lastClinicVisit.fundal_height_cm && <VitalBox label="Fundal Height" value={`${lastClinicVisit.fundal_height_cm} cm`} />}
                  </div>
                </div>
              )}
              {(lastClinicVisit.clinical_notes || lastClinicVisit.patient_complaints) && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Clinical Notes</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-pink-50 border border-pink-100 rounded-lg p-3 italic">
                    "{lastClinicVisit.clinical_notes || lastClinicVisit.patient_complaints}"
                  </p>
                </div>
              )}
              {lastClinicVisit.next_visit_date && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Next Visit Recommended</p>
                  <p className="text-sm text-gray-700 font-medium">{formatDate(lastClinicVisit.next_visit_date, 'long')}</p>
                </div>
              )}
              <div className="pt-2">
                <button onClick={() => setShowVisitSummary(false)}
                  className="w-full py-2.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          YouTube Video Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl">
            <button onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 text-white hover:text-pink-300 transition-colors flex items-center space-x-1">
              <X size={20} /><span className="text-sm">Close</span>
            </button>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/8BH7WFmRs-E?autoplay=1&rel=0"
                title="Gentle Stretching for 3rd Trimester"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-white text-center text-sm mt-3 font-medium">Pregnancy: A Month-By-Month Guide</p>
          </div>
        </div>
      )}
      <ChatWidget />
    </div>
  );
};

// ─── Small reusable sub-components ───────────────────────────────────────────
const Field = ({ label, name, type = 'text', value, onChange, placeholder, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
    />
  </div>
);

const VitalBox = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

export default MotherDashboard;