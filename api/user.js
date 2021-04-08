const Router = require('koa-router')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

let router = new Router()
router.get('/',async(ctx)=>{
    ctx.body='这是用户操作首页'
})

router.post('/login',async(ctx)=>{
    let loginUser = ctx.request.body
    console.log('登陆者的信息',loginUser)
    let studentno = loginUser.studentno
    let password = loginUser.password

    //数据库查找用户名是否存在
    //引入User中的model
    const User = mongoose.model('User')
    await User.findOne({studentno:studentno,status:1}).exec().then(async(result)=>{
        console.log('查找的结果',result)
        if(result){
            let newUser = new User()
            await newUser.comparePassword(password,result.password)
            .then(isMatch=>{
                if(isMatch){
                    let token = jwt.sign(studentno,'keeny')
                    console.log('登录成功设置的token',token)
                    ctx.body = {
                        code: 200,
                        message: isMatch,
                        token: token
                    }
                }else{
                    ctx.body = {
                        code: 200,
                        message: '密码错误'
                    }
                }
            })
            .catch(error=>{
                console.log(error)
                ctx.body = {
                    code: 500,
                    message: error
                }
            })
        }else{
            ctx.body = {
                code: 200,
                message: '用户不存在'
            }
        }
    }).catch(error=>{
        console.log(error)
        ctx.body = {
            code: 500,
            message: error
        }
    })
})

//获取学生列表
router.get('/studentList',async(ctx)=>{
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
    Object.assign(query,{status:1,type:'student'})
    
    const User = mongoose.model('User')
    let total = await User.find(query).count()
    await User.find(query).skip(num).limit(size).then((res)=>{
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

//获取单个学生信息
router.get('/studentInfo', async(ctx)=>{
    let studentno = ctx.request.query
    console.log('studentno',studentno)

    const User = mongoose.model('User')
    await User.findOne(studentno).then(res=>{
        ctx.body={
            code:200,
            data:res
        }
    }).catch(error=>{
        ctx.body={
            code:500,
            message:error
        }
    })
})

//添加学生
router.post('/addStudent',async(ctx)=>{
    let student = ctx.request.body
    console.log('添加的学生信息',student)

    const User = mongoose.model('User')
    
    let { studentno } = student
    await User.findOne({studentno:studentno}).then((res)=>{
        if(res){
            ctx.body={
                code: 500,
                message: '添加失败，该学号已存在'
            }
        }else{
            let newStudent = new User(student)
            newStudent.save().then(()=>{
                ctx.body={
                    code: 200,
                    message: '添加成功'
                }
            }).catch(error=>{
                ctx.body={
                    code: 500,
                    message: error
                }
            })
        }
    })
    
})

// 修改学生信息
router.post('/updateStudent',async(ctx)=>{
    let { studentno } = ctx.request.body
    const User = mongoose.model('User')
    await User.updateOne({studentno:studentno},ctx.request.body).then(()=>{
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

//删除学生
router.post('/deleteStudent',async(ctx)=>{
    let { studentno } = ctx.request.body
    const User = mongoose.model('User')
    await User.updateOne({studentno:studentno},{status:-1}).then(()=>{
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