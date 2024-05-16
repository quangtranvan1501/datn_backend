const httpStatus = require('http-status');
const { ExaminationSchedule } = require('../models');
const ApiError = require('../utils/ApiError');
global.examinationInterval = 30;
/**
 * Create an examination schedule
 * @param {Object} examinationScheduleBody
 * @returns {Promise<ExaminationSchedule>}
 */
const createExaminationSchedule = async (examinationScheduleBody) => {
  try {
    const { doctor, day } = examinationScheduleBody;
    const appointmentDate = new Date(day);

    const interval = global.examinationInterval || 30; // Mặc định là 30 nếu không được cấu hình

    const startRange = new Date(appointmentDate.getTime() - interval * 60000);
    const endRange = new Date(appointmentDate.getTime() + interval * 60000);

    const existingAppointment = await ExaminationSchedule.findOne({
      doctor,
      day: { $gte: startRange, $lte: endRange }
    });

    if (existingAppointment) {
      const conflictingTime = existingAppointment.day.getHours() + ':' + existingAppointment.day.getMinutes();
      throw new ApiError(httpStatus.BAD_REQUEST, `Bác sỹ đã có lịch vào ${conflictingTime} phút, vui lòng đặt lịch trước hoặc sau ${interval} phút.`);
    }
    return ExaminationSchedule.create(examinationScheduleBody);
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error);
  }
  // Kiểm tra xem lịch khám với idSchedule đã cho có tồn tại chưa
  // const existingExaminationSchedule = await ExaminationSchedule.findOne({ idSchedule: examinationScheduleBody.idSchedule });
  // if (existingExaminationSchedule) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Examination schedule with this ID already exists');
  // }
};

/**
 * Query for examination schedules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExaminationSchedules = async (filter, options) => {
  const examinationSchedules = await ExaminationSchedule.paginate(filter, options);
  return examinationSchedules;
};

/**
 * Get examination schedules by patient ID
 * @param {String} patientId
 * @returns {Promise<ExaminationSchedule>}
 */
const getExaminationSchedulesByPatientId = async (patientId) => {
  return ExaminationSchedule.find({ patient: patientId });
};

/**
 * Get examination schedule by id
 * @param {String} examinationScheduleId
 * @returns {Promise<ExaminationSchedule>}
 */
const getExaminationScheduleById = async (examinationScheduleId) => {
  return ExaminationSchedule.findOne({ examinationScheduleId }).populate('patient').populate('service');
};

/**
 * Update examination schedule by id
 * @param {String} examinationScheduleId
 * @param {Object} updateBody
 * @returns {Promise<ExaminationSchedule>}
 */
const updateExaminationScheduleById = async (examinationScheduleId, updateBody) => {
  const examinationSchedule = await getExaminationScheduleById(examinationScheduleId);
  if (!examinationSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Examination schedule not found');
  }
  Object.assign(examinationSchedule, updateBody);
  await examinationSchedule.save();
  return examinationSchedule;
};

/**
 * Delete examination schedule by id
 * @param {String} examinationScheduleId
 * @returns {Promise<ExaminationSchedule>}
 */
const deleteExaminationScheduleById = async (examinationScheduleId) => {
  const examinationSchedule = await getExaminationScheduleById(examinationScheduleId);
  if (!examinationSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Examination schedule not found');
  }
  await examinationSchedule.remove();
  return examinationSchedule;
};

module.exports = {
  createExaminationSchedule,
  queryExaminationSchedules,
  getExaminationSchedulesByPatientId,
  getExaminationScheduleById,
  updateExaminationScheduleById,
  deleteExaminationScheduleById,
};
