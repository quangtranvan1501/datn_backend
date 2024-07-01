const express = require('express');

const { paymentController } = require('../../controllers');
const { paymentValidation } = require('../../validations');
const auth = require('../../middlewares/auth');
const { validate } = require('../../models/token.model');
const router = express.Router();

router.route('/').post(auth(), paymentController.createPayment);

module.exports = router;
