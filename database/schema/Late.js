/****离返校登记*****/
const mongoose = require('mongoose')
const { Schema } = mongoose
let ObjectId = Schema.Types.ObjectId

const lateSchema = new Schema({
    lateId:  ObjectId,
    studentno: Number,
    time: {type:Date,default:Date.now()},
    reason: String,
    status: {type:Number,default:1}
})

mongoose.model('Late',lateSchema)