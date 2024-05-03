const httpStatus = require('http-status');
const Service = require('../models/service.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serviceService } = require('../services');

const createService = catchAsync(async (req, res) => {
  console.log(req.body)
  const service = await serviceService.createService(req.body);
  res.status(httpStatus.CREATED).send(service);
});

const getServices = catchAsync(async (req, res) => {
  const services = await Service.find();
  res.send(services);
});

const getServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  res.send(service);
});

const updateServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.updateServiceById(req.params.serviceId, req.body, { new: true });
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  res.send(service);
});

const deleteServiceById = catchAsync(async (req, res) => {
  await serviceService.deleteServiceById(req.params.serviceId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getSpecialists = catchAsync(async (req, res) => {
  const specialists = await serviceService.getSpecialists() ;
  res.send(specialists);
});

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getSpecialists
};
