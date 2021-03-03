const mongoose = require('mongoose')
const { Schema } = mongoose

const dormSchema = new Schema({
    dormno: Number, //宿舍号
    apartment: String, //楼栋
    bednum: Number,
    emptyBed: Number
})

mongoose.model('Dorm',dormSchema)