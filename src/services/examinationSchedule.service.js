const httpStatus = require('http-status');
const { ExaminationSchedule, ScheduleDoctor } = require('../models');
const ApiError = require('../utils/ApiError');
global.examinationInterval = 30;

const isWithinWorkingHours = async (doctorId, appointmentDate) => {
  console.log(doctorId, appointmentDate);
  const appointmentDay = new Date(appointmentDate.getTime());
  appointmentDay.setUTCHours(0, 0, 0, 0);
  console.log(appointmentDay);
  const doctorSchedule = await ScheduleDoctor.findOne({
    doctorId: doctorId,
    day: appointmentDay, // Check for the same day
    status: '1'
  });

  if (!doctorSchedule) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bác sỹ không làm việc vào ngày này.');
  }

  const { startTime, endTime } = doctorSchedule;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startAppointment = new Date(appointmentDate);
  startAppointment.setHours(startHour, startMinute, 0, 0);

  const endAppointment = new Date(appointmentDate);
  endAppointment.setHours(endHour, endMinute, 0, 0);

  if (appointmentDate < startAppointment || appointmentDate > endAppointment) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Lịch hẹn phải nằm trong khoảng ${startTime} và ${endTime}.`);
  }

  return true;
};
const hasConflictingAppointment = async (doctorId, appointmentDate, interval) => {
  const startRange = new Date(appointmentDate.getTime() - interval * 60000);
  const endRange = new Date(appointmentDate.getTime() + interval * 60000);

  const existingAppointment = await ExaminationSchedule.findOne({
    doctor: doctorId,
    day: { $gte: startRange, $lte: endRange }
  });

  if (existingAppointment) {
    const conflictingTime = existingAppointment.day.getHours() + ':' + String(existingAppointment.day.getMinutes()).padStart(2, '0');
    throw new ApiError(httpStatus.BAD_REQUEST, `Bác sỹ đã có lịch vào ${conflictingTime}, vui lòng đặt lịch trước hoặc sau ${interval} phút.`);
  }

  return false;
};



/**
 * Create an examination schedule
 * @param {Object} examinationScheduleBody
 * @returns {Promise<ExaminationSchedule>}
 */
const createExaminationSchedule = async (examinationScheduleBody) => {
  try {
    return ExaminationSchedule.create(examinationScheduleBody);
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error.message);
  }
};
const checkDoctorShedule = async (doctorId, day) => {
  const appointmentDate = new Date(day);

  const checkTime = await isWithinWorkingHours(doctorId, appointmentDate);

  const interval = 30;

  const checkConflict = await hasConflictingAppointment(doctorId, appointmentDate, interval);

  if (checkTime && !checkConflict) {
    return true;
  } else {
    return false;
  }
}

/**
 * Query for examination schedules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExaminationSchedules = async (filter, options) => {
  const populateOptions = [
    'patient',
    'service.specialist',
    'doctor',
  ].join(',');
  const paginationOptions = {
    ...options,
    populate: populateOptions,
  };
  if(filter.day){
    const startOfDay = new Date(filter.day);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    filter.day = {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }
  const examinationSchedules = await ExaminationSchedule.paginate(filter, paginationOptions);
  const examinationSchedules2 = examinationSchedules.results.map(shedule => {
    const patientDetails = {
      userId: shedule.patient.userId,
      name: shedule.patient.name,
      gender: shedule.patient.gender,
      address: shedule.patient.address,
      birthday: shedule.patient.birthday
    };
    let doctorName = {};
    if(shedule.doctor){
      doctorName = {
        userId: shedule.doctor.userId,
        name: shedule.doctor.name,
        gender: shedule.patient.gender,
        address: shedule.patient.address,
        birthday: shedule.patient.birthday
      };
    }
    const serviceName = {
      name: shedule.service.name,
      specialist: shedule.service.specialist
    };
    return {
      ...shedule.toObject(), 
      patient: patientDetails,
      doctor: doctorName,
      service: serviceName
    };
  });
  examinationSchedules.results = examinationSchedules2;
  return examinationSchedules;
};

/**
 * Get examination schedules by patient ID
 * @param {String} patientId
 * @returns {Promise<ExaminationSchedule>}
 */
const getExaminationSchedulesByPatientId = async (options, patientId) => {
  const filter = { patient: patientId };
  const populateOptions = [
    'patient',
    'service.specialist',
    'doctor',
  ].join(',');

  const paginationOptions = {
    ...options,
    populate: populateOptions,
  };

  const examinationUser = await ExaminationSchedule.paginate(filter, paginationOptions);
  return examinationUser;
};

// const getExaminationSchedulesByPatientId = async (options, patientId) => {
//   const examinationUser = await ExaminationSchedule.find({ patient: patientId })
//     .populate('patient')
//     .populate({
//       path: 'service',
//       populate: {
//         path: 'specialist',
//       },
//     })
//     .populate('doctor');
  
//   const examinationUser2 = await examinationUser.paginate({}, options);
//   return examinationUser2
// };

const getExaminationSchedulesByDoctorId = async (doctorId) => {
  return ExaminationSchedule.find({ doctor: doctorId })
    .populate('patient')
    .populate({
      path: 'service',
      populate: {
        path: 'specialist',
      },
    })
    .populate('doctor');
}

/**
 * Get examination schedule by id
 * @param {String} examinationScheduleId
 * @returns {Promise<ExaminationSchedule>}
 */
const getExaminationScheduleById = async (examinationScheduleId) => {
  return ExaminationSchedule.findOne({ examinationScheduleId })
    .populate('patient', 'name userId birthday address gender')
    .populate('service', 'name specialist')
    .populate('doctor', 'name userId birthday address gender');

};  

/**
 * Update examination schedule by id
 * @param {String} examinationScheduleId
 * @param {Object} updateBody
 * @returns {Promise<ExaminationSchedule>}
 */
const updateExaminationScheduleById = async (examinationScheduleId, updateBody) => {
  const examinationSchedule = await getExaminationScheduleById(examinationScheduleId);
  if (!examinationSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Examination schedule not found');
  }
  Object.assign(examinationSchedule, updateBody);
  await examinationSchedule.save();
  return examinationSchedule;
};

/**
 * Delete examination schedule by id
 * @param {String} examinationScheduleId
 * @returns {Promise<ExaminationSchedule>}
 */
const deleteExaminationScheduleById = async (examinationScheduleId) => {
  const examinationSchedule = await getExaminationScheduleById(examinationScheduleId);
  if (!examinationSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Examination schedule not found');
  }
  await examinationSchedule.remove();
  return examinationSchedule;
};

const getDoctorScheduleDays = async (doctor) => {
  const doctorSchedule = await ExaminationSchedule.find({ doctor });
  const uniqueDaysSet = new Set(doctorSchedule.map((schedule) => {
    const date = schedule.day;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }));
  return [...uniqueDaysSet];
}

const getExaminationScheduleByDay = async (doctor, day) => {

  const startOfDay = new Date(day);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const examinationSchedule = await ExaminationSchedule.find({
    doctor: doctor,
    day: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).populate('patient').populate('service');
  return examinationSchedule
}

const searchByDay = async (filter, options) => {
  return ExaminationSchedule.paginate(filter, options);
}
module.exports = {
  createExaminationSchedule,
  queryExaminationSchedules,
  getExaminationSchedulesByPatientId,
  getExaminationScheduleById,
  updateExaminationScheduleById,
  deleteExaminationScheduleById,
  checkDoctorShedule,
  getExaminationSchedulesByDoctorId,
  getDoctorScheduleDays,
  getExaminationScheduleByDay,
  searchByDay
};
