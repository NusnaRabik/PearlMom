import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import Footer from '../../components/common/Footer';
import babyHandImage from '../../assets/baby_hand.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-slate-50 to-slate-100"></div>

      {/* Top Left Logo (Matches design) */}
      <div className="absolute top-6 left-8 z-10 md:top-8 md:left-12">
        <span className="text-primary-900 font-bold text-xl tracking-tight">PEARL MOM</span>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 pt-20">
        <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Side - Blue Gradient & Image */}
          <div className="md:w-1/2 relative p-10 md:p-14 lg:p-16 text-white overflow-hidden flex flex-col justify-between">
            {/* Background image overlay with gradient */}
            <div 
              className="absolute inset-0 z-0 mix-blend-overlay opacity-[0.35]"
              style={{
                backgroundImage: `url(${babyHandImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 z-0 mix-blend-multiply" />
            <div className="absolute inset-0 bg-primary-900/80 z-0" />
            
            {/* Content */}
            <div className="relative z-10 pt-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 tracking-tight">
                Welcome to your<br />Maternal Sanctuary.
              </h1>
              <p className="text-blue-50 text-base md:text-lg max-w-sm font-light leading-relaxed">
                Access your personalized care insights and connect with your dedicated support team.
              </p>
            </div>
            
            {/* Badge */}
            <div className="relative z-10 mt-16 md:mt-auto">
              <div className="inline-flex items-center space-x-2.5 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white tracking-wide">HIPAA Compliant Security</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-500 mb-8 text-sm md:text-base">Secure access to your maternal health journey</p>
            
            <form className="space-y-5">
              {/* Email / Mobile */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email or Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-900 placeholder-slate-400 outline-none"
                    placeholder="martha@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="block w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-900 placeholder-slate-400 tracking-widest outline-none"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center pt-2">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-[#2280a5] hover:bg-[#1a6685] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2280a5] transition-all mt-4"
              >
                Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Need an account? <a href="/register" className="font-semibold text-[#165a78] hover:text-[#11455c] transition-colors">Register Here</a>
              </p>
            </div>

            {/* Security Tip */}
            <div className="mt-8 bg-[#fcf8e8] rounded-xl p-4 flex items-start space-x-3">
              <div className="bg-[#8b6b15] rounded-full p-1.5 flex-shrink-0 mt-0.5">
                <Info className="h-3 w-3 text-white" />
              </div>
              <p className="text-[13px] text-[#7a5c13] leading-relaxed">
                Security Tip: If you forgot your password, we'll send a secure One-Time Password (OTP) to your registered mobile number for a safe reset.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
