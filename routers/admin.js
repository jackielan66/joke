/**
 * Created by Administrator on 2017/11/14.
 * 后台登录模块
 */
var express = require('express');
var router = express.Router();
var User = require("../models/User.js");
var Category = require("../models/Category.js");
var Content = require("../models/Content.js");

router.use((req,res,next)=>{
    if(!req.username){
        // res.send("你还没登录！");
        res.render('admin/login.html')
        return;
    };
    next();
})
// router.use(function (req,res,next) {
//     if(!req.userInfo.isAdmin){
//         res.send('对不起！只有管理员才能登录此页，');
//         return;
//     };
//     next()
// })
// 管理端首页
router.get('/',function (req,res,next) {
    res.render('admin/index.html',{

    })
});

// 后台分类
router.get("/category",(req,res,next)=>{
    // console.log(req.query,'req');
    let _query = req.query;
    // console.log(_query,'_query')
    let page = req.query.page || 0;
    page = page<0?0:page;
    let size = req.query.size || 10;
    size = size<0?10:size;
    let skipVal = page*size;
    Category.count((err,count)=>{
        // console.log(count,'count');
        Category.find({}).skip(skipVal).then(categorys=>{
            res.render("admin/category.html",{
                categorys:categorys,
                totalSize:count,
                page,
                size
            })
        })
    })
});

// 后台添加分类
router.get("/category/add",(req,res,next)=>{
    res.render("admin/category_add.html",{

    })
});


// 文章列表
router.get("/content",(req,res,next)=>{
    let skipVal = 0; // 跳过多少条
    let limitVal = 5; // 每页显示几条
    Content.count().then(count=>{
        Content.find({}).sort({"_id":-1}).skip(skipVal).limit(limitVal).populate(['category']).then(contents=>{
            res.render("admin/content_index.html",{
                contents:contents,
                count:count
            })
        })
    });
});


// 后台添加文章
router.get("/content/add",(req,res,next)=>{
    Category.find().then(categorys=>{
        res.render("admin/content_add.html",{
            categorys:categorys
        });
    })
});

// 后台修改文章内容页
router.get("/content/edit",(req,res,next)=>{
    let id =req.query.id;
    if(!id){
        return;
    }
    Category.find({}).then((categorys)=>{
        Content.findOne({_id:id}).then(content=>{
            // console.log(content,'content')
            res.render("admin/content_edit.html",{
                categorys:categorys,
                content:content
            });
        })
    })
});

// 后台post文章内容页
router.post("/content/edit",(req,res,next)=>{
    let id =req.query.id;
    if(!id){
        return;
    }
    // console.log(req.body,'res.bdy')
    let newContent = Object.assign({},req.body)
    Content.update({_id:id,},newContent).then((content)=>{
        if(content){
            res.send('修改成功！')
            // res.render("admin/content_edit.html",{
            //         categorys:categorys,
            //         content:content
            // });
        }
        // Content.findOne({_id:id}).then(content=>{
        //     // console.log(content,'content')
        //     res.render("admin/content_edit.html",{
        //         categorys:categorys,
        //         content:content
        //     });
        // })
    })
});
















