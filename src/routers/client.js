/**
 ** 
 **  用户端路由配置
 */
var express = require('express');
var router = express.Router();
var Content = require("../models/Content");
var Tag = require("../models/Tag");
var _ = require('lodash')

const { SITE_DOCMENT_TITLE, SITE_KEYWORDS, SITE_DESCRIPTION, SITE_TTILE } = require("../config")

// 渲染首页
router.get('/', (req, res, next) => {
    Content.find().limit(22).sort({ _id: -1 }).populate(['category']).then(contents => {
        res.render('client/index.html', {
            contents,
            SITE_DOCMENT_TITLE,
            categories: res.categories,
            hotContents: res.hotContents,
            tags: res.tags,
            SITE_TTILE,
            SITE_KEYWORDS,
            SITE_DESCRIPTION
        });
    })
});


// 前台显示某一分类内容列表
router.get("/category-:cid-page-:page", (req, res, next) => {
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
    let condition = { category: currentCategory._id };
    Content.count(condition).then(total => {
        Content.find(condition).sort({ _id: -1 }).skip(page * size).limit(size).populate(['category']).then(
            lists => {
                // console.log(lists,'lists')
                res.render("client/list.html", {
                    title: `${currentCategory.name}`,
                    lists,
                    page,
                    size,
                    total,
                    // hotContents,
                    categories: res.categories,
                    hotContents: res.hotContents,
                    SITE_DOCMENT_TITLE
                })
            }).catch(notFound => {
                res.status(404).render('404.html', {
                    title: 'No Found'
                })
            })
    })
});

// 前台显示标签页
router.get("/tag-:cid-page-:page", (req, res, next) => {
    const { cid } = req.params;
    let tagCondition = { cid };
    Tag.findOne(tagCondition).then(tag => {
        if (tag) {
            let page = req.params.page || 0;
            if (page < 0) {
                page = 0;
            }
            let size = req.query.size || 10;
            let contentCondition = {
                tags: [tag._id]
            }
            Content.count(contentCondition).then(total => {
                Content.find(contentCondition).sort({ _id: -1 }).skip(page * size).limit(size).populate(['category', 'tags']).then(
                    lists => {
                        // console.log(lists,'lists')
                        res.render("client/tag.html", {
                            title: `${tag.name}`,
                            lists,
                            page,
                            size,
                            total,
                            // hotContents,
                            categories: res.categories,
                            hotContents: res.hotContents,
                            SITE_DOCMENT_TITLE
                        })
                    })
            })
        } else {
            res.status(404).render('404.html', {
                title: 'No Found'
            })
        }
    })


});

// 前台显示某一篇具体文章
router.get("/content/*", (req, res, next) => {
    let _contentId = req.params['0'];
    let _prevId = "";
    let _nextId = "";
    let condition = { cid: _contentId };
    Content.findOne(condition).populate(['category', 'tags']).then(content => {
        if (content) {
            Content.update(condition, { '$inc': { views: 1 } }).then();
            res.render("client/article.html", {
                content: content,
                title: content.title,
                categories: res.categories,
                hotContents: res.hotContents,
                SITE_DOCMENT_TITLE
            });
        }
    }).catch(error => {
        res.status(404).render('404.html', {
            title: 'No Found'
        })
    })
});







module.exports = router;
