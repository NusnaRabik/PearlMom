// frontend/src/components/common/MotherNavbar.jsx
import React from 'react';
import { Bell, PhoneCall } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import avatarImg from '../../assets/mother.png'; // Fallback if no specific avatar

const MotherNavbar = () => {
  const location = useLocation();
  const isHealthRecords = location.pathname.includes('/health-records');

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40 sticky top-0">
      {/* Left side */}
      <div className="flex items-center">
        {isHealthRecords ? (
          <span className="text-[#006699] font-bold text-xl tracking-tight">E-MCH Sanctuary</span>
        ) : (
          <span className="text-[#006699] font-bold text-xl tracking-tight">Pearl Mom</span>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-6">
        {isHealthRecords ? (
          <button className="bg-[#006699] hover:bg-[#005580] text-white text-xs font-medium py-2 px-4 rounded-full flex items-center transition-colors">
            Emergency Call
          </button>
        ) : (
          <button className="text-gray-500 hover:text-gray-700 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        )}

        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          {!isHealthRecords && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">Elena Richardson</span>
              <span className="text-xs text-blue-400 font-medium">PM-2024-8842</span>
            </div>
          )}
          <img 
            src="https://ui-avatars.com/api/?name=Elena+Richardson&background=1034a6&color=fff&rounded=true" 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default MotherNavbar;
