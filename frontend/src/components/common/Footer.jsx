// frontend/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="font-semibold text-gray-800">Pearl Mom</span>
            </div>
            <p className="text-sm text-gray-500">
              Empowering mothers with personalized maternal health insights and clinical-grade monitoring for a safer journey to motherhood.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/provider/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Patient Dashboard</Link></li>
              <li><Link to="/provider/mothers" className="text-sm text-gray-500 hover:text-gray-900">Clinical Records</Link></li>
              <li><Link to="/provider/nutrition" className="text-sm text-gray-500 hover:text-gray-900">Risk Assessment</Link></li>
              <li><Link to="/help" className="text-sm text-gray-500 hover:text-gray-900">Resources</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About Us</Link></li>
              <li><Link to="/mission" className="text-sm text-gray-500 hover:text-gray-900">Our Mission</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-500 hover:text-gray-900">Careers</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
              <li><Link to="/hipaa" className="text-sm text-gray-500 hover:text-gray-900">HIPAA Compliance</Link></li>
              <li><Link to="/security" className="text-sm text-gray-500 hover:text-gray-900">Data Security</Link></li>
            </ul>
          </div>
        </div>

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