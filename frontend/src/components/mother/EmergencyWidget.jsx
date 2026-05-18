import React from 'react';
import { Phone, MapPin } from 'lucide-react';

export const EmergencyWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
      <h3 className="text-lg font-bold text-red-600 flex items-center mb-4">
        <span className="text-xl mr-2">🚨</span> Emergency Contacts
      </h3>
      <div className="space-y-3">
        <button className="w-full rounded-xl bg-red-600 p-4 text-white flex items-center shadow-sm hover:bg-red-700 transition">
          <div className="bg-red-500/50 p-2 rounded-lg mr-4">
            <Phone className="h-6 w-6" />
          </div>
          <div className="text-left flex-1">
            <p className="font-bold text-lg">Call Ambulance</p>
            <p className="text-xs text-white/80">1990 - Suwa Seriya</p>
          </div>
        </button>
        <button className="w-full rounded-xl bg-gray-100 p-4 text-gray-900 flex items-center hover:bg-gray-200 transition">
          <div className="bg-white p-2 rounded-lg mr-4 text-gray-500">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="text-left flex-1">
            <p className="font-bold">Find Hospital</p>
            <p className="text-xs text-gray-500">Locate nearest ER</p>
          </div>
        </button>
      </div>
    </div>
  );
};