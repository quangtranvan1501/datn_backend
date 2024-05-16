const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { generateSnowflakeId } = require('../utils/snowflake');

const specialistSchema = mongoose.Schema(
  {
    specialistId:{
      type: String,
      required: true,
      default: generateSnowflakeId
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

specialistSchema.plugin(toJSON);
specialistSchema.plugin(paginate);

/**
 * @typedef Specialist
 */
const Specialist = mongoose.model('Specialist', specialistSchema);

module.exports = Specialist;
