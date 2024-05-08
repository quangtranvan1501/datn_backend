const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { medicalRecordService } = require('../services');
const pick = require('../utils/pick');

const createMedicalRecord = catchAsync(async (req, res) => {
  const medicalRecord = await medicalRecordService.createMedicalRecord(req.body);
  res.status(httpStatus.CREATED).send(medicalRecord);
});

const getMedicalRecords = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['patient']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const medicalRecords = await medicalRecordService.queryMedicalRecords(filter, options);
  res.send(medicalRecords);
});

const getMedicalRecordById = catchAsync(async (req, res) => {
  const medicalRecord = await medicalRecordService.getMedicalRecordById(req.params.medicalRecordId);
  if (!medicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical record not found');
  }
  res.send(medicalRecord);
});

const updateMedicalRecordById = catchAsync(async (req, res) => {
  const medicalRecord = await medicalRecordService.updateMedicalRecordById(req.params.medicalRecordId, req.body);
  if (!medicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical record not found');
  }
  res.send(medicalRecord);
});

const deleteMedicalRecordById = catchAsync(async (req, res) => {
  await medicalRecordService.deleteMedicalRecordById(req.params.medicalRecordId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecordById,
  deleteMedicalRecordById,
};
