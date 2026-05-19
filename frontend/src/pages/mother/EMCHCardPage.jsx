// frontend/src/pages/mother/EMCHCardPage.jsx
import React from 'react';
import { 
  User, 
  PlusCircle, 
  FileText, 
  Download, 
  Info, 
  Microscope,
  BookOpen
} from 'lucide-react';

const MiniBarChart = ({ color, values }) => (
  <div className="flex items-end space-x-1 h-8 mt-4">
    {values.map((val, i) => (
      <div 
        key={i} 
        className="w-full rounded-t-sm" 
        style={{ 
          height: `${val}%`, 
          backgroundColor: color,
          opacity: i === values.length - 1 ? 1 : 0.3 + (i * 0.15)
        }}
      ></div>
    ))}
  </div>
);

const EMCHCardPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Main Content Column */}
      <div className="flex-1 space-y-8">
        
        {/* Patient Hero Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="bg-[#e0f2fe] p-4 rounded-2xl text-[#0284c7]">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Elena Richardson</h1>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span className="bg-[#f1f5f9] px-2 py-1 rounded text-xs font-medium">MTH-2024-000123</span>
                <span>Age: 28</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Blood Group: O+</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#dcfce7] px-6 py-4 rounded-xl border border-[#bbf7d0] text-center w-full md:w-auto">
            <div className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-1">Expected Delivery Date</div>
            <div className="text-xl font-bold text-[#15803d]">Feb 14, 2025</div>
          </div>
        </div>

        {/* Vital Signs & Trends */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Vital Signs & Trends</h2>
            <div className="flex space-x-3 text-xs text-gray-500 font-medium">
              <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#0284c7]"></span><span>FHR</span></div>
              <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#16a34a]"></span><span>Weight</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Pressure */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Blood Pressure (Avg)</div>
              <div className="flex items-end space-x-3">
                <span className="text-3xl font-bold text-gray-900">119/79</span>
                <span className="text-sm font-medium text-[#16a34a] mb-1">→ Stable</span>
              </div>
              <MiniBarChart color="#0284c7" values={[40, 45, 50, 60]} />
            </div>

            {/* Weight */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Weight Progress (kg)</div>
              <div className="flex items-end space-x-3">
                <span className="text-3xl font-bold text-gray-900">65.2</span>
                <span className="text-sm font-medium text-red-500 mb-1">↗ +2.1kg</span>
              </div>
              <MiniBarChart color="#16a34a" values={[30, 40, 60, 80]} />
            </div>

            {/* Fetal Heart Rate */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fetal Heart Rate (bpm)</div>
              <div className="flex items-end space-x-3">
                <span className="text-3xl font-bold text-gray-900">145</span>
                <span className="text-sm font-medium text-gray-500 mb-1">Healthy Range</span>
              </div>
              <MiniBarChart color="#0284c7" values={[50, 50, 60, 70]} />
            </div>
          </div>
        </div>

        {/* Antenatal Visit Timeline */}
        <div className="bg-[#fafafa] rounded-3xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Antenatal Visit Timeline</h2>
            <button className="text-[#0ea5e9] text-sm font-bold flex items-center hover:text-[#0284c7]">
              <PlusCircle size={16} className="mr-1" /> New Visit Record
            </button>
          </div>

          <div className="relative pl-6 border-l-2 border-gray-200 space-y-10">
            
            {/* Visit 3 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#0ea5e9] border-4 border-[#fafafa]"></div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <div className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider mb-1">Visit #3 — 24 Weeks</div>
                    <h3 className="text-lg font-bold text-gray-900">Routine Second Trimester Check</h3>
                  </div>
                  <span className="text-sm text-gray-500 mt-2 md:mt-0">Oct 12, 2024</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">BP</div>
                    <div className="font-semibold text-gray-900">120/80 <span className="text-xs font-normal">mmHg</span></div>
                  </div>
                  <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                    <div className="font-semibold text-gray-900">65.2 <span className="text-xs font-normal">kg</span></div>
                  </div>
                  <div className="bg-[#e0f2fe] p-3 rounded-xl border border-[#bae6fd]">
                    <div className="text-xs text-[#0369a1] mb-1">FHR</div>
                    <div className="font-semibold text-[#0369a1]">145 <span className="text-xs font-normal">bpm</span></div>
                  </div>
                  <div className="bg-[#dcfce7] p-3 rounded-xl border border-[#bbf7d0]">
                    <div className="text-xs text-[#166534] mb-1">Fundal Ht.</div>
                    <div className="font-semibold text-[#166534]">24 <span className="text-xs font-normal">cm</span></div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-sm">
                  <BookOpen size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-700">Health Education Summary</span>
                    <p className="text-gray-500 italic mt-1 leading-relaxed">Discussed sleep positioning, breastfeeding initiation benefits, and signs of pre-eclampsia to watch for in the coming weeks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-gray-300 border-4 border-[#fafafa]"></div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Visit #2 — 20 Weeks</div>
                    <h3 className="text-lg font-bold text-gray-900">Anomaly Scan Review</h3>
                  </div>
                  <span className="text-sm text-gray-500 mt-2 md:mt-0">Sep 14, 2024</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">BP</div>
                    <div className="font-semibold text-gray-900">118/78</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                    <div className="font-semibold text-gray-900">63.1 kg</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">FHR</div>
                    <div className="font-semibold text-gray-900">142 bpm</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Laboratory Reports */}
        <div className="bg-[#fafafa] rounded-3xl p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Microscope className="text-[#0ea5e9]" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Laboratory Reports</h2>
              <p className="text-sm text-gray-500">Recent clinical findings and screenings</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Lab Report 1 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-[#f1f5f9] p-3 rounded-lg text-gray-500 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Full Blood Count (FBC)</h4>
                  <p className="text-xs text-gray-500 mt-1">Completed: Oct 05, 2024 • Lab ID: #77821</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:w-auto w-full justify-end">
                <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Normal</span>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">View</button>
                <button className="px-4 py-2 bg-[#006699] text-white rounded-lg text-sm font-medium hover:bg-[#005580] transition-colors flex items-center">
                  <Download size={16} className="mr-2" /> Download
                </button>
              </div>
            </div>

            {/* Lab Report 2 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-[#f1f5f9] p-3 rounded-lg text-gray-500 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Glucose Tolerance Test (GTT)</h4>
                  <p className="text-xs text-gray-500 mt-1">Completed: Sep 20, 2024 • Lab ID: #76994</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:w-auto w-full justify-end">
                <span className="bg-[#fef3c7] text-[#d97706] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Pending Review</span>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">View</button>
                <button className="px-4 py-2 bg-[#006699] text-white rounded-lg text-sm font-medium hover:bg-[#005580] transition-colors flex items-center">
                  <Download size={16} className="mr-2" /> Download
                </button>
              </div>
            </div>

            {/* Lab Report 3 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-[#f1f5f9] p-3 rounded-lg text-gray-500 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Anatomy Ultrasound Scan (PDF)</h4>
                  <p className="text-xs text-gray-500 mt-1">Completed: Sep 14, 2024 • Clinic ID: #RAD-401</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:w-auto w-full justify-end">
                <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Complete</span>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">View</button>
                <button className="px-4 py-2 bg-[#006699] text-white rounded-lg text-sm font-medium hover:bg-[#005580] transition-colors flex items-center">
                  <Download size={16} className="mr-2" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column - Side Panel */}
      <div className="w-full lg:w-80 flex flex-col space-y-6">
        
        {/* Pregnancy History */}
        <div className="bg-[#fafafa] rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="text-gray-500" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Pregnancy History</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white px-4 py-3 rounded-xl flex justify-between items-center shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-700">Live Births</span>
              <span className="bg-[#166534] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</span>
            </div>
            
            <div className="bg-white px-4 py-3 rounded-xl flex justify-between items-center shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-700">Miscarriages</span>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">0</span>
            </div>
            
            <div className="bg-white px-4 py-3 rounded-xl flex justify-between items-center shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-700">C-Sections</span>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">0</span>
            </div>
          </div>
        </div>

        {/* Next Appointment Card */}
        <div className="bg-[#e0f2fe] rounded-2xl p-6 border border-[#bae6fd]">
          <div className="flex items-start space-x-3">
            <div className="bg-[#0284c7] p-1.5 rounded-full text-white shrink-0 mt-0.5">
              <Info size={16} />
            </div>
            <div>
              <h3 className="font-bold text-[#0369a1] text-sm mb-2">Next Appointment</h3>
              <p className="text-sm text-[#075985] leading-relaxed">
                Your 28-week routine check-up is scheduled for Nov 10, 2024 at 10:00 AM.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EMCHCardPage;
