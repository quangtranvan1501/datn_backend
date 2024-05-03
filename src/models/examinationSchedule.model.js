const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const e = require('express');

const examinationScheduleSchema = mongoose.Schema(
  {
    idSchedule: {
      type: Number,
      required: true,
      unique: true,
    },
    idPatient: {
      type: Number,
      required: true,
    },
    idDoctor: {
      type: Number,
      required: true,
    },
    idOrder: {
      type: Number,
      required: true,
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
