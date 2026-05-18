import React from 'react';
import { MapPin } from 'lucide-react';

export const FacilityMap = ({ facilities = [] }) => {
  return (
    <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-xl relative flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')" }}
      ></div>
      <div className="relative z-10 flex flex-col items-center text-gray-600 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
        <MapPin className="h-10 w-10 mb-2 text-[#0f766e]" />
        <p className="font-bold text-gray-900">Map View Available</p>
        <p className="text-sm text-center">Ready to display {facilities.length || 'nearby'} locations</p>
      </div>
    </div>
  );
};