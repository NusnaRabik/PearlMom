import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Download, 
  Lightbulb, 
  Syringe, 
  MoreHorizontal
} from 'lucide-react';

const VaccinationSchedulerPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 font-sans min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Vaccination & Care</h1>
        <p className="text-slate-500 mt-1 text-lg">Manage your pregnancy milestones and upcoming pediatric appointments in one serene space.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Calendar Widget */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-xl font-bold text-slate-800">
                <CalendarIcon className="w-5 h-5 mr-3 text-[#2681a6]" />
                November 2024
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-6">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
              
              {/* Calendar Days */}
              <div className="text-slate-300 font-medium py-3">27</div>
              <div className="text-slate-300 font-medium py-3">28</div>
              <div className="text-slate-300 font-medium py-3">29</div>
              <div className="text-slate-300 font-medium py-3">30</div>
              <div className="text-slate-300 font-medium py-3">31</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">1</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">2</div>
              
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer relative flex flex-col items-center">
                3
                <div className="w-1 h-1 bg-[#059669] rounded-full absolute bottom-1"></div>
              </div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">4</div>
              <div className="bg-[#2681a6] text-white font-medium py-3 rounded-xl cursor-pointer shadow-sm">5</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">6</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer relative flex flex-col items-center">
                7
                <div className="w-1 h-1 bg-[#2681a6] rounded-full absolute bottom-1"></div>
              </div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">8</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">9</div>
              
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">10</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">11</div>
              <div className="bg-[#eafdf3] border border-[#a6f4c5] text-[#059669] font-medium py-3 rounded-xl cursor-pointer">12</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">13</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">14</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">15</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">16</div>
              
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">17</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">18</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">19</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">20</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">21</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">22</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">23</div>
              
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">24</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">25</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">26</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">27</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">28</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">29</div>
              <div className="text-slate-800 font-medium py-3 hover:bg-slate-50 rounded-xl cursor-pointer">30</div>
              
              <div className="text-slate-300 font-medium py-3">1</div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 flex items-center gap-6">
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <div className="w-2 h-2 rounded-full bg-[#059669] mr-2"></div> Vaccination
              </div>
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <div className="w-2 h-2 rounded-full bg-[#2681a6] mr-2"></div> Routine Checkup
              </div>
            </div>
          </div>

          {/* Appointment History */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Appointment History</h2>
              <button className="text-[#2681a6] text-sm font-bold flex items-center hover:text-[#1e6b8c] transition-colors">
                Download All Records <Download className="w-4 h-4 ml-1.5" />
              </button>
            </div>
            
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">Date</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinic</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialist</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Outcome</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 pl-4">
                      <div className="font-bold text-slate-800 text-sm">Oct 24,</div>
                      <div className="font-bold text-slate-800 text-sm">2024</div>
                    </td>
                    <td className="py-5 text-sm font-medium text-slate-600 pr-4">
                      St. Mary's Women's Center
                    </td>
                    <td className="py-5">
                      <span className="bg-[#e5f5fb] text-[#2681a6] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Routine Checkup
                      </span>
                    </td>
                    <td className="py-5 text-sm text-slate-500 font-medium">Dr. Sarah Chen</td>
                    <td className="py-5">
                      <div className="flex items-center text-sm text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-2"></div>
                        All parameters normal
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <button className="text-slate-400 hover:text-[#2681a6] transition-colors p-1 flex justify-center w-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 pl-4">
                      <div className="font-bold text-slate-800 text-sm">Sep 30,</div>
                      <div className="font-bold text-slate-800 text-sm">2024</div>
                    </td>
                    <td className="py-5 text-sm font-medium text-slate-600 pr-4">
                      Pearl Health Riverside
                    </td>
                    <td className="py-5">
                      <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Lab Test
                      </span>
                    </td>
                    <td className="py-5 text-sm text-slate-500 font-medium">Lab Tech J. Doe</td>
                    <td className="py-5">
                      <div className="flex items-center text-sm text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-2"></div>
                        Glucose screen passed
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <button className="text-slate-400 hover:text-[#2681a6] transition-colors p-1 flex justify-center w-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 pl-4">
                      <div className="font-bold text-slate-800 text-sm">Aug 15,</div>
                      <div className="font-bold text-slate-800 text-sm">2024</div>
                    </td>
                    <td className="py-5 text-sm font-medium text-slate-600 pr-4">
                      St. Mary's Women's Center
                    </td>
                    <td className="py-5">
                      <span className="bg-[#e0e7ff] text-[#4f46e5] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Ultrasound
                      </span>
                    </td>
                    <td className="py-5 text-sm text-slate-500 font-medium">Dr. Sarah Chen</td>
                    <td className="py-5">
                      <div className="flex items-center text-sm text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-2"></div>
                        Healthy development
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <button className="text-slate-400 hover:text-[#2681a6] transition-colors p-1 flex justify-center w-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Immunization Tip */}
          <div className="bg-[#fef08a] rounded-[1.5rem] p-6 relative overflow-hidden flex items-start gap-4">
            <div className="absolute -right-4 -bottom-6 opacity-10 pointer-events-none">
              <Syringe className="w-32 h-32 text-yellow-900" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Lightbulb className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-900 mb-1">Immunization Tip</h4>
                <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                  Vaccines during pregnancy provide early protection for your baby that lasts for several months after birth.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Vaccination Track */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 h-full">
            <div className="flex items-start justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#059669] leading-tight">Vaccination<br/>Track</h2>
              <div className="bg-[#059669] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Growth Phase
              </div>
            </div>

            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
              
              {/* Item 1 - Completed */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0 bg-white p-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] fill-[#059669]/10" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">Influenza (Annual)</h3>
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Completed</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-3">Administered Oct 12, 2024</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Standard seasonal protection for expectant mothers. No side effects reported.
                  </p>
                </div>
              </div>

              {/* Item 2 - Upcoming */}
              <div className="relative pl-8">
                <div className="absolute -left-[7px] top-1.5 w-3 h-3 bg-[#e5f5fb] border-2 border-[#2681a6] rounded-full"></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">Tdap Booster</h3>
                    <span className="bg-[#e5f5fb] text-[#2681a6] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Upcoming</span>
                  </div>
                  <p className="text-xs text-[#2681a6] font-bold mb-3">Scheduled for Nov 12, 2024</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Crucial for protecting the newborn against pertussis (whooping cough).
                  </p>
                </div>
              </div>

              {/* Item 3 - Pending */}
              <div className="relative pl-8 opacity-60">
                <div className="absolute -left-[7px] top-1.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full shadow-sm"></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-500">Hepatitis B</h3>
                    <span className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Pending</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-3">2nd Trimester Window</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Review current immunity levels during next consultation.
                  </p>
                </div>
              </div>

              {/* Item 4 - Pending */}
              <div className="relative pl-8 opacity-60">
                <div className="absolute -left-[7px] top-1.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full shadow-sm"></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-500">RhoGAM Shot</h3>
                    <span className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Pending</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-3">Week 28-30</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Only required for Rh-negative blood type compatibility.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VaccinationSchedulerPage;
