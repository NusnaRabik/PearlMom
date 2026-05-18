import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Info, User, Briefcase, UserCog } from 'lucide-react';
import babyHandImage from '../../assets/baby_hand.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginAs, setLoginAs] = useState('mother'); // mother, provider, admin
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMethod, setForgotMethod] = useState('email'); // email or sms
  const [forgotMessage, setForgotMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.id || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Demo login logic
      if (formData.id && formData.password) {
        switch(loginAs) {
          case 'admin':
            window.location.href = '/admin/dashboard';
            break;
          case 'provider':
            window.location.href = '/provider/dashboard';
            break;
          case 'mother':
            window.location.href = '/mother/dashboard';
            break;
          default:
            window.location.href = '/provider/dashboard';
        }
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setForgotMessage('Please enter your email or mobile number');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setForgotMessage(
        forgotMethod === 'email' 
          ? 'Password reset link has been sent to your email address.' 
          : 'OTP has been sent to your registered mobile number.'
      );
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setForgotMessage('');
      }, 2000);
    }, 1500);
  };

  const getIdLabel = () => {
    switch(loginAs) {
      case 'mother': return 'Mother ID';
      case 'provider': return 'Employee ID';
      case 'admin': return 'Employee ID';
      default: return 'ID';
    }
  };

  const getIdPlaceholder = () => {
    switch(loginAs) {
      case 'mother': return 'e.g., MOT-2024-001';
      case 'provider': return 'e.g., PR-8492';
      case 'admin': return 'e.g., AD-1024';
      default: return 'Enter your ID';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-slate-50 to-slate-100"></div>

      {/* Top Left Logo */}
      <div className="absolute top-6 left-8 z-10 md:top-8 md:left-12">
        <Link to="/" className="text-pink-900 font-bold text-xl tracking-tight">PEARL MOM</Link>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 pt-20">
        <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Side - Gradient & Image */}
          <div className="md:w-1/2 relative p-10 md:p-14 lg:p-16 text-white overflow-hidden flex flex-col justify-between">
            {/* Background image overlay with gradient */}
            <div 
              className="absolute inset-0 z-0 mix-blend-overlay opacity-[0.35]"
              style={{
                backgroundImage: `url(${babyHandImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-pink-700 to-pink-500 z-0 mix-blend-multiply" />
            <div className="absolute inset-0 bg-pink-900/80 z-0" />
            
            <div className="relative z-10 pt-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 tracking-tight">
                Welcome to your<br />Maternal Sanctuary.
              </h1>
              <p className="text-pink-50 text-base md:text-lg max-w-sm font-light leading-relaxed">
                Access your personalized care insights and connect with your dedicated support team.
              </p>
            </div>
            
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
            <p className="text-slate-500 mb-6 text-sm md:text-base">Secure access to your maternal health journey</p>
            
            {/* Role Selection Toggle */}
            <div className="mb-6">
              <p className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Login as:</p>
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setLoginAs('mother'); setError(''); setFormData({ id: '', password: '', rememberMe: false }); }}
                  className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all ${
                    loginAs === 'mother'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <User size={16} />
                  <span>Mother</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginAs('provider'); setError(''); setFormData({ id: '', password: '', rememberMe: false }); }}
                  className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all ${
                    loginAs === 'provider'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Briefcase size={16} />
                  <span>Provider</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginAs('admin'); setError(''); setFormData({ id: '', password: '', rememberMe: false }); }}
                  className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all ${
                    loginAs === 'admin'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <UserCog size={16} />
                  <span>Admin</span>
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                <Info size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Forgot Password View */}
            {showForgotPassword ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    ← Back to Login
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900">Forgot Password</h3>
                <p className="text-sm text-slate-500">
                  Enter your registered email or mobile number to receive a password reset link.
                </p>

                {/* Reset Method Toggle */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setForgotMethod('email')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      forgotMethod === 'email' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotMethod('sms')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      forgotMethod === 'sms' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    SMS OTP
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {forgotMethod === 'email' ? (
                      <Mail className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type={forgotMethod === 'email' ? 'email' : 'tel'}
                    value={forgotEmail}
                    onChange={(e) => { setForgotEmail(e.target.value); setForgotMessage(''); }}
                    placeholder={forgotMethod === 'email' ? 'Enter your email address' : 'Enter your mobile number'}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-slate-900 placeholder-slate-400 outline-none text-sm"
                  />
                </div>

                {forgotMessage && (
                  <div className={`p-3 rounded-xl flex items-center space-x-2 ${
                    forgotMessage.includes('sent') 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <Info size={16} className={forgotMessage.includes('sent') ? 'text-green-500' : 'text-yellow-500'} />
                    <p className={`text-sm ${forgotMessage.includes('sent') ? 'text-green-700' : 'text-yellow-700'}`}>
                      {forgotMessage}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSending}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all ${
                    isSending 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-pink-600 hover:bg-pink-700'
                  }`}
                >
                  {isSending ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-5">
                {/* ID Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {getIdLabel()}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-slate-900 placeholder-slate-400 outline-none"
                      placeholder={getIdPlaceholder()}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <button 
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-slate-900 placeholder-slate-400 tracking-widest outline-none"
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
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-slate-300 rounded cursor-pointer transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer select-none">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Login Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white transition-all mt-4 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login as {loginAs.charAt(0).toUpperCase() + loginAs.slice(1)}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {!showForgotPassword && (
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-600">
                  Need an account? <Link to="/register" className="font-semibold text-pink-600 hover:text-pink-700 transition-colors">Register Here</Link>
                </p>
              </div>
            )}

            {/* Security Tip */}
            {!showForgotPassword && (
              <div className="mt-6 bg-yellow-50 rounded-xl p-4 flex items-start space-x-3 border border-yellow-200">
                <div className="bg-yellow-600 rounded-full p-1.5 flex-shrink-0 mt-0.5">
                  <Info className="h-3 w-3 text-white" />
                </div>
                <p className="text-[13px] text-yellow-800 leading-relaxed">
                  Security Tip: If you forgot your password, we'll send a secure One-Time Password (OTP) to your registered mobile number or a reset link to your email for a safe reset.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2024 PearlMom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;