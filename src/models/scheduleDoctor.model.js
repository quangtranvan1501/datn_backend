const mongoose = require('mongoose');
const { generateSnowflakeId } = require('../utils/snowflake');
const { toJSON, paginate } = require('./plugins');
const { unix } = require('moment');
const Schema = mongoose.Schema;

const scheduleDoctor = new Schema({
    scheduleDoctorId:{
        type: String,
        default: generateSnowflakeId,
        required: true,
    },
    doctorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    day: { 
        type: Date, 
        required: true,
        unique: true,
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
    },
    status:{
        type: String,
        enum: ['1', '0','-1'],
        default: '0',

    }
});

scheduleDoctor.plugin(toJSON);
scheduleDoctor.plugin(paginate);

const Schedule = mongoose.model('Schedule', scheduleDoctor);

module.exports = Schedule;