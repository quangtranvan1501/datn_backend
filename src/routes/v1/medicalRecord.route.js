const express = require('express');
const validate = require('../../middlewares/validate');
const medicalRecordValidation = require('../../validations/medicalRecord.validation');
const medicalRecordController = require('../../controllers/medicalRecord.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/doctor/:doctorId').get(auth(), validate(medicalRecordValidation.getMedicalRecordByDoctorId), medicalRecordController.getMedicalRecordByDoctorId);

router
    .route('/')
    .post(auth(), validate(medicalRecordValidation.createMedicalRecord), medicalRecordController.createMedicalRecord)
    .get(auth(), validate(medicalRecordValidation.getMedicalRecords) , medicalRecordController.getMedicalRecords);

router
    .route('/:medicalRecordId')
    .get(auth(), validate(medicalRecordValidation.getMedicalRecordById), medicalRecordController.getMedicalRecordById)
    .patch(auth(), validate(medicalRecordValidation.updateMedicalRecord), medicalRecordController.updateMedicalRecordById)
    .delete(auth('manageUsers'), validate(medicalRecordValidation.deleteMedicalRecord), medicalRecordController.deleteMedicalRecordById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: MedicalRecord
 *   description: Operations related to medical records
 */

/**
 * @swagger
 * /medicalRecords:
 *   post:
 *     summary: Create a new medical record
 *     tags: [MedicalRecord]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: string
 *               doctor:
 *                 type: string
 *               diagnose:
 *                 type: string
 *               testResults:
 *                 type: string
 *               note:
 *                 type: string
 *               day:
 *                 type: string
 *                 format: date
 *             example:
 *               patient: 6123456789abcdef1234567
 *               doctor: 6123456789abcdef1234567
 *               diagnose: Some diagnosis
 *               testResults: Test results
 *               note: Some notes
 *               day: 2024-05-06
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalRecord'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

