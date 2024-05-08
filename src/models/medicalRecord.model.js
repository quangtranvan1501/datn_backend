const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const medicalRecordSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    diagnose: {
      type: String,
      required: true,
    },
    testResults: {
      type: String,
      required: true,
    },
    note: {
      type: String,
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
medicalRecordSchema.plugin(toJSON);
medicalRecordSchema.plugin(paginate);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
