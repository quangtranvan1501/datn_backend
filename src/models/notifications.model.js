//Viết cho tôi model bao gồm các trường sau:
// - notificationId: string, required, unique
// - deviceToken: string, required
// - userId: string, required
// - createdAt: date, default Date.now
// - updatedAt: date, default Date.now

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { generateSnowflakeId } = require('../utils/snowflake');

const notificationSchema = mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
      default: generateSnowflakeId,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    read: {
      type: String,
      default: '0',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
