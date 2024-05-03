const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createService = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    unit: Joi.string().required(),
    price: Joi.number().required(),
    specialist: Joi.string().required(),
  }),
};

const getServiceById = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId),
  }),
};

const updateService = {
  params: Joi.object().keys({
    serviceId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    unit: Joi.string().required(),
    price: Joi.number().required(),
    specialist: Joi.string().required(),
  }).min(1),
};

const deleteService = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createService,
  getServiceById,
  updateService,
  deleteService,
};
