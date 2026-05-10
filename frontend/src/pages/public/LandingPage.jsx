import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { 
  Users, CheckCircle, Stethoscope, Building, 
  User, Briefcase, Activity, Syringe, 
  Utensils, Calendar, ArrowRight, ShieldCheck 
} from 'lucide-react';
import heroImage from '../../assets/mother.png';
import doctorTabletImage from '../../assets/doctor_tablet.png';
import babyHandImage from '../../assets/baby_hand.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
            <span className="inline-block bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-6">
              Sri Lanka's Trusted Choice
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Digital Maternal<br />Healthcare<br />
              <span className="text-primary-600">Sanctuary</span>
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-lg">
              A seamless, safe, and culturally attuned digital health ecosystem designed specifically for the mothers of Sri Lanka. From the first kick to the first step, we are with you.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-full transition-colors">
                Start Your Journey
              </button>
              <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-3 px-8 rounded-full transition-colors">
                Our Impact
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src={heroImage} 
                alt="Pregnant woman smiling" 
                className="w-full h-auto object-cover rounded-3xl"
              />
              {/* Badge overlay */}
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3 max-w-xs">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShieldCheck className="text-green-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">PEARL MOM</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Official Healthcare Protocol</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Community Impact</h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto mb-4"></div>
            <p className="text-slate-500 mb-12 max-w-2xl mx-auto">
              Our growing network is dedicated to improving maternal health outcomes across the island.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Stat Card 1 */}
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Users className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">25,000+</h3>
                <p className="text-sm text-slate-500 text-center">Mothers Registered</p>
              </div>
              
              {/* Stat Card 2 */}
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <CheckCircle className="text-green-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-1">18,000+</h3>
                <p className="text-sm text-slate-500 text-center">Successful Deliveries</p>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Stethoscope className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-primary-600 mb-1">500+</h3>
                <p className="text-sm text-slate-500 text-center">Active Providers</p>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Building className="text-green-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-1">120+</h3>
                <p className="text-sm text-slate-500 text-center">Clinics Connected</p>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section className="bg-slate-50 py-24 mx-4 md:mx-12 rounded-[3rem] mb-20">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Who are you joining as?</h2>
            <p className="text-slate-500 mb-12">
              Select your role to access your personalized sanctuary dashboard.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mother Card */}
              <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-6">
                  <User className="text-blue-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Mother</h3>
                <p className="text-slate-500 text-center mb-8 text-sm">
                  Access clinics, track growth, and receive reminders for your wellness journey.
                </p>
                <a href="#" className="text-primary-600 font-medium flex items-center hover:text-primary-700 transition-colors">
                  Select Profile <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>

              {/* Provider Card */}
              <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center">
                <div className="bg-green-100 p-4 rounded-full mb-6">
                  <Briefcase className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Provider</h3>
                <p className="text-slate-500 text-center mb-8 text-sm">
                  Midwives and doctors can manage clinics, patient records, and vitals securely.
                </p>
                <a href="#" className="text-green-600 font-medium flex items-center hover:text-green-700 transition-colors">
                  Select Profile <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Empowering Section */}
        <section className="bg-white py-20 overflow-hidden mb-12">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
            {/* Images */}
            <div className="md:w-1/2 relative mb-12 md:mb-0 h-[400px]">
              <img 
                src={doctorTabletImage} 
                alt="Doctor with tablet" 
                className="absolute left-0 bottom-0 w-[55%] h-auto rounded-3xl shadow-lg z-10 border-4 border-white"
              />
              <img 
                src={babyHandImage} 
                alt="Baby hand holding adult finger" 
                className="absolute right-10 top-0 w-[60%] h-auto rounded-3xl shadow-xl"
              />
            </div>
            
            {/* Content */}
            <div className="md:w-1/2 md:pl-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                Empowering Sri Lankan Mothers Through Technology
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                PEARL MOM is more than just an app, it's a nationwide movement to modernize maternal healthcare. By bridging the gap between rural clinics and specialized medical data, we ensure every mother in Sri Lanka receives the same high-standard care.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Integrated MOH protocols & digital clinic records.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Real-time alerts for vaccinations and health checks.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Core Ecosystem Benefits</h2>
            <div className="w-16 h-1 bg-primary-500 mb-10"></div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {/* Benefit 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <Activity className="text-blue-500 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Pregnancy Tracking</h3>
                <p className="text-sm text-slate-500">Visualize development milestones and track vitals through every trimester.</p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <Syringe className="text-green-600 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Vaccination Management</h3>
                <p className="text-sm text-slate-500">Automatic scheduling and reminders for mother and newborn vaccinations.</p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <Utensils className="text-yellow-500 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Nutrition Tracking</h3>
                <p className="text-sm text-slate-500">Personalized diet plans tailored to Sri Lankan nutritional standards.</p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <Calendar className="text-blue-500 w-6 h-6 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Clinic Management</h3>
                <p className="text-sm text-slate-500">Seamlessly book and manage visits to government and private clinics.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
