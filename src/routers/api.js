/**
 * Created by Administrator on 2017/3/8.
 */
/**
 * Created by Administrator on 2017/3/8.
 * 数据接口模块
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Content = require('../models/Content.js');

// 统一返回格式
let responseData = {
    code:200,
    message:"成功"
};

router.use(function (req, res, next) {
    // responseData = {
    //     code: 0,
    //     message: ""
    // }
    next();
})
/*
    ** 用户注册
    *       注册逻辑
    *           1 用户名不能为空
    *           2 密码不能为空
    *           3 两次输入密码必须一致
    *           4 用户名是否已经注册
 */
router.post('/auth/signup', function (req, res, next) {
    // 通过设置  加载body-parser，用来处理前端传过来的数据 有个body的属性
    // console.log( req.body )
    var username = req.body.user;
    var password = req.body.password;
    var rpassword = req.body.cpassword;
    // 用户是否为空
    if (username == "") {
        responseData.code = 500;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    }
    // 密码为空
    if (password == "") {
        responseData.code = 500;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }
    // 两次输入的密码不一样
    if (password != rpassword) {
        responseData.code = 500;
        responseData.message = " 两次输入的密码不一样";
        res.json(responseData);
        return;
    }
    // 数据库中是否存在
    User.findOne({
        username: username
    }).then(function (userInfo) {

        if (userInfo) {
            responseData.code = 500;
            responseData.message = "数据库中有值";
            res.json(responseData);
            return;
        } else {
            // 如果没有就插入数据到数据库中
            var user = new User({
                username: username,
                password: password
            });
            return user.save();
        }
    }).then(function (newUserInfo) {
        //console.log(newUserInfo)
        responseData.code = 200;
        responseData.message = "注册成功";
        res.json(responseData);
    })
});


/*
    ** 用户登录
    *      注册逻辑
    *           1 用户名不能为空
    *           2 密码不能为空
    *           3 两次输入密码必须一致
    *           4 用户名是否已经注册
 */
router.post('/auth/login', function (req, res, next) {
    // 通过设置  加载body-parser，用来处理前端传过来的数据 有个body的属性
    // console.log( req.body )
    var username = req.body.user;
    var password = req.body.password;
    // 用户是否为空
    if (username == "" || password == "") {
        responseData.code = 500;
        responseData.message = "用户名不能为空，或密码不能为空";
        res.json(responseData);
        return;
    }

    // 查询相同用户名跟密码是否存在
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = 500;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        } else {
            req.cookies.set("userInfo", JSON.stringify({
                _id:userInfo._id,
                username: userInfo.username
            }))
            responseData.code = 200;
            responseData.message = "登录成功";
            res.json(responseData);
            return;
        }
    })
});

router.get('/user/logout',function (req,res,next) {
    req.cookies.set("userInfo",null);
    res.json({
        code:200,
        message:"退出成功"
    })
});

// 添加评论
router.post("/comment/post",function (req,res,next) {
    // 前端回来的文章id
    var contentId = req.body.contentId || "";
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content,
    };

    // 查询当前内容的信息
    Content.findOne({_id:contentId}).then(function (content) {
        if(content){
            content.comments.push(postData);
            return content.save();
        }
    }).then(function (newContent) {
        res.json({
            code:200,
            message:"添加成功",
            newContent:newContent
        })
    })
});






module.exports = router;
