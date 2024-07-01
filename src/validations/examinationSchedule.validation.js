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
  body: Joi.object()
    .keys({
      doctor: Joi.string().custom(objectId),
      service: Joi.string().custom(objectId),
      day: Joi.date(),
    })
    .min(1),
};

const deleteExaminationSchedule = {
  params: Joi.object().keys({
    examinationScheduleId: Joi.string().required(),
  }),
};

const checkDoctorShedule = {
  body: Joi.object().keys({
    doctor: Joi.string().custom(objectId).required(),
    day: Joi.date().required(),
  }),
};

const getExaminationScheduleByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getExaminationSchedulesByDoctorId = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
  }),
};

const getDoctorScheduleDays = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
  }),
};

const getExaminationScheduleByDay = {
  body: Joi.object().keys({
    doctor: Joi.string().custom(objectId).required(),
    day: Joi.date().required(),
  }),
};

const getExaminationSchedule = {
  body: Joi.object().keys({
    day: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createExaminationSchedule,
  getExaminationScheduleById,
  updateExaminationSchedule,
  deleteExaminationSchedule,
  checkDoctorShedule,
  getExaminationScheduleByUserId,
  getExaminationSchedulesByDoctorId,
  getDoctorScheduleDays,
  getExaminationScheduleByDay,
  getExaminationSchedule,
};
