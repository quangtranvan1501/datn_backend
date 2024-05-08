const httpStatus = require('http-status');
const Specialist = require('../models/specialist.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { specialistService } = require('../services');

const createSpecialist = catchAsync(async (req, res) => {
    const specialist = await specialistService.createSpecialist(req.body);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: 'Tạo khoa thành công',
        data: specialist
    });
});

const getSpecialists = catchAsync(async (req, res) => {
    const specialists = await specialistService.querySpecialists(req.query);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: 'Lấy danh sách khoa thành công',
        data: specialists,
        totalResult: specialists.length
    });
});

const getSpecialistById = catchAsync(async (req, res) => {
    const specialist = await specialistService.getSpecialistById(req.params.specialistId);
    if (!specialist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Specialist not found');
    }
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: 'Lấy thông tin khoa thành công',
        data: specialist
    });
});

const updateSpecialistById = catchAsync(async (req, res) => {
    const specialist = await specialistService.updateSpecialistById(req.params.specialistId, req.body);
    if (!specialist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Specialist not found');
    }
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: 'Cập nhật khoa thành công'
    });
});

const deleteSpecialistById = catchAsync(async (req, res) => {
    await specialistService.deleteSpecialistById(req.params.specialistId);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: 'Xóa khoa thành công'
    });
});

module.exports = {
    createSpecialist,
    getSpecialists,
    getSpecialistById,
    updateSpecialistById,
    deleteSpecialistById,
};
