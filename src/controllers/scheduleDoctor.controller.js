const httpStatus = require('http-status');
const { scheduleDoctorService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createScheduleDoctor = catchAsync(async (req, res) => {
  const scheduleDoctor = await scheduleDoctorService.createScheduleDoctor(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Tạo lịch làm việc thành công',
    data: scheduleDoctor
  });
});

const getSchedules = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['day', 'status', 'doctorId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await scheduleDoctorService.querySchedules(filter, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách lịch làm việc thành công',
    data: result,
  });
});

const getScheduleById = catchAsync(async (req, res) => {
  const scheduleDoctor = await scheduleDoctorService.getScheduleById(req.params.scheduleDoctorId);
  if (!scheduleDoctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lịch làm việc không được tìm thấy');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy thông tin lịch làm việc thành công',
    data: scheduleDoctor
  });
});

const updateScheduleById = catchAsync(async (req, res) => {
  const scheduleDoctor = await scheduleDoctorService.updateScheduleById(req.params.scheduleDoctorId, req.body);
  if (!scheduleDoctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lịch làm việc không được tìm thấy');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật lịch làm việc thành công',
    data: scheduleDoctor
  });
});

const deleteScheduleById = catchAsync(async (req, res) => {
  await scheduleDoctorService.deleteScheduleById(req.params.scheduleDoctorId);
  res.status(httpStatus.OK).send(
    {
      code: httpStatus.OK,
      message: 'Xóa lịch làm việc thành công'
    }
  );
});

const getScheduleByDoctorId = catchAsync(async (req, res) => {
  const { doctorId, page = 1, limit = 10, sortBy } = req.query;
  const result = await scheduleDoctorService.getScheduleByDoctorId(doctorId, parseInt(page), parseInt(limit), sortBy);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách lịch làm việc theo bác sĩ thành công',
    data: result
  });
})

module.exports = {
  createScheduleDoctor,
  getSchedules,
  getScheduleById,
  updateScheduleById,
  deleteScheduleById,
  getScheduleByDoctorId
};
