import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ChevronDown, ChevronUp, Phone, UploadCloud, Asterisk, 
  ExternalLink, GraduationCap, CheckCircle2, FileText, Bug, 
  MessageSquare, Info, Sparkles 
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import api from '../../services/api';

const HelpSupportPage = () => {
  const [activeTab, setActiveTab] = useState('Mother');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);
  
  // Form States
  const [formType, setFormType] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [attachment, setAttachment] = useState(null);

  // Mouse tracking for hero background animation
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const faqs = {
    Mother: [
      { question: "How do I register for an account?", answer: "You can register by clicking the 'Register' button on the top right, selecting 'Mother' as your role, and filling in your details. You will need your assigned Mother ID from your PHM." },
      { question: "How do I view my E-MCH card?", answer: "Once logged in, navigate to the 'My Health' section and click on 'E-MCH Card'. You can view, share, and download a digital copy of your maternity records." },
      { question: "How do I track my prenatal appointments?", answer: "You can access your appointment calendar directly from the 'My Care' dashboard. Pearl Mom syncs automatically with your assigned PHM's schedule so you never miss a visit." },
      { question: "How do I check Thriposha eligibility?", answer: "Your Thriposha eligibility is displayed on your main dashboard under 'Nutrition Alerts'. It is automatically updated based on your BMI and pregnancy stage recorded by your PHM." }
    ],
    Provider: [
      { question: "How do I record a clinic visit?", answer: "Navigate to the 'Patient Records' tab, search for the Mother ID, and click 'New Clinic Visit'. Enter the examination details and click save." },
      { question: "How do I flag a high-risk pregnancy?", answer: "In the mother's profile, go to the 'Health Metrics' section. The system will automatically prompt you to flag if needed." }
    ],
    Admin: [
      { question: "How do I add a new PHM to the system?", answer: "Go to 'User Management', click 'Add New User', select 'Provider' role, and fill in their details." },
      { question: "How can I view region-wide health reports?", answer: "The 'Analytics' dashboard provides aggregate data across your MOH area." }
    ]
  };

  const filteredFaqs = (faqs[activeTab] || []).filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
  };

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    const browserInfo = `${navigator.userAgent} | ${navigator.platform} | ${window.screen.width}x${window.screen.height}`;
    const pageUrl = window.location.href;

    const payload = {
      ticket_type: formType,
      subject: formType === 'contact' ? e.target.subject?.value : null,
      page_url: pageUrl,
      browser_info: browserInfo,
      steps_to_reproduce: formType === 'bug' ? e.target.steps_to_reproduce?.value : null,
      message: e.target.message?.value,
    };

    try {
      const response = await api.post('/support/ticket', payload);
      if (response.data.success) {
        setSubmitSuccess(true);
        e.target.reset();
        setAttachment(null);
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow">
      {/* Enhanced Hero Section - Matching Landing Page Style */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-rose-50 border-b border-pink-100 overflow-hidden min-h-[85vh] flex items-center"
      >
        {/* Beautiful Cursor-Following Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Base glows */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-purple-200 rounded-full opacity-25 blur-3xl animate-pulse delay-1000" />

          {/* Interactive cursor orbs */}
          <motion.div
            className="absolute w-[34rem] h-[34rem] bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-full blur-3xl opacity-30"
            style={{
              left: useTransform(smoothMouseX, [-600, 600], ['10%', '55%']),
              top: useTransform(smoothMouseY, [-600, 600], ['20%', '65%']),
            }}
          />

          <motion.div
            className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-violet-400 to-purple-500 rounded-full blur-3xl opacity-25"
            style={{
              left: useTransform(smoothMouseX, [-600, 600], ['65%', '25%']),
              top: useTransform(smoothMouseY, [-600, 600], ['55%', '15%']),
            }}
          />

          {/* Accent orbs */}
          <motion.div
            className="absolute w-64 h-64 bg-white/60 rounded-full blur-2xl opacity-40"
            style={{
              left: useTransform(smoothMouseX, [-700, 700], ['25%', '50%']),
              top: useTransform(smoothMouseY, [-700, 700], ['35%', '70%']),
            }}
          />

          {/* Sparkling particles */}
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              style={{
                left: useTransform(smoothMouseX, [-700, 700], [`${20 + i * 8}%`, `${38 + i * 7}%`]),
                top: useTransform(smoothMouseY, [-700, 700], [`${30 + i * 9}%`, `${48 + i * 6}%`]),
              }}
              animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 2.8 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-6"
          >
            <Info className="h-8 w-8 text-pink-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            How can we help you today?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            Search our knowledge base or get personalized support from the Pearl Mom team.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto relative shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow"
          >
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-6 py-4 border border-slate-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800 placeholder-slate-400 text-base transition-all"
              placeholder="Search for answers, guides, or help topics..."
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Left Column (Main Content) */}
          <div className="lg:w-[65%] space-y-8">
            
            {/* FAQ Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              
              {/* Role Tabs */}
              <div className="inline-flex bg-slate-100/80 p-1.5 rounded-full mb-8 overflow-x-auto max-w-full">
                {['Mother', 'Provider', 'Admin'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setExpandedFaq(0); }}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-white text-pink-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab} FAQs
                  </button>
                ))}
              </div>

              {/* Accordion List */}
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                        expandedFaq === index ? 'border-pink-200 shadow-sm bg-white' : 'border-slate-100 bg-white hover:border-pink-200 hover:bg-pink-50/30'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                      >
                        <span className={`font-semibold text-base pr-8 ${expandedFaq === index ? 'text-slate-900' : 'text-slate-700'}`}>
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0 text-slate-400">
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-pink-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </button>
                      
                      <div 
                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedFaq === index ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-slate-600 leading-relaxed text-[15px]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No FAQs found matching "{searchQuery}" for {activeTab}.
                  </div>
                )}
              </div>
            </div>

            {/* Download Manuals Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">User Guides & Manuals</h2>
              
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Download Manuals</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-pink-600 hover:border-pink-300 transition-colors">
                    <FileText className="w-4 h-4 text-pink-500" /> English PDF
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-pink-600 hover:border-pink-300 transition-colors">
                    <FileText className="w-4 h-4 text-pink-500" /> Sinhala PDF
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-pink-600 hover:border-pink-300 transition-colors">
                    <FileText className="w-4 h-4 text-pink-500" /> Tamil PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Support Form Section */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Get in touch</h2>
                  <p className="text-slate-600 text-sm">Send a message or report an issue directly to our team.</p>
                </div>
                
                {/* Form Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setFormType('contact')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${formType === 'contact' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <MessageSquare className="w-4 h-4" /> Contact
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormType('bug')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${formType === 'bug' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Bug className="w-4 h-4" /> Report Bug
                  </button>
                </div>
              </div>
              
              {submitSuccess && (
                <div className="mb-6 bg-green-50 text-green-800 p-4 rounded-xl flex items-center gap-3 border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-sm font-medium">Your submission has been sent successfully. We'll be in touch soon!</p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6 relative">
                {isSubmitting && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formType === 'contact' ? (
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Subject</label>
                      <div className="relative group">
                        <select name="subject" required className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-slate-700 font-medium appearance-none hover:border-slate-300 cursor-pointer">
                          <option value="">Select a topic</option>
                          <option value="technical">Technical Issue</option>
                          <option value="account">Account Issue</option>
                          <option value="general">General Inquiry</option>
                          <option value="feedback">Feedback</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-hover:text-slate-500 transition-colors" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Page where issue occurred</label>
                      <input name="page_url" required type="text" placeholder="e.g. Dashboard, Registration" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Attachment (Optional)</label>
                    <label className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-pink-600 font-semibold rounded-xl px-4 py-3.5 transition-colors border border-transparent cursor-pointer">
                      <UploadCloud className="h-5 w-5" />
                      <span>{attachment ? attachment.name : 'Upload Screenshot'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                {formType === 'bug' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Browser / Device Information</label>
                      <input name="browser_info" required type="text" placeholder="e.g. Chrome on Windows 11, Safari on iOS" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Steps to Reproduce</label>
                      <textarea name="steps_to_reproduce" required rows="1" placeholder="1. Go to... 2. Click..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none hover:border-slate-300"></textarea>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-2">
                    {formType === 'contact' ? 'Message' : 'Description of the problem'}
                  </label>
                  <textarea 
                    name="message"
                    required
                    rows="4" 
                    placeholder={formType === 'contact' ? "Describe your issue or inquiry in detail..." : "What exactly happened? What were you expecting to happen?"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-[15px] focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none hover:border-slate-300"
                  ></textarea>
                </div>

                <button disabled={isSubmitting} type="submit" className={`w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg text-base font-bold text-white transition-all duration-300 ${formType === 'contact' ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/20 hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-pink-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20 hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-red-600/20'}`}>
                  {isSubmitting ? 'Submitting...' : formType === 'contact' ? 'Send Message' : 'Submit Bug Report'}
                </button>
              </form>
            </div>
            
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:w-[35%] space-y-6">
            
            {/* Emergency Contacts Card */}
            <div className="bg-red-50 rounded-3xl p-7 border border-red-100">
              <div className="flex items-center gap-2 mb-6">
                <Asterisk className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold text-red-800">Emergency Contacts</h3>
              </div>
              
              <div className="flex items-start gap-4 mb-8">
                <div className="bg-red-600 p-3 rounded-2xl shadow-sm shadow-red-600/20">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-1">Suwa Seriya Ambulance</p>
                  <p className="text-3xl font-black text-red-700 tracking-tight">1990</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <p className="text-[12px] font-bold text-slate-800 mb-0.5">Local PHM Contact</p>
                  <p className="text-[15px] text-slate-600">+94 11 234 5678</p>
                  <p className="text-[11px] text-slate-500 mt-1">Available 24/7 for urgent care.</p>
                </div>
                
                <div className="h-px bg-red-200 w-full"></div>
                
                <div>
                  <p className="text-[12px] font-bold text-slate-800 mb-0.5">Nearest Hospital Emergency</p>
                  <p className="text-[14px] text-slate-600">De Soysa Maternity Hospital</p>
                  <p className="text-[15px] text-slate-600 mt-0.5">+94 11 269 1111</p>
                </div>

                <div className="h-px bg-red-200 w-full"></div>

                <a href="#" className="flex items-center justify-between group">
                  <div>
                    <p className="text-[13px] font-bold text-red-700 mb-0.5 group-hover:text-red-800 transition-colors">Maternal Emergency Guidelines</p>
                    <p className="text-[11px] text-slate-500">View what to do in an emergency</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors" />
                </a>
              </div>
            </div>

          </div>
          
        </div>
      </main>
    </div>
  );
};

export default HelpSupportPage;