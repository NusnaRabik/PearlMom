// frontend/src/components/common/Footer.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Users, Target, ShieldCheck, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, targetPath, sectionId) => {
    e.preventDefault();
    if (sectionId) {
      if (location.pathname !== targetPath) {
        navigate(targetPath);
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Brand Section */}
          <div className="text-center md:text-left max-w-sm flex-shrink-0">
            <Link 
              to="/" 
              onClick={(e) => handleNavClick(e, '/', 'hero-section')}
              className="group inline-flex items-center space-x-2.5"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Heart className="w-4 h-4 text-white fill-white/20" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-gray-800 text-base leading-tight tracking-tight">PearlMom</span>
                <span className="text-[10px] text-gray-400 -mt-0.5">Maternal Health</span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Empowering mothers with personalized maternal health insights and clinical-grade monitoring for a safer journey to motherhood.
            </p>
          </div>

          {/* Direct Links - Medium sized with icons above text */}
          <div className="flex-1 flex flex-wrap items-center justify-between md:pl-16 lg:pl-24 gap-y-3 text-sm font-medium">
            <Link
              to="/about"
              onClick={(e) => handleNavClick(e, '/', 'about-section')}
              className="group flex flex-col items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Users className="w-5 h-5 mb-1.5 text-gray-400 group-hover:text-pink-500 transition-colors" />
              <span className="whitespace-nowrap">About Us</span>
            </Link>
            <Link
              to="/mission"
              onClick={(e) => handleNavClick(e, '/', 'mission-section')}
              className="group flex flex-col items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Target className="w-5 h-5 mb-1.5 text-gray-400 group-hover:text-pink-500 transition-colors" />
              <span className="whitespace-nowrap">Our Mission</span>
            </Link>
            <Link
              to="/privacy"
              onClick={(e) => handleNavClick(e, '/privacy')}
              className="group flex flex-col items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ShieldCheck className="w-5 h-5 mb-1.5 text-gray-400 group-hover:text-pink-500 transition-colors" />
              <span className="whitespace-nowrap">Privacy Policy</span>
            </Link>
            <Link
              to="/contact"
              onClick={(e) => handleNavClick(e, '/help', 'contact-form')}
              className="group flex flex-col items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Mail className="w-5 h-5 mb-1.5 text-gray-400 group-hover:text-pink-500 transition-colors" />
              <span className="whitespace-nowrap">Contact</span>
            </Link>
          </div>
        </div>

        {/* Copyright - Centered */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} PearlMom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;