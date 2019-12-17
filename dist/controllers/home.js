"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Content_1 = require("../models/Content");
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    var skipVal = 0; // 跳过几页
    var limitVal = 10; // 每页显示几个
    Content_1.Content.find().sort({ _id: -1 }).skip(skipVal).limit(limitVal).then(contents => {
        res.render("uc/index", {
            title: "首页",
            contents: contents,
            hotContents: contents,
        });
    });
};
exports.detail = (req, res) => {
    let _contentId = req.params.id;
    console.log(_contentId, '_contentId');
    let limitVal = 10;
    let _prevId = "";
    let _nextId = "";
    Content_1.Content.findOne({ _id: _contentId }).then(content => {
        if (content) {
            Content_1.Content.update({ _id: _contentId }, { '$inc': { views: 1 } }).then(newcontent => {
                Content_1.Content.find({}).sort({ views: -1 }).limit(limitVal).then(hotContents => {
                    res.render("uc/article.html", {
                        hotContents,
                        content: content,
                        title: content.title,
                    });
                });
            });
        }
        else {
            res.status(404).render('404.html', {
                title: 'No Found'
            });
        }
    }, notFound => {
        res.status(404).render('404.html', {
            title: 'No Found'
        });
    });
};
//# sourceMappingURL=home.js.map