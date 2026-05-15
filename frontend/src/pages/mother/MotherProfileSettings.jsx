import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Bell, Shield, Smartphone, Monitor, ChevronRight, Lock, Eye, Download } from 'lucide-react';

const MotherProfileSettings = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0369a1] mb-2">Account Settings</h2>
        <p className="text-gray-500">Manage your maternal health profile and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="bg-white">
            <CardContent className="p-8">
               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                 <User className="h-5 w-5 mr-3 text-[#0369a1]" /> Personal Information
               </h3>
               
               <div className="flex items-center mb-8">
                 <div className="relative">
                   <div className="h-20 w-20 rounded-full border-4 border-white shadow-md bg-cover bg-center" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026704d)' }}></div>
                   <button className="absolute bottom-0 right-0 h-6 w-6 bg-[#0369a1] rounded-full text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#0284c7]">
                     <span className="text-[10px]">â</span>
                   </button>
                 </div>
                 <div className="ml-6">
                   <h4 className="font-bold text-gray-900 text-lg">Your Profile Photo</h4>
                   <p className="text-sm text-gray-500">Recommended size 400x400px</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                   <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                   <input type="text" defaultValue="Elena Rodriguez" className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-3 text-sm focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1] outline-none" />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                   <div className="flex gap-2">
                     <input type="email" defaultValue="elena.r@example.com" className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-3 text-sm focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1] outline-none" />
                     <button className="px-4 bg-[#86efac] text-green-900 font-semibold rounded-lg text-sm hover:bg-green-400 transition-colors">Verify</button>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-900 mb-2">Mobile Number</label>
                   <div className="flex gap-2">
                     <input type="tel" defaultValue="+1(555) 0123" className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-3 text-sm focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1] outline-none" />
                     <button className="px-4 bg-[#86efac] text-green-900 font-semibold rounded-lg text-sm whitespace-nowrap hover:bg-green-400 transition-colors">Re-verify</button>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center">Mother ID <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-2 font-normal">(READ-ONLY)</span></label>
                   <div className="relative">
                     <input type="text" defaultValue="MTH-2024-000123" readOnly className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed outline-none" />
                     <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                   </div>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-gray-900 mb-2">Home Address</label>
                 <textarea rows="3" defaultValue="124 Serenity Lane, Maplewood, NJ 07040" className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-3 text-sm focus:border-[#0369a1] focus:ring-1 focus:ring-[#0369a1] outline-none resize-none"></textarea>
               </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardContent className="p-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                   <Bell className="h-5 w-5 mr-3 text-[#0369a1]" /> Communication
                 </h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="flex items-center">
                       <span className="text-[#0f766e] mr-3">â¡</span>
                       <div>
                         <p className="font-semibold text-sm text-gray-900">Email Notifications</p>
                         <p className="text-xs text-gray-500">Weekly health summaries</p>
                       </div>
                     </div>
                     <div className="w-10 h-6 bg-[#0369a1] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                           <span className="text-[8px] text-[#0369a1]">â</span>
                        </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="flex items-center">
                       <span className="text-[#0f766e] mr-3">â¤</span>
                       <div>
                         <p className="font-semibold text-sm text-gray-900">SMS Alerts</p>
                         <p className="text-xs text-gray-500">Critical health alerts</p>
                       </div>
                     </div>
                     <div className="w-10 h-6 bg-[#0369a1] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                           <span className="text-[8px] text-[#0369a1]">â</span>
                        </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="mt-6">
                   <p className="text-sm font-semibold text-gray-900 mb-3">Preferred Reminder Timing</p>
                   <div className="flex gap-2">
                     <button className="px-4 py-2 bg-[#0369a1] text-white rounded-full text-sm font-medium">Morning</button>
                     <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">Afternoon</button>
                     <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">Evening</button>
                   </div>
                 </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                   <Shield className="h-5 w-5 mr-3 text-[#0369a1]" /> Security & Privacy
                 </h3>
                 <div className="space-y-4 mb-6">
                   <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                     <div className="flex items-center">
                       <span className="text-[#0369a1] mr-3">ð</span>
                       <span className="font-semibold text-sm text-gray-900">Change Password</span>
                     </div>
                     <ChevronRight className="h-5 w-5 text-gray-400" />
                   </button>
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="flex items-center">
                       <span className="text-[#0369a1] mr-3">ð¡</span>
                       <div>
                         <p className="font-semibold text-sm text-gray-900">Two-Factor Auth</p>
                         <p className="text-xs text-gray-500">Add a layer of security</p>
                       </div>
                     </div>
                     <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-3 pt-2">
                   <button className="flex items-center text-sm font-semibold text-[#0369a1] hover:underline">
                     <Download className="h-4 w-4 mr-2" /> Download Health Data (JSON/PDF)
                   </button>
                   <button className="flex items-center text-sm font-semibold text-red-600 hover:underline">
                     <span className="mr-2 text-lg leading-none">â</span> Deactivate Account
                   </button>
                 </div>
              </CardContent>
            </Card>
          </div>
          
        </div>

        {/* Right Column (1/3) */}
        <div>
          <Card className="bg-[#0369a1] text-white border-none shadow-md overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <CardContent className="p-8 relative z-10">
              <h3 className="text-xl font-bold mb-8 flex items-center">
                <span className="mr-3">â¤</span> Maternal Profile
              </h3>
              
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10 mb-6">
                <p className="text-[10px] uppercase tracking-widest text-sky-200 mb-1 font-semibold">PREGNANCY STATUS</p>
                <p className="text-xl font-bold">Active â 24 Weeks</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-sky-200 mb-1 font-semibold">EDD</p>
                  <p className="text-base font-bold">Oct 24, 2024</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-sky-200 mb-1 font-semibold">Blood Group</p>
                  <p className="text-base font-bold">O Positive</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <p className="text-xs font-semibold mb-3">Emergency Contact</p>
                <div className="mb-2">
                  <p className="font-bold text-lg">Marco Rodriguez</p>
                  <p className="text-sm text-sky-200">+1(555) 0987</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Section */}
      <Card className="bg-white mt-8">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-3 text-xl">â</span> Security Logs & Active Sessions
            </h3>
            <button className="text-sm font-semibold text-[#0369a1] hover:underline">Log out all other sessions</button>
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between items-center p-4 rounded-xl bg-green-50/50 border border-green-100">
               <div className="flex items-center">
                 <div className="h-10 w-10 bg-green-100 rounded-lg text-green-700 flex items-center justify-center mr-4"><Monitor className="h-5 w-5" /></div>
                 <div>
                   <p className="font-bold text-gray-900 text-sm">Chrome on macOS (Current)</p>
                   <p className="text-xs text-gray-500 mt-1">San Francisco, USA â 192.168.1.1</p>
                 </div>
               </div>
               <Badge className="bg-[#86efac] hover:bg-[#86efac] text-green-900 border-none font-bold tracking-wider text-[10px]">ACTIVE NOW</Badge>
             </div>
             
             <div className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent">
               <div className="flex items-center">
                 <div className="h-10 w-10 bg-gray-100 rounded-lg text-gray-500 flex items-center justify-center mr-4"><Smartphone className="h-5 w-5" /></div>
                 <div>
                   <p className="font-bold text-gray-900 text-sm">Pearl Mom App on iPhone 15</p>
                   <p className="text-xs text-gray-500 mt-1">San Francisco, USA â 2 hours ago</p>
                 </div>
               </div>
               <button className="text-xs font-semibold text-red-600 hover:underline">Terminate Session</button>
             </div>

             <div className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent">
               <div className="flex items-center">
                 <div className="h-10 w-10 bg-gray-100 rounded-lg text-gray-500 flex items-center justify-center mr-4"><Monitor className="h-5 w-5" /></div>
                 <div>
                   <p className="font-bold text-gray-900 text-sm">Safari on iPad</p>
                   <p className="text-xs text-gray-500 mt-1">Austin, USA â Last login: Oct 12, 2023</p>
                 </div>
               </div>
               <button className="text-xs font-semibold text-red-600 hover:underline">Terminate Session</button>
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center py-6">
        <p className="text-sm italic text-gray-500">Changes will be updated across all synced devices.</p>
        <div className="flex space-x-4">
          <Button variant="ghost" className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full font-bold px-8">Discard</Button>
          <Button className="bg-[#0369a1] hover:bg-[#0284c7] text-white rounded-full font-bold px-8">Save Changes</Button>
        </div>
      </div>

    </div>
  );
};

export default MotherProfileSettings;
