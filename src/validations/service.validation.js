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

const getServicesBySpecialistId = {
  params: Joi.object().keys({
    specialistId: Joi.string().required(),
  }),
};

const getServiceById = {
  params: Joi.object().keys({
    serviceId: Joi.string(),
  }),
};

const updateService = {
  params: Joi.object().keys({
    serviceId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    unit: Joi.string(),
    price: Joi.number(),
    specialist: Joi.string(),
  }).min(1),
};

const deleteService = {
  params: Joi.object().keys({
    serviceId: Joi.string().required(),
  }),
};

module.exports = {
  createService,
  getServiceById,
  updateService,
  deleteService,
  getServicesBySpecialistId
};
