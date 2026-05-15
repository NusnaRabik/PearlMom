import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 fixed top-0 w-full z-20">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden text-gray-500 hover:text-gray-700">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-[#0f766e]">Pearl Mom</h1>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">Elena Richardson</p>
            <p className="text-xs text-blue-600 mt-1">PM-2024-8842</p>
          </div>
          <Link to="/settings" className="h-9 w-9 rounded-full bg-cover bg-center border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#0f766e] transition-all" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026704d)' }}></Link>
        </div>
      </div>
    </header>
  );
};
