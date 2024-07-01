const express = require('express');
const validate = require('../../middlewares/validate');
const { notificationsController } = require('../../controllers');
const { notificatonsValidation } = require('../../validations');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/').post(notificationsController.sendNotification);

router.route('/read-all/:userId').get(auth(), notificationsController.readAllNotification);

router
  .route('/create')
  .post(validate(notificatonsValidation.createNotification), notificationsController.createNotification);

router
  .route('/update/:notificationId')
  .patch(validate(notificatonsValidation.updateNotification), notificationsController.updateNotification);

router
  .route('/user')
  .get(validate(notificatonsValidation.getNotificationByUserId), notificationsController.getNotifications);

module.exports = router;
