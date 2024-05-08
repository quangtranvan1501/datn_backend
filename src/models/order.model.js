const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { Service } = require('.');

const orderSchema = mongoose.Schema(
  {
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
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
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
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
