const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const specialistSchema = mongoose.Schema(
  {
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
