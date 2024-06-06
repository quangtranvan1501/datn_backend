const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMedicalRecord = {
  body: Joi.object().keys({
    patient: Joi.string().custom(objectId).required(),
    doctor: Joi.string().custom(objectId).required(),
    service: Joi.string().custom(objectId).required(),
    diagnose: Joi.string().required(),
    symptom: Joi.string().required(),
    prescription: Joi.string(),
    testResults: Joi.string().required(),
    note: Joi.string().required(),
    day: Joi.date(),
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
    medicalRecordId: Joi.string().required(),
  }),
};

const updateMedicalRecord = {
  params: Joi.object().keys({
    medicalRecordId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      diagnose: Joi.string(),
      testResults: Joi.string(),
      symptom: Joi.string(),
      prescription: Joi.string(),
      note: Joi.string(),
      day: Joi.date(),
    })
    .min(1),
};

const deleteMedicalRecord = {
  params: Joi.object().keys({
    medicalRecordId: Joi.string(),
  }),
};

const getMedicalRecordByDoctorId = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordByDoctorId
};
