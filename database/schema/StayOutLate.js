const mongoose = require('mongoose')
const { Schema } = mongoose

const stayOutLateSchema = new Schema({
    studentno: {unique:true,type:Number},
    time: {type:Date,default:Date.now()},
    reason: String,
    status: {type:Number,default:1}
})

module.exports = mongoose.model('StayOutLate',stayOutLateSchema)