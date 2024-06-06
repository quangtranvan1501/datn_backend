const Joi = require('joi');
const { objectId } = require('./custom.validation');

const timeFormat = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/);

const createScheduleDoctor = {
  body: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
    day: Joi.date().required(),
    startTime: timeFormat,
    endTime: timeFormat,
  }),
};

const getScheduleDoctorById = {
  params: Joi.object().keys({
    scheduleDoctorId: Joi.string().required(),
  }),
};

const updateScheduleDoctor = {
  params: Joi.object().keys({
    scheduleDoctorId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
    day: Joi.date(),
    startTime: timeFormat,
    endTime: timeFormat,
    status: Joi.string(),
  }).min(1), 
};

const deleteScheduleDoctor = {
  params: Joi.object().keys({
    scheduleDoctorId: Joi.string().required(),
  }),
};

const getScheduleDoctorByDoctorId = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getScheduleDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
    day: Joi.date(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createScheduleDoctor,
  getScheduleDoctorById,
  updateScheduleDoctor,
  deleteScheduleDoctor,
  getScheduleDoctorByDoctorId,
  getScheduleDoctor
};
