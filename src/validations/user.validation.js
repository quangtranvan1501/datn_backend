const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const { email } = require('../config/config');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    username: Joi.string().required(),
    gender: Joi.string().required().valid('Male', 'Female', 'Other'),
    role: Joi.string().required().valid('user', 'admin', 'doctor'),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    birthday: Joi.date().required(),
  }),
};

const createDoctor = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    username: Joi.string().required(),
    gender: Joi.string().required().valid('Male', 'Female', 'Other'),
    role: Joi.string().required().valid('user', 'admin', 'doctor'),
    phoneNumber: Joi.custom((value) => {
      if (typeof value !== 'string') {
        const stringValue = '0' + String(value);
        return stringValue;
      }
      return value;
    }).required(),
    address: Joi.string().required(),
    birthday: Joi.date().required(),
    positon: Joi.string().required(),
    specialist: Joi.string().required().custom(objectId),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchUser = {
  query: Joi.object().keys({
    searchText: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchDoctor = {
  query: Joi.object().keys({
    searchText: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const getPatient = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      // password: Joi.string().custom(password),
      name: Joi.string(),
      username: Joi.string(),
      gender: Joi.string(),
      phoneNumber: Joi.string(),
      address: Joi.string(),
      birthday: Joi.date(),
      positon: Joi.string(),
      specialist: Joi.string(),
    })
    .min(1),
};

const updateDevice = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      deviceToken: Joi.string().required(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const getDoctorBySpecialistId = {
  params: Joi.object().keys({
    specialistId: Joi.string().required(),
  }),
};

const updateDeviceToken = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    deviceToken: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  createDoctor,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDoctorBySpecialistId,
  getPatient,
  searchUser,
  searchDoctor,
  updateDevice,
  updateDeviceToken,
};
