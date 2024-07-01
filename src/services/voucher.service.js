const httpStatus = require('http-status');
const { Voucher } = require('../models');
const ApiError = require('../utils/ApiError');

const createVoucher = async (voucherBody) => {
  return Voucher.create(voucherBody);
};

const queryVouchers = async (filter, options) => {
  const vouchers = await Voucher.paginate(filter, options);
  return vouchers;
};

const getVoucherById = async (code) => {
  return Voucher.findOne({ code });
};

const updateVoucherById = async (code, updateBody) => {
  const voucher = await getVoucherById(code);
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Voucher not found');
  }
  Object.assign(voucher, updateBody);
  await voucher.save();
  return voucher;
};

const deleteVoucherById = async (code) => {
  const voucher = await getVoucherById(code);
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Voucher not found');
  }
  await voucher.remove();
  return voucher;
};

const useVoucher = async (code) => {
  const voucher = await Voucher.findOne({ code }).select('code type discount');
  if (!voucher) {
    throw new Error('Voucher không tìm thấy');
  }
  if (voucher.used || voucher.usageCount >= voucher.maxUsage) {
    throw new Error('Voucher đã hết lượt sử dụng');
  }
  if (new Date() > new Date(voucher.expirationDate)) {
    throw new Error('Voucher đã hết hạn sử dụng');
  }
  return voucher;
};

const usedVoucher = async (code) => {
  const voucher = await Voucher.findOne({ code });
  voucher.usageCount += 1;
  if (voucher.usageCount >= voucher.maxUsage) {
    voucher.used = true;
  }
  await voucher.save();
  return true;
};

module.exports = {
  createVoucher,
  queryVouchers,
  getVoucherById,
  updateVoucherById,
  deleteVoucherById,
  useVoucher,
  usedVoucher,
};
