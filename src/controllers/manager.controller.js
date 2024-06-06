const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, managerService } = require('../services');

const updateUser = catchAsync(async (req, res) => {
  const user = await managerService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật tài khoản thành công',
    data: user
  });
});

const countGenderByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const genderCounts = await managerService.countGenderByRole(role || 'user');
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Thống kê giới tính theo vai trò thành công',
      data: genderCounts
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getTotalRevenueByMonth = async (req, res) =>{
  try {
    const results = await managerService.getTotalRevenueByMonth();
     
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Thống kê doanh thu theo tháng thành công',
      data: results
    })
  } catch (error) {
    console.log(error);
  }
}

const getTop10Services = async (req, res) => {
  try {
    const results = await managerService.getTop10Services();
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Lấy danh sách 10 dịch vụ phổ biến nhất thành công',
      data: results
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  updateUser,
  countGenderByRole,
  getTotalRevenueByMonth,
  getTop10Services
};