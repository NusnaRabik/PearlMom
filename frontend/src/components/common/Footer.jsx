import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <span className="text-primary-900 font-bold text-xl tracking-tight block mb-4">PEARL MOM</span>
            <p className="text-sm text-slate-500 leading-relaxed pr-4">
              The Digital Sanctuary for Maternal Health. Committed to the well-being of Sri Lankan mothers and their future generations.
            </p>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-sm text-slate-500 hover:text-primary-600">Help & Support</Link></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600">Health Blog</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600">Nutrition Guide</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600">Contact Us</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600">Terms of Service</a></li>
            </ul>
          </div>

          {/* Portals Column */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Portals</h4>
            <ul className="space-y-3">
              <li><Link to="/provider/dashboard" className="text-sm text-slate-500 hover:text-primary-600">Provider Dashboard</Link></li>
              <li><Link to="/admin/dashboard" className="text-sm text-slate-500 hover:text-primary-600">MOH Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} PEARL MOM. The Digital Sanctuary for Maternal Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
