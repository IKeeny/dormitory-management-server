const mongoose = require('mongoose')
const { Schema } = mongoose

const stayOutLateSchema = new Schema({
    studentno: {unique:true,type:Number},
    time: {type:Date,default:Date.now()},
    reason: String
})

mongoose.model('StayOutLate',stayOutLateSchema)