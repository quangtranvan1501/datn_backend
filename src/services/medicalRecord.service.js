const httpStatus = require('http-status');
const { MedicalRecord } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a medical record
 * @param {Object} medicalRecordBody
 * @returns {Promise<MedicalRecord>}
 */
const createMedicalRecord = async (medicalRecordBody) => {
  return MedicalRecord.create(medicalRecordBody);
};

/**
 * Query for medical records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMedicalRecords = async (filter, options) => {
  const medicalRecords = await MedicalRecord.paginate(filter, {
    ...options,
    populate: 'patient doctor'
  });
  return medicalRecords;
};

/**
 * Get medical record by id
 * @param {String} medicalRecordId
 * @returns {Promise<MedicalRecord>}
 */
const getMedicalRecordById = async (medicalRecordId) => {
  return MedicalRecord.findOne({medicalRecordId}).populate('patient', 'name').populate('doctor','name');
  
};

/**
 * Update medical record by id
 * @param {String} medicalRecordId
 * @param {Object} updateBody
 * @returns {Promise<MedicalRecord>}
 */
const updateMedicalRecordById = async (medicalRecordId, updateBody) => {
  const medicalRecord = await getMedicalRecordById(medicalRecordId);
  if (!medicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical record not found');
  }
  Object.assign(medicalRecord, updateBody);
  await medicalRecord.save();
  return medicalRecord;
};

/**
 * Delete medical record by id
 * @param {String} medicalRecordId
 * @returns {Promise<MedicalRecord>}
 */
const deleteMedicalRecordById = async (medicalRecordId) => {
  const medicalRecord = await getMedicalRecordById(medicalRecordId);
  if (!medicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical record not found');
  }
  await medicalRecord.remove();
  return medicalRecord;
};

module.exports = {
  createMedicalRecord,
  queryMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecordById,
  deleteMedicalRecordById,
};
