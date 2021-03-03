const Koa = require('koa')
const app = new Koa()
const { connect, initSchemas } = require('./database/init')
const mongoose = require('mongoose')

//立即执行函数注意分号，和上边的分开
;(async ()=>{
    await connect()
    initSchemas()
    const User = mongoose.model('User')
    let oneUser = new User({studentno:'100004',password:'123456'})
    oneUser.save().then(()=>{
        console.log('插入成功')
    })
})()

app.use(async (ctx)=>{
    ctx.body = '<h1>Hello Keeny</h1>'
})

app.listen(3000,()=>{
    console.log('server is listening at port 3000')
})
