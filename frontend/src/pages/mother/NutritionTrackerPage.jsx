import React from 'react';
import { 
  CheckCircle, 
  Bell, 
  History, 
  Plus, 
  TrendingUp, 
  Utensils, 
  Lightbulb, 
  Leaf,
  Beef,
  CircleDot
} from 'lucide-react';

const NutritionTrackerPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 font-sans min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Nutrition & Thriposha Tracker</h1>
          <p className="text-slate-500 mt-1 text-lg">Nurturing your journey with essential supplements and mindful eating.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Thriposha Supplement Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2681a6] to-[#1e6b8c] p-8 shadow-md">
          {/* Decorative shapes */}
          <div className="absolute -right-20 -bottom-20 opacity-20 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" d="M45.7,-76.4C58.9,-69.1,69.1,-55.5,77.7,-41.3C86.3,-27.1,93.4,-12.3,91.8,1.7C90.2,15.7,79.9,28.8,70.1,40.9C60.3,53,51,64.1,39.2,71.5C27.4,78.9,13.7,82.6,-0.4,83.2C-14.5,83.8,-29,81.3,-41.2,74.1C-53.4,66.9,-63.3,55,-71.4,41.9C-79.5,28.8,-85.8,14.4,-86.3,-0.3C-86.8,-15,-81.5,-29.9,-73.2,-42.6C-64.9,-55.3,-53.6,-65.8,-40.5,-73.1C-27.4,-80.4,-13.7,-84.5,0.8,-85.8C15.3,-87.1,32.5,-83.7,45.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="absolute right-10 bottom-0 opacity-20 pointer-events-none">
             <svg width="250" height="250" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" d="M42.7,-73.4C55.9,-66.1,66.1,-52.5,74.7,-38.3C83.3,-24.1,90.4,-9.3,88.8,4.7C87.2,18.7,76.9,31.8,67.1,43.9C57.3,56,48,67.1,36.2,74.5C24.4,81.9,10.7,85.6,-3.4,86.2C-17.5,86.8,-32,84.3,-44.2,77.1C-56.4,69.9,-66.3,58,-74.4,44.9C-82.5,31.8,-88.8,17.4,-89.3,2.7C-89.8,-12,-84.5,-26.9,-76.2,-39.6C-67.9,-52.3,-56.6,-62.8,-43.5,-70.1C-30.4,-77.4,-16.7,-81.5,-2.2,-82.8C12.3,-84.1,29.5,-80.7,42.7,-73.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center bg-white/20 text-white backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
              <CheckCircle className="w-4 h-4 mr-2" /> You are eligible
            </div>
            
            <h2 className="text-white text-4xl font-bold mt-6">Thriposha Supplement</h2>
            <p className="text-white/90 mt-3 text-lg max-w-md leading-relaxed">
              Your health records are up-to-date. Visit your local clinic for the upcoming distribution cycle.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-5 min-w-[160px]">
                <div className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Next Distribution</div>
                <div className="text-2xl font-bold text-white mt-1">Dec 15, 2024</div>
              </div>
              
              <button className="bg-[#429bbd]/60 hover:bg-[#429bbd]/80 backdrop-blur-md border border-white/20 rounded-[1.5rem] p-5 min-w-[160px] flex flex-col justify-center transition-colors text-left group">
                <div className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Reminder</div>
                <div className="text-xl font-bold text-white mt-1 flex items-center">
                  Set Alert 
                  <Bell className="w-5 h-5 ml-2 transition-transform group-hover:rotate-12" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Distribution History */}
        <div className="bg-[#f8f9fa] rounded-[2rem] p-8 border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Distribution History</h3>
            <History className="text-[#2681a6] w-5 h-5" />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm">2 Packets</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Nov 12, 2024</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#2681a6]">Colombo Central Clinic</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Collected</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-[#2681a6] border-y border-r border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm">2 Packets</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Oct 14, 2024</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#2681a6]">Colombo Central Clinic</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Collected</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm">2 Packets</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Sep 10, 2024</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#2681a6]">Regional Health Office</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Collected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mother's Weight Tracking */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Mother's Weight Tracking</h2>
              <p className="text-slate-500 text-sm mt-1">Monitoring your healthy weight gain progress for a safe pregnancy.</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button className="flex items-center justify-center bg-[#e5f5fb] text-[#2681a6] hover:bg-[#d6eff8] font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Log Weight
              </button>
              <button className="flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">
                View Details
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Weight */}
            <div className="bg-[#eafdf3] border border-[#d1fae5] rounded-[1.5rem] p-6 flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-[11px] font-bold text-[#059669] uppercase tracking-widest mb-2">Current Weight</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-800">64.5</span>
                  <span className="text-lg font-semibold text-slate-500">kg</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-3">Recorded on Nov 28</div>
              </div>
            </div>

            {/* Total Gain */}
            <div className="bg-[#f8f9fa] rounded-[1.5rem] p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#e5f5fb] p-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4 text-[#2681a6]" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total Gain</div>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-4">+6.2 kg</div>
              
              <div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div className="bg-[#2681a6] h-2 rounded-full w-[60%]"></div>
                </div>
                <div className="text-xs text-slate-400 font-medium italic text-right">Target Gain: 11-16 kg</div>
              </div>
            </div>

            {/* Recent Progress */}
            <div className="bg-[#f8f9fa] rounded-[1.5rem] p-6">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Progress</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Oct 25</span>
                  <span className="text-sm font-bold text-slate-800">63.1 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Sep 24</span>
                  <span className="text-sm font-bold text-slate-800">61.8 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Aug 20</span>
                  <span className="text-sm font-bold text-slate-800">60.2 kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trimester Advice */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden flex flex-col justify-center">
          {/* Subtle background graphic */}
          <div className="absolute top-0 right-8 opacity-[0.03] pointer-events-none">
             <Utensils className="w-48 h-48 text-slate-900" />
          </div>
          
          <div className="relative z-10">
            <div className="bg-[#a6f4c5] w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Leaf className="w-6 h-6 text-[#059669]" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Trimester Advice: The Golden Midpoint</h3>
            <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-xl">
              In your 2nd trimester, your baby's growth accelerates. Focus on increasing your daily intake by approximately 340 quality calories.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#059669] mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-slate-700 font-medium"><span className="font-bold">Prioritize lean protein</span> (chicken, beans, tofu) for tissue repair.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#059669] mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-slate-700 font-medium"><span className="font-bold">Calcium-rich</span> dairy or fortified milks for developing bones.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#059669] mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-slate-700 font-medium"><span className="font-bold">Hydration is key</span> — aim for 8-10 glasses of water daily.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Iron-Rich Foods */}
        <div className="bg-[#f8f9fa] rounded-[2rem] p-8 border border-gray-100/50">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Fuel Your Energy: Iron-Rich Foods</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-100 text-center col-span-1">
              <div className="bg-[#eafdf3] w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5 text-[#059669]" />
              </div>
              <div className="font-bold text-slate-800 text-sm">Spinach</div>
              <div className="text-[9px] text-slate-400 font-medium mt-1 uppercase">Non-heme Iron</div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-100 text-center col-span-1">
              <div className="bg-[#fef3c7] w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <CircleDot className="w-5 h-5 text-[#d97706]" />
              </div>
              <div className="font-bold text-slate-800 text-sm">Lentils</div>
              <div className="text-[9px] text-slate-400 font-medium mt-1 uppercase">Protein + Fiber</div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-gray-100 text-center col-span-2">
              <div className="bg-[#fee2e2] w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <Beef className="w-5 h-5 text-[#dc2626]" />
              </div>
              <div className="font-bold text-slate-800 text-sm">Lean Meat</div>
              <div className="text-[9px] text-slate-400 font-medium mt-1 uppercase">Heme Iron</div>
            </div>
          </div>
          
          <div className="bg-[#fef08a] rounded-xl p-4 flex items-start gap-3 mt-auto">
            <Lightbulb className="w-5 h-5 text-[#ca8a04] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#854d0e] font-semibold leading-relaxed">
              Tip: Eat these with Vitamin C (like oranges) to double iron absorption!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NutritionTrackerPage;
