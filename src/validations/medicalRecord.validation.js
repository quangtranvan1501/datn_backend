const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMedicalRecord = {
  body: Joi.object().keys({
    patient: Joi.string().custom(objectId).required(),
    doctor: Joi.string().custom(objectId).required(),
    diagnose: Joi.string().required(),
    testResults: Joi.string().required(),
    note: Joi.string().required(),
    day: Joi.date().required(),
  }),
};

const getMedicalRecords = {
  query: Joi.object().keys({
    patient: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMedicalRecordById = {
  params: Joi.object().keys({
    medicalRecordId: Joi.string().custom(objectId),
  }),
};

const updateMedicalRecord = {
  params: Joi.object().keys({
    medicalRecordId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      doctor: Joi.string().custom(objectId),
      diagnose: Joi.string(),
      testResults: Joi.string(),
      note: Joi.string(),
      day: Joi.date(),
    })
    .min(1),
};

const deleteMedicalRecord = {
  params: Joi.object().keys({
    medicalRecordId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
};
