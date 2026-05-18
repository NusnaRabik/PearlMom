// frontend/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first then scroll
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 flex-shrink-0"
            onClick={handleHomeClick}
          >
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="font-semibold text-gray-800 text-lg">PearlMom</span>
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1">
              <button 
                onClick={handleHomeClick}
                className="text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about-section')}
                className="text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services-section')}
                className="text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Services
              </button>
              <Link 
                to="/help" 
                className="text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Auth Buttons - Right */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            <Link 
              to="/login" 
              className="px-4 py-2 border border-pink-600 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              <button 
                onClick={handleHomeClick}
                className="block w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about-section')}
                className="block w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services-section')}
                className="block w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium"
              >
                Services
              </button>
              <Link 
                to="/help" 
                className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-3 space-y-2 border-t border-gray-100 mt-3">
                <Link 
                  to="/login" 
                  className="block px-3 py-2.5 text-sm text-pink-600 font-medium hover:bg-pink-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2.5 text-sm text-white bg-pink-600 rounded-lg text-center font-medium hover:bg-pink-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;