const Joi = require('joi');

const sendNotification = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    token: Joi.string(),
  }),
};

const createNotification = {
  body: Joi.object().keys({
    senderId: Joi.string().required(),
    receiverId: Joi.string().required(),
    body: Joi.string().required(),
  }),
};

const getNotificationByUserId = {
  query: Joi.object().keys({
    receiverId: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      read: Joi.string(),
    })
    .min(1),
};

module.exports = {
  createNotification,
  sendNotification,
  getNotificationByUserId,
  updateNotification,
};
