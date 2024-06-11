const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { update } = require('../models/token.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isUsername(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username đã tồn tại');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getAllUsers = async ({ role, userIds }) => {
  try {
    const query = {};
    if (userIds && Array.isArray(userIds)) {
      query.userId = { $in: userIds };
    }
    if (role) {
      query.role = role;
    }
    const users = await User.find(query);

    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchUser = async (searchText, options) => {
  try {
    let filter = {};
    if (searchText) {
      const searchRegex = { $regex: searchText, $options: 'i' };
      const fields = Object.keys(User.schema.paths).filter((key) => User.schema.paths[key].instance === 'String');
      filter = {
        $or: fields.map((field) => ({ [field]: searchRegex })),
      };
    }

    const result = await User.paginate(filter, options);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchDoctor = async (searchText, options) => {
  try {
    let filter = {};
    if (searchText) {
      const searchRegex = { $regex: searchText, $options: 'i' };
      const fields = Object.keys(User.schema.paths).filter((key) => User.schema.paths[key].instance === 'String');
      filter = {
        $or: fields.map((field) => ({ [field]: searchRegex })),
        role: 'doctor',
      };
    }

    const result = await User.paginate(filter, options);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

// /**
//  * Get user by id
//  * @param {Number} userId
//  * @returns {Promise<User>}
//  */
// const getUserByUserId = async (userId) => {
//   console.log(userId)
//   return User.findOne({userId});
// };

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return User.findOne({ username });
};

const getUserByUserId = async (userId) => {
  return User.findOne({ userId }).populate('specialist');
};

const getPatient = async (userId) => {
  return User.findOne({ userId }).select('id userId name gender birthday address');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateUserByEmail = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserByUserId(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const getDoctorBySpecialistId = async (specialistId) => {
  return User.find({ specialist: specialistId });
};

const getTVV = async () => {
  return User.find({ role: 'admin' }).select('id userId name');
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByUserId,
  getUserByEmail,
  updateUserById,
  updateUserByEmail,
  deleteUserById,
  getUserByUsername,
  getAllUsers,
  getDoctorBySpecialistId,
  getPatient,
  searchUser,
  searchDoctor,
  getTVV,
};
