import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ChevronLeft, ChevronRight, CheckCircle2, ChevronDown, Download, Syringe } from 'lucide-react';

const NutritionTrackerPage = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nutrition & Thriposha Tracker</h2>
        <p className="text-gray-500">Nurturing your journey with essential supplements and mindful eating.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thriposha Hero */}
          <div className="bg-[#0f766e] rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Abstract background shapes */}
            <div className="absolute right-0 bottom-0 opacity-20">
               <svg width="200" height="200" viewBox="0 0 200 200">
                 <path fill="currentColor" d="M100,0 C155,0 200,45 200,100 C200,155 155,200 100,200 C45,200 0,155 0,100 C0,45 45,0 100,0 Z M100,20 C55,20 20,55 20,100 C20,145 55,180 100,180 C145,180 180,145 180,100 C180,55 145,20 100,20 Z" />
                 <circle fill="currentColor" cx="100" cy="100" r="40" />
               </svg>
            </div>
            
            <div className="relative z-10 w-3/4">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4 tracking-wider uppercase text-xs">
                â YOU ARE ELIGIBLE
              </Badge>
              <h2 className="text-3xl font-bold mb-3">Thriposha Supplement</h2>
              <p className="text-teal-50 mb-8 leading-relaxed">
                Your health records are up-to-date. Visit your local clinic for the upcoming distribution cycle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                  <p className="text-xs text-teal-200 uppercase tracking-widest mb-1">NEXT DISTRIBUTION</p>
                  <p className="text-xl font-bold">Dec 15, 2024</p>
                </div>
                <button className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-between min-w-[140px]">
                  <div>
                    <p className="text-xs text-teal-200 uppercase tracking-widest mb-1 text-left">REMINDER</p>
                    <p className="text-base font-semibold">Set Alert</p>
                  </div>
                  <ChevronDown className="h-5 w-5 opacity-70" />
                </button>
              </div>
            </div>
          </div>

          {/* Weight Tracking */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mother's Weight Tracking</h3>
                  <p className="text-sm text-gray-500">Monitoring your healthy weight gain progress for a safe pregnancy.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="text-[#0f766e] text-sm font-semibold hover:underline bg-teal-50 px-3 py-1.5 rounded-lg flex items-center">
                    + Log Weight
                  </button>
                  <button className="text-gray-600 text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                    View Details
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50/50 border border-green-100 rounded-xl p-5 flex flex-col justify-center text-center">
                  <p className="text-xs font-semibold text-green-700 tracking-wider uppercase mb-2">CURRENT WEIGHT</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">64.5 <span className="text-lg text-gray-500 font-medium">kg</span></p>
                  <p className="text-xs text-gray-500">Recorded on Nov 28</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">TOTAL GAIN</p>
                      <p className="text-xl font-bold text-gray-900">+6.2 kg</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-[#0369a1] h-2 rounded-full w-3/5"></div>
                  </div>
                  <p className="text-xs text-gray-400 italic">Target Gain: 11 - 16 kg</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">RECENT PROGRESS</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Oct 25</span>
                      <span className="font-semibold">63.1 kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sep 24</span>
                      <span className="font-semibold">61.8 kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Aug 20</span>
                      <span className="font-semibold">60.2 kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  â
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Trimester Advice:<br/>The Golden Midpoint</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  In your 2nd trimester, your baby's growth accelerates. Focus on increasing your daily intake by approximately 340 quality calories.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#0f766e] mr-3 shrink-0" />
                    <span className="text-sm text-gray-700">Prioritize lean protein (chicken, beans, tofu) for tissue repair.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#0f766e] mr-3 shrink-0" />
                    <span className="text-sm text-gray-700">Calcium-rich dairy or fortified milks for developing bones.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#0f766e] mr-3 shrink-0" />
                    <span className="text-sm text-gray-700">Hydration is key â aim for 8-10 glasses of water daily.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6 h-full flex flex-col">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Fuel Your Energy: Iron-Rich Foods</h4>
                
                <div className="grid grid-cols-3 gap-2 flex-grow">
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-2">â</div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">Spinach</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Non-heme Iron</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mb-2">â</div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">Lentils</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Protein + Fiber</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-2">ð</div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">Lean Meat</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Heme Iron</p>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 rounded-lg p-3 flex items-start border border-yellow-100">
                  <span className="text-yellow-600 mr-2 text-lg">💡</span>
                  <p className="text-xs text-yellow-800 leading-snug">Tip: Eat these with Vitamin C (like oranges) to double iron absorption!</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column (1/3) */}
        <div>
          <Card className="bg-white h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Distribution History</h3>
                <button className="h-8 w-8 rounded-full bg-gray-50 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition border border-gray-100">
                   â
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { qty: "2 Packets", date: "Nov 12, 2024", location: "Colombo Central Clinic", status: "COLLECTED" },
                  { qty: "2 Packets", date: "Oct 14, 2024", location: "Colombo Central Clinic", status: "COLLECTED", active: true },
                  { qty: "2 Packets", date: "Sep 10, 2024", location: "Regional Health Office", status: "COLLECTED" },
                ].map((item, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${item.active ? 'border-[#0f766e] bg-teal-50/30' : 'border-gray-100 bg-gray-50/50'} flex justify-between items-center`}>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{item.qty}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${item.active ? 'text-[#0f766e]' : 'text-gray-600'}`}>{item.location}</p>
                      <p className="text-[10px] tracking-wider uppercase font-semibold text-gray-400 mt-1">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NutritionTrackerPage;
