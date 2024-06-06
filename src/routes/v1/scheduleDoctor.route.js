const express = require('express');
const validate = require('../../middlewares/validate');
const scheduleDoctorValidation = require('../../validations/scheduleDoctor.validation');
const scheduleDoctorController = require('../../controllers/scheduleDoctor.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/doctor').get(auth(), validate(scheduleDoctorValidation.getScheduleDoctorByDoctorId), scheduleDoctorController.getScheduleByDoctorId);

router
  .route('/')
  .post(auth(), validate(scheduleDoctorValidation.createScheduleDoctor), scheduleDoctorController.createScheduleDoctor)
  .get(auth('manageUsers'), validate(scheduleDoctorValidation.getScheduleDoctor) , scheduleDoctorController.getSchedules);

router
  .route('/:scheduleDoctorId')
  .get(auth(), validate(scheduleDoctorValidation.getScheduleDoctorById), scheduleDoctorController.getScheduleById)
  .patch(auth('manageUsers'), validate(scheduleDoctorValidation.updateScheduleDoctor), scheduleDoctorController.updateScheduleById)
  .delete(auth(), validate(scheduleDoctorValidation.deleteScheduleDoctor), scheduleDoctorController.deleteScheduleById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: ScheduleDoctor
 *   description: Operations related to doctor schedules
 */

/**
 * @swagger
 * /scheduleDoctors:
 *   post:
 *     summary: Create a new schedule for a doctor
 *     tags: [ScheduleDoctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleDoctor'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleDoctor'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /scheduleDoctors:
 *   get:
 *     summary: Get all doctor schedules
 *     tags: [ScheduleDoctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScheduleDoctor'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /scheduleDoctors/{id}:
 *   get:
 *     summary: Get a schedule by ID
 *     tags: [ScheduleDoctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the schedule
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleDoctor'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /scheduleDoctors/{id}:
 *   patch:
 *     summary: Update a schedule by ID
 *     tags: [ScheduleDoctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleDoctorUpdate'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleDoctor'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /scheduleDoctors/{id}:
 *   delete:
 *     summary: Delete a schedule by ID
 *     tags: [ScheduleDoctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the schedule
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
