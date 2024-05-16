const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const serviceRoute = require('./service.route');
const specialistRoute = require('./specialist.route');
const medicalRecordRoute = require('./medicalRecord.route');
const orderRoute = require('./order.route');
const examinationScheduleRoute = require('./examinationSchedule.route');
const config = require('../../config/config');

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
    path: "/services",
    route: serviceRoute,
  },
  {
    path: "/specialist",
    route: specialistRoute,
  },
  {
    path: "/medicalRecords",
    route: medicalRecordRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/examinationSchedules",
    route: examinationScheduleRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
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
