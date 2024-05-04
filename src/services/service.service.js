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
  const services = await Service.paginate(filter, options);
  return services;
};

/**
 * Get service by id
 * @param {ObjectId} idService
 * @returns {Promise<Service>}
 */
const getServiceById = async (idService) => {
  return Service.findById(idService);
};

/**
 * Update service by id
 * @param {ObjectId} idService
 * @param {Object} updateBody
 * @returns {Promise<Service>}
 */
const updateServiceById = async (idService, updateBody) => {
  const service = await getServiceById(idService);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  Object.assign(service, updateBody);
  await service.save();
  return service;
};

/**
 * Delete service by id
 * @param {ObjectId} idService
 * @returns {Promise<Service>}
 */
const deleteServiceById = async (idService) => {
  const service = await getServiceById(idService);
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
const getSpecialists = async () => {
    try {
      const specialists = await Service.distinct('specialist');
      return specialists;
    } catch (error) {
      throw new Error('Error getting specialists');
    }
  };
module.exports = {
  createService,
  queryServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getSpecialists
};
