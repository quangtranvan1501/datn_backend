const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Đã tạo đơn hàng thành công',
    data: order,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'orderDate']); // Assuming you might want to filter orders by status
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.queryOrders(filter, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách đơn hàng thành công',
    data: result,
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Đơn hàng không tồn tại');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy thông tin đơn hàng thành công',
    data: order,
  });
});

const updateOrderById = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật đơn hàng thành công',
    data: order,
  });
});

const updateOrderByUser = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật đơn hàng thành công',
    data: order,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật thanh toán thành công',
    data: order,
  });
});

const deleteOrderById = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Xóa đơn hàng thành công',
  });
});

const getOrdersByUserId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['patient']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const orders = await orderService.getOrdersByUserId(options, filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách đơn hàng thành công',
    data: orders,
  });
});

const getTopServices = catchAsync(async (req, res) => {
  const services = await orderService.getTopServices();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách dịch vụ nhiều lượt đặt thành công',
    data: services,
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrdersByUserId,
  updatePayment,
  updateOrderByUser,
  getTopServices,
};
