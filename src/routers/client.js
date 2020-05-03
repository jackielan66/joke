/**
 ** 
 **  用户端路由配置
 */
var express = require('express');
var router = express.Router();
var Content = require("../models/Content");
var _ = require('lodash')

// 渲染首页
router.get('/', (req, res, next) => {
    Content.find().limit(22).then(contents => {
        res.render('client/index.html', {
            contents,
            categories: res.categories,
            // biaoqingtags: res.biaoqingtags
        });
    })
});


// 前台显示某一分类内容列表
router.get("/category/:cid/:page", (req, res, next) => {
    const { cid } = req.params;
    let currentCategory = {};
    _.find(res.categories, (category) => {
        if (category.cid == cid) {
            currentCategory = category;
        }
    })

    let page = req.params.page || 0;
    if (page < 0) {
        page = 0;
    }
    let size = req.query.size || 10;
    Content.find({ category: currentCategory._id }).sort({ _id: -1 }).skip(page * size).limit(size).populate(['category']).then(
        lists => {
            // console.log(lists,'lists')
            res.render("client/list.html", {
                title: `${currentCategory.name}`,
                lists,
                page,
                size,
                // hotContents,
                // _categoryId,
                categories: res.categories,
            })
        }).catch(notFound => {
            res.status(404).render('404.html', {
                title: 'No Found'
            })
        })

});

// 前台显示某一篇具体文章
router.get("/content/*", (req, res, next) => {
    let _contentId = req.params['0'];
    let _prevId = "";
    let _nextId = "";
    Content.findOne({ cid: _contentId }).populate(['category']).then(content => {
        if (content) {
            // Content.update({ _id: _contentId }, { '$inc': { views: 1 } }).then(newcontent => {
            //     Content.find({}).sort({ views: -1 }).limit(limitVal).then(hotContents => {

            //     })
            // });
            res.render("client/article.html", {
                // hotContents,
                content: content,
                title: content.title,
                categories: res.categories,
            });
        }
    }).catch(error => {
        res.status(404).render('404.html', {
            title: 'No Found'
        })
    })
});







module.exports = router;
