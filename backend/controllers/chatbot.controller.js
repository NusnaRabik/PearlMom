const OpenAI = require('openai');
const { Mother, MaternalRecord, Appointment, Vaccination, ThriposhaEligibility, Midwife } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt for the maternal health assistant (Mothers)
const getSystemPrompt = (motherData = null) => {
  let motherContext = '';
  if (motherData) {
    motherContext = `
Current Mother Information:
- Name: ${motherData.full_name || 'N/A'}
- Pregnancy Week: ${motherData.weeks || 'N/A'}
- Pregnancy Status: ${motherData.pregnancy_status || 'N/A'}
- Blood Group: ${motherData.blood_group || 'N/A'}
- Expected Delivery Date: ${motherData.expected_delivery_date || 'N/A'}
- High Risk: ${motherData.is_high_risk ? 'Yes' : 'No'}
`;
  }

  return `You are PearlMom, a caring and professional maternal health assistant for pregnant mothers in Sri Lanka. 
You help with pregnancy-related questions, Thriposha program information, clinic visits, vaccinations, and general maternal wellness.

Guidelines:
1. Be warm, empathetic, and professional
2. Provide accurate, evidence-based information
3. For medical emergencies, always advise contacting local healthcare provider or calling 1990 (Suwa Seriya)
4. NEVER give medical diagnosis - always recommend consulting a healthcare provider
5. Keep responses concise but helpful (2-4 sentences when possible)
6. Speak Sinhala or Tamil if the user asks, default to English

${motherContext}

Important: If the user mentions any emergency symptoms (severe bleeding, severe headache, difficulty breathing, etc.), immediately advise them to seek emergency care.
Always encourage regular clinic visits and following the advice of their healthcare provider.`;
};

// System prompt for Provider Assistant
const getProviderSystemPrompt = () => {
  return `You are PearlMom's Clinical Assistant for healthcare providers (Midwives, Doctors, and Admin staff) in Sri Lanka.

Your role is to help healthcare providers with their daily clinical and administrative tasks.

**What you can help with:**

📋 **Patient Management:**
- Find mother by ID, name, or code
- View patient medical history
- Check vaccination status
- Review Thriposha eligibility

💉 **Clinical Tasks:**
- Guide through recording clinic visits
- Explain how to check vitals (BP, weight, FHR)
- Help with high-risk flagging
- Vaccination schedule management

📊 **Reports & Analytics:**
- Generate monthly distribution reports
- View eligible mothers for Thriposha
- Check upcoming deliveries
- Review clinic visit statistics

🍽️ **Thriposha Program:**
- Check mother's eligibility
- Log new distributions
- View distribution history
- Calculate packet requirements

**Guidelines:**
1. Be professional, concise, and accurate
2. Provide step-by-step instructions for clinical tasks
3. Remind providers to follow MOH protocols
4. For urgent medical questions, advise consulting senior staff
5. Never suggest treatments outside standard Sri Lankan MOH protocols
6. Keep responses helpful but not overly verbose (3-5 sentences when possible)

**Important Notes:**
- Always remind providers to document everything in the system
- For emergencies, advise calling 1990 immediately
- Encourage regular data entry for accurate reporting

You are speaking to a trained healthcare professional. Use professional but friendly language.`;
};

// @desc    Chat with PearlMom AI Assistant (for Mothers)
// @route   POST /api/chatbot/message
const sendMessage = async (req, res) => {
  try {
    const { message, motherId, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return errorResponse(res, 'Message is required', 400);
    }

    // Fetch mother data if motherId is provided
    let motherData = null;
    let motherInfo = null;
    
    if (motherId) {
      motherData = await Mother.findOne({
        where: { mother_id: motherId, is_deleted: false },
        attributes: ['full_name', 'weeks', 'pregnancy_status', 'blood_group', 'expected_delivery_date', 'is_high_risk']
      });
      
      if (motherData) {
        motherInfo = {
          full_name: motherData.full_name,
          weeks: motherData.weeks,
          pregnancy_status: motherData.pregnancy_status,
          blood_group: motherData.blood_group,
          expected_delivery_date: motherData.expected_delivery_date,
          is_high_risk: motherData.is_high_risk
        };
      }
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: getSystemPrompt(motherInfo) },
      ...conversationHistory.slice(-10),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
    });

    const reply = completion.choices[0].message.content;

    await saveConversationLog(motherId, message, reply);

    return successResponse(res, {
      reply,
      conversationId: Date.now().toString()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    const fallbackResponses = [
      "I'm here to help with your maternal health questions. Could you please rephrase your question?",
      "For immediate medical concerns, please contact your healthcare provider or call 1990 for emergency services.",
      "I understand you have a question. For the most accurate information, please consult with your PHM or visit your nearest clinic.",
      "I'm having trouble connecting right now. Please try again in a moment, or contact your healthcare provider directly."
    ];
    
    return successResponse(res, {
      reply: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      fallback: true
    });
  }
};

