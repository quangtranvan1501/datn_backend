const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSpecialist = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getSpecialistById = {
  params: Joi.object().keys({
    specialistId: Joi.string(),
  }),
};

const updateSpecialist = {
  params: Joi.object().keys({
    specialistId: Joi.required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
  }).min(1),
};

const deleteSpecialist = {
  params: Joi.object().keys({
    specialistId: Joi.string(),
  }),
};

module.exports = {
  createSpecialist,
  getSpecialistById,
  updateSpecialist,
  deleteSpecialist,
};
