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
let record = require('./api/record')
let late = require('./api/late')
let dorm = require('./api/dorm')

//装载子路由
let router = new Router()
router.use('/user',user.routes())
router.use('/college',college.routes())
router.use('/record',record.routes())
router.use('/late',late.routes())
router.use('/dorm',dorm.routes())

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
   
    let User = mongoose.model('User')
    let u1 = new User({
        "studentno" : 201740,
        "username" : "小太阳",
        // "gender" : "男",
        // "phone" : 15958367960,
        // "dormId":'607800140b2b7c2a64fb7100',
        // "grade" : 2017,
        // "majorno" : 24102,
        password: '123456bai'
    })
    u1.save().then(()=>{
        console.log('用户插入成功')
    })
    // let u2 = await User.updateOne({studentno:201717},{username:'小斗',grade:2018})
    // u2.save().then((err,docs)=>{
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

    // let Record = mongoose.model('LeaveAndReturnSchool')
    // let r1 = new Record({
    //     // record_id: 2,
    //     // student: 12,  //学号,
    // })
    // r1.save().then(()=>{
    //     console.log('离返校登记插入成功')
    // })

    // let RR = mongoose.model('Record')
    // let r = new RR({studentno:201710})
    // r.save().then(()=>{
    //     console.log('测试成功')
    //     console.log(r._id)
    // })

    // let Late = mongoose.model('Late')
    // let r = new Late({
    //     studentno:201710,
    //     reason: '回家刚回来'
    // })
    // r.save().then(()=>{
    //     console.log('晚归添加成功')
    // })

    // let Dorm = mongoose.model('Dorm')
    // let d = new Dorm({
    //     dormId: '20',
    //     apartment: '宁静苑2舍',
    //     dormno: 503,
    //     bednum: 6,
    //     usedBed: 6
    // })
    // d.save().then(()=>{
    //     console.log('宿舍楼添加成功')
    // })
})()

app.use(async (ctx)=>{
    ctx.body = '<h1>Hello Keeny</h1>'
})

app.listen(3000,()=>{
    console.log('server is listening on port 3000')
})
