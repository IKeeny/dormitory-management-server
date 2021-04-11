const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

router.get('/',async(ctx)=>{
    ctx.body = '离返校登记接口'
})

// 获取记录列表
router.get('/recordList',async(ctx)=>{
    let query = ctx.request.query
    let { page,size } = query
    let num = (page-1)*size
    //把size的类型变成number,传过来的是string
    size = size*1
    //删除查询对象中的空值
    let keys = Object.keys(query)
    keys.map((key)=>{    
        // if(key === 'username' && query[key]){
        //     const User = mongoose.model('User')
        //     await User.find({key:query[key],status:1}).then(res=>{
        //         if(res.data.data){

        //         }
        //     })           
        // }
        if(!query[key] || key === 'page' || key === 'size' ||key === 'username'){
            delete query[key]
        }
    })
    Object.assign(query,{status:1})

    let total = 0
    
    // //如果查询条件中username有值
    // if(query.username){
    //     const User = mongoose.model('User')
    //     await User.find(query).then(res=>{
    //         if(res){
    //             let stuList = res.map(item=>{
    //                 const Record = mongoose.model('Record')
    //                 await Record.find(query)
    //                 return item.studentno
    //             })
    //             total = stuList.length 
    //         }
    //     })
    // }
    
    const Record = mongoose.model('Record')
    total = await Record.find(query).count()
    await Record.find(query).skip(num).limit(size).then((res)=>{
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

//获取记录信息
router.get('/recordInfo',async(ctx)=>{
    let recordId = ctx.request.query
    recordId = Object.assign(recordId,{status:1})
    console.log('获取记录recordId',recordId)

    const Record = mongoose.model('Record')
    await Record.findOne(recordId).then(res=>{
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

// 添加记录
router.post('/addRecord',async(ctx)=>{
    let record = ctx.request.body
    console.log('添加的记录信息',record)

    const Record = mongoose.model('Record')
    let newRecord = await new Record(record)
    await newRecord.save().then(()=>{
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

//更新记录信息
router.post('/updateRecord',async(ctx)=>{
    let { _id } = ctx.request.body
    const Record = mongoose.model('Record')
    await Record.updateOne({_id:_id},ctx.request.body).then(()=>{
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

//删除记录
router.post('/deleteRecord',async(ctx)=>{
    let recordId = ctx.request.body
    const Record = mongoose.model('Record')
    await Record.updateOne(recordId,{status:-1}).then(()=>{
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