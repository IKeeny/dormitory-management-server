const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

//获取晚归记录列表
router.get('/lateList',async(ctx)=>{
    let query = ctx.request.query
    let { page,size } = query
    let num = (page-1)*size
    //把size的类型变成number,传过来的是string
    size = size*1
    //删除查询对象中的空值
    let keys = Object.keys(query)
    keys.map((key)=>{    
        if(!query[key] || key === 'page' || key === 'size' ||key === 'username'){
            delete query[key]
        }
    })
    Object.assign(query,{status:1})

    let total = 0
    
    const Late = mongoose.model('Late')
    total = await Late.find(query).count()
    await Late.find(query).skip(num).limit(size).then((res)=>{
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

//获取晚归信息
router.get('/lateInfo',async(ctx)=>{
    let late = ctx.request.query
    late = Object.assign(late,{status:1})
    console.log('获取记录late',late)

    const Late = mongoose.model('Late')
    await Late.findOne(late).then(res=>{
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

// 添加晚归记录
router.post('/addLate',async(ctx)=>{
    let late = ctx.request.body
    console.log('添加的记录信息',late)

    const Late = mongoose.model('Late')
    let newLate = await new Late(late)
    await newLate.save().then(()=>{
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

//更新晚归信息
router.post('/updateLate',async(ctx)=>{
    let { _id } = ctx.request.body
    const Late = mongoose.model('Late')
    await Late.updateOne({_id:_id},ctx.request.body).then(()=>{
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

//删除晚归记录
router.post('/deleteLate',async(ctx)=>{
    let late = ctx.request.body
    const Late = mongoose.model('Late')
    await Late.updateOne(late,{status:-1}).then(()=>{
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