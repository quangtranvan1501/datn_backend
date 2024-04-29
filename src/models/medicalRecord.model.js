const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const medicalRecordSchema = mongoose.Schema(
  {
    idRecord: {
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
