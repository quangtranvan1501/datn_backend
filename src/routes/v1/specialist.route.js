const express = require('express');
const validate = require('../../middlewares/validate');
const specialistValidation = require('../../validations/specialist.validation');
const specialistController = require('../../controllers/specialist.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(specialistValidation.createSpecialist), specialistController.createSpecialist)
    .get(specialistController.getSpecialists);

router
    .route('/:specialistId')
    .get(auth(), validate(specialistValidation.getSpecialistById), specialistController.getSpecialistById)
    .patch(auth('manageUsers'), validate(specialistValidation.updateSpecialist), specialistController.updateSpecialistById)
    .delete(auth('manageUsers'), validate(specialistValidation.deleteSpecialist), specialistController.deleteSpecialistById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Specialist
 *   description: Operations related to specialists
 */

/**
 * @swagger
 * /specialists:
 *   post:
 *     summary: Create a new specialist
 *     tags: [Specialist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: John Doe
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialist'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

