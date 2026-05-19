import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  Phone, 
  Navigation, 
  PersonStanding, 
  Droplets, 
  Bed, 
  Plus, 
  Minus, 
  LocateFixed
} from 'lucide-react';

const FacilityCard = ({ name, distance, location, phone, isFavorite }) => (
  <div className="bg-white rounded-[2rem] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] mb-4 border border-gray-100 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-bold text-[#1a6685] text-lg">{name}</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{distance} • {location}</p>
      </div>
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#ef4444] text-[#ef4444]' : 'fill-[#cbd5e1] text-[#cbd5e1]'} cursor-pointer transition-colors shrink-0 mt-1`} />
    </div>
    
    <div className="flex gap-2 mb-6 mt-4">
      <div className="bg-[#f0f9ff] p-1.5 rounded-lg text-[#0ea5e9]">
        <PersonStanding className="w-3.5 h-3.5" />
      </div>
      <div className="bg-[#f0f9ff] p-1.5 rounded-lg text-[#0ea5e9]">
        <Droplets className="w-3.5 h-3.5" />
      </div>
      <div className="bg-[#f0f9ff] p-1.5 rounded-lg text-[#0ea5e9]">
        <Bed className="w-3.5 h-3.5" />
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[#1a6685] text-xs font-bold">
        <Phone className="w-3.5 h-3.5" />
        {phone}
      </div>
      <button className="bg-[#1a6685] hover:bg-[#165a78] text-white text-[11px] font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm">
        <Navigation className="w-3 h-3" /> Get Directions
      </button>
    </div>
  </div>
);

const ClinicLocatorPage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Top Search Bar Area */}
      <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100 shrink-0 z-10">
        <div className="relative w-full max-w-[600px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search clinic names or locations..." 
            className="w-full bg-[#f3f4f6] border-none rounded-full pl-11 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a6685]/20 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Nearby Facilities */}
        <div className="w-[450px] bg-[#fbfbfd] p-8 overflow-y-auto border-r border-gray-200 shrink-0 z-10 hidden md:block">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Nearby Facilities</h2>
          
          <div className="space-y-4 pb-10">
            <FacilityCard 
              name="Lanka Maternity Hospital"
              distance="2.4 km away"
              location="Colombo 07"
              phone="+94 11 234 5678"
              isFavorite={true}
            />
            <FacilityCard 
              name="Serene Care Clinic"
              distance="3.8 km away"
              location="Dehiwala"
              phone="+94 11 234 5679"
              isFavorite={false}
            />
            <FacilityCard 
              name="City Wellness Hub"
              distance="5.1 km away"
              location="Rajagiriya"
              phone="+94 11 234 5680"
              isFavorite={false}
            />
          </div>
        </div>

        {/* Right Panel: Map Area */}
        <div className="flex-1 relative bg-[#bae6fd]">
          {/* Map Image Placeholder */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
             {/* Using a subtle map-like background */}
             <div 
                className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] opacity-40 mix-blend-multiply" 
                style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l.83.83v58.34h-58.34l.83-.83h56.68v-56.68h.83zM27 49c-11.046 0-20-8.954-20-20 0-3.328.814-6.467 2.257-9.257l2.829 2.829c-1.077 2.05-1.686 4.382-1.686 6.828 0 7.732 6.268 14 14 14s14-6.268 14-14c0-2.446-.609-4.778-1.686-6.828l2.829-2.829c1.443 2.79 2.257 5.929 2.257 9.257 0 11.046-8.954 20-20 20zM36.172 23.828l-2.829-2.829c.652-1.282 1.018-2.73 1.018-4.249 0-5.523-4.477-10-10-10s-10 4.477-10 10c0 1.52.366 2.967 1.018 4.249l-2.829 2.829c-1.03-1.954-1.615-4.186-1.615-6.528 0-7.732 6.268-14 14-14s14 6.268 14 14c0 2.342-.585 4.574-1.615 6.528z\\' fill=\\'%230ea5e9\\' fill-opacity=\\'0.2\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')",
                  backgroundSize: "60px 60px"
                }}
             ></div>
          </div>

          {/* Map Markers Simulation */}
          <div className="absolute top-[40%] left-[30%] z-10">
             <div className="bg-[#1a6685] p-2 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
               <Plus className="w-4 h-4 text-white" />
             </div>
             <div className="bg-white px-3 py-1 rounded-full shadow border border-gray-100 absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-700">
               Lanka Maternity
             </div>
          </div>
          <div className="absolute top-[55%] left-[20%] z-10">
             <div className="bg-[#15803d] p-2 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
               <Bed className="w-4 h-4 text-white" />
             </div>
             <div className="bg-white px-3 py-1 rounded-full shadow border border-gray-100 absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-700">
               Serene Care
             </div>
          </div>
          <div className="absolute top-[48%] left-[45%] z-10">
             <div className="bg-[#15803d] p-2 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
               <Bed className="w-4 h-4 text-white" />
             </div>
          </div>

          {/* Live Traffic Status Widget */}
          <div className="absolute top-6 right-6 w-80 bg-white/95 backdrop-blur rounded-[2rem] p-6 shadow-xl border border-white z-20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Traffic Status</span>
            </div>
            <p className="text-sm font-medium text-[#1a6685] leading-relaxed">
              Clear routes to most facilities in Colombo 07. Estimated travel time to nearest ER: <span className="font-bold">8 mins.</span>
            </p>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-10 right-6 flex flex-col gap-2 z-20">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
              <button className="p-3 hover:bg-slate-50 border-b border-gray-100 transition-colors group">
                <Plus className="w-5 h-5 text-slate-500 group-hover:text-[#1a6685]" />
              </button>
              <button className="p-3 hover:bg-slate-50 transition-colors group">
                <Minus className="w-5 h-5 text-slate-500 group-hover:text-[#1a6685]" />
              </button>
            </div>
            <button className="bg-[#1a6685] p-3 rounded-full shadow-lg border border-transparent hover:bg-[#165a78] transition-colors mt-2">
              <LocateFixed className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClinicLocatorPage;
