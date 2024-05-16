const httpStatus = require('http-status');
const { ScheduleDoctor } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a schedule for a doctor
 * @param {Object} scheduleDoctorBody
 * @returns {Promise<ScheduleDoctor>}
 */
const createScheduleDoctor = async (scheduleDoctorBody) => {
  return ScheduleDoctor.create(scheduleDoctorBody);
};

/**
 * Query for schedules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySchedules = async (filter, options) => {
  const schedules = await ScheduleDoctor.paginate(filter, options);
  return schedules;
};

/**
 * Get schedule by id
 * @param {String} scheduleDoctorId
 * @returns {Promise<ScheduleDoctor>}
 */
const getScheduleById = async (scheduleDoctorId) => {
  return ScheduleDoctor.findOne({scheduleDoctorId}).populate('doctorId');
};

/**
 * Update schedule by id
 * @param {String} scheduleDoctorId
 * @param {Object} updateBody
 * @returns {Promise<ScheduleDoctor>}
 */
const updateScheduleById = async (scheduleDoctorId, updateBody) => {
  const schedule = await getScheduleById(scheduleDoctorId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  Object.assign(schedule, updateBody);
  await schedule.save();
  return schedule;
};

/**
 * Delete schedule by id
 * @param {String} scheduleDoctorId
 * @returns {Promise<ScheduleDoctor>}
 */
const deleteScheduleById = async (scheduleDoctorId) => {
  const schedule = await getScheduleById(scheduleDoctorId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  await schedule.remove();
  return schedule;
};

module.exports = {
  createScheduleDoctor,
  querySchedules,
  getScheduleById,
  updateScheduleById,
  deleteScheduleById,
};
