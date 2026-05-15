import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Phone, MapPin, Calendar, FileText, Syringe, ChevronRight, Video, Droplet, Apple, FileCheck, CheckCircle2 } from 'lucide-react';

const MotherDashboard = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Widget */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c5c56] to-[#14998d] text-white p-8">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-4 border-white/10 opacity-50"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4">
                  <span className="mr-1">â¥</span> 3rd Trimester
                </Badge>
                <h2 className="text-4xl font-bold mb-2">Week 28 of 40</h2>
                <p className="text-white/80 max-w-sm mb-6 leading-relaxed">
                  Your baby is the size of a large eggplant. 84 days until your journey begins!
                </p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Status</p>
                    <p className="font-semibold flex items-center">
                      <span className="h-2 w-2 rounded-full bg-[#86efac] mr-2"></span> Low Risk
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">EDD</p>
                    <p className="font-semibold">Feb 14, 2025</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 relative">
                <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center">
                   {/* Simulate partial circle with CSS or SVG - using simple text for now */}
                   <span className="text-3xl font-bold">70%</span>
                </div>
                <p className="text-center text-xs text-white/70 mt-2 uppercase tracking-wide">Progress</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:border-[#0f766e]/30 cursor-pointer transition-all">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0369a1]">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">View E-MCH Card</h4>
                  <p className="text-xs text-gray-500">Digital health ID</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-[#0f766e]/30 cursor-pointer transition-all">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#0f766e]">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Book Appointment</h4>
                  <p className="text-xs text-gray-500">Schedule a checkup</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-[#0f766e]/30 cursor-pointer transition-all">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Syringe className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Vaccination Schedule</h4>
                  <p className="text-xs text-gray-500">View all doses</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timely Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                   <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                     <Calendar className="h-5 w-5" />
                   </div>
                   <Badge variant="primary">CONFIRMED</Badge>
                 </div>
                 <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">NEXT APPOINTMENT</p>
                 <h4 className="text-xl font-bold text-gray-900 mb-1">Nov 24, 10:30 AM</h4>
                 <p className="text-sm text-gray-600">Consultation with <span className="font-medium text-[#0f766e]">Dr. Perera</span></p>
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

          {/* More Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-500">LAST CLINIC VISIT</h4>
                  <span className="text-xs text-gray-400">Oct 28</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                  "Patient shows normal weight gain. Fetal heartbeat stable at 145 bpm. Iron supplements continued."
                </p>
                <button className="text-sm font-medium text-[#0f766e] flex items-center hover:underline">
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
                </div>
                <button className="w-full mt-4 py-2 border border-blue-100 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  DOWNLOAD BLOOD REPORT
                </button>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          {/* Emergency Actions */}
          <div>
            <h3 className="text-lg font-bold text-red-600 flex items-center mb-4">
              <span className="text-xl mr-2">â</span> Emergency Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full rounded-xl bg-red-600 p-4 text-white flex items-center shadow-sm hover:bg-red-700 transition">
                <div className="bg-red-500/50 p-2 rounded-lg mr-4">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-lg">Call Midwife</p>
                  <p className="text-xs text-white/80">24/7 Available</p>
                </div>
              </button>
              <button className="w-full rounded-xl bg-gray-100 p-4 text-gray-900 flex items-center hover:bg-gray-200 transition">
                <div className="bg-white p-2 rounded-lg mr-4 text-gray-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold">Find Hospital</p>
                  <p className="text-xs text-gray-500">Nearest: 1.2km</p>
                </div>
              </button>
            </div>
          </div>

          {/* Alerts & Tips */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Alerts & Tips</h3>
                <button className="text-xs font-medium text-blue-600 hover:underline">MARK ALL READ</button>
              </div>
              <div className="space-y-6">
                
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Clinic Schedule Update</p>
                    <p className="text-sm text-gray-600 mt-1 leading-snug">The Friday clinic will now start at 8:00 AM instead of 9:00 AM.</p>
                    <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
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
                    <p className="text-xs text-gray-400 mt-2">Yesterday</p>
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
                    <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                  </div>
                </div>

              </div>
              <button className="w-full mt-6 flex justify-center items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                View All Notifications <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </CardContent>
          </Card>

          {/* Video Guide widget */}
          <div className="rounded-2xl overflow-hidden relative group cursor-pointer h-48 bg-gradient-to-br from-blue-900 to-teal-800">
            {/* Using a placeholder for the image map */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555252117-426bf85fc585?auto=format&fit=crop&q=80')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-white/20 text-white border-none mb-2 backdrop-blur-sm tracking-wider uppercase text-[10px]">VIDEO GUIDE</Badge>
              <h3 className="font-bold text-white text-lg leading-tight group-hover:text-teal-200 transition-colors">Gentle Stretching for 3rd Trimester</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                 <Video className="h-6 w-6 text-white" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MotherDashboard;
