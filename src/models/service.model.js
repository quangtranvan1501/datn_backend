const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { generateSnowflakeId } = require('../utils/snowflake');

const serviceSchema = mongoose.Schema(
  {
    serviceId: {
      type: String,
      default: generateSnowflakeId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.plugin(toJSON);
serviceSchema.plugin(paginate);

/**
 * @typedef Service
 */
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
