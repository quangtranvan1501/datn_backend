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
  }).min(1), 
};

const deleteScheduleDoctor = {
  params: Joi.object().keys({
    scheduleDoctorId: Joi.string().required(),
  }),
};

module.exports = {
  createScheduleDoctor,
  getScheduleDoctorById,
  updateScheduleDoctor,
  deleteScheduleDoctor,
};
