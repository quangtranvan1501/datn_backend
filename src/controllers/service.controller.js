const httpStatus = require('http-status');
const Service = require('../models/service.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serviceService } = require('../services');
const pick = require('../utils/pick');

const createService = catchAsync(async (req, res) => {
  console.log(req.body)
  const service = await serviceService.createService(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Tạo dịch vụ thành công',
    data: service
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const services = await serviceService.queryServices(filter, options);

  // const services = await Service.find().populate('specialist');
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách dịch vụ thành công',
    data: services,
  });
});

const getServicesBySpecialistId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['specialist']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await serviceService.getServicesBySpecialistId(filter, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách dịch vụ thành công',
    data: result,
    totalResult: result.length
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy thông tin dịch vụ thành công',
    data: service
  });
});

const updateServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.updateServiceById(req.params.serviceId, req.body);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật dịch vụ thành công',
    data: service
  });
});

const deleteServiceById = catchAsync(async (req, res) => {
  await serviceService.deleteServiceById(req.params.serviceId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Xóa dịch vụ thành công'
  });
});

const searchService = catchAsync(async (req, res) => {
  const searchText = req.query.searchText || '';
  const options = {
    sortBy: req.query.sortBy,
    limit: parseInt(req.query.limit, 10) || 10,
    page: parseInt(req.query.page, 10) || 1,
  };

  const result = await serviceService.searchService(searchText, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Tìm kiếm tài khoản thành công',
    data: result
  });
})

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  getServicesBySpecialistId,
  updateServiceById,
  deleteServiceById,
  searchService
};
