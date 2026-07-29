import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronDown, User, Briefcase, Heart, CheckCircle2, Stethoscope } from 'lucide-react';
import PregnantWoman from '../../components/common/PregnantWoman';
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

    const normalizedPassword = formData.password.trim();
    const normalizedConfirmPassword = formData.confirmPassword.trim();

    if (normalizedPassword !== normalizedConfirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (normalizedPassword.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);

    // Prepare the registration data
    const registrationData = {
      fullName: formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim().toLowerCase(),
      password: normalizedPassword,
      role: joinAs.toLowerCase()
    };

    console.log('Submitting registration:', registrationData);
    const result = await handleRegister(registrationData, register);

    console.log('Registration result:', result);
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
      
      // Navigate after a short delay
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
    <div className="min-h-screen flex flex-col font-sans bg-[#faf9fa] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full md:w-1/2 h-full bg-[#fce5eb] rounded-br-[15rem] -z-0 opacity-50"></div>
      <div className="absolute top-6 left-8 z-10 md:top-8 md:left-12">
        <Link to="/" className="group flex items-center space-x-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-[#b00b46] rounded-xl blur-md opacity-30 transition-opacity"></div>
            <div className="relative w-9 h-9 bg-gradient-to-br from-[#b00b46] to-[#8e0838] rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white fill-white/20" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-lg leading-tight tracking-tight">PearlMom</span>
            <span className="text-[10px] text-gray-400 -mt-0.5">Maternal Health</span>
          </div>
        </Link>
      </div>

      <main className="flex-grow max-w-[1300px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 md:py-16 pt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          <div className="lg:w-[45%] flex flex-col pt-8">
            <div className="inline-block mb-6">
              <span className="bg-[#b00b46] text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                Join the Sanctuary
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              Begin your journey<br />to <span className="italic text-[#b00b46]">radiant</span><br />motherhood.
            </h1>
            <p className="text-slate-600 text-base lg:text-lg mb-10 leading-relaxed max-w-[90%] font-light">
              Whether you are an expectant mother seeking care or a provider offering expertise, PearlMom is your digital home for maternal health excellence.
            </p>
            <div className="mt-8 relative">
              <div className="absolute inset-0 bg-[#fae6ec] rounded-[2.5rem] transform -translate-x-4 translate-y-4 -z-10"></div>
              <img 
                src={joinAs === 'Mother' ? motherImage : doctorImage} 
                alt={`${joinAs} registration`} 
                className="w-full max-w-[480px] aspect-[4/5] rounded-[2.5rem] object-cover shadow-lg border-4 border-white"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full max-w-[480px] aspect-[4/5] bg-[#fae6ec] rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-lg"><span class="text-6xl">📋</span></div>';
                }}
              />
            </div>
          </div>

          <div className="lg:w-[55%]">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 lg:p-12 border border-white/50">
              
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                  <p className="text-gray-500 mb-2">Your account has been created.</p>
                  <p className="text-sm text-[#b00b46] font-medium">Redirecting to your dashboard...</p>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Register as</p>
                    <div className="flex bg-[#eef3fb] p-1.5 rounded-2xl">
                      <button type="button" onClick={() => setJoinAs('Mother')}
                        className={`flex-1 py-4 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Mother' ? 'bg-[#fce5eb] border border-[#b00b46] text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <PregnantWoman className={`h-5 w-5 mb-1.5 ${joinAs === 'Mother' ? 'text-gray-900' : 'text-gray-400'}`} />
                        <span className="text-[13px] font-medium">Mother</span>
                      </button>
                      <button type="button" onClick={() => setJoinAs('Provider')}
                        className={`flex-1 py-4 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Provider' ? 'bg-white border border-[#b00b46] text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Stethoscope className={`h-5 w-5 mb-1.5 ${joinAs === 'Provider' ? 'text-gray-900' : 'text-gray-400'}`} />
                        <span className="text-[13px] font-medium">Provider</span>
                      </button>
                    </div>
                  </div>

                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-1.5 h-6 bg-[#b00b46] rounded-full mr-3"></div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Account Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                          <input type="text" name="fullName" required placeholder="Jane Doe" value={formData.fullName} onChange={handleInputChange}
                            className="w-full bg-[#eff4fb] border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#b00b46] focus:ring-2 focus:ring-[#b00b46]/20 outline-none transition-all placeholder:text-gray-400 text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                          <input type="tel" name="mobile" required placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={handleInputChange}
                            className="w-full bg-[#eff4fb] border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#b00b46] focus:ring-2 focus:ring-[#b00b46]/20 outline-none transition-all placeholder:text-gray-400 text-slate-800" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                          <input type="email" name="email" required placeholder="jane@example.com" value={formData.email} onChange={handleInputChange}
                            className="w-full bg-[#eff4fb] border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#b00b46] focus:ring-2 focus:ring-[#b00b46]/20 outline-none transition-all placeholder:text-gray-400 text-slate-800" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                          <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleInputChange}
                            className="w-full bg-[#eff4fb] border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#b00b46] focus:ring-2 focus:ring-[#b00b46]/20 outline-none transition-all placeholder:text-gray-400 tracking-widest text-slate-800" />
                          {passwordStrength && (
                            <>
                              <div className="flex gap-1 mt-3 mb-1.5 px-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div key={level} className={`h-1 flex-1 rounded-full ${level <= parseInt(passwordStrength.width.split('-')[1]) ? passwordStrength.color : 'bg-slate-200'}`}></div>
                                ))}
                              </div>
                              <p className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${passwordStrength.textColor}`}>Strength: {passwordStrength.label}</p>
                            </>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                          <input type="password" name="confirmPassword" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange}
                            className="w-full bg-[#eff4fb] border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#b00b46] focus:ring-2 focus:ring-[#b00b46]/20 outline-none transition-all placeholder:text-gray-400 tracking-widest text-slate-800" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="flex items-center mb-8 bg-[#eff4fb] p-4 rounded-xl">
                        <input id="terms" type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-[#b00b46] focus:ring-[#b00b46] focus:ring-offset-0 cursor-pointer transition-colors bg-white" />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                          I agree to the <a href="#" className="font-semibold text-[#b00b46] hover:underline">Terms & Conditions</a> and <a href="#" className="font-semibold text-[#b00b46] hover:underline">Privacy Policy</a>.
                        </label>
                      </div>

                      <button type="submit" disabled={isSubmitting}
                        className={`group w-full flex justify-center items-center py-4 px-4 rounded-full shadow-md text-sm font-bold text-white transition-all duration-300 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#b00b46] hover:bg-[#8e0838] hover:shadow-lg hover:-translate-y-0.5'}`}>
                        {isSubmitting ? 'Creating Account...' : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
                      </button>

                      <div className="mt-8 text-center">
                        <p className="text-[14px] text-gray-600">
                          Already have an account? <Link to="/login" className="font-bold text-[#b00b46] hover:underline">Log In</Link>
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