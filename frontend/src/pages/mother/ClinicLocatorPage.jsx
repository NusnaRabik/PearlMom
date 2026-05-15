import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { InputField } from '../../components/ui/InputField';
import { Badge } from '../../components/ui/Badge';
import { Search, MapPin, Navigation, Phone, Heart, Plus, Minus, Target } from 'lucide-react';

const ClinicLocatorPage = () => {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 md:min-w-[320px] md:max-w-[400px] border-b md:border-r border-gray-200 flex flex-col bg-gray-50/50 flex-1 md:flex-none">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clinic names or locations..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 transition-all text-sm outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Nearby Facilities</h3>
          
          <Card className="border-[#0f766e]/20 shadow-sm relative hover:border-[#0f766e] transition-colors cursor-pointer">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900 text-lg">Lanka Maternity Hospital</h4>
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-sm text-gray-500 mb-4">2.4 km away â Colombo 07</p>
              
              <div className="flex space-x-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><span className="text-xs font-bold">i</span></div>
                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Navigation className="h-4 w-4" /></div>
                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><span className="text-xs font-bold">bp</span></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> +94 11 234 5678
                </p>
                <button className="bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-[#0c5c56] transition-colors">
                  <Navigation className="h-4 w-4 mr-2" /> Get Directions
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-gray-300 transition-colors cursor-pointer">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900 text-lg">Serene Care Clinic</h4>
                <Heart className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-4">3.8 km away â Dehiwala</p>
              
              <div className="flex space-x-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><span className="text-xs font-bold">w</span></div>
                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><span className="text-xs font-bold">i</span></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> +94 11 234 5679
                </p>
                <button className="bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-[#0c5c56] transition-colors">
                  <Navigation className="h-4 w-4 mr-2" /> Get Directions
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-gray-300 transition-colors cursor-pointer">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900 text-lg">City Wellness Hub</h4>
                <Heart className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-4">5.1 km away â Rajagiriya</p>
              
              <div className="flex space-x-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Navigation className="h-4 w-4" /></div>
                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><span className="text-xs font-bold">bp</span></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> +94 11 234 5680
                </p>
                <button className="bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-[#0c5c56] transition-colors">
                  <Navigation className="h-4 w-4 mr-2" /> Get Directions
                </button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Map View Placeholder */}
      <div className="flex-1 relative bg-blue-50">
        <div className="absolute inset-0 opacity-50 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')" }}></div>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <div className="h-16 w-16 bg-[#0f766e] text-white rounded-full flex items-center justify-center shadow-lg animate-bounce relative z-10 pointer-events-auto">
             <MapPin className="h-8 w-8" />
             <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center text-[#0f766e]">
               <Target className="h-4 w-4" />
             </div>
          </div>
          <p className="mt-4 text-xl font-bold text-gray-800 drop-shadow-md pb-16">Interactive Map Loading...</p>
        </div>

        {/* Map UI Overlays */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg w-80">
           <div className="flex items-center mb-2">
             <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
             <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">LIVE TRAFFIC STATUS</p>
           </div>
           <p className="text-sm text-gray-700">Clear routes to most facilities in Colombo 07. Estimated travel time to nearest ER: 8 mins.</p>
        </div>

        <div className="absolute right-4 bottom-8 flex flex-col space-y-2">
           <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-[#0f766e] hover:bg-gray-50 transition-colors pointer-events-auto">
             <Plus className="h-5 w-5" />
           </button>
           <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-[#0f766e] hover:bg-gray-50 transition-colors pointer-events-auto">
             <Minus className="h-5 w-5" />
           </button>
           <button className="h-12 w-12 mt-4 bg-[#0f766e] rounded-full flex items-center justify-center shadow-lg text-white hover:bg-[#0c5c56] transition-colors pointer-events-auto">
             <Target className="h-6 w-6" />
           </button>
        </div>
      </div>

    </div>
  );
};

export default ClinicLocatorPage;
