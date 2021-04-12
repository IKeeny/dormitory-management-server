const mongoose = require('mongoose')
const { Schema } = mongoose

const dormSchema = new Schema({
    apartno: Number, //楼栋编号
    dormno: Number, //宿舍号
    apartment: String, //楼栋
    bednum: Number,
    usedBed: Number,
    status: {type:Number,default:1}
})

module.exports = mongoose.model('Dorm',dormSchema)