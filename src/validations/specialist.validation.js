const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSpecialist = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getSpecialistById = {
  params: Joi.object().keys({
    specialistId: Joi.string().custom(objectId),
  }),
};

const updateSpecialist = {
  params: Joi.object().keys({
    specialistId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }).min(1),
};

const deleteSpecialist = {
  params: Joi.object().keys({
    specialistId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSpecialist,
  getSpecialistById,
  updateSpecialist,
  deleteSpecialist,
};
