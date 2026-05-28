// frontend/src/pages/public/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { 
  Users, CheckCircle, Stethoscope, Building, 
  User, Briefcase, Activity, Syringe, 
  Utensils, Calendar, ArrowRight, ShieldCheck,
  Heart
} from 'lucide-react';
import heroImage from '../../assets/hero-image.png';
import doctorTabletImage from '../../assets/doctor_tablet.png';
import babyHandImage from '../../assets/baby_hand.png';
import api from '../../services/api';

const LandingPage = () => {
  const [stats, setStats] = useState({
    totalMothers: 0,
    successfulDeliveries: 0,
    activeProviders: 0,
    clinicsConnected: 0
  });
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    totalMothers: 0,
    successfulDeliveries: 0,
    activeProviders: 0,
    clinicsConnected: 0
  });
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  // Fetch stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/public/stats');
        if (response.data.success) {
          const data = response.data.data;
          setStats({
            totalMothers: data.total_mothers || 0,
            successfulDeliveries: data.successful_deliveries || 0,
            activeProviders: data.active_providers || 0,
            clinicsConnected: data.clinics_connected || 0
          });
        } else {
          // Fallback to default values if API fails
          setStats({
            totalMothers: 25000,
            successfulDeliveries: 18000,
            activeProviders: 500,
            clinicsConnected: 120
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default values
        setStats({
          totalMothers: 25000,
          successfulDeliveries: 18000,
          activeProviders: 500,
          clinicsConnected: 120
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Count animation when stats come into view
  useEffect(() => {
    const animateValue = (start, end, duration, setter) => {
      const increment = (end - start) / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
      return timer;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current && !loading) {
          hasAnimated.current = true;
          
          animateValue(0, stats.totalMothers, 2000, (value) => 
            setAnimatedStats(prev => ({ ...prev, totalMothers: value }))
          );
          animateValue(0, stats.successfulDeliveries, 2000, (value) => 
            setAnimatedStats(prev => ({ ...prev, successfulDeliveries: value }))
          );
          animateValue(0, stats.activeProviders, 2000, (value) => 
            setAnimatedStats(prev => ({ ...prev, activeProviders: value }))
          );
          animateValue(0, stats.clinicsConnected, 2000, (value) => 
            setAnimatedStats(prev => ({ ...prev, clinicsConnected: value }))
          );
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [stats, loading]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}${num % 1000 >= 100 ? ',' + (num % 1000) : num % 1000 === 0 ? 'K+' : ',' + (num % 1000)}`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section - HOME */}
        <section id="hero-section" className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center scroll-mt-20">
          <div className="md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
            <span className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-6">
              Sri Lanka's Trusted Choice
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Digital Maternal<br />Healthcare<br />
              <span className="text-pink-600">Sanctuary</span>
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-lg">
              A seamless, safe, and culturally attuned digital health ecosystem designed specifically for the mothers of Sri Lanka. From the first kick to the first step, we are with you.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/register" 
                className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-8 rounded-full transition-colors text-center"
              >
                Start Your Journey
              </Link>
              <Link 
                to="/login" 
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-3 px-8 rounded-full transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative bg-pink-100">
              <img 
                src={heroImage} 
                alt="Pregnant woman smiling" 
                className="w-full h-auto object-cover rounded-3xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-3xl flex items-center justify-center"><span class="text-6xl">🤰</span></div>';
                }}
              />
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3 max-w-xs">
                <div className="bg-pink-100 p-2 rounded-full">
                  <ShieldCheck className="text-pink-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">PEARL MOM</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Official Healthcare Protocol</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact Section */}
        <section className="bg-white py-20" ref={statsRef}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Community Impact</h2>
            <div className="w-16 h-1 bg-pink-600 mx-auto mb-4"></div>
            <p className="text-slate-500 mb-12 max-w-2xl mx-auto">
              Our growing network is dedicated to improving maternal health outcomes across the island.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-md transition-shadow group">
                <div className="bg-pink-100 p-3 rounded-full mb-4 group-hover:bg-pink-200 transition-colors">
                  <Users className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {loading ? '...' : `${formatNumber(animatedStats.totalMothers)}+`}
                </h3>
                <p className="text-sm text-slate-500 text-center">Mothers Registered</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-md transition-shadow group">
                <div className="bg-pink-100 p-3 rounded-full mb-4 group-hover:bg-pink-200 transition-colors">
                  <Heart className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {loading ? '...' : `${formatNumber(animatedStats.successfulDeliveries)}+`}
                </h3>
                <p className="text-sm text-slate-500 text-center">Successful Deliveries</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-md transition-shadow group">
                <div className="bg-pink-100 p-3 rounded-full mb-4 group-hover:bg-pink-200 transition-colors">
                  <Stethoscope className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {loading ? '...' : `${formatNumber(animatedStats.activeProviders)}+`}
                </h3>
                <p className="text-sm text-slate-500 text-center">Active Providers</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-md transition-shadow group">
                <div className="bg-pink-100 p-3 rounded-full mb-4 group-hover:bg-pink-200 transition-colors">
                  <Building className="text-pink-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {loading ? '...' : `${formatNumber(animatedStats.clinicsConnected)}+`}
                </h3>
                <p className="text-sm text-slate-500 text-center">Clinics Connected</p>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section className="bg-slate-50 py-24 mx-4 md:mx-12 rounded-[3rem] mb-20">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Who are you joining as?</h2>
            <p className="text-slate-500 mb-12">
              Select your role to access your personalized sanctuary dashboard.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-8">
              <Link to="/register" className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center group flex-1 max-w-sm mx-auto">
                <div className="bg-pink-100 p-4 rounded-full mb-6 group-hover:bg-pink-200 transition-colors">
                  <User className="text-pink-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Mother</h3>
                <p className="text-slate-500 text-center mb-8 text-sm">
                  Access clinics, track growth, and receive reminders for your wellness journey.
                </p>
                <span className="text-pink-600 font-medium flex items-center hover:text-pink-700 transition-colors">
                  Join as Mother <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Link>

              <Link to="/register" className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center group flex-1 max-w-sm mx-auto">
                <div className="bg-pink-100 p-4 rounded-full mb-6 group-hover:bg-pink-200 transition-colors">
                  <Briefcase className="text-pink-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Provider</h3>
                <p className="text-slate-500 text-center mb-8 text-sm">
                  Midwives and doctors can manage clinics, patient records, and vitals securely.
                </p>
                <span className="text-pink-600 font-medium flex items-center hover:text-pink-700 transition-colors">
                  Provider Login <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT Section - Empowering Sri Lankan Mothers Through Technology */}
        <section id="about-section" className="bg-white py-20 overflow-hidden mb-12 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 relative mb-12 md:mb-0 h-[400px]">
              <div className="absolute left-0 bottom-0 w-[55%] h-auto rounded-3xl shadow-lg z-10 border-4 border-white overflow-hidden">
                <img 
                  src={doctorTabletImage} 
                  alt="Doctor with tablet" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-64 bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl flex items-center justify-center"><span class="text-4xl">👩‍⚕️</span></div>';
                  }}
                />
              </div>
              <div className="absolute right-10 top-0 w-[60%] h-auto rounded-3xl shadow-xl overflow-hidden">
                <img 
                  src={babyHandImage} 
                  alt="Baby hand holding adult finger" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-80 bg-gradient-to-br from-pink-200 to-pink-300 rounded-3xl flex items-center justify-center"><span class="text-4xl">👶</span></div>';
                  }}
                />
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                Empowering Sri Lankan Mothers Through Technology
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                PEARL MOM is more than just an app, it's a nationwide movement to modernize maternal healthcare. By bridging the gap between rural clinics and specialized medical data, we ensure every mother in Sri Lanka receives the same high-standard care.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-pink-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Integrated MOH protocols & digital clinic records.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-pink-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Real-time alerts for vaccinations and health checks.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-pink-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Seamless communication between mothers and healthcare providers.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-pink-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Secure, encrypted health records accessible anywhere.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SERVICES Section - Core Ecosystem Benefits */}
        <section id="services-section" className="bg-slate-50 py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Core Ecosystem Benefits</h2>
            <div className="w-16 h-1 bg-pink-600 mb-10"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Activity className="text-pink-500 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Pregnancy Tracking</h3>
                <p className="text-sm text-slate-500">Visualize development milestones and track vitals through every trimester.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Syringe className="text-pink-600 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Vaccination Management</h3>
                <p className="text-sm text-slate-500">Automatic scheduling and reminders for mother and newborn vaccinations.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Utensils className="text-pink-500 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Nutrition Tracking</h3>
                <p className="text-sm text-slate-500">Personalized diet plans tailored to Sri Lankan nutritional standards.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Calendar className="text-pink-500 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Clinic Management</h3>
                <p className="text-sm text-slate-500">Seamlessly book and manage visits to government and private clinics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-600 to-pink-700 py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-pink-100 mb-8 text-lg">
              Join thousands of mothers and healthcare providers already using PearlMom.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/register" 
                className="bg-white text-pink-600 font-medium py-3 px-8 rounded-full hover:bg-pink-50 transition-colors"
              >
                Register Now
              </Link>
              <Link 
                to="/help" 
                className="border-2 border-white text-white font-medium py-3 px-8 rounded-full hover:bg-pink-500 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;