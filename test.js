// const mongoose = require('mongoose')
// const { Schema } = mongoose
// let ObjectId = Schema.Types.ObjectId
// const bcrypt = require('bcryptjs')
// // console.log(bcrypt)
// const SALT_WORK_FACTOR = 10

// const userSchema = new Schema({
//     UserId: ObjectId, 
//     studentno: {unique:true,type:Number}, //学号
//     username: String,
//     password: String,
//     gender: String,
//     phone: Number,
//     apartment: Number, //楼栋号
//     dormno: Number, //宿舍号
//     type: String,  //是否是管理员
//     grade: Number,  //年级
//     majorno: Number,  //专业
//     status: {type:Number,default:1},
//     createAt: {type:Date,default:Date.now()},
//     lastLoginAt: {type:Date,default:Date.now()}
// })

// //加盐
// userSchema.pre('save',function(next){
//     bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
//         if(err) return next(err)
//         bcrypt.hash(this.password,salt,(err,hash)=>{
//             if(err) return next(err)
//             this.password = hash
//             next()
//         })
//     })
// })

// //实例方法
// userSchema.methods = {
//     comparePassword:(_password,password)=>{
//         return new Promise((resolve,reject)=>{
//             bcrypt.compare(_password,password,(err,isMatch)=>{
//                 if(!err) resolve(isMatch)
//                 else reject(err)
//             })
//             // // if(_password === password){
//             // //     resolve()
//             // // }else{
//             // //     reject()
//             // // }
//             // resolve()
//         })
//     }
// }

// //发布模型 model代表数据库中的集合 建立映射关系
// module.exports = mongoose.model('User',userSchema)