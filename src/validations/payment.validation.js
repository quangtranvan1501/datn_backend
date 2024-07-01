const Joi = require('joi');
const { query } = require('../config/logger');

// Tạo cho tôi một số validation cho payment
const createPayment = {
  // body có các trường sau : paymentRequest, clientId, apiKey, checkSumKey
  body: {
    paymentRequest: Joi.object().required(),
  },
};

const deletePayment = {
  // body có các trường sau : id, reason, clientId, apiKey
  body: {
    id: Joi.string().required(),
    reason: Joi.string().required(),
  },
};

module.exports = {
  createPayment,
  deletePayment,
};
