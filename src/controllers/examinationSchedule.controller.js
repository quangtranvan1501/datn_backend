const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { examinationScheduleService } = require('../services');

const createExaminationSchedule = catchAsync(async (req, res) => {
  const examinationSchedule = await examinationScheduleService.createExaminationSchedule(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Đặt lịch khám thành công',
    data: examinationSchedule,
  });
});

const getExaminationSchedules = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['day']); // Assuming you might want to filter schedules by patient or doctor
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await examinationScheduleService.queryExaminationSchedules(filter, options);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách lịch khám thành công',
    data: result,
  });
});

const getExaminationScheduleById = catchAsync(async (req, res) => {
  const examinationSchedule = await examinationScheduleService.getExaminationScheduleById(req.params.examinationScheduleId);
  if (!examinationSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Examination schedule not found');
  }
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy thông tin lịch khám thành công',
    data: examinationSchedule,
  });
});

const updateExaminationScheduleById = catchAsync(async (req, res) => {
  const examinationSchedule = await examinationScheduleService.updateExaminationScheduleById(
    req.params.examinationScheduleId,
    req.body
  );
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cập nhật lịch khám thành công',
    data: examinationSchedule,
  });
});

const deleteExaminationScheduleById = catchAsync(async (req, res) => {
  await examinationScheduleService.deleteExaminationScheduleById(req.params.examinationScheduleId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Xóa lịch khám thành công',
  });
});

const checkDoctorShedule = catchAsync(async (req, res) => {
  const { doctor, day } = req.body;
  await examinationScheduleService.checkDoctorShedule(doctor, day);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Kiểm tra lịch khám bác sĩ thành công',
  });
});

const getExaminationScheduleByUserId = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const examinationSchedules = await examinationScheduleService.getExaminationSchedulesByPatientId(
    options,
    req.params.userId
  );
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách lịch khám thành công',
    data: examinationSchedules,
  });
});

const getExaminationSchedulesByDoctorId = catchAsync(async (req, res) => {
  const examinationSchedules = await examinationScheduleService.getExaminationSchedulesByDoctorId(req.params.doctorId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách lịch khám thành công',
    data: examinationSchedules,
  });
});

const getDoctorScheduleDays = catchAsync(async (req, res) => {
  const doctorScheduleDays = await examinationScheduleService.getDoctorScheduleDays(req.params.doctorId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách ngày làm việc của bác sĩ thành công',
    data: doctorScheduleDays,
  });
});

const getExaminationScheduleByDay = catchAsync(async (rep, res) => {
  const { doctor, day } = rep.body;
  const doctorScheduleDays = await examinationScheduleService.getExaminationScheduleByDay(doctor, day);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Lấy danh sách ngày làm việc của bác sĩ thành công',
    data: doctorScheduleDays,
  });
});

module.exports = {
  createExaminationSchedule,
  getExaminationSchedules,
  getExaminationScheduleById,
  updateExaminationScheduleById,
  deleteExaminationScheduleById,
  checkDoctorShedule,
  getExaminationScheduleByUserId,
  getExaminationSchedulesByDoctorId,
  getDoctorScheduleDays,
  getExaminationScheduleByDay,
};
