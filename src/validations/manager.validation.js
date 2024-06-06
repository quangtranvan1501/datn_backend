const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const { query } = require('../config/logger');

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            name: Joi.string(),
            username: Joi.string(),
            gender: Joi.string(),
            phoneNumber: Joi.string(),
            address: Joi.string(),
            birthday: Joi.date(),
            positon: Joi.string(),
            specialist: Joi.string(),
            isEmailVerified: Joi.boolean(),
            role: Joi.string(),
            status: Joi.string(),
        })
        .min(1),
};

const searchUser = {
    query: Joi.object().keys({
        query:Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const countGenderByRole = {
    query: Joi.object().keys({
      role: Joi.string().valid('user', 'doctor',).default('user'),
    }),
  };

module.exports = {
    updateUser,
    searchUser,
    countGenderByRole
};