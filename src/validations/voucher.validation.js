const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createVoucher = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    discount: Joi.number().min(0).required(),
    type: Joi.string().required(),
    expirationDate: Joi.date().required(),
    maxUsage: Joi.number().min(0).required(),
  }),
};

const getVoucherById = {
  params: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const updateVoucher = {
  params: Joi.object().keys({
    code: Joi.string().required(),
  }),
  body: Joi.object().keys({
    discount: Joi.number().min(0),
    type: Joi.string(),
    expirationDate: Joi.date(),
    maxUsage: Joi.number().min(0),
  }),
};

const deleteVoucher = {
  params: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const getVouchers = {
  query: Joi.object().keys({
    code: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const usedVoucher = {
  params: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

module.exports = {
  createVoucher,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  getVouchers,
  usedVoucher,
};
