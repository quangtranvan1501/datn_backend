const { scheduleDoctorService, userService } = require('../services');
const schedule = require('node-schedule');
// const { scheduleDoctorService } = require('./services');

// Hàm tạo lịch làm việc cho một tuần
const createWeeklySchedules = async () => {
  const doctors = await userService.getAllUsers({ role: 'doctor' });
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  for (let doctor of doctors) {
    for (let day of daysOfWeek) {
      const nextDay = getNextDayOfWeek(day);

      // Check if the schedule already exists
      const scheduleExists = await scheduleDoctorService.checkScheduleExists(doctor.id, nextDay);
      if (!scheduleExists) {
        await scheduleDoctorService.createScheduleDoctor({
          doctorId: doctor.id,
          day: nextDay,
          startTime: '08:00',
          endTime: '17:00',
        });
      }
    }
  }
};

// Hàm lấy ngày tiếp theo của một ngày trong tuần
const getNextDayOfWeek = (dayName) => {
  const dayOfWeek = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 0,
  };

  const now = new Date();
  const resultDate = new Date();
  resultDate.setDate(now.getDate() + ((7 - now.getDay() + dayOfWeek[dayName]) % 7));
  return resultDate;
};
schedule.scheduleJob('0 9 * * 5', createWeeklySchedules);
module.exports = { createWeeklySchedules };