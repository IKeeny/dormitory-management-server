const mongoose = require('mongoose')
const { Schema } = mongoose

const leaveAndReturnSchoolSchema = new Schema({
    studentno: {unique:true,type:Number},
    leaveTime: {type:Date,default:Date.now()},
    leaveRemark: String,
    returnTime: {type:Date,default:Date.now()},
    status: {type:Number,default:1}
})

module.exports = mongoose.model('LeaveAndReturnSchool',leaveAndReturnSchoolSchema)