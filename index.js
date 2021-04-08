const Koa = require('koa')
const app = new Koa()
const { connect, initSchemas } = require('./database/init')
const mongoose = require('mongoose')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')

app.use(bodyParser())
app.use(cors())

let user = require('./api/user')
let college = require('./api/college')

//装载子路由
let router = new Router()
router.use('/user',user.routes())
router.use('/college',college.routes())

// 中间件对token进行验证
app.use(async (ctx, next) => {
    // let token = ctx.header.authorization;
    // let payload = await util.promisify(jwt.verify)(token.split(' ')[1], SECRET);
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: err.message
            }
        } else {
            throw err;
        }
    })
});

app.use(koajwt({ secret: 'keeny' }).unless({
    // 登录接口不需要验证
    path: [/^\/user\/login/]
}));

//设置token验证 
//app.use只接收函数
// app.use(async (ctx,next)=>{
//     // console.log('ctx.request--',ctx.request)
//     if(ctx.request.url == '/user/login') {
//         await next()
//         return
//     }
//     if(!ctx.request.header.authorization){
//         ctx.body={
//             code: 401,
//             message: 'token无效,请先登录'
//         }
//         await next()
//         return
//     }
// //     // const token = ctx.request.header.authorization.split(' ').pop()
// //     // console.log('传过来的token',token)
// //     // const studentno = jwt.verify(token,'keeny')
// //     // console.log('解析出来的studentno',studentno)
// //     // if(token == 'undefined' || studentno == null){
// //     //     ctx.body={
// //     //         code: 400,
// //     //         message: 'token无效'
// //     //     }
// //     // }
// })

app.use(router.routes())
app.use(router.allowedMethods())



//立即执行函数注意分号，和上边的分开
;(async ()=>{
    await connect()
    initSchemas()
   
    // let User = mongoose.model('User')
    // let u1 = new User({
    //     studentno: 100000, //学号
    //     username: '管理员',
    //     password: '123456',
    //     gender: '男',
    //     phone: '18758367960',
    //     // apartment: '明理苑7舍',
    //     // dormno: '310', //宿舍号
    //     type: 'manager',  //是否是管理员
    //     // grade: '',  //年级
    //     // majorno: '24101',  //专业
    // })
    // u1.save().then(()=>{
    //     console.log('用户插入成功')
    // })
    // await User.updateOne({studentno:201717},{username:'菜八斗',grade:2018}).then((err,docs)=>{
    //     console.log(docs)
    //     console.log('试试更新成功')
    // })

    // let College = mongoose.model('College')
    // let c1 = new College({
    //     majorno: '24104',  //专业编号
    //     major: '工程管理',  //专业
    //     department: '经济管理学院',  //学院
    // })
    // c1.save().then(()=>{
    //     console.log('专业插入成功')
    // })

    // let Dorm = mongoose.model('Dorm')
    // let c1 = new Dorm({
    //     majorno: '24104',  //专业编号
    //     major: '工程管理',  //专业
    //     department: '经济管理学院',  //学院
    // })
    // c1.save().then(()=>{
    //     console.log('专业插入成功')
    // })
})()

app.use(async (ctx)=>{
    ctx.body = '<h1>Hello Keeny</h1>'
})

app.listen(3000,()=>{
    console.log('server is listening on port 3000')
})
