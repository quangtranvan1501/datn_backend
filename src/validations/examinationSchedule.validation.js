const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createExaminationSchedule = {
  body: Joi.object().keys({
    patient: Joi.string().custom(objectId).required(),
    doctor: Joi.string().custom(objectId),
    service: Joi.string().custom(objectId).required(),
    day: Joi.date().required(),
  }),
};

const getExaminationScheduleById = {
  params: Joi.object().keys({
    examinationScheduleId: Joi.string().required(),
  }),
};

const updateExaminationSchedule = {
  params: Joi.object().keys({
    examinationScheduleId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    doctor: Joi.string().custom(objectId),
    service: Joi.string().custom(objectId),
    day: Joi.date(),
  }).min(1),
};

const deleteExaminationSchedule = {
  params: Joi.object().keys({
    examinationScheduleId: Joi.string().required(),
  }),
};

module.exports = {
  createExaminationSchedule,
  getExaminationScheduleById,
  updateExaminationSchedule,
  deleteExaminationSchedule,
};
