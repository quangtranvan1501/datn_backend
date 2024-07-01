const { userService } = require('.');
const { Message } = require('../models');
const getMessages = async (from, to) => {
  try {
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    return projectedMessages;
  } catch (ex) {
    throw ex;
  }
};

const addMessage = async (from, to, message) => {
  try {
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    return data;
  } catch (ex) {
    throw ex;
  }
};

const getOnlineUsers = async ({ page, limit, role }) => {
  try {
    const roleUserIds = [];
    for (const [key, value] of global.onlineUsers.entries()) {
      if (value.role === role) {
        roleUserIds.push(key);
      }
    }
    console.log('roleIds', roleUserIds);
    const paginatedUserIds = roleUserIds.slice((page - 1) * limit, page * limit);
    console.log('paginatedUserIds', paginatedUserIds);
    const users = await userService.getAllUsers({ userIds: paginatedUserIds, role });
    console.log('users', users);
    const usersMap = users.reduce((acc, user) => {
      acc[user.userId] = user;
      return acc;
    }, {});
    const sortedUsers = paginatedUserIds.map((uId) => {
      if (!usersMap[uId]) return null;
      const { _id, name, role, userId } = usersMap[uId];
      return { _id, name, role, userId };
    });

    return sortedUsers;
  } catch (ex) {
    throw ex;
  }
};

const chatbot = async (message) => {
  const { GoogleGenerativeAI } = require('@google/generative-ai');

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(process.env.API_KEY_GOOGLE);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt1 = 'Mô tả dịch tả lợn';
  const prompt2 = 'Viết thành văn bản liền mạch, không quá 5 câu.';

  const result = await model.generateContentStream([message, prompt2]);
  console.log('result', result);
  // print text as it comes in
  const chunks = [];
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    chunks.push(chunk.text());
    console.log(chunkText);
  }

  //tôi muốn lấy ra cả đoạn text, ghép chúng thành đoạn văn hoàn chỉnh loại bỏ các ký tự đặc biệt, dấu cách thừa
  const text = chunks.join('').replace(/\s+/g, ' ').trim();

  return { message: text };
};

module.exports = {
  getMessages,
  addMessage,
  getOnlineUsers,
  chatbot,
};
