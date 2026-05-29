import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Heart, Stethoscope, FileText, Users, Calendar, Activity, TrendingUp, AlertTriangle, Database, Search, Baby, Syringe, Pill } from 'lucide-react';
import api from '../../services/api';

// ─── Timestamp formatter ──────────────────────────────────────────────────────
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─── Typing dots ──────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="block w-1.5 h-1.5 rounded-full bg-pink-400"
        style={{
          animation: 'pearlBounce 1.1s ease-in-out infinite',
          animationDelay: `${delay}ms`,
        }}
      />
    ))}
  </div>
);

// ─── Single message bubble ────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isUser = msg.sender === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div
          className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mb-0.5"
          style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' }}
        >
          <Stethoscope className="w-3 h-3 text-white" />
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'text-white rounded-2xl rounded-br-md'
              : msg.isError
              ? 'text-rose-700 border border-rose-200 rounded-2xl rounded-bl-md'
              : 'text-gray-800 border rounded-2xl rounded-bl-md'
          }`}
          style={
            isUser
              ? { background: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)' }
              : msg.isError
              ? { background: '#fff1f2' }
              : { background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }
          }
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-400 px-1">{formatTime(msg.timestamp)}</span>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ProviderChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello Provider! 👩‍⚕️\n\nI'm your PearlMom Clinical Assistant. I can fetch real-time data from the database!\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // Quick actions for providers
//   const quickActions = [
//     { icon: TrendingUp, label: "Dashboard Stats", action: "Show me dashboard statistics" },
//     { icon: Search, label: "Find Patient", action: "Find mother with ID: " },
//     { icon: Calendar, label: "Today's Visits", action: "Show me today's scheduled clinic visits" },
//     { icon: FileText, label: "Thriposha Count", action: "How many mothers are eligible for Thriposha?" },
//     { icon: Activity, label: "High Risk", action: "How many high-risk mothers are there?" },
//     { icon: Syringe, label: "Vaccination Schedule", action: "Show me the vaccination schedule for pregnant mothers" },
//     { icon: Pill, label: "Allergies Info", action: "Show me mothers with allergies" },
//     { icon: Baby, label: "Thriposha Eligible", action: "List mothers eligible for Thriposha" },
//   ];

  // Floating Message Logic
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowFloatingMessage(true);
    }, 1500);
    
    const hideTimer = setTimeout(() => {
      setShowFloatingMessage(false);
    }, 5500);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleFloatingMessageClose = () => {
    setShowFloatingMessage(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  const handleInput = (e) => {
    setInputMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
  };

  const resetHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  // Function to fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/providers/dashboard');
      if (response.data.success) {
        const stats = response.data.data.stats;
        return `📊 Dashboard Statistics 📊\n\n` +
          `👩 Total Mothers Registered: ${stats.totalMothers.toLocaleString()}\n` +
          `🤰 Active Pregnancies: ${stats.activePregnancies.toLocaleString()}\n` +
          `⚠️ High-Risk Mothers: ${stats.highRiskMothers.toLocaleString()}\n` +
          `💉 Vaccination Rate: ${stats.vaccinationRate}%\n` +
          `📅 Today's Appointments: ${stats.todayAppointments}\n` +
          `⌛ Pending Vaccinations: ${stats.pendingVaccinations}\n\n` +
          `Data fetched from the system in real-time.`;
      }
      return "Unable to fetch dashboard statistics at this moment.";
    } catch (error) {
      console.error('Error fetching stats:', error);
      return "Error fetching dashboard data. Please try again.";
    }
  };

  // Function to find mother by ID
  const findMotherById = async (motherId) => {
    try {
      const response = await api.get(`/providers/mothers/${motherId}`);
      if (response.data.success) {
        const mother = response.data.data.mother;
        return `👩 Mother Details\n\n` +
          `Name: ${mother.full_name}\n` +
          `ID: ${mother.mother_code}\n` +
          `Pregnancy Week: ${mother.weeks || 'N/A'} weeks\n` +
          `Status: ${mother.pregnancy_status || 'N/A'}\n` +
          `Blood Group: ${mother.blood_group || 'N/A'}\n` +
          `High Risk: ${mother.is_high_risk ? 'Yes ⚠️' : 'No'}\n` +
          `Expected Delivery: ${mother.expected_delivery_date || 'N/A'}\n` +
          `Phone: ${mother.emergency_contact_phone || 'N/A'}\n` +
          `Address: ${mother.address || 'N/A'}\n\n` +
          `Need more details? Ask about vaccinations or medical history.`;
      }
      return `❌ Mother with ID "${motherId}" not found. Please check the ID and try again.`;
    } catch (error) {
      console.error('Error finding mother:', error);
      return `Error finding mother. Please check the ID and try again.`;
    }
  };

  // Function to get mother's vaccination details
  const getMotherVaccinations = async (motherId) => {
    try {
      const response = await api.get(`/vaccinations/mother/${motherId}`);
      if (response.data.success) {
        const vaccinations = response.data.data.vaccinations || [];
        if (vaccinations.length === 0) {
          return `No vaccination records found for mother ID: ${motherId}`;
        }
        let result = `💉 Vaccination Records\n\n`;
        vaccinations.forEach(v => {
          result += `${v.vaccine_name} - Dose ${v.dose_number}\n`;
          result += `   Given: ${v.given_date}\n`;
          result += `   Batch: ${v.batch_number || 'N/A'}\n`;
          result += `   Notes: ${v.notes || 'None'}\n\n`;
        });
        return result;
      }
      return `No vaccination records found for mother ID: ${motherId}`;
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      return "Error fetching vaccination records.";
    }
  };

  // Function to get Thriposha eligible mothers count
  const getThriposhaEligibleCount = async () => {
    try {
      const response = await api.get('/thriposha/eligible-mothers');
      if (response.data.success) {
        const eligibleMothers = response.data.data.eligible_mothers || [];
        const count = eligibleMothers.length;
        return `🍽️ Thriposha Program Summary\n\n` +
          `📊 Total Eligible Mothers: ${count}\n\n` +
          (count > 0 ? `${count} mother(s) are currently eligible for Thriposha supplementation.` : `No mothers currently eligible for Thriposha.`);
      }
      return "Unable to fetch Thriposha eligibility data.";
    } catch (error) {
      console.error('Error fetching Thriposha data:', error);
      return "Error fetching Thriposha eligibility data.";
    }
  };

  // Function to get mothers with allergies or chronic diseases
  const getMothersWithAllergies = async () => {
    try {
      const response = await api.get('/providers/mothers');
      if (response.data.success) {
        const mothers = response.data.data.mothers || [];
        const mothersWithIssues = mothers.filter(m => m.allergies || m.chronic_diseases);
        
        if (mothersWithIssues.length === 0) {
          return "No mothers with recorded allergies or chronic diseases found.";
        }
        
        let result = `🏥 Mothers with Medical History\n\n`;
        mothersWithIssues.slice(0, 10).forEach(m => {
          result += `${m.full_name} (${m.mother_code})\n`;
          if (m.allergies) result += `   Allergies: ${m.allergies}\n`;
          if (m.chronic_diseases) result += `   Chronic: ${m.chronic_diseases}\n`;
          result += `\n`;
        });
        if (mothersWithIssues.length > 10) {
          result += `+ ${mothersWithIssues.length - 10} more records.\n`;
        }
        return result;
      }
      return "Unable to fetch mothers data.";
    } catch (error) {
      console.error('Error fetching mothers with allergies:', error);
      return "Error fetching medical history data.";
    }
  };

  // Function to get vaccination schedule
  const getVaccinationSchedule = () => {
    return `💉 Vaccination Schedule for Pregnant Mothers 💉\n\n` +
      `During Pregnancy:\n` +
      `• TT1 (Tetanus Toxoid) - First dose at 6-8 weeks\n` +
      `• TT2 - Second dose at 12-16 weeks\n` +
      `• TT Booster - If needed, after 1 year\n` +
      `• Tdap - Recommended at 27-36 weeks\n` +
      `• Influenza - Any trimester during flu season\n\n` +
      `After Delivery (Newborn):\n` +
      `• BCG & Hep B - At birth\n` +
      `• OPV/IPV - At 6, 10, 14 weeks\n` +
      `• Pentavalent - At 6, 10, 14 weeks\n` +
      `• PCV - At 6, 10, 14 weeks\n` +
      `• Rotavirus - At 6, 10, 14 weeks\n` +
      `• Measles & Rubella - At 9 months\n` +
      `• MMR - At 12 months\n\n` +
      `Please follow Sri Lanka's Expanded Programme on Immunization (EPI) schedule.`;
  };

  // Function to process and handle user queries
  const processQuery = async (message) => {
    const lowerMsg = message.toLowerCase();
    
    // Dashboard statistics
    if (lowerMsg.includes('dashboard') || 
        (lowerMsg.includes('statistics') || lowerMsg.includes('stats')) &&
        (lowerMsg.includes('total') || lowerMsg.includes('mother'))) {
      return await fetchDashboardStats();
    }
    
    // High risk count
    if (lowerMsg.includes('high risk') && (lowerMsg.includes('count') || lowerMsg.includes('how many'))) {
      const stats = await fetchDashboardStats();
      return stats;
    }
    
    // Find mother by ID
    const motherIdMatch = message.match(/ID:\s*([A-Z0-9-]+)/i) || 
                         message.match(/find.*?(MOM-[A-Z0-9-]+)/i) ||
                         message.match(/mother\s+([A-Z0-9-]+)/i);
    if (motherIdMatch) {
      const motherId = motherIdMatch[1];
      return await findMotherById(motherId);
    }
    
    // Mother vaccinations
    if (lowerMsg.includes('vaccination') && (lowerMsg.includes('mother') || lowerMsg.includes('patient'))) {
      const idMatch = message.match(/(MOM-[A-Z0-9-]+)/i);
      if (idMatch) {
        return await getMotherVaccinations(idMatch[1]);
      }
      return "Please provide the Mother ID. Example: 'Show vaccinations for mother MOM-26-0012'";
    }
    
    // Thriposha eligible count
    if (lowerMsg.includes('thriposha') && (lowerMsg.includes('count') || lowerMsg.includes('eligible') || lowerMsg.includes('how many'))) {
      return await getThriposhaEligibleCount();
    }
    
    // List Thriposha eligible mothers
    if (lowerMsg.includes('list') && lowerMsg.includes('thriposha') && lowerMsg.includes('eligible')) {
      try {
        const response = await api.get('/thriposha/eligible-mothers');
        if (response.data.success) {
          const eligible = response.data.data.eligible_mothers || [];
          if (eligible.length === 0) {
            return "No mothers are currently eligible for Thriposha.";
          }
          let result = `🍽️ Thriposha Eligible Mothers 🍽️\n\n`;
          eligible.slice(0, 15).forEach((m, i) => {
            result += `${i+1}. ${m.name} (${m.motherId})\n`;
            result += `   Week: ${m.week} | BMI: ${m.bmi}\n`;
          });
          if (eligible.length > 15) {
            result += `\n+ ${eligible.length - 15} more eligible mothers.`;
          }
          return result;
        }
        return "Unable to fetch eligible mothers list.";
      } catch (error) {
        return "Error fetching eligible mothers.";
      }
    }
    
    // Mothers with allergies/chronic diseases
    if (lowerMsg.includes('allergies') || lowerMsg.includes('chronic') || 
        (lowerMsg.includes('medical history') && lowerMsg.includes('mothers'))) {
      return await getMothersWithAllergies();
    }
    
    // Vaccination schedule
    if (lowerMsg.includes('vaccination schedule') || lowerMsg.includes('vaccine schedule')) {
      return getVaccinationSchedule();
    }
    
    // Today's appointments
    if (lowerMsg.includes('today\'s appointments') || lowerMsg.includes('appointments today')) {
      try {
        const response = await api.get('/providers/dashboard');
        if (response.data.success) {
          const count = response.data.data.stats.todayAppointments;
          return `📅 Today's Appointments\n\nThere ${count === 1 ? 'is' : 'are'} ${count} appointment${count !== 1 ? 's' : ''} scheduled for today.\n\nCheck the appointments section for more details.`;
        }
        return "Unable to fetch today's appointments.";
      } catch (error) {
        return "Error fetching appointments data.";
      }
    }
    
    // Pending vaccinations count
    if (lowerMsg.includes('pending vaccination')) {
      try {
        const response = await api.get('/providers/dashboard');
        if (response.data.success) {
          const count = response.data.data.stats.pendingVaccinations;
          return `💉 Pending Vaccinations\n\nThere ${count === 1 ? 'is' : 'are'} ${count} pending vaccination${count !== 1 ? 's' : ''} due.\n\nPlease check the vaccination module for details.`;
        }
        return "Unable to fetch pending vaccinations.";
      } catch (error) {
        return "Error fetching vaccination data.";
      }
    }
    
    // Active pregnancies count
    if (lowerMsg.includes('active pregnancies')) {
      try {
        const response = await api.get('/providers/dashboard');
        if (response.data.success) {
          const count = response.data.data.stats.activePregnancies;
          return `🤰 Active Pregnancies\n\nThere are currently ${count} active pregnancy cases being monitored.\n\nThis includes all registered pregnant mothers.`;
        }
        return "Unable to fetch active pregnancies data.";
      } catch (error) {
        return "Error fetching pregnancy data.";
      }
    }
    
    // Default: Use OpenAI for general questions
    return null; // Will use OpenAI API
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const text = inputMessage.trim();
    const userMessage = { id: Date.now(), text, sender: 'user', timestamp: new Date() };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    resetHeight();
    setIsTyping(true);

    try {
      // First try to handle with database queries
      const dbResponse = await processQuery(text);
      
      if (dbResponse) {
        // Got response from database query
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: dbResponse, sender: 'bot', timestamp: new Date() },
        ]);
      } else {
        // Fallback to OpenAI for general questions
        const user = JSON.parse(localStorage.getItem('pearlmom_user') || '{}');
        const providerId = user?.providerId || user?.midwife_id || null;

        const response = await api.post('/chatbot/provider-message', {
          message: text,
          providerId,
          conversationHistory,
        });

        if (response.data.success) {
          const reply = response.data.data.reply;
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, text: reply, sender: 'bot', timestamp: new Date() },
          ]);
          setConversationHistory((prev) => [
            ...prev,
            { role: 'user', content: text },
            { role: 'assistant', content: reply },
          ]);
        } else {
          throw new Error('No success');
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm having trouble connecting. Please try again in a moment. For urgent matters, contact your healthcare provider directly.",
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChatOpen = () => {
    setIsOpen(true);
    if (showFloatingMessage) {
      setShowFloatingMessage(false);
    }
  };

  // ── Closed state: FAB with floating message ───────────────────────────────────
  if (!isOpen) {
    return (
      <>
        <style>
          {`
            @keyframes pearlPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(236,72,153,0.45), 0 8px 24px rgba(236,72,153,0.35); }
              60% { box-shadow: 0 0 0 10px rgba(236,72,153,0), 0 8px 24px rgba(236,72,153,0.35); }
            }
            @keyframes pearlSlideIn {
              from { opacity: 0; transform: translateX(30px) scale(0.9); }
              to { opacity: 1; transform: translateX(0) scale(1); }
            }
            .pearl-fab {
              animation: pearlPulse 2.8s ease-out infinite;
              transition: transform 0.2s ease;
            }
            .pearl-fab:hover { transform: scale(1.1); }
            .pearl-fab:active { transform: scale(0.96); }
            .pearl-message-enter { animation: pearlSlideIn 0.45s ease-out forwards; }
          `}
        </style>

        {showFloatingMessage && (
          <div className="pearl-message-enter fixed bottom-24 right-6 z-50">
            <div
              className="relative rounded-2xl shadow-xl p-4 pr-8"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #fff0f3 100%)',
                border: '1px solid rgba(236,72,153,0.3)',
                width: '280px',
              }}
            >
              <div
                className="absolute -bottom-1.5 right-6 w-4 h-4 rotate-45"
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #fff0f3 100%)',
                  borderRight: '1px solid rgba(236,72,153,0.2)',
                  borderBottom: '1px solid rgba(236,72,153,0.2)',
                }}
              />

              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' }}
                >
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Provider Assistant 👩‍⚕️</p>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    I can fetch real-time data from the database! Ask about stats, patients, or Thriposha.
                  </p>
                </div>

                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1.5" />
              </div>

              <button
                onClick={handleFloatingMessageClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleChatOpen}
          aria-label="Open Provider Assistant"
          className="pearl-fab fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' }}
        >
          <Stethoscope className="w-6 h-6 text-white" strokeWidth={1.8} />
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-400 animate-pulse" />
          <span
            className="absolute bottom-full right-0 mb-3 px-3 py-1.5 text-xs font-medium text-white rounded-full whitespace-nowrap pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(6px)' }}
          >
            Provider Assistant ✦
          </span>
        </button>
      </>
    );
  }

  // ── Open state: Chat panel ──────────────────────────────────────────────
  return (
    <>
      <style>
        {`
          @keyframes pearlSlideUp {
            from { opacity: 0; transform: translateY(16px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes pearlBounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-5px); }
          }
          .pearl-panel {
            animation: pearlSlideUp 0.28s cubic-bezier(0.34,1.36,0.64,1) forwards;
          }
          .pearl-messages::-webkit-scrollbar { width: 4px; }
          .pearl-messages::-webkit-scrollbar-track { background: transparent; }
          .pearl-messages::-webkit-scrollbar-thumb {
            background: rgba(236,72,153,0.2);
            border-radius: 99px;
          }
          .pearl-input:focus { outline: none; box-shadow: 0 0 0 2px rgba(236,72,153,0.3); }
          .pearl-chip {
            transition: all 0.15s ease;
            border: 1px solid rgba(236,72,153,0.25);
          }
          .pearl-chip:hover {
            background: rgba(236,72,153,0.08);
            border-color: rgba(236,72,153,0.5);
            transform: translateY(-1px);
          }
          .pearl-send { transition: all 0.15s ease; }
          .pearl-send:not(:disabled):hover { transform: scale(1.08); }
          .pearl-send:not(:disabled):active { transform: scale(0.95); }
        `}
      </style>

      <div
        className="pearl-panel fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden"
        style={{
          width: 420,
          height: isMinimized ? 60 : 620,
          borderRadius: 20,
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(236,72,153,0.12)',
          transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 flex-shrink-0"
          style={{
            height: 60,
            background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 60%, #db2777 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -20, top: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', right: 40, bottom: -40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)' }}>
            <Database className="w-4 h-4 text-white" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight tracking-tight">Provider Assistant</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
              <span className="text-[11px] leading-none" style={{ color: 'rgba(255,255,255,0.75)' }}>Database Connected · Real-time Data</span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0 relative z-10">
            <button onClick={() => setIsMinimized(v => !v)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'rgba(255,255,255,0.8)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'rgba(255,255,255,0.8)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <X size={15} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="pearl-messages flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4" style={{ background: '#fdf6f9' }}>
              {messages.map((msg) => (
                <Bubble key={msg.id} msg={msg} />
              ))}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' }}>
                    <Stethoscope className="w-3 h-3 text-white" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {/* <div className="px-4 py-3 bg-white border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">Quick Actions (Database Powered):</p>
              <div className="flex gap-2 flex-wrap">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(action.action);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="pearl-chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{ background: 'rgba(236,72,153,0.08)', color: '#be185d' }}
                  >
                    <action.icon size={12} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <textarea
                  ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
                  value={inputMessage}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything... "
                  rows={1}
                  className="pearl-input flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 rounded-xl px-3 py-2.5"
                  style={{
                    background: '#f9f1f5',
                    border: '1.5px solid rgba(236,72,153,0.15)',
                    maxHeight: 80,
                    minHeight: 40,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(236,72,153,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(236,72,153,0.15)')}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="pearl-send flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: inputMessage.trim() ? 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' : '#e2e8f0',
                    boxShadow: inputMessage.trim() ? '0 4px 12px rgba(236,72,153,0.3)' : 'none',
                    cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Send size={16} className={inputMessage.trim() ? 'text-white' : 'text-gray-400'} />
                </button>
              </div>
              <p className="text-center text-gray-400 text-[10px] mt-2">
                🔍 Database queries | Clinical support | For emergencies call <span className="font-semibold text-pink-600">1990</span>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProviderChatWidget;