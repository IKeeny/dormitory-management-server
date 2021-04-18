const mongoose = require('mongoose')
const { Schema } = mongoose
let ObjectId = Schema.Types.ObjectId
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

const userSchema = new Schema({
    UserId: ObjectId, 
    studentno: {unique:true,type:Number}, //学号
    username: String,
    password: {type:String,default:'123456bai'},
    gender: String,
    phone: Number,
    dormId: String, //宿舍楼栋的_id号
    // apartment: String, //楼栋
    // dormno: Number, //宿舍号
    type: {type:String,default:'student'},  //是否是管理员
    grade: Number,  //年级
    majorno: Number,  //专业,
    email: String,
    status: {type:Number,default:1},
    createAt: {type:Date,default:Date.now()},
    lastLoginAt: {type:Date,default:Date.now()}
})

//加盐
userSchema.pre('save',function(next){
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.password,salt,(err,hash)=>{
            if(err) return next(err)
            this.password = hash
            next()
        })
    })
})

//实例方法
userSchema.methods = {
    comparePassword:(_password,password)=>{
        return new Promise((resolve,reject)=>{
            bcrypt.compare(_password,password,(err,isMatch)=>{
                if(!err) resolve(isMatch)
                else reject(err)
            })
        })
    }
}

//发布模型 model代表数据库中的集合 建立映射关系
module.exports = mongoose.model('User',userSchema)