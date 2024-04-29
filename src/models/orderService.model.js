const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderServiceSchema = mongoose.Schema(
  {
    idOrderServices: {
      type: Number,
      required: true,
      unique: true,
    },
    idService: {
      type: Number,
      required: true,
    },
    idOrder: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderServiceSchema.plugin(toJSON);
orderServiceSchema.plugin(paginate);

const OrderService = mongoose.model('OrderService', orderServiceSchema);

module.exports = OrderService;
