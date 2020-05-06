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
router.get("/category-:cid-page-:page", async (req, res, next) => {
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
    let size = req.query.size || 5;
    let condition = { category: currentCategory._id };
    try {
        let total = await Content.count(condition);
        let lists = await
            Content.find(condition).sort({ _id: -1 }).skip(page * size).limit(size).populate(['category']);
        res.render("client/list.html", {
            title: `${currentCategory.name}`,
            currentCategory,
            lists,
            page,
            size,
            total,
            categories: res.categories,
            hotContents: res.hotContents,
            tags: res.tags,
            SITE_DOCMENT_TITLE
        })
    } catch (error) {
        throw404(res);
    }


});

// 前台显示标签页
router.get("/tag-:cid-page-:page", async (req, res, next) => {
    const { cid } = req.params;
    let tagCondition = { cid };
    try {
        let tag = await Tag.findOne(tagCondition);
        let page = req.params.page || 0;
        if (page < 0) {
            page = 0;
        }
        let size = req.query.size || 10;
        let contentCondition = {
            tags: [tag._id]
        }
        let total = await Content.count(contentCondition);
        let lists = await Content.find(contentCondition).sort({ _id: -1 })
            .skip(page * size).limit(size).populate(['category', 'tags']);

        res.render("client/tag.html", {
            title: `${tag.name}`,
            lists,
            page,
            size,
            total,
            categories: res.categories,
            hotContents: res.hotContents,
            tags: res.tags,
            currentTag: tag,
            SITE_DOCMENT_TITLE
        })

    } catch (error) {
        throw404(res);
    }
});

// 前台显示某一篇具体文章
router.get("/content/*", async (req, res, next) => {
    let _contentId = req.params['0'];
    let condition = { cid: _contentId };

    try {
        const content = await Content.findOne(condition).populate(['category', 'tags']);

        const prev = await Content.find({ '_id': { '$lt': content._id } }).sort({ _id: -1 }).limit(1);
        const next = await Content.find({ '_id': { '$gt': content._id } }).sort({ _id: -1 }).limit(1);
        Content.update(condition, { '$inc': { views: 1 } }).then();
        res.render("client/article.html", {
            content: content,
            prev: prev.length > 0 ? prev[0] : null,
            next: next.length > 0 ? next[0] : null,
            title: content.title,
            categories: res.categories,
            hotContents: res.hotContents,
            tags: res.tags,
            SITE_DOCMENT_TITLE
        });
    } catch (error) {
        throw404(res);
    }
});




// 处理 404 页面
function throw404(res) {
    res.status(404).render('404.html', {
        title: 'No Found'
    })
}


module.exports = throw404;
module.exports = router;