// // 用户管理
// router.get('/user',function (req,res,next) {
//     /**
//      * limit(number) 限制获取数据条数
//      *
//      * skip(); 忽略几条
//      * 1 ： 1-2   skip：0
//      * 2 ： 3-4   skip:  2
//      *
//      * sort({_id : -1 || 1})   1 =》升序   -1 =》降序
//      *
//      */
//     var page = req.query.page || 1;
//     var limitVal = 3;
//     var totalPage = 0;
//     User.count().then(function (count) {
//         totalPage=Math.ceil(count/limitVal);
//         page=Math.min(page,totalPage);
//         page=Math.max(page,1);
//         var skipVal = (page-1)*limitVal;
//         User.find().sort({_id:-1}).limit(limitVal).skip(skipVal).then(function (user) {
//             res.render('admin/user.html',{
//                 userInfo:req.userInfo,
//                 users:user,
//                 page:page,
//                 totalPage:count
//             });
//         })
//     });
// })
//
// router.get('/category',function (req,res,next) {
//     var page = req.query.page || 1;
//     var limitVal = 3;
//     var totalPage = 0;
//     Category.count().then(function (count) {
//         totalPage = Math.ceil(count/limitVal);
//         page=Math.min(page,totalPage);
//         page=Math.max(page,1);
//         var skipVal = (page-1)*limitVal;
//         Category.find().sort({_id:-1}).limit(limitVal).skip(skipVal).then(function (categorys) {
//             res.render('admin/category.html',{
//                 userInfo:req.userInfo,
//                 categorys:categorys,
//                 page:page,
//                 totalPage:count
//             })
//         })
//     })
//
// });
//
// router.get('/category/add',function (req,res,next) {
//     res.render('admin/category_add.html',{
//
//     })
// });
//
// router.post('/category/add',function (req,res,next) {
//     var name = req.body.name || "";
//     // console.log(name,"namename admin")
//     if(!name.trim()){
//         res.render('admin/error.html',{
//             userInfo:req.userInfo,
//             message:"名称不能为空！"
//         })
//         return;
//     };
//
//     // console.log(Category,"CategoryCategory");
//
//     Category.findOne({
//         name:name
//     }).then(function (rs) {
//         if(rs){
//             //表示数据库中有值
//             console.log("1111")
//             res.render('admin/error.html',{
//                 userInfo:req.userInfo,
//                 message:"数据库已经有一样的值了"
//             });
//             return Promise.reject();
//         } else {
//             console.log("22222")
//             // 数据库中没有
//             var newCategory = new Category({
//                 name:name
//             }).save();
//             console.log(newCategory,"newCategorynewCategory")
//             return newCategory;
//         }
//     }).then(function (newCategory) {
//         res.render('admin/error.html',{
//             userInfo:req.userInfo,
//             message:"保存成功！"
//         });
//     })
// })
//
// router.get("/category/edit",function (req,res,next) {
//     var id = req.query.id || "";
//     Category.findOne({
//         _id:id
//     }).then(function (category) {
//         if(!category){
//             res.render("admin/error.html",{
//                 userInfo:req.userInfo,
//                 message:"分类信息不存在！"
//             })
//             return Promise.reject();
//         }else{
//             res.render('admin/category_edit.html',{
//                 userInfo:req.userInfo,
//                 category:category
//             })
//         }
//     })
// });
//
// router.post("/category/edit",function (req,res,next) {
//     var id = req.query.id || "";
//     var name = req.body.name || "";
//     Category.findOne({
//         _id:id
//     }).then(function (category) {
//         if(!category){
//             res.render("admin/error.html",{
//                 userInfo:req.userInfo,
//                 message:"分类信息不存在！"
//             });
//             return Promise.reject();
//         }else{
//
//             if(name==category.name){
//                 // 当用户没做任何修改的时候
//                 res.render("admin/error.html",{
//                     userInfo:req.userInfo,
//                     message:"名称修改成功！"
//                 });
//                 return Promise.reject();
//             }else{
//                 // 查询本条记录数据库中是否存在
//                 // id 不是本条id，但是名称却是我要修改的名称
//                 return Category.findOne({
//                     _id:{$ne:id},
//                     name:name
//                 });
//             }
//         }
//     }).then( function(sameCategory){
//         if(sameCategory){
//             res.render("admin/error.html",{
//                 userInfo:req.userInfo,
//                 message:"数据库中有此名称，请更换其他名称！"
//             });
//             return Promise.reject();
//         }else{
//             // 否则就更新本条数据
//             // update(条件,需要更改的值)
//             return Category.update({
//                 _id:id
//             },{
//                 name:name
//             })
//         }
//     }).then(function () {
//         res.render("admin/error.html",{
//             userInfo:req.userInfo,
//             message:"名称修改成功！"
//         });
//     })
// });
//
// // 删除分类
// router.get("/category/delete",function (req,res,next) {
//     var id = req.query.id || "";
//     // remove 删除方法
//     Category.remove({
//         _id:id
//     }).then(()=>{
//         res.render("admin/error.html",{
//             userInfo:req.userInfo,
//             message:"删除成功！"
//         });
//     });
// });
//
// router.get("/content",function (req,res,next) {
//     var page = req.query.page || 1;
//     var limitVal = 3;
//     var totalPage = 0;
//     Content.count().then(function (count) {
//         totalPage = Math.ceil(count/limitVal);
//         page=Math.min(page,totalPage);
//         page=Math.max(page,1);
//         var skipVal = (page-1)*limitVal;
//         Content.find().sort({_id:-1}).limit(limitVal).skip(skipVal).populate(['category','user']).then(function (contents) {
//             console.log(contents,"contents")
//             res.render('admin/content_index.html',{
//                 userInfo:req.userInfo,
//                 contents:contents,
//                 page:page,
//                 totalPage:count
//             })
//         })
//     })
// })
//
// router.get("/content/add",function (req,res,next) {
//     Category.find().then( categorys=>{
//         res.render("admin/content_add.html",{
//             userInfo:req.userInfo,
//             categorys:categorys
//         })
//     })
//
// });
//
// router.post("/content/add",function (req,res,next) {
//     // console.log(req.userInfo.id,"req.userInfo.id");
//     if(req.body.category == ""){
//         res.render("admin/error.html",{
//             userInfo:req.userInfo,
//             message:"内容分类不能为空！！"
//         });
//         return;
//     };
//     new Content({
//         category:req.body.category,
//         user:req.userInfo._id,
//         title:req.body.title,
//         description:req.body.description,
//         content:req.body.content
//     }).save().then(rs=>{
//         res.render("admin/error.html",{
//             userInfo:req.userInfo,
//             message:"内容添加成功！"
//         });
//     });
//     //保存到数据库
// });
//
// // 修改博客内容
// router.get("/content/edit",function (req,res,next) {
//     let id = req.query.id || "";
//     Category.find().sort({_id:-1}).then(function (categorys) {
//         Content.findOne({_id:id}).then( content=>{
//             if(content){
//                 res.render("admin/content_edit.html",{
//                     userInfo:req.userInfo,
//                     content:content,
//                     categorys:categorys,
//                 })
//             }else{
//                 res.render("admin/error.html",{
//                     userInfo:req.userInfo,
//                     message:"该内容不存在！"
//                 });
//             }
//         })
//     })
// });
//
// // 保存修改的博客内容
// router.post("/content/edit",function (req,res,next) {
//     let id = req.query.id || "";
//     let _body = req.body;
//     console.log(_body,"_body_body")
//     Content.findOne({_id:id}).then( content=>{
//         if(content){
//             Content.update({
//                 _id:id
//             },_body).then(()=>{
//                 res.render("admin/error.html",{
//                     userInfo:req.userInfo,
//                     message:"博客内容保存成功！！"
//                 });
//             })
//         }
//     })
// })
//
// //博客内容删除
// router.get("/content/delete",function (req,res,next) {
//     let id = req.query.id || "";
//     Content.remove({
//         _id:id
//     }).then(function () {
//         res.render("admin/error.html",{
//             userInfo:req.userInfo,
//             message:"博客内容删除成功！！"
//         });
//     })
// })




module.exports = router;
