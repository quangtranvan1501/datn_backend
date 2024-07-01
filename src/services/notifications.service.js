const { Notification, User } = require('../models');
const admin = require('../config/firebase-admin');

const sendNotification = async (userId, message) => {
  const user = await User.findOne({ userId });
  const payload = {
    token: user.deviceToken,
    notification: {
      title: message.title,
      body: message.body,
    },
  };

  admin
    .messaging()
    .send(payload)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
};

//Hàm lưu thông báo vào database

const createNotification = async (message) => {
  try {
    const notification = await Notification.create(message);
    console.log('Notification saved successfully:', notification);
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

const updateNotification = async (notificationId, notificationBody) => {
  try {
    const notification = await Notification.findOne({ notificationId });
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'notification not found');
    }
    Object.assign(notification, notificationBody);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error updating notification:', error);
  }
};

const getNotificationByUserId = async (filter, options) => {
  try {
    const notification = await Notification.paginate(filter, options);

    // muốn trả về biến đếm có bao nhiêu notidication có trường read = 0
    const countNoti = await Notification.countDocuments({ ...filter, read: 0 });

    // Thêm biến countNoti vào đối tượng trả về
    return { ...notification, countNoti };
  } catch (error) {
    console.error('Error getting notification:', error);
  }
};

const saveToken = async (userId, deviceToken) => {
  try {
    // Tìm user theo userId
    const user = await User.findOne({ userId });

    if (!user) {
      console.error('User not found.');
      return;
    }
    //tôi muốn nếu chưa deviceToken nào thì mới thêm vào, nếu đã có rồi thì ghi đè, chỉ có 1 deviceToken
    user.deviceToken = deviceToken;
    await user.save();

    console.log('Device token saved successfully.');
  } catch (error) {
    console.error('Error saving device token:', error);
  }
};

// remove token

const removeToken = async (userId) => {
  try {
    const user = await User.findOne({ userId });

    if (!user) {
      console.error('User not found.');
      return;
    }

    user.deviceToken = null;
    await user.save();
    console.log('Device token removed successfully.');
  } catch (error) {
    console.error('Error removing device token:', error);
  }
};

//tôi muốn xây dụng hàm cập nhatajn trạng thái đã đọc tất cả thông báo của user
const readAllNotification = async (userId) => {
  try {
    const user = await User.findOne({ receiverId: userId });

    if (!user) {
      console.error('User not found.');
      return;
    }

    // Tìm tất cả thông báo chưa đọc của user

    const notifications = await Notification.find({ userId, read: 0 });

    // Cập nhật trạng thái đã đọc cho tất cả thông báo chưa đọc

    notifications.forEach(async (notification) => {
      notification.read = 1;
      await notification.save();
    });
  } catch (error) {
    console.error('Error reading all notifications:', error);
  }
};

module.exports = {
  sendNotification,
  saveToken,
  removeToken,
  createNotification,
  getNotificationByUserId,
  updateNotification,
  readAllNotification,
};
