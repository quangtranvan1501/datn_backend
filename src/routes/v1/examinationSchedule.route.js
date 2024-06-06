const express = require('express');
const validate = require('../../middlewares/validate');
const examinationScheduleValidation = require('../../validations/examinationSchedule.validation');
const examinationScheduleController = require('../../controllers/examinationSchedule.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/doctor/day').post(auth(), validate(examinationScheduleValidation.getExaminationScheduleByDay), examinationScheduleController.getExaminationScheduleByDay);

router.route('/user/:userId').get(auth(), validate(examinationScheduleValidation.getExaminationScheduleByUserId), examinationScheduleController.getExaminationScheduleByUserId);

router.route('/doctor/:doctorId').get(auth(), validate(examinationScheduleValidation.getExaminationSchedulesByDoctorId), examinationScheduleController.getExaminationSchedulesByDoctorId);


router.route('/doctor/schedule-days/:doctorId').get(auth(), validate(examinationScheduleValidation.getDoctorScheduleDays), examinationScheduleController.getDoctorScheduleDays);


router
    .route('/checkDoctorShedule')
    .post(auth(), validate(examinationScheduleValidation.checkDoctorShedule), examinationScheduleController.checkDoctorShedule);

router
    .route('/')
    .post(auth(), validate(examinationScheduleValidation.createExaminationSchedule), examinationScheduleController.createExaminationSchedule)
    .get(auth('manageUsers'), validate(examinationScheduleValidation.getExaminationSchedule), examinationScheduleController.getExaminationSchedules);

router
    .route('/:examinationScheduleId')
    .get(auth(), validate(examinationScheduleValidation.getExaminationScheduleById), examinationScheduleController.getExaminationScheduleById)
    .patch(auth('manageUsers'), validate(examinationScheduleValidation.updateExaminationSchedule), examinationScheduleController.updateExaminationScheduleById)
    .delete(auth(), validate(examinationScheduleValidation.deleteExaminationSchedule), examinationScheduleController.deleteExaminationScheduleById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Examination Schedule
 *   description: Operations related to examination schedules
 */

/**
 * @swagger
 * /examinationSchedules:
 *   post:
 *     summary: Create a new examination schedule
 *     tags: [Examination Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExaminationSchedule'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExaminationSchedule'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /examinationSchedules/{examinationScheduleId}:
 *   get:
 *     summary: Get an examination schedule by ID
 *     tags: [Examination Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examinationScheduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExaminationSchedule'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update an examination schedule by ID
 *     tags: [Examination Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examinationScheduleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExaminationSchedule'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExaminationSchedule'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete an examination schedule by ID
 *     tags: [Examination Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examinationScheduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No Content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
