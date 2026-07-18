import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Info, User, Briefcase, UserCog, UserCircle, Stethoscope } from 'lucide-react';
import PregnantWoman from '../../components/common/PregnantWoman';
import { useAuth } from '../../context/AuthContext';
import { useAuthHook } from '../../hooks/useAuth';
import babyHandImage from '../../assets/baby_hand.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { handleLogin, checkPasswordStrength } = useAuthHook();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAs, setLoginAs] = useState('mother');
  const [formData, setFormData] = useState({ fullName: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.fullName || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const normalizedFullName = formData.fullName.trim();
      console.log('Attempting login with:', { fullName: normalizedFullName, role: loginAs });
      
      const result = await handleLogin(
        { fullName: normalizedFullName, password: formData.password, role: loginAs },
        login
      );

      console.log('Login result in component:', result);

      if (result.success) {
        console.log('Login successful, role:', result.role);
        
        // Get user from localStorage to verify role
        const storedUser = localStorage.getItem('pearlmom_user');
        const userData = storedUser ? JSON.parse(storedUser) : null;
        const userRole = result.role || userData?.role;
        
        console.log('Navigating with role:', userRole);
        
        // Navigate based on role - DO THIS HERE, not in hook
        if (userRole === 'mother') {
          navigate('/mother/dashboard');
        } else if (userRole === 'midwife' || userRole === 'doctor') {
          navigate('/provider/dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    const demoFullNames = { 
      mother: 'Elena Richardson', 
      provider: 'Dr. Sarah Perera', 
      admin: 'Admin User' 
    };
    
    console.log('Demo login with:', { fullName: demoFullNames[role], role: role });
    
    const result = await handleLogin(
      { fullName: demoFullNames[role], password: 'password', role: role },
      login
    );
    
    console.log('Demo login result:', result);
    setLoading(false);
  };

  // Password strength for display
  const passwordStrength = formData.password ? checkPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-slate-50 to-slate-100"></div>
      <div className="absolute top-6 left-8 z-10 md:top-8 md:left-12">
        <Link to="/" className="text-pink-900 font-bold text-xl tracking-tight">PEARL MOM</Link>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 pt-20">
        <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          <div className="md:w-1/2 relative p-10 md:p-14 lg:p-16 text-white overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 z-0 mix-blend-overlay opacity-[0.35]"
              style={{ backgroundImage: `url(${babyHandImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-pink-700 to-pink-500 z-0 mix-blend-multiply" />
            <div className="absolute inset-0 bg-pink-900/80 z-0" />
            <div className="relative z-10 pt-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 tracking-tight">Welcome to your<br />Maternal Sanctuary.</h1>
              <p className="text-pink-50 text-base md:text-lg max-w-sm font-light leading-relaxed">Access your personalized care insights and connect with your dedicated support team.</p>
            </div>
            <div className="relative z-10 mt-16 md:mt-auto">
              <div className="inline-flex items-center space-x-2.5 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white tracking-wide">HIPAA Compliant Security</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-500 mb-6 text-sm md:text-base">Secure access to your maternal health journey</p>
            
            <div className="mb-6">
              <p className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Login as:</p>
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
                {['mother', 'provider', 'admin'].map((role) => (
                  <button key={role} type="button" onClick={() => { setLoginAs(role); setError(''); }}
                    className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all ${loginAs === role ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {role === 'mother' ? <PregnantWoman size={16} /> : role === 'provider' ? <Stethoscope size={16} /> : <UserCog size={16} />}
                    <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                <Info size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email or Full Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-slate-900 placeholder-slate-400 outline-none"
                    placeholder="Enter your email or full name" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange}
                    className="block w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-slate-900 tracking-widest outline-none"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      <div className={`h-1 flex-1 rounded-full ${passwordStrength.width}`} style={{ backgroundColor: passwordStrength.color }}></div>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${passwordStrength.textColor}`}>
                      Strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center pt-2">
                <input id="remember-me" name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleInputChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-slate-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer select-none">Remember me for 30 days</label>
              </div>

              <button type="submit" disabled={loading}
                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white transition-all mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'}`}>
                {loading ? 'Logging in...' : <>Login as {loginAs.charAt(0).toUpperCase() + loginAs.slice(1)} <ArrowRight className="ml-2 h-5 w-5" /></>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">Need an account? <Link to="/register" className="font-semibold text-pink-600 hover:text-pink-700">Register Here</Link></p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2024 PearlMom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;