import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MotherNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath.includes(path);
  };

  return (
    <div className="h-16 bg-[#fbfbfd] flex items-center justify-between px-6 z-40 sticky top-0 relative">
      {/* Left side */}
      <div className="flex items-center w-1/4">
        <span className="text-[#1a6685] font-bold text-xl tracking-tight">Pearl Mom</span>
      </div>

      {/* Center side - Links */}
      <div className="flex-1 flex justify-center items-center space-x-8">
        <Link 
          to="/mother/dashboard" 
          className={`text-[13px] font-bold transition-colors pb-1 border-b-2 ${isActive('/mother/dashboard') ? 'text-[#1a6685] border-[#1a6685]' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/mother/health-records" 
          className={`text-[13px] font-bold transition-colors pb-1 border-b-2 ${isActive('/mother/health-records') ? 'text-[#1a6685] border-[#1a6685]' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'}`}
        >
          Medical Records
        </Link>
        <Link 
          to="/mother/settings" 
          className={`text-[13px] font-bold transition-colors pb-1 border-b-2 ${isActive('/mother/settings') ? 'text-[#1a6685] border-[#1a6685]' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'}`}
        >
          Profile
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-end w-1/4 space-x-5">
        <button className="text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={18} />
        </button>
        <button className="text-slate-500 hover:text-slate-700 transition-colors">
          <Settings size={18} />
        </button>
        
        <div className="relative cursor-pointer">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default MotherNavbar;
