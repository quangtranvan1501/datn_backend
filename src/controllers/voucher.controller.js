const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { voucherService } = require('../services');

const createVoucher = catchAsync(async (req, res) => {
  const voucher = await voucherService.createVoucher(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Tạo voucher thành công',
    data: voucher,
  });
});

const getVouchers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'expiryDate']); // Assuming you might want to filter vouchers by status
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await voucherService.queryVouchers(filter, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách voucher thành công',
    data: result,
  });
});

const getVoucherById = catchAsync(async (req, res) => {
  const voucher = await voucherService.getVoucherById(req.params.code);
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy voucher');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy voucher thành công',
    data: voucher,
  });
});

const updateVoucherById = catchAsync(async (req, res) => {
  const voucher = await voucherService.updateVoucherById(req.params.code, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'cập nhật voucher thành công',
    data: voucher,
  });
});

const deleteVoucherById = catchAsync(async (req, res) => {
  await voucherService.deleteVoucherById(req.params.code);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Xóa voucher thành công',
  });
});

const useVoucher = catchAsync(async (req, res) => {
  try {
    const voucher = await voucherService.useVoucher(req.params.code);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Áp dụng voucher thành công',
      data: voucher,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
});

const usedVoucher = catchAsync(async (req, res) => {
  await voucherService.usedVoucher(req.params.code);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Sử dụng voucher thành công',
  });
});

module.exports = {
  createVoucher,
  getVouchers,
  getVoucherById,
  updateVoucherById,
  deleteVoucherById,
  useVoucher,
  usedVoucher,
};
