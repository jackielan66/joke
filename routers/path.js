/**
 * Created by Administrator on 2017/11/14.
 * 后台登录模块
 */
var express = require('express');
var router = express.Router();
var Content = require("../models/Content.js");
var Category = require("../models/Category.js");
var User = require("../models/User.js");

var skipVal =  0; // 跳过几页
var limitVal = 10; // 每页显示几个

// 登录路径
router.get("/login",(req,res,next)=>{
    res.render("admin/login.html",{

    })
    // if(req.cookies.get("username")){
    //     res.render("admin/category.html",{
    //
    //     })
    // }else{
    //     res.render("admin/login.html",{
    //
    //     })
    // }
});





// 首页路径
router.get("/",(req,res,next)=>{
    Content.find().sort({_id:-1}).skip(skipVal).limit(limitVal).populate(['category']).then(contents=>{
        Content.find().sort({views:-1}).limit(limitVal).then(hotContents=>{
            res.render("font/index.html",{
                contents:contents,
                hotContents:hotContents,
                categorys:req.categorys
            })
        })

    })
});

// 前台显示某一篇具体文章
router.get("/content/*",(req,res,next)=>{
    let _contentId = req.params['0'];
    let _prevId = "";
    let _nextId = "";
    Content.findOne({_id:_contentId}).populate(['category']).then(content=>{
        Content.update({_id:_contentId},{views:content.views+1}).then(newcontent=>{
            // Content.find({_id:_contentId}).then(search=>{
            //     console.log('-------',search)
            // })
            Content.find({}).sort({views:-1}).limit(limitVal).then(hotContents=>{
                res.render("font/article.html",{
                    hotContents,
                    content:content,
                    title:content.title,
                    categorys:req.categorys
                });
            })
        });
    })
});


// 前台显示某一分类内容列表
router.get("/category/*",(req,res,next)=>{
    let _categoryId = req.params['0'];
    let page = req.query.page || 0;
    if(page<0){
        page=0;
    }
    let size = req.query.size||10;
    Content.find({category:_categoryId}).sort({_id:-1}).skip(page*size).limit(size).populate(['category']).then(lists=>{
        if(page*size>lists.length){
            page = parseInt(lists.length/page/size) + 1;
        }
        Content.find({}).sort({_id:-1}).limit(limitVal).then(hotContents=>{
            res.render("font/list.html",{
                title:"分页",
                lists,
                page,
                size,
                hotContents,
                _categoryId,
                categorys:req.categorys
            })
        })
    })

    // let _prevId = "";
    // let _nextId = "";
    // Content.findOne({_id:_contentId}).populate(['category']).then(content=>{
    //     Content.update({_id:_contentId},{views:content.views+1}).then(newcontent=>{
    //         // Content.find({_id:_contentId}).then(search=>{
    //         //     console.log('-------',search)
    //         // })
    //         Content.find({}).sort({views:-1}).limit(limitVal).then(hotContents=>{
    //             res.render("font/article.html",{
    //                 hotContents,
    //                 content:content,
    //                 title:content.title
    //             });
    //         })
    //     });
    // })
});

module.exports = router;
