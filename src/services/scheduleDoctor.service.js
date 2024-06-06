const httpStatus = require('http-status');
const { ScheduleDoctor } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const { json } = require('express');

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
  try {
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy;
    
    const sortOptions = {};

    if (sortBy) {
      const [key, order] = sortBy.split(':');
      sortOptions[key] = order === 'desc' ? -1 : 1;
    }

    const schedules = await ScheduleDoctor.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);
    const totalResults = await ScheduleDoctor.countDocuments(filter);

    return {
      totalResults,
      page,
      limit,
      results: schedules
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get schedule by id
 * @param {String} scheduleDoctorId
 * @returns {Promise<ScheduleDoctor>}
 */
const getScheduleById = async (scheduleDoctorId) => {
  return ScheduleDoctor.findOne({ scheduleDoctorId }).populate('doctorId');
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

const checkScheduleExists = async (doctorId, day) => {
  const existingSchedule = await ScheduleDoctor.findOne({ where: { doctorId, day } });
  return existingSchedule !== null;
};

const getScheduleByDoctorId = async (doctorId, page, limit, sortBy) => {
  try {
    const skip = (page - 1) * limit;
    const sortOptions = {};

    if (sortBy) {
      const [key, order] = sortBy.split(':');
      sortOptions[key] = order === 'desc' ? -1 : 1;
    }

    const schedules = await ScheduleDoctor.find({ doctorId })
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);
    const totalResults = await ScheduleDoctor.countDocuments({ doctorId });

    return {
      totalResults,
      page,
      limit,
      results: schedules
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createScheduleDoctor,
  querySchedules,
  getScheduleById,
  updateScheduleById,
  deleteScheduleById,
  checkScheduleExists,
  getScheduleByDoctorId
};
