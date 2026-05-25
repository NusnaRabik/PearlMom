import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronDown, User, Briefcase, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAuthHook } from '../../hooks/useAuth';
import motherImage from '../../assets/mother.png';
import doctorImage from '../../assets/doctor_tablet.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { handleRegister, checkPasswordStrength, validateEmail, validateMobile } = useAuthHook();
  const [joinAs, setJoinAs] = useState('Mother');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const passwordStrength = formData.password ? checkPasswordStrength(formData.password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName || !formData.mobile || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (!validateMobile(formData.mobile)) {
      setFormError('Please enter a valid mobile number');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);

    // Prepare the registration data
    const registrationData = {
      fullName: formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: joinAs.toLowerCase()
    };

    console.log('Submitting registration:', registrationData);
    const result = await handleRegister(registrationData, register);

    setIsSubmitting(false);

    if (result.success) {
      // Set registration flags based on role
      if (joinAs.toLowerCase() === 'mother') {
        localStorage.setItem('pearlmom_new_registration', 'true');
        localStorage.removeItem('pearlmom_mother_profile_complete');
      } else if (joinAs.toLowerCase() === 'provider') {
        localStorage.setItem('pearlmom_provider_new_registration', 'true');
        localStorage.removeItem('pearlmom_provider_profile_complete');
      }
      
      setSubmitSuccess(true);
      setTimeout(() => {
        if (result.role === 'mother') {
          navigate('/mother/dashboard');
        } else if (result.role === 'midwife' || result.role === 'doctor') {
          navigate('/provider/dashboard');
        } else if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/login');
        }
      }, 1500);
    } else {
      setFormError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbfbfd]">
      <div className="absolute top-6 left-8 z-10 md:top-8 md:left-12">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-pink-900 font-bold text-xl tracking-tight">PEARL MOM</span>
        </Link>
      </div>

      <main className="flex-grow max-w-[1300px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 md:py-16 pt-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="lg:w-[42%] flex flex-col pt-4">
            <div className="inline-block mb-6">
              <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                Join the Sanctuary
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Begin your journey<br />to radiant<br />motherhood.
            </h1>
            <p className="text-slate-600 text-base lg:text-lg mb-10 leading-relaxed max-w-[90%] font-light">
              Whether you are an expectant mother seeking care or a provider offering expertise, PEARL MOM is your digital home for maternal health excellence.
            </p>
            <div className="mt-4">
              <img 
                src={joinAs === 'Mother' ? motherImage : doctorImage} 
                alt={`${joinAs} registration`} 
                className="w-full max-w-[440px] aspect-[4/3] rounded-3xl object-cover shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full max-w-[440px] aspect-[4/3] bg-gradient-to-br from-pink-200 to-pink-300 rounded-3xl flex items-center justify-center shadow-md"><span class="text-6xl">📋</span></div>';
                }}
              />
            </div>
          </div>

          <div className="lg:w-[58%]">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 p-8 sm:p-10 lg:p-12">
              
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                  <p className="text-gray-500 mb-2">Your account has been created.</p>
                  <p className="text-sm text-pink-600 font-medium">Redirecting to your dashboard...</p>
                </div>
              ) : (
                <>
                  <div className="mb-12">
                    <p className="text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-wider">I am joining as a:</p>
                    <div className="flex gap-3 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100/80">
                      <button type="button" onClick={() => setJoinAs('Mother')}
                        className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Mother' ? 'bg-white shadow-sm border border-pink-200 text-pink-600 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
                        <User className={`h-5 w-5 mb-2 transition-colors ${joinAs === 'Mother' ? 'text-pink-600' : 'text-slate-400'}`} />
                        <span className="text-[13px] font-semibold tracking-wide">Mother</span>
                      </button>
                      <button type="button" onClick={() => setJoinAs('Provider')}
                        className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Provider' ? 'bg-white shadow-sm border border-pink-200 text-pink-600 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
                        <Briefcase className={`h-5 w-5 mb-2 transition-colors ${joinAs === 'Provider' ? 'text-pink-600' : 'text-slate-400'}`} />
                        <span className="text-[13px] font-semibold tracking-wide">Provider</span>
                      </button>
                    </div>
                  </div>

                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-pink-500 to-pink-600 rounded-r-full mr-3 shadow-sm"></div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Account Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                          <input type="text" name="fullName" required placeholder="Jane Doe" value={formData.fullName} onChange={handleInputChange}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                          <input type="tel" name="mobile" required placeholder="+94 77 123 4567" value={formData.mobile} onChange={handleInputChange}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                          <input type="email" name="email" required placeholder="jane@example.com" value={formData.email} onChange={handleInputChange}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Password</label>
                          <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleInputChange}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 tracking-widest text-slate-800 font-medium hover:border-slate-300" />
                          {passwordStrength && (
                            <>
                              <div className="flex gap-1 mt-3 mb-1.5 px-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div key={level} className={`h-1 flex-1 rounded-full ${level <= parseInt(passwordStrength.width.split('-')[1]) ? passwordStrength.color : 'bg-slate-100'}`}></div>
                                ))}
                              </div>
                              <p className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${passwordStrength.textColor}`}>Strength: {passwordStrength.label}</p>
                            </>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                          <input type="password" name="confirmPassword" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 tracking-widest text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-start mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <input id="terms" type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-slate-300 text-pink-600 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer transition-colors" />
                        <label htmlFor="terms" className="ml-3 text-[13px] text-slate-600 leading-relaxed cursor-pointer select-none">
                          I agree to the <a href="#" className="font-semibold text-pink-600 hover:text-pink-700 underline">Terms & Conditions</a> and <a href="#" className="font-semibold text-pink-600 hover:text-pink-700 underline">Privacy Policy</a>.
                        </label>
                      </div>

                      <button type="submit" disabled={isSubmitting}
                        className={`group w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg text-base font-bold text-white transition-all duration-300 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/25 hover:shadow-xl hover:-translate-y-0.5'}`}>
                        {isSubmitting ? 'Creating Account...' : <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>}
                      </button>

                      <div className="mt-8 text-center">
                        <p className="text-[14px] text-slate-500">
                          Already have an account? <Link to="/login" className="font-bold text-pink-600 hover:text-pink-700">Login here</Link>
                        </p>
                      </div>
                    </div>
                  </form>
                </>
              )}
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

export default RegisterPage;