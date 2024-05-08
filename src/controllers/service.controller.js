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

const getAllServices = catchAsync(async (req, res) => {

  const services = await Service.find().populate('specialist');
  res.send({
    data: services,
    totalResult: services.length
  });
});

const getServicesBySpecialistId = catchAsync(async (req, res) => {
  console.log(req.params.specialistId)
  const result = await serviceService.getServicesBySpecialistId(req.params.specialistId);
  res.send({
    data: result,
    totalResult: result.length
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  res.send(service);
});

const updateServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.updateServiceById(req.params.serviceId, req.body);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  res.send(service);
});

const deleteServiceById = catchAsync(async (req, res) => {
  await serviceService.deleteServiceById(req.params.serviceId);
  res.status(httpStatus.OK).send('Đã xóa thành công');
});

const getSpecialists = catchAsync(async (req, res) => {
  console.log('getSpecialists')
  const specialists = await serviceService.getSpecialists() ;
  res.send(specialists);
});

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  getServicesBySpecialistId,
  updateServiceById,
  deleteServiceById,
  getSpecialists
};
