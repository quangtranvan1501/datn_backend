const mongoose = require('mongoose');
const { generateSnowflakeId } = require('../utils/snowflake');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema;

const scheduleDoctor = new Schema({
    scheduleDoctorId:{
        type: String,
        default: generateSnowflakeId,
        required: true,
    },
    doctorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Doctor' 
    },
    day: { 
        type: Date, 
        required: true 
    },
    startTime: { 
        type: String, 
        default: '08:00' ,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); 
            },
            message: props => `${props.value} không đúng định dạng hh:mm!`
        }
    },
    endTime: { 
        type: String, 
        default: '17:00' ,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); 
            },
            message: props => `${props.value} không đúng định dạng hh:mm!`
        }
    } 
});

scheduleDoctor.plugin(toJSON);
scheduleDoctor.plugin(paginate);

const Schedule = mongoose.model('Schedule', scheduleDoctor);

module.exports = Schedule;