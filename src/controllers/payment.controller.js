const { paymentService } = require('../services');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// Viết cho tôi hàm thanh toán
const createPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.createPayment(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Tạo thanh toán thành công',
    data: payment,
  });
});

// hàm hủy thanh toán
const deletePayment = catchAsync(async (req, res) => {
  await paymentService.deletePayment(req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Hủy thanh toán thành công',
  });
});

module.exports = {
  createPayment,
  deletePayment,
};