// @desc    Provider-specific chat (NEW)
// @route   POST /api/chatbot/provider-message
const providerSendMessage = async (req, res) => {
  try {
    const { message, providerId, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return errorResponse(res, 'Message is required', 400);
    }

    // Fetch provider data if providerId is provided
    let providerInfo = null;
    if (providerId) {
      const provider = await Midwife.findOne({
        where: { midwife_id: providerId, is_deleted: false },
        attributes: ['full_name', 'assigned_area', 'district', 'qualification']
      });
      
      if (provider) {
        providerInfo = {
          full_name: provider.full_name,
          assigned_area: provider.assigned_area,
          district: provider.district,
          qualification: provider.qualification
        };
      }
    }

    // Get provider context
    let providerContext = '';
    if (providerInfo) {
      providerContext = `
Provider Information:
- Name: ${providerInfo.full_name || 'N/A'}
- Assigned Area: ${providerInfo.assigned_area || 'N/A'}
- District: ${providerInfo.district || 'N/A'}
- Qualification: ${providerInfo.qualification || 'N/A'}
`;
    }

    // Prepare messages for OpenAI with provider-specific system prompt
    const messages = [
      { role: 'system', content: getProviderSystemPrompt() + providerContext },
      ...conversationHistory.slice(-10),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 600,
      temperature: 0.5, // Lower temperature for more consistent clinical responses
    });

    const reply = completion.choices[0].message.content;

    // Log provider conversation
    console.log(`[Provider Chat] ${providerInfo?.full_name || 'Unknown'}: ${message.substring(0, 100)}`);
    console.log(`[Provider Chat] Bot: ${reply.substring(0, 100)}`);

    return successResponse(res, {
      reply,
      conversationId: Date.now().toString()
    });

  } catch (error) {
    console.error('Provider chatbot error:', error);
    
    const fallbackResponses = [
      "I'm your clinical assistant. Could you please rephrase your question about patient care or clinic management?",
      "For urgent clinical matters, please consult with your senior staff or refer to the MOH guidelines.",
      "I can help with patient records, Thriposha management, and clinic visit documentation. What specific task can I assist with?",
      "I'm having trouble connecting. Please check your internet connection and try again."
    ];
    
    return successResponse(res, {
      reply: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      fallback: true
    });
  }
};

// Save conversation log (optional)
const saveConversationLog = async (motherId, userMessage, botReply) => {
  try {
    console.log(`[Chat] Mother ${motherId || 'Guest'}: ${userMessage.substring(0, 100)}`);
    console.log(`[Chat] Bot: ${botReply.substring(0, 100)}`);
  } catch (error) {
    console.error('Error saving chat log:', error);
  }
};

// @desc    Get quick health tips
// @route   GET /api/chatbot/tips
const getHealthTips = async (req, res) => {
  const tips = [
    { title: "Stay Hydrated", content: "Drink at least 8-10 glasses of water daily during pregnancy." },
    { title: "Folic Acid", content: "Take folic acid supplements as prescribed by your doctor to prevent neural tube defects." },
    { title: "Rest Well", content: "Get 7-9 hours of sleep and take short naps during the day." },
    { title: "Balanced Diet", content: "Include iron-rich foods like leafy greens, legumes, and lean meats." },
    { title: "Kick Counts", content: "Monitor fetal movements daily - you should feel at least 10 kicks in 2 hours." },
    { title: "Clinic Visits", content: "Don't miss your scheduled antenatal checkups for proper monitoring." }
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return successResponse(res, { tip: randomTip });
};

// @desc    Get provider quick tips (NEW)
// @route   GET /api/chatbot/provider-tips
const getProviderTips = async (req, res) => {
  const tips = [
    { title: "Clinic Visit Documentation", content: "Always record BP, weight, and fetal heart rate for every antenatal visit." },
    { title: "Thriposha Eligibility", content: "Mothers with BMI < 18.5 or > 30 qualify for 2 packets instead of 1." },
    { title: "High Risk Flagging", content: "Flag mothers with severe anemia, hypertension, or multiple pregnancies as high risk." },
    { title: "Vaccination Schedule", content: "TT1 at 6-8 weeks, TT2 at 12-16 weeks, TT Booster if needed." },
    { title: "Emergency Referral", content: "Always refer mothers with severe bleeding, fits, or reduced fetal movement immediately." },
    { title: "Data Entry Best Practice", content: "Enter clinic visit data immediately after consultation for accurate records." }
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return successResponse(res, { tip: randomTip });
};

// @desc    Get emergency contacts
// @route   GET /api/chatbot/emergency
const getEmergencyContacts = async (req, res) => {
  return successResponse(res, {
    emergency: {
      ambulance: "1990 (Suwa Seriya)",
      nearestHospital: "De Soysa Maternity Hospital - +94 11 269 1111",
      phmContact: "Contact your local Public Health Midwife",
      emergencySymptoms: "Severe bleeding, severe headache, difficulty breathing, reduced fetal movement"
    }
  });
};

// @desc    Get provider emergency contacts (NEW)
// @route   GET /api/chatbot/provider-emergency
const getProviderEmergencyContacts = async (req, res) => {
  return successResponse(res, {
    emergency: {
      ambulance: "1990 (Suwa Seriya)",
      maternalEmergencyUnit: "De Soysa Maternity Hospital - +94 11 269 1111",
      bloodBank: "National Blood Centre - +94 11 269 1122",
      poisonControl: "National Poison Control - +94 11 269 1111 ext 123",
      reportingLine: "MOH Emergency Reporting - 0112 345 678"
    }
  });
};

module.exports = {
  sendMessage,
  providerSendMessage,  // NEW
  getHealthTips,
  getProviderTips,  // NEW
  getEmergencyContacts,
  getProviderEmergencyContacts  // NEW
};