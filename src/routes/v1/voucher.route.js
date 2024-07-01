const express = require('express');
const validate = require('../../middlewares/validate');
const voucherValidation = require('../../validations/voucher.validation');
const voucherController = require('../../controllers/voucher.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/use/:code').get(auth(), validate(voucherValidation.getVoucherById), voucherController.useVoucher);

router
  .route('/')
  .post(auth('manageUsers'), validate(voucherValidation.createVoucher), voucherController.createVoucher)
  .get(auth('manageUsers'), validate(voucherValidation.getVouchers), voucherController.getVouchers);

router
  .route('/:code')
  .get(auth(), validate(voucherValidation.getVoucherById), voucherController.getVoucherById)
  .patch(auth('manageUsers'), validate(voucherValidation.updateVoucher), voucherController.updateVoucherById)
  .delete(auth('manageUsers'), validate(voucherValidation.deleteVoucher), voucherController.deleteVoucherById);

module.exports = router;
