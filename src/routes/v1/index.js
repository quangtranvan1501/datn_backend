const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const serviceRoute = require('./service.route');
const specialistRoute = require('./specialist.route');
const medicalRecordRoute = require('./medicalRecord.route');
const orderRoute = require('./order.route');
const examinationScheduleRoute = require('./examinationSchedule.route');
const scheduleDoctorRoute = require('./scheduleDoctor.route');
const managerRoute = require('./manager.route');
const messageRoute = require('./message.route');
const paymentRoute = require('./payment.route');
const notificationRoute = require('./notifications.route');
const voucherRoute = require('./voucher.route');
const config = require('../../config/config');
const { path } = require('../../app');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/services',
    route: serviceRoute,
  },
  {
    path: '/specialist',
    route: specialistRoute,
  },
  {
    path: '/medicalRecords',
    route: medicalRecordRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/examinationSchedules',
    route: examinationScheduleRoute,
  },
  {
    path: '/scheduleDoctors',
    route: scheduleDoctorRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/manager',
    route: managerRoute,
  },
  {
    path: '/message',
    route: messageRoute,
  },
  {
    path: '/payment',
    route: paymentRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/vouchers',
    route: voucherRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
devRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
// }

module.exports = router;
