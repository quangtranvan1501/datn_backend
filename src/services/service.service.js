const httpStatus = require('http-status');
const {Service} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a service
 * @param {Object} serviceBody
 * @returns {Promise<Service>}
 */
const createService = async (serviceBody) => {
  // Check if the service with the given idService already exists
  // const existingService = await Service.findOne({ idService: serviceBody.idService });
  // if (existingService) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Service with this ID already exists');
  // }
  return Service.create(serviceBody);
};

/**
 * Query for services
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryServices = async (filter, options) => {
  const services = await Service.paginate(filter, {
    ...options,
    populate: 'specialist'
  });
  return services;
};

const getServicesBySpecialistId = async (specialistId) => {
  return Service.find({specialist: specialistId}).populate('specialist');
}

/**
 * Get service by id
 * @param {String} serviceId
 * @returns {Promise<Service>}
 */
const getServiceById = async (serviceId) => {
  return Service.findOne({serviceId}).populate('specialist');
};

/**
 * Update service by id
 * @param {String} serviceId
 * @param {Object} updateBody
 * @returns {Promise<Service>}
 */
const updateServiceById = async (serviceId, updateBody) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  Object.assign(service, updateBody);
  await service.save();
  return service;
};

/**
 * Delete service by id
 * @param {String} serviceId
 * @returns {Promise<Service>}
 */
const deleteServiceById = async (serviceId) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  await service.remove();
  return service;
};

/**
 * Get list of specialists
 * @returns {Promise<Specialists<string>>} List of specialists
 */
module.exports = {
  createService,
  queryServices,
  getServiceById,
  getServicesBySpecialistId,
  updateServiceById,
  deleteServiceById,
};
