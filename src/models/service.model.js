const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const serviceSchema = mongoose.Schema(
  {
    serviceId: {
      type: Number,
      required: false,
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

serviceSchema.pre('save', async function (next) {
  const service = this;
  if (!service.isNew) return next(); 
  try {
    const lastService = await mongoose.model('Service').findOne({}, {}, { sort: { 'serviceId': -1 } }); 
    service.serviceId = lastService ? lastService.serviceId + 1 : 1; 
    next();
  } catch (error) {
    next(error);
  }
});

serviceSchema.plugin(toJSON);
serviceSchema.plugin(paginate);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
