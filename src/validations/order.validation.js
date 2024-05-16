const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    patient: Joi.string().custom(objectId).required(),
    totalAmount: Joi.number().min(0).required(),
    discount: Joi.number().min(0).required(),
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
  body: Joi.object().keys({
    patient: Joi.string().custom(objectId),
    totalAmount: Joi.number().min(0),
    discount: Joi.number().min(0),
    status: Joi.string().valid('pending', 'completed', 'cancelled'),
    orderDate: Joi.date(),
    orderService: Joi.array().items(
      Joi.object().keys({
        service: Joi.string().custom(objectId),
        quantity: Joi.number().min(1),
      })
    ),
  }).min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string(),
  }),
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
