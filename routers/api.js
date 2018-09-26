// api json 模块  admiin
var express = require('express');
var router = express.Router();
var Content = require("../models/Content.js");
var Category = require("../models/Category.js");
var User = require("../models/User.js");
const SysConfig = require('../models/SysConfig.js')

// 用户登录api
router.post("/login",(req,res,next)=>{
    let username = req.body.username? req.body.username.trim() : "";
    let password = req.body.password? req.body.password.trim() : "";
    if(!username || !password){
        res.json({
            code:500,
            message:"账号或密码不能为空！"
        })
    };
    User.findOne({
        username:username,
        password:password
    },function (err,data) {
        // console.log(data,"data")
        if(!err){
            if(data){
                // console.log(req.cookies,"req.cookies")
                let _cookiesValue = {username:data.username}
                req.cookies.set('Bearer',JSON.stringify(_cookiesValue))
                res.json({
                    code:200,
                    message:"账号登录成功！"
                });
            }else {
                res.json({
                    code:500,
                    message:"账号或密码错误，请从新登陆！"
                })
            }
        }

        // if(!err){
        //     req.cookies.set('username',data.username);
        //     res.json({
        //         code:200,
        //         message:"账号登录成功！",
        //         data:data
        //     });
        // }
    })
});

// 用户退出api
router.post("/logout",(req,res,next)=>{
    req.cookies.set('Bearer',null);
    res.json({
        code:200,
        message:"退出成功！"
    });
});



// 添加分类
router.post("/category/add",(req,res,next)=>{
    let name = req.body.name? req.body.name.trim() : "";
    if(!name){
        res.json({
            code:500,
            message:"分类添加失败！"
        })
    };
    Category.findOne({name:name}).then(category=>{
        if(category){
            res.json({
                code:500,
                message:"分类已经存在，请更改名称！"
            });
            return;
        }else{
            return (new Category({name:name})).save();
        }
    }).then(newCategory=>{
        res.json({
            code:200,
            data:newCategory,
            message:"分类添加成功！"
        })
    });
});

// 删除分类
router.post("/category/delete",(req,res,next)=>{
    // let id = {req.body.id}
    // console.log(req.body,'req.body')
    if(!req.body.id){
        res.json({
            code:500,
            message:"分类删除失败！请重试"
        })
        return;
    }
    Category.remove({
        _id:req.body.id
    },(err,data)=>{
        // console.log(data,'data')
        if(!err){
            if(data){
                res.json({
                    code:200,
                    message:"分类删除成功"
                })
            }else{
                res.json({
                    code:500,
                    message:"分类删除失败！请重试"
                })
            }
        }
    })
    // if(!name){
    //     res.json({
    //         code:500,
    //         message:"分类添加失败！"
    //     })
    // };
    // Category.findOne({name:name}).then(category=>{
    //     if(category){
    //         res.json({
    //             code:500,
    //             message:"分类已经存在，请更改名称！"
    //         });
    //         return;
    //     }else{
    //         return (new Category({name:name})).save();
    //     }
    // }).then(newCategory=>{
    //     res.json({
    //         code:200,
    //         data:newCategory,
    //         message:"分类添加成功！"
    //     })
    // });
});


// 删除分类
router.post("/category/edit",(req,res,next)=>{
    if(!req.body.id || !req.body.name){
        res.json({
            code:500,
            message:"分类名称失败！请重试"
        })
        return;
    };

    Category.update({
        _id:req.body.id
    },{name:req.body.name},(err,data)=>{
        // console.log(data,'data')
        if(!err){
            if(data){
                res.json({
                    code:200,
                    message:"分类名称更新成功"
                })
            }else{
                res.json({
                    code:500,
                    message:"分类名称失败！请重试"
                })
            }
        }
    })
});


// 发布文章
router.post("/content/add",(req,res,next)=>{
    let title = req.body.title? req.body.title.trim() : "";
    let content = req.body.content ? req.body.content.trim() : "";
    let category = req.body.category ? req.body.category.trim() : "";

    if(!title || !content || !category){
        res.json({
            code:500,
            message:"内容发布失败！请填写完整信息！"
        })
    }

    (new Content({
        title:title,
        category:category,
        content:content,
        createAt:Date.now()
    })).save().then(content=>{
        if(content){
            res.json({
                code:200,
                message:"内容发布成功！"
            })
        }else{
            res.json({
                code:500,
                message:"内容发布失败！"
            })
        }
    });

})


// 删除文章
router.post("/content/delete",(req,res,next)=>{
    let contentId = req.body.id;
    if(!contentId){
        res.json({
            code:200,
            message:"内容删除失败！"
        })
    }
    Content.remove({
        _id:contentId
    },(err,data)=>{
        if(!err){
            if(data){
                res.json({
                    code:200,
                    message:"分类删除成功"
                })
            }else{
                res.json({
                    code:500,
                    message:"分类删除失败！请重试"
                })
            }
        }
    })
})


/**
 * 保存系统配置信息
 */
router.post('/config',(req,res,next)=>{
    let body = req.body;
    console.log(body,"body  ====  >>")
    SysConfig.find({}).then(config=>{
        console.log(config,"config")
    })
    res.json({
        code:500,
        message:"配置保存失败"
    })
})





module.exports = router;