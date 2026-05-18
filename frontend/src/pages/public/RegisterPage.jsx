import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronDown, User, Briefcase, Heart, CheckCircle2 } from 'lucide-react';
import motherImage from '../../assets/mother.png';
import doctorImage from '../../assets/doctor_tablet.png';
import adminImage from '../../assets/mother.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [joinAs, setJoinAs] = useState('Mother');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate registration API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Navigate based on role after showing success
      setTimeout(() => {
        if (joinAs === 'Mother') {
          navigate('/mother/dashboard');
        } else if (joinAs === 'Provider') {
          navigate('/provider/dashboard');
        }
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbfbfd]">
      {/* Top Left Logo */}
      <div className="absolute top-6 left-8 z-10 md:top-8 md:left-12">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-pink-900 font-bold text-xl tracking-tight">PEARL MOM</span>
        </Link>
      </div>

      <main className="flex-grow max-w-[1300px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 md:py-16 pt-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Side */}
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

          {/* Right Side - Form */}
          <div className="lg:w-[58%]">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 p-8 sm:p-10 lg:p-12 transition-shadow hover:shadow-[0_8px_50px_rgb(0,0,0,0.06)] duration-500">
              
              {/* Success Message */}
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                  <p className="text-gray-500 mb-2">
                    Your {joinAs === 'Mother' ? 'Mother' : 'Provider'} account has been created.
                  </p>
                  <p className="text-sm text-pink-600 font-medium">
                    Redirecting to your dashboard...
                  </p>
                </div>
              ) : (
                <>
                  {/* Join As Toggle */}
                  <div className="mb-12">
                    <p className="text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-wider">I am joining as a:</p>
                    <div className="flex gap-3 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100/80">
                      <button 
                        type="button"
                        onClick={() => setJoinAs('Mother')}
                        className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Mother' ? 'bg-white shadow-sm border border-pink-200 text-pink-600 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                      >
                        <User className={`h-5 w-5 mb-2 transition-colors ${joinAs === 'Mother' ? 'text-pink-600' : 'text-slate-400'}`} />
                        <span className="text-[13px] font-semibold tracking-wide">Mother</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setJoinAs('Provider')}
                        className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Provider' ? 'bg-white shadow-sm border border-pink-200 text-pink-600 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                      >
                        <Briefcase className={`h-5 w-5 mb-2 transition-colors ${joinAs === 'Provider' ? 'text-pink-600' : 'text-slate-400'}`} />
                        <span className="text-[13px] font-semibold tracking-wide">Provider</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* Account Information */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-pink-500 to-pink-600 rounded-r-full mr-3 shadow-sm"></div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Account Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                          <input type="text" required placeholder="Jane Doe" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                          <input type="tel" required placeholder="+94 77 123 4567" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                          <input type="email" required placeholder="jane@example.com" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Password</label>
                          <input type="password" required placeholder="••••••••" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 tracking-widest text-slate-800 font-medium hover:border-slate-300" />
                          <div className="flex gap-1 mt-3 mb-1.5 px-1">
                            <div className="h-1 flex-1 bg-pink-400 rounded-full"></div>
                            <div className="h-1 flex-1 bg-pink-400 rounded-full"></div>
                            <div className="h-1 flex-1 bg-pink-200 rounded-full"></div>
                            <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
                          </div>
                          <p className="text-[10px] font-bold text-pink-700 uppercase tracking-wider ml-1">Strength: Moderate</p>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                          <input type="password" required placeholder="••••••••" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 tracking-widest text-slate-800 font-medium hover:border-slate-300" />
                        </div>
                      </div>
                    </div>

                    {/* Role Specific Details */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-pink-500 to-pink-600 rounded-r-full mr-3 shadow-sm"></div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                          {joinAs === 'Mother' ? 'Mother Details' : 'Provider Details'}
                        </h3>
                      </div>
                      
                      {joinAs === 'Mother' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Expected Due Date (EDD)</label>
                            <div className="relative group">
                              <input type="date" required className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium group-hover:border-slate-300" />
                              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-colors group-hover:text-slate-500" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Blood Group (Optional)</label>
                            <div className="relative group">
                              <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-slate-800 font-medium appearance-none group-hover:border-slate-300 cursor-pointer">
                                <option value="" disabled selected className="text-slate-400">Select Group</option>
                                <option value="A+">A+</option>
                                <option value="O+">O+</option>
                                <option value="B+">B+</option>
                                <option value="AB+">AB+</option>
                                <option value="A-">A-</option>
                                <option value="O-">O-</option>
                                <option value="B-">B-</option>
                                <option value="AB-">AB-</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-colors group-hover:text-slate-500" />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Home Address</label>
                            <textarea required placeholder="Enter your residential address" rows="3" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium resize-none hover:border-slate-300"></textarea>
                          </div>
                        </div>
                      )}

                      {joinAs === 'Provider' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Employee ID</label>
                            <input type="text" required placeholder="e.g. PR-8492" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Designation</label>
                            <div className="relative group">
                              <select required className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-slate-800 font-medium appearance-none group-hover:border-slate-300 cursor-pointer">
                                <option value="" disabled selected className="text-slate-400">Select Designation</option>
                                <option value="Midwife">Midwife</option>
                                <option value="Medical Officer">Medical Officer</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-colors group-hover:text-slate-500" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Assigned Area / Clinic</label>
                            <input type="text" required placeholder="Clinic Name" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Contact Number</label>
                            <input type="tel" required placeholder="+94 77 000 0000" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Terms and Submit */}
                    <div className="pt-4">
                      <div className="flex items-start mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center h-5 mt-0.5">
                          <input id="terms" type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer transition-colors" />
                        </div>
                        <label htmlFor="terms" className="ml-3 text-[13px] text-slate-600 leading-relaxed cursor-pointer select-none">
                          I agree to the <a href="#" className="font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-2 decoration-pink-300">Terms & Conditions</a> and <a href="#" className="font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-2 decoration-pink-300">Privacy Policy</a>. I understand my data will be stored securely and handled with medical confidentiality.
                        </label>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`group w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg text-base font-bold text-white transition-all duration-300 ${
                          isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/25 hover:shadow-xl hover:shadow-pink-600/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-pink-500/20'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>

                      <div className="mt-8 text-center">
                        <p className="text-[14px] text-slate-500">
                          Already have an account? <Link to="/login" className="font-bold text-pink-600 hover:text-pink-700 transition-colors hover:underline underline-offset-4 decoration-pink-300">Login here</Link>
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2024 PearlMom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;