const httpStatus = require('http-status');
const Specialist = require('../models/specialist.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a specialist
 * @param {Object} specialistBody
 * @returns {Promise<Specialist>}
 */
const createSpecialist = async (specialistBody) => {
  // Check if the specialist with the given name already exists
  const existingSpecialist = await Specialist.findOne({ name: specialistBody.name });
  if (existingSpecialist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Specialist with this name already exists');
  }
  return Specialist.create(specialistBody);
};

/**
 * Query for specialists
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySpecialists = async (filter, options) => {
  const specialists = await Specialist.paginate(filter, options);
  return specialists;
};

/**
 * Get specialist by id
 * @param {Number} specialistId
 * @returns {Promise<Specialist>}
 */
const getSpecialistById = async (specialistId) => {
  return Specialist.findById(specialistId);
};

/**
 * Update specialist by id
 * @param {Number} specialistId
 * @param {Object} updateBody
 * @returns {Promise<Specialist>}
 */
const updateSpecialistById = async (specialistId, updateBody) => {
  const specialist = await getSpecialistById(specialistId);
  if (!specialist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Specialist not found');
  }
  Object.assign(specialist, updateBody);
  await specialist.save();
  return specialist;
};

/**
 * Delete specialist by id
 * @param {Number} specialistId
 * @returns {Promise<Specialist>}
 */
const deleteSpecialistById = async (specialistId) => {
  const specialist = await getSpecialistById(specialistId);
  if (!specialist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Specialist not found');
  }
  await specialist.remove();
  return specialist;
};

module.exports = {
  createSpecialist,
  querySpecialists,
  getSpecialistById,
  updateSpecialistById,
  deleteSpecialistById,
};
