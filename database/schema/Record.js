/****离返校登记*****/
const mongoose = require('mongoose')
const { Schema } = mongoose
let ObjectId = Schema.Types.ObjectId

const recordSchema = new Schema({
    recordId:  ObjectId,
    studentno: Number,
    leaveTime: {type:Date,default:Date.now()},
    remark: String,
    returnTime: {type:Date,default:Date.now()},
    status: {type:Number,default:1}
})

mongoose.model('Record',recordSchema)