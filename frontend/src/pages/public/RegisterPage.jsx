import React, { useState } from 'react';
import { ArrowRight, Calendar, ChevronDown, User, Briefcase, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import motherImage from '../../assets/mother.png';
import doctorImage from '../../assets/doctor_tablet.png';
import adminImage from '../../assets/mother.png';

const RegisterPage = () => {
  const [joinAs, setJoinAs] = useState('Mother');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbfbfd]">
      <Navbar />

      <main className="flex-grow max-w-[1300px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Side */}
          <div className="lg:w-[42%] flex flex-col pt-4">
            <div className="inline-block mb-6">
              <span className="bg-[#a6f4c5] text-[#067647] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
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
                src={joinAs === 'Mother' ? motherImage : joinAs === 'Provider' ? doctorImage : adminImage} 
                alt={`${joinAs} registration`} 
                className="w-full max-w-[440px] aspect-[4/3] rounded-3xl object-cover shadow-md"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-[58%]">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 p-8 sm:p-10 lg:p-12 transition-shadow hover:shadow-[0_8px_50px_rgb(0,0,0,0.06)] duration-500">
              
              {/* Join As Toggle */}
              <div className="mb-12">
                <p className="text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-wider">I am joining as a:</p>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100/80">
                  <button 
                    onClick={() => setJoinAs('Mother')}
                    className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Mother' ? 'bg-white shadow-sm border border-slate-200 text-[#2280a5] scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                  >
                    <User className={`h-5 w-5 mb-2 transition-colors ${joinAs === 'Mother' ? 'text-[#2280a5]' : 'text-slate-400'}`} />
                    <span className="text-[13px] font-semibold tracking-wide">Mother</span>
                  </button>
                  <button 
                    onClick={() => setJoinAs('Provider')}
                    className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Provider' ? 'bg-white shadow-sm border border-slate-200 text-[#2280a5] scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                  >
                    <Briefcase className={`h-5 w-5 mb-2 transition-colors ${joinAs === 'Provider' ? 'text-[#2280a5]' : 'text-slate-400'}`} />
                    <span className="text-[13px] font-semibold tracking-wide">Provider</span>
                  </button>
                  <button 
                    onClick={() => setJoinAs('Admin')}
                    className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${joinAs === 'Admin' ? 'bg-white shadow-sm border border-slate-200 text-[#2280a5] scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                  >
                    <ShieldCheck className={`h-5 w-5 mb-2 transition-colors ${joinAs === 'Admin' ? 'text-[#2280a5]' : 'text-slate-400'}`} />
                    <span className="text-[13px] font-semibold tracking-wide">Admin</span>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form className="space-y-10">
                
                {/* Account Information */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-[#2280a5] to-[#1a6685] rounded-r-full mr-3 shadow-sm"></div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Account Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                      <input type="text" placeholder="Jane Doe" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Mobile Number (Username)</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                      <input type="email" placeholder="jane@example.com" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 tracking-widest text-slate-800 font-medium hover:border-slate-300" />
                      {/* Password Strength indicator */}
                      <div className="flex gap-1 mt-3 mb-1.5 px-1">
                        <div className="h-1 flex-1 bg-[#2DBB81] rounded-full shadow-[0_0_5px_rgba(45,187,129,0.4)]"></div>
                        <div className="h-1 flex-1 bg-[#2DBB81] rounded-full shadow-[0_0_5px_rgba(45,187,129,0.4)]"></div>
                        <div className="h-1 flex-1 bg-[#a6f4c5] rounded-full"></div>
                        <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
                      </div>
                      <p className="text-[10px] font-bold text-[#067647] uppercase tracking-wider ml-1">Strength: Moderate</p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 tracking-widest text-slate-800 font-medium hover:border-slate-300" />
                    </div>
                  </div>
                </div>

                {/* Role Specific Details */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-[#2280a5] to-[#1a6685] rounded-r-full mr-3 shadow-sm"></div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                      {joinAs === 'Mother' ? 'Mother Details' : joinAs === 'Provider' ? 'Provider Details' : 'Admin Details'}
                    </h3>
                  </div>
                  
                  {joinAs === 'Mother' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Expected Due Date (EDD)</label>
                        <div className="relative group">
                          <input type="text" placeholder="mm/dd/yyyy" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium group-hover:border-slate-300" />
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-colors group-hover:text-slate-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Blood Group (Optional)</label>
                        <div className="relative group">
                          <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all text-slate-800 font-medium appearance-none group-hover:border-slate-300 cursor-pointer">
                            <option value="" disabled selected className="text-slate-400">Select Group</option>
                            <option value="A+">A+</option>
                            <option value="O+">O+</option>
                            <option value="B+">B+</option>
                            <option value="AB+">AB+</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-colors group-hover:text-slate-500" />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Home Address</label>
                        <textarea placeholder="Enter your residential address" rows="3" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium resize-none hover:border-slate-300"></textarea>
                      </div>
                    </div>
                  )}

                  {joinAs === 'Provider' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Employee ID</label>
                        <input type="text" placeholder="e.g. PR-8492" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Designation</label>
                        <div className="relative group">
                          <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all text-slate-800 font-medium appearance-none group-hover:border-slate-300 cursor-pointer">
                            <option value="" disabled selected className="text-slate-400">Select Designation</option>
                            <option value="Midwife">Midwife</option>
                            <option value="Medical Officer">Medical Officer</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-colors group-hover:text-slate-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Assigned Area / Clinic</label>
                        <input type="text" placeholder="Clinic Name" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Contact Number</label>
                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                      </div>
                    </div>
                  )}

                  {joinAs === 'Admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Employee ID</label>
                        <input type="text" placeholder="e.g. AD-1024" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Admin Level</label>
                        <div className="relative group">
                          <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-11 py-3.5 text-[15px] focus:bg-white focus:border-[#2280a5] focus:ring-4 focus:ring-[#2280a5]/10 outline-none transition-all text-slate-800 font-medium appearance-none group-hover:border-slate-300 cursor-pointer">
                            <option value="" disabled selected className="text-slate-400">Select Level</option>
                            <option value="Super Admin">Super Admin</option>
                            <option value="Moderator">Moderator</option>
                            <option value="System Admin">System Admin</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-colors group-hover:text-slate-500" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms and Submit */}
                <div className="pt-4">
                  <div className="flex items-start mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center h-5 mt-0.5">
                      <input id="terms" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#2280a5] focus:ring-[#2280a5] focus:ring-offset-0 cursor-pointer transition-colors" />
                    </div>
                    <label htmlFor="terms" className="ml-3 text-[13px] text-slate-600 leading-relaxed cursor-pointer select-none">
                      I agree to the <a href="#" className="font-semibold text-[#2280a5] hover:text-[#1a6685] underline underline-offset-2 decoration-[#2280a5]/30">Terms & Conditions</a> and <a href="#" className="font-semibold text-[#2280a5] hover:text-[#1a6685] underline underline-offset-2 decoration-[#2280a5]/30">Privacy Policy</a>. I understand my data will be stored securely and handled with medical confidentiality.
                    </label>
                  </div>

                  <button type="submit" className="group w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg shadow-[#2280a5]/25 text-base font-bold text-white bg-[#2280a5] hover:bg-[#1a6685] hover:shadow-xl hover:shadow-[#2280a5]/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#2280a5]/20 transition-all duration-300">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="mt-8 text-center">
                    <p className="text-[14px] text-slate-500">
                      Already have an account? <a href="/login" className="font-bold text-[#165a78] hover:text-[#11455c] transition-colors hover:underline underline-offset-4 decoration-[#165a78]/30">Login here</a>
                    </p>
                  </div>
                </div>

              </form>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
