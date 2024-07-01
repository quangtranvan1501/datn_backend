const express = require('express');
const { messageController } = require('../../controllers');

const router = express.Router();

router.get('/messages', messageController.getMessages);
router.post('/message', messageController.addMessage);

router.post('/chatbot', messageController.chatbot);

// online users
router.get('/onlineUsers', messageController.getOnlineUsers);

module.exports = router;
