import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, FileText, CheckCircle2, Syringe } from 'lucide-react';

const EMCHCardPage = () => {
  return (
    <div className="space-y-6">
      
      {/* Header Profile */}
      <Card className="overflow-hidden border-none shadow-sm pb-0">
        <CardContent className="p-6 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
              i
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Elena Richardson</h2>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <span className="bg-gray-100 px-2 py-1 rounded">MTH-2024-000123</span>
                <span>Age: 28</span>
                <span>Blood Group: <strong className="text-gray-900">O+</strong></span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
             <p className="text-xs tracking-wider uppercase text-green-700 font-semibold mb-1">EXPECTED DELIVERY DATE</p>
             <p className="text-2xl text-green-800 font-bold">Feb 14, 2025</p>
          </div>
        </CardContent>
      </Card>

      {/* Vitals Row */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Vital Signs & Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">BLOOD PRESSURE (AVG)</p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">119/79</span>
                <span className="ml-2 text-sm text-green-600 font-medium">â Stable</span>
              </div>
              <div className="flex gap-1 h-8 items-end">
                {/* Simulated bar chart */}
                <div className="w-1/3 bg-gray-100 h-4 rounded-sm"></div>
                <div className="w-1/3 bg-gray-200 h-5 rounded-sm"></div>
                <div className="w-1/3 bg-blue-200 h-6 rounded-sm"></div>
                <div className="w-1/3 bg-[#0369a1] h-6 rounded-sm"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">WEIGHT PROGRESS (KG)</p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">65.2</span>
                <span className="ml-2 text-sm text-rose-500 font-medium">~ +2.1kg</span>
              </div>
               <div className="flex gap-1 h-8 items-end">
                <div className="w-1/3 bg-gray-100 h-2 rounded-sm"></div>
                <div className="w-1/3 bg-gray-200 h-4 rounded-sm"></div>
                <div className="w-1/3 bg-green-200 h-6 rounded-sm"></div>
                <div className="w-1/3 bg-[#0f766e] h-8 rounded-sm"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">FETAL HEART RATE (BPM)</p>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">145</span>
                <span className="ml-2 text-sm text-gray-600 font-medium">Healthy Range</span>
              </div>
               <div className="flex gap-1 h-8 items-end">
                <div className="w-1/3 bg-gray-100 h-5 rounded-sm"></div>
                <div className="w-1/3 bg-gray-200 h-5 rounded-sm"></div>
                <div className="w-1/3 bg-blue-200 h-6 rounded-sm"></div>
                <div className="w-1/3 bg-[#0ea5e9] h-5 rounded-sm"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area: Timeline & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Antenatal Timeline */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Antenatal Visit Timeline</h3>
            <Button variant="ghost" className="text-[#0f766e] px-2 text-sm font-semibold">
              + New Visit Record
            </Button>
          </div>
          
          <Card className="bg-white">
            <CardContent className="p-6">
               <div className="relative border-l border-gray-200 ml-3 space-y-10 py-2">
                 
                 {/* Item 1 */}
                 <div className="relative pl-8">
                   <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-[#0369a1] border border-white"></div>
                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-semibold text-[#0369a1] tracking-wider uppercase">VISIT #3 â 24 WEEKS</p>
                        <span className="text-sm text-gray-500">Oct 12, 2024</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Routine Second Trimester Check</h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                          <p className="text-xs text-gray-500 mb-1">BP</p>
                          <p className="font-semibold text-gray-900">120/80</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                          <p className="text-xs text-gray-500 mb-1">Weight</p>
                          <p className="font-semibold text-gray-900">65.2 kg</p>
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
                           <FileText className="h-4 w-4 mr-2" /> Health Education Summary
                         </div>
                         <p className="text-sm text-gray-600 italic">Discussed sleep positioning, breastfeeding initiation benefits, and signs of pre-eclampsia to watch for in the coming weeks.</p>
                      </div>
                   </div>
                 </div>

                 {/* Item 2 */}
                 <div className="relative pl-8">
                   <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-gray-300"></div>
                   <div className="bg-white rounded-xl p-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">VISIT #2 â 20 WEEKS</p>
                        <span className="text-sm text-gray-400">Sep 14, 2024</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Anomaly Scan Review</h4>
                      <div className="flex gap-8">
                        <div><span className="text-xs text-gray-400 mr-2">BP</span><span className="font-medium text-gray-700">118/78</span></div>
                        <div><span className="text-xs text-gray-400 mr-2">Weight</span><span className="font-medium text-gray-700">63.1 kg</span></div>
                        <div><span className="text-xs text-gray-400 mr-2">FHR</span><span className="font-medium text-gray-700">142 bpm</span></div>
                      </div>
                   </div>
                 </div>

               </div>
            </CardContent>
          </Card>

          {/* Lab Reports Section */}
          <div className="mt-8 mb-4 flex items-center">
             <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
               <Syringe className="h-4 w-4" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-gray-900">Laboratory Reports</h3>
               <p className="text-xs text-gray-500">Recent clinical findings and screenings</p>
             </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: "Full Blood Count (FBC)", date: "Oct 05, 2024", id: "#77821", status: "NORMAL" },
              { name: "Glucose Tolerance Test (GTT)", date: "Sep 20, 2024", id: "#76994", status: "PENDING REVIEW" },
              { name: "Anatomy Ultrasound Scan (PDF)", date: "Sep 14, 2024", id: "#RAD-401", status: "COMPLETE" }
            ].map((report, i) => (
              <Card key={i} className="hover:border-blue-200 transition-colors">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex items-center">
                     <div className="p-2 bg-gray-100 rounded text-gray-500 mr-4">
                       <FileText className="h-5 w-5" />
                     </div>
                     <div>
                       <h4 className="font-medium text-gray-900">{report.name}</h4>
                       <p className="text-xs text-gray-500">Completed: {report.date} â Lab ID: {report.id}</p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-2 md:space-x-4">
                     <Badge variant={report.status === 'NORMAL' || report.status === 'COMPLETE' ? 'success' : 'warning'}>
                       {report.status}
                     </Badge>
                     <div className="flex items-center space-x-2">
                       <Button variant="ghost" size="sm" className="text-[#0369a1]">View</Button>
                       <Button variant="outline" size="sm" className="bg-[#0369a1] text-white hover:bg-[#0284c7]">
                         <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Download</span>
                       </Button>
                     </div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-50/50">
            <CardContent className="p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-500" /> Pregnancy History
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600 text-sm font-medium">Live Births</span>
                  <span className="h-6 w-6 rounded-full bg-[#0f766e] text-white flex items-center justify-center text-xs font-bold">1</span>
                </div>
                <div className="bg-white p-3 rounded-lg flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600 text-sm font-medium">Miscarriages</span>
                  <span className="h-6 w-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold">0</span>
                </div>
                <div className="bg-white p-3 rounded-lg flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600 text-sm font-medium">C-Sections</span>
                  <span className="h-6 w-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
            <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center">
               <div className="h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mr-2 text-xs font-bold">i</div>
               Next Appointment
            </h4>
            <p className="text-sm text-blue-800/80 leading-relaxed">
              Your 28-week routine check-up is scheduled for Nov 10, 2024 at 10:00 AM.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EMCHCardPage;