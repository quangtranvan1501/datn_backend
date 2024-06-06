const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { managerValidation } = require('../../validations');
const { managerController } = require('../../controllers');

const router = express.Router();

router.route('/:userId').patch(auth('manageUsers'), validate(managerValidation.updateUser), managerController.updateUser);

router.route('/count-gender').get(auth('manageUsers'), validate(managerValidation.countGenderByRole), managerController.countGenderByRole);

router.route('/total-revenue-by-month').get(auth('manageUsers'), managerController.getTotalRevenueByMonth);

router.route('/top-10-services').get(auth('manageUsers'), managerController.getTop10Services);

module.exports = router;