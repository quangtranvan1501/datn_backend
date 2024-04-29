const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const serviceSchema = mongoose.Schema(
  {
    idService: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    specialist: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.plugin(toJSON);
serviceSchema.plugin(paginate);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
