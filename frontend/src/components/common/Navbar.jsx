// frontend/src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, ChevronDown, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
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
    setIsOpen(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('hero-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById('hero-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo - Left with Animation */}
          <Link 
            to="/" 
            className="group flex items-center space-x-2.5 flex-shrink-0 "
            onClick={handleLogoClick}
          >
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

          {/* Desktop Navigation Links - Centered with Elegant Design */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1 bg-white/40 backdrop-blur-sm rounded-full p-1 shadow-sm">
              <button 
                onClick={handleHomeClick}
                className="relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 group"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute inset-0 rounded-full bg-pink-50 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </button>
              <button 
                onClick={() => scrollToSection('about-section')}
                className="relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 group"
              >
                <span className="relative z-10">About</span>
                <span className="absolute inset-0 rounded-full bg-pink-50 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </button>
              <button 
                onClick={() => scrollToSection('services-section')}
                className="relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 group"
              >
                <span className="relative z-10">Services</span>
                <span className="absolute inset-0 rounded-full bg-pink-50 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </button>
              <Link 
                to="/help" 
                className="relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 group"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">FAQ</span>
                <span className="absolute inset-0 rounded-full bg-pink-50 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </Link>
            </div>
          </div>

          {/* Auth Buttons - Right with Gradient */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            <Link 
              to="/login" 
              className="group relative px-5 py-2.5 text-sm font-semibold text-pink-600 rounded-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Sign In</span>
              <span className="absolute inset-0 bg-pink-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              to="/register" 
              className="relative px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Register Now
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>

          {/* Mobile Menu Button - Elegant */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm flex items-center justify-center transition-all duration-300 hover:bg-pink-50 hover:border-pink-200"
          >
            <div className={`transition-all duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isOpen ? <X size={20} className="text-pink-600" /> : <Menu size={20} className="text-gray-600" />}
            </div>
          </button>
        </div>

        {/* Mobile Navigation - Slide Down with Elegant Design */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-gray-100/50 space-y-2">
            <button 
              onClick={handleHomeClick}
              className="group w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all duration-300"
            >
              <span className="font-medium">Home</span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg]" />
            </button>
            <button 
              onClick={() => scrollToSection('about-section')}
              className="group w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all duration-300"
            >
              <span className="font-medium">About</span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg]" />
            </button>
            <button 
              onClick={() => scrollToSection('services-section')}
              className="group w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all duration-300"
            >
              <span className="font-medium">Services</span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg]" />
            </button>
            <Link 
              to="/help" 
              className="group w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">FAQ</span>
              <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg]" />
            </Link>
            
            <div className="pt-4 mt-2 space-y-3 border-t border-gray-100">
              <Link 
                to="/login" 
                className="block px-4 py-3 text-center text-pink-600 font-semibold hover:bg-pink-50 rounded-xl transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="block px-4 py-3 text-center text-white bg-gradient-to-r from-pink-500 to-rose-500 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;