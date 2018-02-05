// api 接口返回 app 使用
var express = require('express');
var router = express.Router();
var Content = require("../models/Content.js");
var Category = require("../models/Category.js");
var User = require("../models/User.js");

router.get('/list',(req,res,next)=> {
    let page = req.query.page || 0;
    let size = req.query.size || 10;
    Content.find({}).skip(page*size).limit(size).populate(['category']).then(contents=>{
        let _contents = [];
        contents.forEach(v=>{
            delete v.content;
            _contents.push(v);

        })
        res.json({
            code:200,
            contents:_contents,
        })
    })
});

// 获取某一篇文章的详情页
router.get('/content',(req,res,next)=> {
    let _id = req.query.id;
    if(!_id) return;
    let id = {_id:_id};
    Content.findOne(id).populate(['category']).then(content=>{
        Content.update(id,{views:content.views+1}).then(newContent=>{
            res.json({
                code:200,
                content:content
            })
        })
    })
})


module.exports = router;