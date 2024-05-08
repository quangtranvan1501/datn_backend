const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const e = require('express');

const examinationScheduleSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
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
