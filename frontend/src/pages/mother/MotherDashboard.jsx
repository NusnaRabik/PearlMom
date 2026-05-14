// frontend/src/pages/mother/MotherDashboard.jsx
import React from 'react';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Syringe, 
  PhoneCall, 
  MapPin, 
  ArrowRight,
  Bell,
  Activity,
  Apple
} from 'lucide-react';

const CircularProgress = ({ percentage }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255,255,255,0.2)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#4ade80" // light green
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{percentage}%</span>
        <span className="text-xs text-white/80 uppercase tracking-wider">Progress</span>
      </div>
    </div>
  );
};

const MotherDashboard = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Column - Main Content */}
      <div className="flex-1 space-y-6">
        
        {/* Hero Card */}
        <div className="bg-gradient-to-r from-[#176a8f] to-[#2585a6] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                <Heart size={14} className="text-white fill-white" />
                <span>3rd Trimester</span>
              </div>
              <h1 className="text-4xl font-bold mb-3">Week 28 of 40</h1>
              <p className="text-[#e0f2fe] text-lg max-w-md leading-relaxed mb-6">
                Your baby is the size of a large eggplant. 84 days until your journey begins!
              </p>
              
              <div className="flex space-x-12">
                <div>
                  <span className="block text-xs text-[#e0f2fe] uppercase tracking-wider mb-1">Status</span>
                  <div className="flex items-center space-x-2 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                    <span>Low Risk</span>
                  </div>
                </div>
                <div className="w-px bg-white/30"></div>
                <div>
                  <span className="block text-xs text-[#e0f2fe] uppercase tracking-wider mb-1">EDD</span>
                  <div className="font-medium">
                    Feb 14, 2025
                  </div>
                </div>
              </div>
            </div>
            
            {/* Circular Progress */}
            <div className="flex-shrink-0">
              <CircularProgress percentage={70} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow text-left">
            <div className="bg-[#e0f2fe] p-3 rounded-xl">
              <FileText className="text-[#0ea5e9]" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View E-MCH Card</h3>
              <p className="text-sm text-gray-500">Digital health ID</p>
            </div>
          </button>
          
          <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow text-left">
            <div className="bg-[#f1f5f9] p-3 rounded-xl">
              <Calendar className="text-[#64748b]" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Book Appointment</h3>
              <p className="text-sm text-gray-500">Schedule a checkup</p>
            </div>
          </button>
          
          <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow text-left">
            <div className="bg-[#f1f5f9] p-3 rounded-xl">
              <Syringe className="text-[#64748b]" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vaccination Schedule</h3>
              <p className="text-sm text-gray-500">View all doses</p>
            </div>
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Next Appointment */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#38bdf8]"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#e0f2fe] p-2.5 rounded-lg text-[#0284c7]">
                <Calendar size={20} />
              </div>
              <span className="bg-[#e0f2fe] text-[#0284c7] text-xs font-bold px-2.5 py-1 rounded-full">
                CONFIRMED
              </span>
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Next Appointment</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nov 24, 10:30 AM</h3>
            <p className="text-sm text-gray-600">Consultation with <span className="font-medium text-[#0ea5e9]">Dr. Perera</span></p>
          </div>

          {/* Vaccination Due */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f59e0b]"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#fef3c7] p-2.5 rounded-lg text-[#d97706]">
                <Syringe size={20} />
              </div>
              <span className="bg-[#fef3c7] text-[#d97706] text-xs font-bold px-2.5 py-1 rounded-full">
                DUE SOON
              </span>
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Vaccination Due</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">TDAP Booster</h3>
            <p className="text-sm text-gray-500 italic">Recommended by Week 30</p>
          </div>

          {/* Last Clinic Visit */}
          <div className="bg-[#fafafa] p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Clinic Visit</div>
              <span className="text-sm text-gray-500">Oct 28</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                "Patient shows normal weight gain. Fetal heartbeat stable at 145 bpm. Iron supplements continued."
              </p>
            </div>
            <button className="text-[#0ea5e9] text-sm font-semibold flex items-center hover:text-[#0284c7]">
              VIEW FULL SUMMARY <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          {/* Recent Test Results */}
          <div className="bg-[#fafafa] p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Test Results</div>
              <span className="bg-[#dcfce7] text-[#166534] text-xs font-bold px-2 py-0.5 rounded">NORMAL</span>
            </div>
            
            <div className="space-y-4 mb-6 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Hemoglobin</span>
                <span className="font-bold text-gray-900">12.2 g/dL</span>
              </div>
              <div className="w-full bg-gray-200 h-px"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Blood Glucose</span>
                <span className="font-bold text-gray-900">88 mg/dL</span>
              </div>
            </div>

            <button className="w-full bg-white border border-gray-200 text-[#0ea5e9] font-bold text-xs py-2.5 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wider">
              Download Blood Report
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Side Panel */}
      <div className="w-full lg:w-80 flex flex-col space-y-6">
        
        {/* Emergency Actions */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-red-500" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Emergency Actions</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white p-4 rounded-xl flex items-center justify-between transition-colors shadow-sm">
              <div className="flex items-center space-x-3">
                <PhoneCall size={20} />
                <div className="text-left">
                  <div className="font-bold">Call Midwife</div>
                </div>
              </div>
              <div className="text-xs text-red-200 text-right leading-tight">
                24/7<br/>Available
              </div>
            </button>
            
            <button className="w-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-gray-900 p-4 rounded-xl flex items-center justify-between transition-colors">
              <div className="flex items-center space-x-3">
                <MapPin size={20} className="text-gray-600" />
                <div className="font-bold">Find Hospital</div>
              </div>
              <div className="text-xs text-gray-500 text-right leading-tight">
                Nearest:<br/>1.2km
              </div>
            </button>
          </div>
        </div>

        {/* Alerts & Tips */}
        <div className="bg-[#fafafa] rounded-2xl border border-gray-100 p-5 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Alerts & Tips</h2>
            <button className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider">Mark All Read</button>
          </div>

          <div className="space-y-6">
            {/* Alert Item 1 */}
            <div className="flex items-start space-x-4">
              <div className="bg-[#e0f2fe] p-2 rounded-full text-[#0ea5e9] mt-1 shrink-0">
                <Calendar size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Clinic Schedule Update</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-1">The Friday clinic will now start at 8:00 AM instead of 9:00 AM.</p>
                <span className="text-[10px] text-gray-400">2 hours ago</span>
              </div>
            </div>

            {/* Alert Item 2 */}
            <div className="flex items-start space-x-4">
              <div className="bg-[#dcfce7] p-2 rounded-full text-[#16a34a] mt-1 shrink-0">
                <Activity size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Maternal Wellness Tip</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-1">Stay hydrated! Drinking 2.5L of water daily helps maintain amniotic fluid levels.</p>
                <span className="text-[10px] text-gray-400">Yesterday</span>
              </div>
            </div>

            {/* Alert Item 3 */}
            <div className="flex items-start space-x-4">
              <div className="bg-[#fef3c7] p-2 rounded-full text-[#d97706] mt-1 shrink-0">
                <Apple size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Nutrition Guide</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-1">Add more leafy greens to your dinner for natural folic acid boost.</p>
                <span className="text-[10px] text-gray-400">2 days ago</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button className="text-sm font-semibold text-gray-700 hover:text-gray-900">
              View All Notifications <span className="text-[10px]">▼</span>
            </button>
          </div>
        </div>

        {/* Video Guide */}
        <div className="rounded-2xl overflow-hidden relative h-48 shadow-sm group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#1e293b]/80 to-transparent z-10"></div>
          {/* Placeholder for video thumbnail - using CSS gradient to simulate */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8] to-[#0284c7]"></div>
          
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">Video Guide</div>
            <h3 className="text-white font-bold leading-tight">Gentle Stretching for 3rd Trimester</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MotherDashboard;
