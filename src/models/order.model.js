const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { Service } = require('.');

const orderSchema = mongoose.Schema(
  {
    idOrder: {
      type: Number,
      required: true,
      unique: true,
    },
    idPatient: {
      type: Number,
      required: true,
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
    OrderService: [
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
