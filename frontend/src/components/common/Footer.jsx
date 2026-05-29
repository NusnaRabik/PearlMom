// frontend/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section - Same as Navbar */}
          <div className="text-center md:text-left">
            <Link to="/" className="group flex items-center justify-center md:justify-start space-x-2.5 ">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-500 rounded-xl blur-md opacity-50  transition-opacity"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white fill-white/20" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-lg leading-tight tracking-tight">PearlMom</span>
                <span className="text-[10px] text-gray-400 -mt-0.5">Maternal Health</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Empowering mothers with personalized maternal health insights and clinical-grade monitoring for a safer journey to motherhood.
            </p>
          </div>

          {/* Company Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link to="/mission" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Our Mission</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link to="/hipaa" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">HIPAA Compliance</Link></li>
              <li><Link to="/security" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Data Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright - Centered */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} PEARL MOM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;