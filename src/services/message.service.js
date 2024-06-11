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

module.exports = {
  getMessages,
  addMessage,
  getOnlineUsers,
};
