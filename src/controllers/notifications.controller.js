const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationsService } = require('../services');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationsService.createNotification(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Tạo thông báo thành công',
    data: notification,
  });
});

catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Đã tạo đơn hàng thành công',
    data: order,
  });
});

const getNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['receiverId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const notifications = await notificationsService.getNotificationByUserId(filter, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách thông báo thành công',
    data: notifications,
  });
});

const sendNotification = catchAsync(async (req, res) => {
  const notification = notificationsService.sendNotification(req.body.userId, req.body.message);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Gửi thông báo thành công',
    data: notification,
  });
});

const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationsService.updateNotification(req.params.notificationId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật đơn hàng thành công',
    data: notification,
  });
});

const readAllNotification = catchAsync(async (req, res) => {
  const notification = await notificationsService.readAllNotification(req.body.userId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Đã đọc tất cả thông báo',
    data: notification,
  });
});

module.exports = {
  createNotification,
  getNotifications,
  sendNotification,
  updateNotification,
  readAllNotification,
};
