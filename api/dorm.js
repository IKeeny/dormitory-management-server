const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

//查询所有宿舍楼以及宿舍
router.get('/dormList',async(ctx)=>{
    let query = ctx.request.query
    let { page,size } = query
    let num = (page-1)*size
    //把size的类型变成number,传过来的是string
    size = size*1
    //删除查询对象中的空值
    let keys = Object.keys(query)
    keys.map((key)=>{    
        if(!query[key] || key === 'page' || key === 'size'){
            delete query[key]
        }
    })
    Object.assign(query,{status:1})

    let total = 0
    
    const Dorm = mongoose.model('Dorm')
    total = await Dorm.find(query).count()
    await Dorm.find(query).skip(num).limit(size).then((res)=>{
        res = {
            total: total,
            list: res
        }
        console.log('查询到的结果列表',res)
        ctx.body={
            code:200,
            data:res
        }
    })
    .catch(error=>{
        ctx.body={
            code:500,
            message:error
        }
    })
})

//获取宿舍楼信息
router.get('/dormInfo',async(ctx)=>{
    let dorm = ctx.request.query
    dorm = Object.assign(dorm,{status:1})
    console.log('获取记录dorm',dorm)

    const Dorm = mongoose.model('Dorm')
    await Dorm.findOne(dorm).then(res=>{
        ctx.body = {
            code: 200,
            data: res
        }
    }).catch(err=>{
        ctx.body = {
            code: 500,
            message: err
        }
    })
})

//添加宿舍
router.post('/addDorm',async(ctx)=>{
    let dorm = ctx.request.body
    console.log('添加的宿舍信息',dorm)

    const Dorm = mongoose.model('Dorm')
    let newDorm = await new Dorm(dorm)
    await newDorm.save().then(()=>{
        ctx.body={
            code: 200,
            message: '添加成功'
        }
        console.log('添加成功')
    }).catch(error=>{
        ctx.body={
            code: 500,
            message: error
        }
    })
})

//更新宿舍信息
router.post('/updateDorm',async(ctx)=>{
    let { _id } = ctx.request.body
    const Dorm = mongoose.model('Dorm')
    await Dorm.updateOne({_id:_id},ctx.request.body).then(()=>{
        ctx.body={
            code: 200,
            message: '修改成功'
        }
    }).catch(error=>{
        ctx.body={
            code: 500,
            message: error
        }
    })
})

//删除宿舍记录
router.post('/deleteDorm',async(ctx)=>{
    let dorm = ctx.request.body
    const Dorm = mongoose.model('Dorm')
    await Dorm.updateOne(dorm,{status:-1}).then(()=>{
        ctx.body={
            code: 200,
            message: '删除成功'
        }
    }).catch(error=>{
        ctx.body={
            code: 500,
            message: error
        }
    })
})

module.exports = router