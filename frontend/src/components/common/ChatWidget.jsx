import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Heart } from 'lucide-react';
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
          <Heart className="w-3 h-3 text-white" />
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
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm PearlMom, your maternal health assistant. 👋\n\nHow can I help you today? You can ask me about:\n• Pregnancy tips\n• Clinic visits\n• Vaccinations\n• Thriposha program\n• Emergency contacts",
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

  // Show floating message on component mount - FORCE SHOW
  useEffect(() => {
    console.log('Attempting to show floating message');
    
    // Show message after 1.5 seconds
    const showTimer = setTimeout(() => {
      console.log('Setting showFloatingMessage to true');
      setShowFloatingMessage(true);
    }, 1500);
    
    // Auto hide after 8 seconds
    const hideTimer = setTimeout(() => {
      console.log('Setting showFloatingMessage to false');
      setShowFloatingMessage(false);
    }, 5500);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleFloatingMessageClose = () => {
    console.log('Closing floating message');
    setShowFloatingMessage(false);
    localStorage.setItem('pearlmom_floating_message_seen', 'true');
    localStorage.setItem('pearlmom_floating_message_seen_date', Date.now().toString());
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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const text = inputMessage.trim();
    const userMessage = { id: Date.now(), text, sender: 'user', timestamp: new Date() };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    resetHeight();
    setIsTyping(true);

    try {
      const user = JSON.parse(localStorage.getItem('pearlmom_user') || '{}');
      const motherId = user?.motherId || null;

      const response = await api.post('/chatbot/message', {
        message: text,
        motherId,
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
    } catch {
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

  const getEmergencyTip = async () => {
    try {
      const response = await api.get('/chatbot/emergency');
      if (response.data.success) {
        const d = response.data.data.emergency;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `🚨 Emergency Contacts 🚨\n\n📞 Ambulance: ${d.ambulance}\n🏥 Nearest Hospital: ${d.nearestHospital}\n👩‍⚕️ PHM Contact: ${d.phmContact}\n\n⚠️ Emergency Symptoms:\n${d.emergencySymptoms}\n\nIf you experience any of these, seek immediate medical attention!`,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (e) {
      console.error('Emergency fetch error:', e);
    }
  };

  const getHealthTip = async () => {
    try {
      const response = await api.get('/chatbot/tips');
      if (response.data.success) {
        const tip = response.data.data.tip;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `💡 Health Tip: ${tip.title}\n\n${tip.content}`,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (e) {
      console.error('Health tip fetch error:', e);
    }
  };

  const handleChatOpen = () => {
    console.log('Opening chat');
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
            @keyframes pearlFadeOut {
              from { opacity: 1; transform: translateX(0) scale(1); }
              to { opacity: 0; transform: translateX(20px) scale(0.9); }
            }
            @keyframes pearlBounce {
              0%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-5px); }
            }
            .pearl-fab {
              animation: pearlPulse 2.8s ease-out infinite;
              transition: transform 0.2s ease;
            }
            .pearl-fab:hover { transform: scale(1.1); }
            .pearl-fab:active { transform: scale(0.96); }
            .pearl-message-enter { animation: pearlSlideIn 0.45s ease-out forwards; }
            .pearl-message-exit { animation: pearlFadeOut 0.4s ease-in forwards; }
          `}
        </style>

        {/* Floating Message */}
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
                  <Heart className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Hi! I'm PearlMom Assistant 👋</p>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    Ask me anything about pregnancy, appointments, nutrition, or vaccinations.
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

        {/* Chat Button */}
        <button
          onClick={handleChatOpen}
          aria-label="Open PearlMom chat assistant"
          className="pearl-fab fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' }}
        >
          <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.8} />
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-400 animate-pulse" />
          <span
            className="absolute bottom-full right-0 mb-3 px-3 py-1.5 text-xs font-medium text-white rounded-full whitespace-nowrap pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(6px)' }}
          >
            Chat with PearlMom ✦
          </span>
        </button>
      </>
    );
  }

  // ── Open state: Chat panel (same as before) ─────────────────────────────────
  return (
    <>
      <style>
        {`
          @keyframes pearlSlideUp {
            from { opacity: 0; transform: translateY(16px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
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
          width: 384,
          height: isMinimized ? 60 : 520,
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
            <Heart className="w-4 h-4 text-white" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight tracking-tight">PearlMom Assistant</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
              <span className="text-[11px] leading-none" style={{ color: 'rgba(255,255,255,0.75)' }}>Online · Here to help</span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0 relative z-10">
            <button onClick={() => setIsMinimized((v) => !v)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'rgba(255,255,255,0.8)' }}
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
              {messages.map((msg) => (<Bubble key={msg.id} msg={msg} />))}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' }}>
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 px-4 py-2.5 flex-shrink-0" style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <button onClick={getEmergencyTip} className="pearl-chip flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(254,226,226,0.6)', color: '#be123c' }}>
                <span>🚨</span> Emergency
              </button>
              <button onClick={getHealthTip} className="pearl-chip flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(220,252,231,0.6)', color: '#15803d' }}>
                <span>💡</span> Health Tip
              </button>
            </div>

            <div className="flex items-end gap-2.5 px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fff' }}>
              <textarea ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
                value={inputMessage} onChange={handleInput} onKeyDown={handleKeyDown}
                placeholder="Type a message…" rows={1}
                className="pearl-input flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 rounded-2xl px-3.5 py-2.5"
                style={{ background: '#f9f1f5', border: '1.5px solid rgba(236,72,153,0.15)', maxHeight: 96, minHeight: 40, lineHeight: '1.45' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(236,72,153,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(236,72,153,0.15)')} />
              <button onClick={sendMessage} disabled={!inputMessage.trim()}
                className="pearl-send flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: inputMessage.trim() ? 'linear-gradient(135deg, #f472b6 0%, #e11d48 100%)' : 'rgba(0,0,0,0.07)',
                  boxShadow: inputMessage.trim() ? '0 4px 14px rgba(236,72,153,0.4)' : 'none',
                  cursor: inputMessage.trim() ? 'pointer' : 'not-allowed' }}>
                <Send size={16} className={inputMessage.trim() ? 'text-white' : 'text-gray-400'} style={{ transform: 'translate(1px, 0)' }} strokeWidth={2} />
              </button>
            </div>

            <p className="text-center text-gray-400 pb-2.5 px-4 flex-shrink-0" style={{ fontSize: 10, lineHeight: '1.4', background: '#fff' }}>
              General health info only · For emergencies call <span className="font-semibold text-rose-500">1990</span>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default ChatWidget;