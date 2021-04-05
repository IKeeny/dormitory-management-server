const mongoose = require('mongoose')
const db = 'mongodb://localhost/dormitory'
const glob = require('glob')
const { resolve } = require('path')

exports.initSchemas = ()=>{
    glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}

exports.connect = ()=>{
    //连接数据库
    mongoose.set('useCreateIndex', true)
    mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
    let maxConnectTimes = 0;

    return new Promise((resolve,reject)=>{

        //增加数据库监听事件
        mongoose.connection.on('disconnected',(err)=>{
            console.log('*********数据库断开');
            if(maxConnectTimes<3){
                maxConnectTimes++;
                //重新连接
                mongoose.connect(db);
            }else{
                reject(err);
                throw new Error('数据库出现问题....')
            }
            
        });
        mongoose.connection.on('error',(err)=>{
            console.log('*********数据库错误');
            if(maxConnectTimes<3){
                maxConnectTimes++;
                //重新连接
                mongoose.connect(db);
            }else{
                reject(err);
                throw new Error('数据库出现问题....')
            }
        })
        mongoose.connection.once('open',()=>{
            console.log('MongoDB connected successfully');
            resolve();
        })
    })
}