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

const getServicesBySpecialistId = async (filter, options) => {
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

    const schedules = await Service.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions)
      .populate('specialist', 'name');
    const totalResults = await Service.countDocuments(filter);

    return {
      totalResults,
      page,
      limit,
      results: schedules
    };
  } catch (error) {
    throw new Error(error.message);
  }
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

const searchService = async (searchText, options) => {
  try {
    let filter = {};
    if (searchText) {
      const searchRegex = { $regex: searchText, $options: 'i' };
      const fields = Object.keys(Service.schema.paths).filter(key => Service.schema.paths[key].instance === 'String');
      filter = {
        $or: fields.map(field => ({ [field]: searchRegex })),
      };
    }

    const result = await Service.paginate(filter, {
      ...options,
      populate: 'specialist'});
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

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
  searchService
};
