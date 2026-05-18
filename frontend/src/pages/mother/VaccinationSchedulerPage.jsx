import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Download, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const VaccinationSchedulerPage = () => {
  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vaccination & Care</h2>
        <p className="text-gray-500">Manage your pregnancy milestones and upcoming pediatric appointments in one serene space.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Calendar View Custom UI */}
          <Card className="bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center"><Calendar className="mr-3 h-6 w-6 text-[#0f766e]" /> November 2024</h3>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                  <div key={day} className="text-[10px] font-bold text-gray-400 tracking-widest">{day}</div>
                ))}
              </div>

              {/* Hardcoded dates for visual likeness to image 2 */}
              <div className="grid grid-cols-7 gap-2">
                <div className="aspect-square p-2 border border-transparent text-gray-300 flex flex-col items-center justify-center text-lg">27</div>
                <div className="aspect-square p-2 border border-transparent text-gray-300 flex flex-col items-center justify-center text-lg">28</div>
                <div className="aspect-square p-2 border border-transparent text-gray-300 flex flex-col items-center justify-center text-lg">29</div>
                <div className="aspect-square p-2 border border-transparent text-gray-300 flex flex-col items-center justify-center text-lg">30</div>
                <div className="aspect-square p-2 border border-transparent text-gray-300 flex flex-col items-center justify-center text-lg">31</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">1</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">2</div>
                
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">
                  <span>3</span><span className="h-1.5 w-1.5 rounded-full bg-[#0f766e] mt-1"></span>
                </div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">4</div>
                <div className="aspect-square p-2 border-transparent rounded-xl bg-[#0369a1] text-white font-bold flex flex-col items-center justify-center text-lg shadow-md hover:bg-[#0284c7]">5</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">6</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">
                  <span>7</span><span className="h-1.5 w-1.5 rounded-full bg-[#0369a1] mt-1"></span>
                </div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">8</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">9</div>
                
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">10</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">11</div>
                <div className="aspect-square p-2 border-2 border-[#86efac] rounded-xl flex flex-col items-center justify-center text-lg font-bold bg-[#f0fdf4] text-green-800">12</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">13</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">14</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">15</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">16</div>
                
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">17</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">18</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">19</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">20</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">21</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">22</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">23</div>
                
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">24</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">25</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">26</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">27</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">28</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">29</div>
                <div className="aspect-square p-2 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-lg hover:bg-gray-100">30</div>
                
                <div className="aspect-square p-2 border border-transparent text-gray-300 flex flex-col items-center justify-center text-lg">1</div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-6 text-sm text-gray-500 font-medium">
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-[#86efac] mr-2"></span> Vaccination</span>
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-[#0369a1] mr-2"></span> Routine Checkup</span>
              </div>
            </CardContent>
          </Card>

          {/* Appointment History */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Appointment History</h3>
              <button className="text-sm font-semibold text-[#0f766e] flex items-center hover:underline">
                 Download All Records <Download className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-200">
                    <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">DATE</th>
                    <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">CLINIC</th>
                    <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">TYPE</th>
                    <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">SPECIALIST</th>
                    <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">OUTCOME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">Oct<br/>24,<br/>2024</td>
                    <td className="py-4 px-4 text-gray-600">St.<br/>Mary's<br/>Women's<br/>Center</td>
                    <td className="py-4 px-4"><Badge className="bg-sky-100 text-sky-800 border-none rounded-md px-3 py-1">Routine<br/>Checkup</Badge></td>
                    <td className="py-4 px-4 text-gray-700">Dr. Sarah<br/>Chen</td>
                    <td className="py-4 px-4 text-gray-900 font-medium flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#0f766e] mr-2 inline-block"></span>All<br/>parameters<br/>normal</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">Sep<br/>30,<br/>2024</td>
                    <td className="py-4 px-4 text-gray-600">Pearl<br/>Health<br/>Riverside</td>
                    <td className="py-4 px-4"><Badge variant="default" className="rounded-md">Lab Test</Badge></td>
                    <td className="py-4 px-4 text-gray-700">Lab Tech J.<br/>Doe</td>
                    <td className="py-4 px-4 text-gray-900 font-medium flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#0f766e] mr-2 inline-block"></span>Glucose<br/>screen<br/>passed</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <td className="py-4 px-4 font-bold text-gray-900">Aug<br/>15,<br/>2024</td>
                    <td className="py-4 px-4 text-gray-600">St.<br/>Mary's<br/>Women's<br/>Center</td>
                    <td className="py-4 px-4"><Badge className="bg-sky-100 text-sky-800 border-none rounded-md px-3 py-1">Ultrasound</Badge></td>
                    <td className="py-4 px-4 text-gray-700">Dr. Sarah<br/>Chen</td>
                    <td className="py-4 px-4 text-gray-900 font-medium flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#0f766e] mr-2 inline-block"></span>Healthy<br/>development</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 bg-[#fef08a]/60 rounded-xl p-6 border border-yellow-200/50 flex">
               <div className="mr-4">
                 <div className="h-10 w-10 bg-yellow-200/50 rounded-full flex items-center justify-center text-yellow-700">
                   â¡
                 </div>
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 mb-1">Immunization Tip</h4>
                 <p className="text-gray-700 text-sm leading-relaxed">Vaccines during pregnancy provide early protection for your baby that lasts for several months after birth.</p>
               </div>
            </div>
          </div>
          
        </div>

        {/* Right Column (1/3) */}
        <div>
          <Card className="h-full bg-white relative overflow-hidden">
             <div className="p-6 pb-2 border-b border-gray-100 flex justify-between items-center relative z-10 bg-white">
               <h3 className="text-lg font-bold text-[#0f766e]">Vaccination<br/>Track</h3>
               <Badge className="bg-[#0f766e] text-white hover:bg-[#0c5c56] border-none px-3 py-1 text-[10px] uppercase font-bold tracking-wider">GROWTH PHASE</Badge>
             </div>
             
             <CardContent className="p-6 pt-4 relative z-10">
                <div className="relative border-l border-gray-200 ml-3 space-y-10 py-4">
                  
                  {/* Item 1 */}
                  <div className="relative pl-8">
                    <div className="absolute left-[-12px] top-0 h-6 w-6 rounded-full bg-[#0f766e] text-white flex items-center justify-center"><CheckCircle2 className="h-4 w-4" /></div>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-bold text-gray-900 text-base">Influenza<br/>(Annual)</h4>
                         <p className="text-xs text-gray-500 mt-1">Administered Oct 12, 2024</p>
                       </div>
                       <Badge variant="default" className="text-[10px] tracking-wider font-bold">COMPLETED</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">Standard seasonal protection for expectant mothers. No side effects reported.</p>
                  </div>

                  {/* Item 2 */}
                  <div className="relative pl-8">
                    <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-blue-400 border border-white"></div>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-bold text-gray-900 text-base">Tdap Booster</h4>
                         <p className="text-xs text-[#0369a1] font-medium mt-1">Scheduled for Nov 12, 2024</p>
                       </div>
                       <Badge className="bg-sky-100 text-sky-800 text-[10px] tracking-wider font-bold border-none">UPCOMING</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">Crucial for protecting the newborn against pertussis (whooping cough).</p>
                  </div>

                  {/* Item 3 */}
                  <div className="relative pl-8 opacity-60">
                    <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-gray-200 border-2 border-white"></div>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-bold text-gray-500 text-base">Hepatitis B</h4>
                         <p className="text-xs text-gray-400 italic mt-1">2nd Trimester Window</p>
                       </div>
                       <Badge variant="default" className="bg-gray-100 text-gray-400 border-none text-[10px] tracking-wider font-bold">PENDING</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">Review current immunity levels during next consultation.</p>
                  </div>

                  {/* Item 4 */}
                  <div className="relative pl-8 opacity-60">
                    <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-gray-200 border-2 border-white"></div>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-bold text-gray-500 text-base">RhoGAM Shot</h4>
                         <p className="text-xs text-gray-400 italic mt-1">Week 28-30</p>
                       </div>
                       <Badge variant="default" className="bg-gray-100 text-gray-400 border-none text-[10px] tracking-wider font-bold">PENDING</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">Only required for Rh-negative blood type compatibility.</p>
                  </div>

                </div>
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default VaccinationSchedulerPage;