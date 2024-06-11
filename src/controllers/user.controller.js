const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản',
    data: user
  });
});
const createDoctor = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản',
    data: user
  });
});
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách tài khoản thành công',
    data: result
  });
});

const searchUser = catchAsync(async (req, res) => {
  const searchText = req.query.searchText || '';
    const options = {
      sortBy: req.query.sortBy,
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
    };

    const result = await userService.searchUser(searchText, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Tìm kiếm tài khoản thành công',
    data: result
  });
})

const searchDoctor = catchAsync(async (req, res) => {
  const searchText = req.query.searchText || '';
    const options = {
      sortBy: req.query.sortBy,
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
    };

    const result = await userService.searchDoctor(searchText, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Tìm kiếm bác sỹ thành công',
    data: result
  });
})

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserByUserId(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy thông tin tài khoản thành công',
    data: user
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật tài khoản thành công',
    data: user
  
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Xóa tài khoản thành công'
  
  });
});

const getDoctorBySpecialistId = catchAsync(async (req, res) => {
  const result = await userService.getDoctorBySpecialistId(req.params.specialistId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách bác sĩ thành công',
    data: result
  });
})

const getPatient = catchAsync(async (req, res) => {
  const result = await userService.getPatient(req.params.userId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách bệnh nhân thành công',
    data: result
  });
})

const getTVV = catchAsync(async (req, res) => {
  const result = await userService.getTVV();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách tư vấn viên thành công',
    data: result
  });
})

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
  getTVV
};
