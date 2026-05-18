import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, Calendar, Bell, TrendingUp, Package, MapPin, Award, Leaf, Droplets, Sun } from 'lucide-react';

const NutritionTrackerPage = () => {
  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nutrition & Thriposha Tracker</h2>
        <p className="text-gray-500">Nurturing your journey with essential supplements and mindful eating.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thriposha Hero - Softer Pink */}
          <div className="bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl p-8 text-white relative overflow-hidden shadow-sm">
            {/* Decorative background */}
            <div className="absolute right-0 bottom-0 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle fill="currentColor" cx="150" cy="150" r="100" />
                <circle fill="currentColor" cx="100" cy="100" r="60" />
              </svg>
            </div>
            <div className="absolute top-4 right-8 opacity-10">
              <Package size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                {/* Larger Green Eligibility Badge */}
                <Badge className="bg-green-500 text-white hover:bg-green-400 border-none tracking-wide uppercase text-sm font-bold px-5 py-2 shadow-md">
                  ✅ You Are Eligible
                </Badge>
                <Badge className="bg-white/20 text-white border-none tracking-wide uppercase text-xs px-3 py-1.5">
                  Active Program
                </Badge>
              </div>
              
              <h2 className="text-3xl font-bold mb-3">Thriposha Supplement Program</h2>
              <p className="text-rose-50 mb-8 leading-relaxed max-w-lg">
                You qualify for the government-sponsored Thriposha nutritional supplement program. Your health records are verified and up-to-date.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/15 rounded-xl px-5 py-4 backdrop-blur-sm border border-white/20 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-rose-100" />
                    <p className="text-xs text-rose-100 uppercase tracking-widest">Next Distribution</p>
                  </div>
                  <p className="text-2xl font-bold">Dec 15, 2024</p>
                  <p className="text-xs text-rose-100 mt-1">Colombo Central Clinic</p>
                </div>
                
                <div className="bg-white/15 rounded-xl px-5 py-4 backdrop-blur-sm border border-white/20 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-rose-100" />
                    <p className="text-xs text-rose-100 uppercase tracking-widest">Eligible Quantity</p>
                  </div>
                  <p className="text-2xl font-bold">2 Packets</p>
                  <p className="text-xs text-rose-100 mt-1">Per distribution cycle</p>
                </div>
                
                <button className="bg-white text-rose-500 rounded-xl px-5 py-4 font-semibold hover:bg-rose-50 transition-colors flex items-center justify-center space-x-2 flex-1">
                  <Bell className="h-5 w-5" />
                  <span>Set Reminder</span>
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 flex flex-col justify-center text-center">
                  <p className="text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">Current Weight</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">64.5 <span className="text-lg text-gray-500 font-medium">kg</span></p>
                  <p className="text-xs text-gray-500">Recorded on Nov 28</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mr-3">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Total Gain</p>
                      <p className="text-xl font-bold text-gray-900">+6.2 kg</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-rose-400 h-2 rounded-full w-3/5"></div>
                  </div>
                  <p className="text-xs text-gray-400 italic">Target Gain: 11 - 16 kg</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">Recent Progress</p>
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

          {/* Tips Section - Full Width & Equal Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trimester Advice */}
            <Card className="bg-white h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Trimester Advice: The Golden Midpoint</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  In your 2nd trimester, your baby's growth accelerates. Focus on increasing your daily intake by approximately 340 quality calories.
                </p>
                <ul className="space-y-4 flex-grow">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Prioritize lean protein (chicken, beans, tofu) for tissue repair.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Calcium-rich dairy or fortified milks for developing bones.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Hydration is key - aim for 8-10 glasses of water daily.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Essential Nutrition Tips */}
            <Card className="bg-white h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Essential Nutrition Tips</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Key nutritional guidelines to support your health and your baby's development throughout pregnancy.
                </p>
                
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Stay Hydrated</p>
                      <p className="text-xs text-gray-600 mt-0.5">Drink 8-10 glasses of water daily. Proper hydration helps prevent UTIs and maintains amniotic fluid levels.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Vitamin D Intake</p>
                      <p className="text-xs text-gray-600 mt-0.5">Get 15-20 minutes of morning sunlight and consume vitamin D-rich foods like eggs and fortified milk.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Iron-Rich Foods</p>
                      <p className="text-xs text-gray-600 mt-0.5">Combine iron sources (spinach, lean meat) with vitamin C (oranges, tomatoes) for better absorption.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 rounded-lg p-3 flex items-start border border-yellow-200">
                  <span className="text-yellow-600 mr-2 text-lg">💡</span>
                  <p className="text-xs text-yellow-800 leading-snug">Tip: Eat iron-rich foods with Vitamin C (like oranges) to double iron absorption!</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column - Distribution History */}
        <div>
          <Card className="bg-white h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Distribution History</h3>
                <Badge className="bg-rose-100 text-rose-700 border-none">3 Records</Badge>
              </div>

              <div className="space-y-4">
                {[
                  { qty: "2 Packets", date: "Nov 12, 2024", location: "Colombo Central Clinic", status: "COLLECTED" },
                  { qty: "2 Packets", date: "Oct 14, 2024", location: "Colombo Central Clinic", status: "COLLECTED", active: true },
                  { qty: "2 Packets", date: "Sep 10, 2024", location: "Regional Health Office", status: "COLLECTED" },
                ].map((item, i) => (
                  <div key={i} className={`rounded-xl p-4 border flex justify-between items-center transition-all ${
                    item.active 
                      ? 'border-rose-300 bg-rose-50 ring-1 ring-rose-200' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{item.qty}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <p className={`text-sm ${item.active ? 'text-rose-700 font-medium' : 'text-gray-600'}`}>
                          {item.location}
                        </p>
                      </div>
                      <span className={`text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full ${
                        item.active 
                          ? 'bg-rose-200 text-rose-800' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eligibility Reminder */}
              <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900 text-sm">Eligibility Status</h4>
                </div>
                <p className="text-xs text-green-700 leading-relaxed">
                  You are currently eligible for 2 packets per distribution cycle. Next eligibility review: <strong>Jan 2025</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NutritionTrackerPage;