const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const e = require('express');
const { generateSnowflakeId } = require('../utils/snowflake');

const examinationScheduleSchema = mongoose.Schema(
  {
    examinationScheduleId: {
      type: String,
      required: true,
      default: generateSnowflakeId,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    day: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
examinationScheduleSchema.plugin(toJSON);
examinationScheduleSchema.plugin(paginate);

const ExaminationSchedule = mongoose.model('ExaminationSchedule', examinationScheduleSchema);

module.exports = ExaminationSchedule;
