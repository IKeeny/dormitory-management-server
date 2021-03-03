const mongoose = require('mongoose')
const { Schema } = mongoose

const leaveAndReturnSchoolSchema = new Schema({
    studentno: {unique:true,type:Number},
    leaveTime: {type:Date,default:Date.now()},
    leaveRemark: String,
    returnTime: {type:Date,default:Date.now()}
})

mongoose.model('LeaveAndReturnSchool',leaveAndReturnSchoolSchema)