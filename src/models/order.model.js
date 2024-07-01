const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { Service } = require('.');
const { generateSnowflakeId } = require('../utils/snowflake');

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      default: generateSnowflakeId,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['0', '1', '-1'],
      default: '0',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderService: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    examinationScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExaminationSchedule',
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
