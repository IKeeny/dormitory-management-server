/****学院的的表再考虑一下，可以不要*****/
const mongoose = require('mongoose')
const { Schema } = mongoose

const collegeSchema = new Schema({
    majorno: {unique:true,type:Number},  //专业编号
    major: String,  //专业
    department: String,  //学院
    counselor: String,  //辅导员,
    status: {type:Number,default:1}
})

mongoose.model('College',collegeSchema)