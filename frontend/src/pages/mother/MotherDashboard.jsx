import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Phone, MapPin, Calendar, FileText, Syringe, ChevronRight, Video, Droplet, Apple, Download, X, CheckCircle2, User, Heart } from 'lucide-react';
import { useMother } from '../../hooks/useMother';
import { useNotificationsHook } from '../../hooks/useNotifications';
import { formatDate, getRelativeTime } from '../../utils/formatDate';

const MotherDashboard = () => {
  const navigate = useNavigate();
  const pregnancyProgress = 70;

  const { motherData, appointments, vaccinations, loading: motherLoading } = useMother('MTH-2024-001');
  const { notifications, unreadCount, markAllAsRead } = useNotificationsHook();

  // Profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    nic: '',
    dob: '',
    address: '',
    bloodGroup: '',
    pregnancyStatus: '',
    expectedDeliveryDate: '',
    currentWeight: '',
    emergencyContact: ''
  });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Check if profile needs to be completed - ONLY for new registrations
  useEffect(() => {
    const isNewRegistration = localStorage.getItem('pearlmom_new_registration');
    const isProfileComplete = localStorage.getItem('pearlmom_mother_profile_complete');
    
    // Only show profile modal if:
    // 1. User just registered (new_registration flag is 'true')
    // 2. Profile is NOT yet completed
    if (isNewRegistration === 'true' && !isProfileComplete) {
      setShowProfileModal(true);
    } else {
      setProfileCompleted(true);
      // Clean up the flag if profile is already complete
      if (isProfileComplete) {
        localStorage.removeItem('pearlmom_new_registration');
      }
    }
  }, []);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setProfileError('');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileError('');

    const requiredFields = ['fullName', 'nic', 'dob', 'address', 'bloodGroup', 'expectedDeliveryDate', 'currentWeight', 'emergencyContact'];
    const emptyFields = requiredFields.filter(field => !profileData[field]);
    
    if (emptyFields.length > 0) {
      setProfileError(`Please fill in all required fields: ${emptyFields.map(f => f.replace(/([A-Z])/g, ' $1').trim()).join(', ')}`);
      return;
    }

    const profileInfo = {
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('pearlmom_mother_profile', JSON.stringify(profileInfo));
    localStorage.setItem('pearlmom_mother_profile_complete', 'true');
    localStorage.removeItem('pearlmom_new_registration');
    
    setProfileSuccess(true);
    
    setTimeout(() => {
      setShowProfileModal(false);
      setProfileCompleted(true);
      setProfileSuccess(false);
    }, 2000);
  };

  const handleSkipProfile = () => {
    setShowProfileModal(false);
  };

  const handleDownloadReport = () => {
    const storedProfile = localStorage.getItem('pearlmom_mother_profile');
    const profile = storedProfile ? JSON.parse(storedProfile) : {};
    
    const reportContent = `
BLOOD TEST REPORT
=================
Patient: ${profile.fullName || motherData?.fullName || 'Sample Mother'}
Date: ${formatDate(new Date())}

Results:
- Hemoglobin: 12.2 g/dL (Normal: 11-15)
- Blood Glucose: 88 mg/dL (Normal: 70-100)
- Blood Pressure: 120/80 mmHg
- Platelet Count: 250,000/mcL

Status: NORMAL
All values within normal range.
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Blood_Report_${formatDate(new Date(), 'short').replace(/, /g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 text-white p-8 shadow-lg">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-4 border-white/10 opacity-30"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full border-4 border-white/10 opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4 px-3 py-1">
                  <span className="mr-1">❤️</span> 3rd Trimester
                </Badge>
                <h2 className="text-4xl font-bold mb-2">Week 28 of 40</h2>
                <p className="text-pink-100 max-w-sm mb-6 leading-relaxed">
                  Your baby is the size of a large eggplant. 84 days until your journey begins!
                </p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-pink-200 mb-1 uppercase tracking-wider">Status</p>
                    <p className="font-semibold flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-300 mr-2"></span> Low Risk
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-pink-200 mb-1 uppercase tracking-wider">EDD</p>
                    <p className="font-semibold">{formatDate(profileData.expectedDeliveryDate || '2025-02-14', 'long')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 relative">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(pregnancyProgress / 100) * 326.73} 326.73`} className="transition-all duration-1000" />
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

          {/* Profile Completion Reminder Banner - only shows if profile not completed and not first visit */}
          {!profileCompleted && !showProfileModal && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Complete Your Profile</p>
                  <p className="text-xs text-yellow-600">Please fill in your health information to get personalized care.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
              >
                Complete Now
              </button>
            </div>
          )}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                   <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                     <Calendar className="h-5 w-5" />
                   </div>
                   <Badge variant="success">CONFIRMED</Badge>
                 </div>
                 <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">NEXT APPOINTMENT</p>
                 <h4 className="text-xl font-bold text-gray-900 mb-1">{formatDate('2024-11-24', 'long')}, 10:30 AM</h4>
                 <p className="text-sm text-gray-600">Consultation with <span className="font-medium text-pink-600">Dr. Perera</span></p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-500">LAST CLINIC VISIT</h4>
                  <span className="text-xs text-gray-400">{formatDate('2024-10-28', 'short')}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                  "Patient shows normal weight gain. Fetal heartbeat stable at 145 bpm. Iron supplements continued."
                </p>
                <button className="text-sm font-medium text-pink-600 flex items-center hover:underline">
                  VIEW FULL SUMMARY <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-500">RECENT TEST RESULTS</h4>
                  <Badge variant="success">NORMAL</Badge>
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hemoglobin</span>
                    <span className="text-sm font-semibold text-gray-900">12.2 g/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Blood Glucose</span>
                    <span className="text-sm font-semibold text-gray-900">88 mg/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Blood Pressure</span>
                    <span className="text-sm font-semibold text-gray-900">120/80</span>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadReport}
                  className="w-full mt-4 py-2 border border-pink-200 rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>DOWNLOAD BLOOD REPORT</span>
                </button>
              </CardContent>
            </Card>
          </div>

        </div>

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

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Alerts & Tips</h3>
                <button onClick={markAllAsRead} className="text-xs font-medium text-pink-600 hover:underline">
                  MARK ALL READ {unreadCount > 0 && `(${unreadCount})`}
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-8 w-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Clinic Schedule Update</p>
                    <p className="text-sm text-gray-600 mt-1 leading-snug">The Friday clinic will now start at 8:00 AM instead of 9:00 AM.</p>
                    <p className="text-xs text-gray-400 mt-2">{getRelativeTime(new Date(Date.now() - 7200000))}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Droplet className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Maternal Wellness Tip</p>
                    <p className="text-sm text-gray-600 mt-1 leading-snug">Stay hydrated! Drinking 2.5L of water daily helps maintain amniotic fluid levels.</p>
                    <p className="text-xs text-gray-400 mt-2">{getRelativeTime(new Date(Date.now() - 86400000))}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                      <Apple className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Nutrition Guide</p>
                    <p className="text-sm text-gray-600 mt-1 leading-snug">Add more leafy greens to your dinner for a natural folic acid boost.</p>
                    <p className="text-xs text-gray-400 mt-2">{getRelativeTime(new Date(Date.now() - 172800000))}</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 flex justify-center items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                View All Notifications <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </CardContent>
          </Card>

          <div className="rounded-2xl overflow-hidden relative group cursor-pointer h-48 bg-gradient-to-br from-pink-600 to-rose-700">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555252117-426bf85fc585?auto=format&fit=crop&q=80')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-white/20 text-white border-none mb-2 backdrop-blur-sm tracking-wider uppercase text-[10px]">VIDEO GUIDE</Badge>
              <h3 className="font-bold text-white text-lg leading-tight group-hover:text-pink-200 transition-colors">Gentle Stretching for 3rd Trimester</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                 <Video className="h-6 w-6 text-white" />
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Complete Your Health Profile</h2>
                  <p className="text-xs text-gray-500">This information helps us provide personalized care</p>
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
                  <p className="text-gray-500">Your health information has been saved successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  {profileError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {profileError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" name="fullName" value={profileData.fullName} onChange={handleProfileInputChange}
                        placeholder="e.g., Elena Richardson"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number *</label>
                      <input type="text" name="nic" value={profileData.nic} onChange={handleProfileInputChange}
                        placeholder="e.g., 987654321V"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input type="date" name="dob" value={profileData.dob} onChange={handleProfileInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                      <select name="bloodGroup" value={profileData.bloodGroup} onChange={handleProfileInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy Status</label>
                      <select name="pregnancyStatus" value={profileData.pregnancyStatus} onChange={handleProfileInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                        <option value="">Select Status</option>
                        <option value="Normal">Normal</option>
                        <option value="High Risk">High Risk</option>
                        <option value="Multiple Pregnancy">Multiple Pregnancy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date *</label>
                      <input type="date" name="expectedDeliveryDate" value={profileData.expectedDeliveryDate} onChange={handleProfileInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg) *</label>
                      <input type="number" name="currentWeight" value={profileData.currentWeight} onChange={handleProfileInputChange}
                        placeholder="e.g., 65" step="0.1"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
                      <input type="tel" name="emergencyContact" value={profileData.emergencyContact} onChange={handleProfileInputChange}
                        placeholder="e.g., +94 77 123 4567"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Home Address *</label>
                    <textarea name="address" value={profileData.address} onChange={handleProfileInputChange} rows="2"
                      placeholder="Enter your residential address"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"></textarea>
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
                      <button type="submit"
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
                        Save Profile
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

export default MotherDashboard;