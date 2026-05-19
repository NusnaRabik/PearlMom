import React from 'react';
import { 
  User, 
  Camera, 
  Lock, 
  Bell, 
  Shield, 
  Key, 
  ShieldCheck, 
  Download, 
  Ban, 
  History, 
  Monitor, 
  Smartphone, 
  Tablet,
  PersonStanding,
  ChevronRight,
  Mail,
  MessageSquare
} from 'lucide-react';

const MotherProfileSettings = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 font-sans min-h-screen bg-[#fbfbfd]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#1a6685] tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1 text-base font-medium">Manage your maternal health profile and application preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
        
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-6 h-6 text-[#1a6685]" />
            <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
          </div>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-[0_2px_10px_rgb(0,0,0,0.08)]"
              />
              <button className="absolute bottom-0 right-0 bg-[#1a6685] text-white p-1.5 rounded-full shadow-sm hover:bg-[#165a78] transition-colors border-2 border-white">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Your Profile Photo</h3>
              <p className="text-xs text-slate-500 mt-1">Recommended size 400x400px</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                defaultValue="Elena Rodriguez"
                className="w-full bg-[#f3f4f6] border-none rounded-xl px-4 py-3 text-[14px] text-slate-800 font-medium focus:ring-2 focus:ring-[#1a6685]/20 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2 ml-1">Email Address</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  defaultValue="elena.r@example.com"
                  className="flex-1 w-full bg-[#f3f4f6] border-none rounded-xl px-4 py-3 text-[14px] text-slate-800 font-medium focus:ring-2 focus:ring-[#1a6685]/20 outline-none" 
                />
                <button className="bg-[#86efac] text-[#14532d] hover:bg-[#6ce295] font-bold text-xs px-4 rounded-xl transition-colors shrink-0">
                  Verify
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2 ml-1">Mobile Number</label>
              <div className="flex gap-2">
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 0123"
                  className="flex-1 w-full bg-[#f3f4f6] border-none rounded-xl px-4 py-3 text-[14px] text-slate-800 font-medium focus:ring-2 focus:ring-[#1a6685]/20 outline-none" 
                />
                <button className="bg-[#86efac] text-[#14532d] hover:bg-[#6ce295] font-bold text-xs px-4 rounded-xl transition-colors shrink-0">
                  Re-verify
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 mb-2 ml-1">Mother ID <span className="text-slate-400 font-normal">(READ-ONLY)</span></label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="MTH-2024-000123"
                  readOnly
                  className="w-full bg-[#f3f4f6] border-none rounded-xl px-4 py-3 text-[14px] text-slate-500 font-medium outline-none cursor-not-allowed" 
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-800 mb-2 ml-1">Home Address</label>
              <textarea 
                rows="2"
                defaultValue="124 Serenity Lane, Maplewood, NJ 07040"
                className="w-full bg-[#f3f4f6] border-none rounded-xl px-4 py-3 text-[14px] text-slate-800 font-medium focus:ring-2 focus:ring-[#1a6685]/20 outline-none resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Maternal Profile */}
        <div className="lg:col-span-1 bg-[#0b7489] rounded-[2rem] p-8 shadow-md text-white flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <PersonStanding className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold">Maternal Profile</h2>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 mb-6 backdrop-blur-sm border border-white/5">
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Pregnancy Status</div>
            <div className="text-lg font-bold">Active • 24 Weeks</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">EDD</div>
              <div className="text-sm font-bold">Oct 24, 2024</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Blood Group</div>
              <div className="text-sm font-bold flex items-center">
                O Positive
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm mt-auto border border-white/5">
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Emergency Contact</div>
            <div className="text-sm font-bold mb-0.5">Marco Rodriguez</div>
            <div className="text-xs text-white/80">+1 (555) 0987</div>
          </div>
        </div>

        {/* Communication */}
        <div className="lg:col-span-2 lg:col-start-1 bg-[#f3f4f6]/50 rounded-[2rem] p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="w-5 h-5 text-[#1a6685]" />
            <h2 className="text-xl font-bold text-slate-800">Communication</h2>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Email Notifications</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Weekly health summaries</p>
                </div>
              </div>
              {/* Toggle Switch Active */}
              <div className="w-12 h-6 bg-[#1a6685] rounded-full relative cursor-pointer flex items-center px-1 shrink-0 shadow-inner">
                 <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">SMS Alerts</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Critical health alerts</p>
                </div>
              </div>
              {/* Toggle Switch Active */}
              <div className="w-12 h-6 bg-[#1a6685] rounded-full relative cursor-pointer flex items-center px-1 shrink-0 shadow-inner">
                 <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-slate-800 mb-3 ml-1">Preferred Reminder Timing</h3>
            <div className="flex flex-wrap gap-2">
              <button className="bg-[#1a6685] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-sm transition-colors">Morning</button>
              <button className="bg-[#e5e7eb] text-slate-600 hover:bg-[#d1d5db] px-5 py-2.5 rounded-full text-xs font-bold transition-colors">Afternoon</button>
              <button className="bg-[#e5e7eb] text-slate-600 hover:bg-[#d1d5db] px-5 py-2.5 rounded-full text-xs font-bold transition-colors">Evening</button>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="lg:col-span-1 bg-[#f3f4f6]/50 rounded-[2rem] p-8 border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-5 h-5 text-[#1a6685]" />
            <h2 className="text-xl font-bold text-slate-800">Security & Privacy</h2>
          </div>

          <div className="space-y-4 flex-1">
            <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-50 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-[#1a6685]" />
                <span className="font-bold text-slate-800 text-sm">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#1a6685]" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Two-Factor Auth</h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Add a layer of security</p>
                </div>
              </div>
              {/* Toggle Switch Inactive */}
              <div className="w-10 h-5 bg-slate-300 rounded-full relative cursor-pointer flex items-center px-0.5 shrink-0 shadow-inner">
                 <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button className="flex items-center gap-2 text-[11px] font-bold text-[#1a6685] hover:text-[#165a78] transition-colors w-full p-2 hover:bg-slate-100 rounded-lg">
              <Download className="w-3.5 h-3.5" /> Download Health Data (JSON/PDF)
            </button>
            <button className="flex items-center gap-2 text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors w-full p-2 hover:bg-red-50 rounded-lg">
              <Ban className="w-3.5 h-3.5" /> Deactivate Account
            </button>
          </div>
        </div>

        {/* Security Logs & Active Sessions */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-[#1a6685]" />
              <h2 className="text-xl font-bold text-slate-800">Security Logs & Active Sessions</h2>
            </div>
            <button className="text-[#1a6685] text-xs font-bold hover:underline underline-offset-4">
              Log out all other sessions
            </button>
          </div>

          <div className="space-y-4">
            {/* Session 1 */}
            <div className="bg-[#f8f9fa] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Monitor className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Chrome on macOS (Current)</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">San Francisco, USA • 192.168.1.1</p>
                </div>
              </div>
              <div className="bg-[#86efac] text-[#14532d] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest w-fit">
                Active Now
              </div>
            </div>

            {/* Session 2 */}
            <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Pearl Mom App on iPhone 15</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">San Francisco, USA • 2 hours ago</p>
                </div>
              </div>
              <button className="text-red-600 text-xs font-bold hover:text-red-700 w-fit">
                Terminate Session
              </button>
            </div>

            {/* Session 3 */}
            <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <Tablet className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Safari on iPad</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Austin, USA • Last login: Oct 12, 2023</p>
                </div>
              </div>
              <button className="text-red-600 text-xs font-bold hover:text-red-700 w-fit">
                Terminate Session
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Area */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-100 px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-40">
        <p className="text-xs text-slate-500 font-medium italic">Changes will be updated across all synced devices.</p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            Discard
          </button>
          <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#1a6685] hover:bg-[#165a78] transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>

    </div>
  );
};

export default MotherProfileSettings;
