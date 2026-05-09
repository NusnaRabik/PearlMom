import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-primary-900 font-bold text-xl tracking-tight">PEARL MOM</span>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
        <a href="#" className="text-primary-600 border-b-2 border-primary-500 pb-1">Benefits</a>
        <a href="#" className="hover:text-primary-600 transition-colors">How It Works</a>
        <a href="#" className="hover:text-primary-600 transition-colors">Providers</a>
        <a href="#" className="hover:text-primary-600 transition-colors">FAQ</a>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">Login</a>
        <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-6 rounded-full transition-colors">
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
