const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

router.get('/',async(ctx)=>{
    ctx.body = `<h2>获取学生专业相关信息</h2>`
})

router.get('/major',async (ctx)=>{
    let majorno = ctx.request.query.majorno
    console.log('专业编号',majorno)

    const College = mongoose.model('College')
    await College.findOne({majorno:majorno}).then((result)=>{
        ctx.body={
            code:200,
            data:result
        }
    })
    .catch(error=>{
        console.log(error)
        ctx.body={
            code:500,
            message:error
        }
    })
})

router.get('/majorAll',async (ctx)=>{
    const College = mongoose.model('College')
    await College.find({}).then((result)=>{
        ctx.body={
            code:200,
            data:result
        }
    })
    .catch(error=>{
        console.log(error)
        ctx.body={
            code:500,
            message:error
        }
    })
})

module.exports = router