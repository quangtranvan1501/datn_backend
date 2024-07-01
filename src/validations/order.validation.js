const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    patient: Joi.string().custom(objectId).required(),
    totalAmount: Joi.number().min(0).required(),
    discount: Joi.number().min(0),
    orderService: Joi.array().items(
      Joi.object().keys({
        service: Joi.string().custom(objectId).required(),
        quantity: Joi.number().min(1).required(),
      })
    ),
  }),
};

const getOrderById = {
  params: Joi.object().keys({
    orderId: Joi.string(),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      patient: Joi.string().custom(objectId),
      totalAmount: Joi.number().min(0),
      discount: Joi.number().min(0),
      status: Joi.string().valid('0', '1', '-1'),
      orderDate: Joi.date(),
      orderService: Joi.array().items(
        Joi.object().keys({
          service: Joi.string().custom(objectId),
          quantity: Joi.number().min(1),
        })
      ),
    })
    .min(1),
};

const updateOrderByUser = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('0', '1', '-1'),
    })
    .min(1),
};

const updatePayment = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    paymentId: Joi.string().required(),
  }),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string(),
  }),
};

const getOrdersByUserId = {
  query: Joi.object().keys({
    patient: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  query: Joi.object().keys({
    orderDate: Joi.date(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createOrder,
  getOrderById,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  updatePayment,
  updateOrderByUser,
};
