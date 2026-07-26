import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Info, User, Briefcase, UserCog, UserCircle, Stethoscope, Heart } from 'lucide-react';
import PregnantWoman from '../../components/common/PregnantWoman';
import { useAuth } from '../../context/AuthContext';
import { useAuthHook } from '../../hooks/useAuth';
import newBabyLoginImage from '../../assets/newbabylogin.png';

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
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden bg-[#fafafa]">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 pt-10">
        <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

          <div className="md:w-1/2 relative p-10 md:p-14 lg:p-16 text-white overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 z-0"
              style={{ backgroundImage: `url(${newBabyLoginImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-[#c8378d] to-[#802a4b] mix-blend-multiply opacity-80 z-0" />
            <div className="absolute inset-0 bg-pink-900/20 z-0" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <Link to="/" className="group flex items-center space-x-2.5 mb-8 inline-flex">
                  <div className="relative">
                    <div className="absolute inset-0 bg-pink-500 rounded-xl blur-md opacity-50"></div>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Heart className="w-4 h-4 text-white fill-white/20" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-lg leading-tight tracking-tight">PearlMom</span>
                    <span className="text-[10px] text-pink-100 -mt-0.5">Maternal Health</span>
                  </div>
                </Link>
                <h1 className="text-5xl md:text-[3.5rem] font-bold leading-tight tracking-tight text-white/80">
                  Welcome to<br />
                  your<br />
                  Maternal<br />
                  Sanctuary.
                </h1>
              </div>
              <div className="mt-16 md:mt-auto">
                <div className="inline-flex items-start space-x-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-white/80 leading-relaxed">
                    Access your personalized care insights and connect with your dedicated support team.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-500 mb-8 text-sm">Secure access to your maternal health journey</p>

            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Login as:</p>
              <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100">
                {['mother', 'provider', 'admin'].map((role) => (
                  <button key={role} type="button" onClick={() => { setLoginAs(role); setError(''); }}
                    className={`flex-1 py-2 px-3 rounded-full flex items-center justify-center space-x-2 text-sm font-medium transition-all ${loginAs === role ? 'bg-white text-pink-600 shadow-sm border border-pink-100' : 'text-slate-500 hover:text-slate-700'}`}>
                    {role === 'mother' ? <User size={15} /> : role === 'provider' ? <Briefcase size={15} /> : <UserCog size={15} />}
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
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Email or Full Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-full bg-[#fcfcfc] focus:bg-white focus:ring-1 focus:ring-pink-300 focus:border-pink-300 transition-all text-slate-900 placeholder-slate-400 text-sm outline-none"
                    placeholder="Enter your email or full name" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange}
                    className="block w-full pl-11 pr-11 py-3 border border-slate-200 rounded-full bg-[#fcfcfc] focus:bg-white focus:ring-1 focus:ring-pink-300 focus:border-pink-300 transition-all text-slate-900 tracking-widest text-sm outline-none"
                    placeholder="•••••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300`} style={{ width: '80%', backgroundColor: '#22c55e' }}></div>
                    </div>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 text-green-500`}>
                      STRENGTH: STRONG
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center pt-2">
                <input id="remember-me" name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleInputChange}
                  className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-slate-300 rounded-full cursor-pointer appearance-none checked:bg-pink-500 checked:border-transparent bg-white border" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-500 cursor-pointer select-none">Remember me for 30 days</label>
              </div>

              <button type="submit" disabled={loading}
                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-md text-sm font-semibold text-white transition-all mt-6 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#e7429b] to-[#d73281] hover:opacity-90'}`}>
                {loading ? 'Logging in...' : <>Login as {loginAs.charAt(0).toUpperCase() + loginAs.slice(1)} <ArrowRight className="ml-2 h-4 w-4" /></>}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">Need an account? <Link to="/register" className="font-bold text-pink-500 hover:text-pink-600">Register Here</Link></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;