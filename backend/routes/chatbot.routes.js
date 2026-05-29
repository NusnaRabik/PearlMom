const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const chatbotController = require('../controllers/chatbot.controller');

// Mother routes
router.post('/message', protect, chatbotController.sendMessage);
router.get('/tips', protect, chatbotController.getHealthTips);
router.get('/emergency', protect, chatbotController.getEmergencyContacts);

// Provider routes (NEW)
router.post('/provider-message', protect, chatbotController.providerSendMessage);
router.get('/provider-tips', protect, chatbotController.getProviderTips);
router.get('/provider-emergency', protect, chatbotController.getProviderEmergencyContacts);

module.exports = router;