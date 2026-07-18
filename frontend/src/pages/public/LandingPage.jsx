// frontend/src/pages/public/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import {
  Users, CheckCircle, Stethoscope, Building,
  User, Briefcase, Activity, Syringe,
  Utensils, Calendar, ArrowRight, ShieldCheck,
  Heart, Sparkles
} from 'lucide-react';
import PregnantWoman from '../../components/common/PregnantWoman';
import heroImage from '../../assets/hero-image.png';
import doctorTabletImage from '../../assets/doctor_tablet.png';
import babyHandImage from '../../assets/baby_hand.png';
import api from '../../services/api';
import ChatWidget from '../../components/common/ChatWidget';

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
  const heroRef = useRef(null);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D tilt for hero image
  const rotateX = useTransform(smoothMouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-300, 300], [-5, 5]);

  // Floating badge animation
  const floatingBadgeVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -12, 0, -6, 0],
      rotate: [0, 3, -3, 2, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // Fetch stats
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
          setStats({
            totalMothers: 25000,
            successfulDeliveries: 18000,
            activeProviders: 500,
            clinicsConnected: 120
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
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

  // Mouse move handler
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // Stats counter animation
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

    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, [stats, loading]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      const k = Math.floor(num / 1000);
      const remainder = num % 1000;
      if (remainder === 0) return `${k}K+`;
      if (remainder >= 100) return `${k}.${Math.floor(remainder / 100)}K+`;
      return `${k}K+`;
    }
    return num.toString();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with Enhanced Background Animation */}
        <section
          id="hero-section"
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center scroll-mt-20 overflow-visible min-h-[90vh]"
        >
          {/* Beautiful Cursor-Following Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base Soft Glows */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-[28rem] h-[28rem] bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />

            {/* Cursor Interactive Glow Orbs */}
            <motion.div
              className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-full blur-3xl opacity-30"
              style={{
                left: useTransform(smoothMouseX, [-500, 500], ['15%', '55%']),
                top: useTransform(smoothMouseY, [-500, 500], ['25%', '65%']),
              }}
            />

            <motion.div
              className="absolute w-[26rem] h-[26rem] bg-gradient-to-br from-purple-400 to-violet-500 rounded-full blur-3xl opacity-25"
              style={{
                left: useTransform(smoothMouseX, [-500, 500], ['60%', '25%']),
                top: useTransform(smoothMouseY, [-500, 500], ['55%', '20%']),
              }}
            />

            {/* Accent floating elements */}
            <motion.div
              className="absolute w-56 h-56 bg-white/60 rounded-full blur-2xl opacity-40"
              style={{
                left: useTransform(smoothMouseX, [-600, 600], ['25%', '50%']),
                top: useTransform(smoothMouseY, [-600, 600], ['40%', '70%']),
              }}
            />

            <motion.div
              className="absolute w-72 h-72 bg-rose-300 rounded-full blur-3xl opacity-20"
              style={{
                left: useTransform(smoothMouseX, [-600, 600], ['70%', '35%']),
                top: useTransform(smoothMouseY, [-600, 600], ['30%', '60%']),
              }}
            />

            {/* Tiny sparkling particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white rounded-full"
                style={{
                  left: useTransform(smoothMouseX, [-700, 700], [`${18 + i * 9}%`, `${35 + i * 7}%`]),
                  top: useTransform(smoothMouseY, [-700, 700], [`${28 + i * 8}%`, `${45 + i * 6}%`]),
                }}
                animate={{
                  scale: [0.8, 1.4, 0.8],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2.5 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>

          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0 relative z-10"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide mb-6 shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              Sri Lanka's Trusted Choice
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              Digital Maternal<br />Healthcare
              <span className="text-pink-600 block">Sanctuary</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-slate-600 text-lg mb-8 max-w-lg leading-relaxed"
            >
              A seamless, safe, and culturally attuned digital health ecosystem designed specifically for the mothers of Sri Lanka. From the first kick to the first step, we are with you.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="group relative bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 text-center shadow-lg hover:shadow-xl inline-flex items-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white text-slate-800 font-medium py-3 px-8 rounded-full transition-all duration-300 text-center border border-slate-200 shadow-sm hover:shadow-md inline-flex items-center gap-2"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Image with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:w-1/2 relative z-10"
            style={{
              perspective: 1200,
              rotateX: rotateX,
              rotateY: rotateY,
            }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-100 to-rose-100">
                <img
                  src={heroImage}
                  alt="Pregnant woman smiling"
                  className="w-full h-auto object-cover rounded-3xl relative z-10"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-96 bg-gradient-to-br from-pink-200 to-pink-300 rounded-3xl flex items-center justify-center"><span class="text-6xl">🤰</span></div>';
                  }}
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                variants={floatingBadgeVariants}
                initial="initial"
                animate="animate"
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-xs border border-pink-100 z-20"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2.5 rounded-xl shadow-md">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">PEARL MOM</p>
                  <p className="text-[10px] text-pink-600 font-medium leading-tight">Official Healthcare Protocol</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Rest of your sections remain unchanged */}
        {/* Community Impact Section */}
        <section className="bg-white py-20" ref={statsRef}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-slate-900 mb-4"
            >
              Community Impact
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-1 bg-pink-600 mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-slate-500 mb-12 max-w-2xl mx-auto"
            >
              Our growing network is dedicated to improving maternal health outcomes across the island.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, label: "Mothers Registered", value: animatedStats.totalMothers, color: "text-pink-500" },
                { icon: Heart, label: "Successful Deliveries", value: animatedStats.successfulDeliveries, color: "text-rose-500" },
                { icon: Stethoscope, label: "Active Providers", value: animatedStats.activeProviders, color: "text-purple-500" },
                { icon: Building, label: "Clinics Connected", value: animatedStats.clinicsConnected, color: "text-blue-500" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-md transition-all group"
                >
                  <div className="bg-pink-100 p-3 rounded-full mb-4 group-hover:bg-pink-200 transition-colors">
                    <stat.icon className={`${stat.color} w-6 h-6`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {loading ? '...' : `${formatNumber(stat.value)}+`}
                  </h3>
                  <p className="text-sm text-slate-500 text-center">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Role Selection, About, Services, CTA sections remain the same as your original code */}
        {/* (I kept them unchanged for brevity - they are identical to your original) */}

        {/* Role Selection Section */}
        <section className="bg-slate-50 py-24 mx-4 md:mx-12 rounded-[3rem] mb-20">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-slate-900 mb-4"
            >
              Who are you joining as?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-slate-500 mb-12"
            >
              Select your role to access your personalized sanctuary dashboard.
            </motion.p>

            <div className="flex flex-col md:flex-row justify-center gap-8">
              {[
                { icon: PregnantWoman, title: "Mother", description: "Access clinics, track growth, and receive reminders for your wellness journey.", link: "/register" },
                { icon: Stethoscope, title: "Provider", description: "Midwives and doctors can manage clinics, patient records, and vitals securely.", link: "/register" }
              ].map((role, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="flex-1 max-w-sm mx-auto w-full"
                >
                  <Link to={role.link} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center group w-full">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="bg-pink-100 p-4 rounded-full mb-6 group-hover:bg-pink-200 transition-colors"
                    >
                      <role.icon className="text-pink-500 w-8 h-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{role.title}</h3>
                    <p className="text-slate-500 text-center mb-8 text-sm">{role.description}</p>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="text-pink-600 font-medium flex items-center hover:text-pink-700 transition-colors"
                    >
                      {role.title === "Mother" ? "Join as Mother" : "Provider Login"} <ArrowRight className="ml-2 w-4 h-4" />
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT Section */}
        <section id="about-section" className="bg-white py-20 overflow-hidden mb-12 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 relative mb-12 md:mb-0 h-[400px]">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute left-0 bottom-0 w-[55%] h-auto rounded-3xl shadow-lg z-10 border-4 border-white overflow-hidden"
              >
                <img src={doctorTabletImage} alt="Doctor with tablet" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute right-10 top-0 w-[60%] h-auto rounded-3xl shadow-xl overflow-hidden"
              >
                <img src={babyHandImage} alt="Baby hand holding adult finger" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            <div className="md:w-1/2 md:pl-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-slate-900 mb-6 leading-tight"
              >
                Empowering Sri Lankan Mothers Through Technology
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-slate-600 mb-8 leading-relaxed"
              >
                PEARL MOM is more than just an app, it's a nationwide movement to modernize maternal healthcare. By bridging the gap between rural clinics and specialized medical data, we ensure every mother in Sri Lanka receives the same high-standard care.
              </motion.p>

              <ul className="space-y-4">
                {[
                  "Integrated MOH protocols & digital clinic records.",
                  "Real-time alerts for vaccinations and health checks.",
                  "Seamless communication between mothers and healthcare providers.",
                  "Secure, encrypted health records accessible anywhere."
                ].map((text, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <CheckCircle className="text-pink-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-slate-700">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SERVICES Section */}
        <section id="services-section" className="bg-slate-50 py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-slate-900 mb-2"
            >
              Core Ecosystem Benefits
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-1 bg-pink-600 mb-10"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Activity, title: "Pregnancy Tracking", desc: "Visualize development milestones and track vitals through every trimester.", color: "text-pink-500" },
                { icon: Syringe, title: "Vaccination Management", desc: "Automatic scheduling and reminders for mother and newborn vaccinations.", color: "text-pink-600" },
                { icon: Utensils, title: "Nutrition Tracking", desc: "Personalized diet plans tailored to Sri Lankan nutritional standards.", color: "text-pink-500" },
                { icon: Calendar, title: "Clinic Management", desc: "Seamlessly book and manage visits to government and private clinics.", color: "text-pink-500" }
              ].map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <service.icon className={`${service.color} w-6 h-6 mb-4`} />
                  <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-600 to-pink-700 py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-4"
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-pink-100 mb-8 text-lg"
            >
              Join thousands of mothers and healthcare providers already using PearlMom.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="bg-white text-pink-600 font-medium py-3 px-8 rounded-full hover:bg-pink-50 transition-colors inline-block shadow-lg">
                  Register Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/help" className="border-2 border-white text-white font-medium py-3 px-8 rounded-full hover:bg-pink-500 transition-colors inline-block">
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default LandingPage;