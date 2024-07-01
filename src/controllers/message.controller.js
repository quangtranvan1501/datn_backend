const { messageService } = require('../services');

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const projectedMessages = await messageService.getMessages(from, to);
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const result = await messageService.addMessage(from, to, message);
    if (result) return res.json({ msg: 'Message added successfully.' });
    else return res.json({ msg: 'Failed to add message to the database' });
  } catch (ex) {
    next(ex);
  }
};

const getOnlineUsers = async (req, res, next) => {
  try {
    const { page, limit, role } = req.query;
    const onlineUsers = await messageService.getOnlineUsers({ page, limit, role });
    res.json(onlineUsers);
  } catch (ex) {
    next(ex);
  }
};

const chatbot = async (req, res, next) => {
  try {
    const { message } = req.body;
    console.log('message', message);
    const response = await messageService.chatbot(message);
    res.json(response);
  } catch (ex) {
    next(ex);
  }
};

module.exports = {
  getMessages,
  addMessage,
  getOnlineUsers,
  chatbot,
};
