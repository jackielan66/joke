/**
 * Created by Administrator on 2017/3/8.
 * 后台中心模块
 */
var express = require('express');
var app = express()
var router = express.Router();
var User = require("../../models/User.js");
var Category = require("../../models/BiaoQingCategory");
var ContentBiaoQing = require("../../models/BiaoQingContent");
var BiaoQingTag = require("../../models/BiaoQingTag");


// 获取管理 权限管理

// 获取表情
router.get("/", function (req, res, next) {
    var page = req.query.page || 1;
    var limitVal = 10;
    var totalPage = 0;
    ContentBiaoQing.count().then(function (count) {
        totalPage = Math.ceil(count / limitVal);
        page = Math.min(page, totalPage);
        page = Math.max(page, 1);
        var skipVal = (page - 1) * limitVal;
        ContentBiaoQing.find().sort({ _id: -1 }).limit(limitVal).skip(skipVal).populate(['category', 'user', 'tags']).then(function (contents) {
            // console.log(contents, "contents")
            res.send({
                // categorys: categorys,
                data: contents,
                page: page,
                total: count
            })
        })
    })
})

// 创建表情
router.post("/create", function (req, res, next) {
    // console.log(req.userInfo.id,"req.userInfo.id");
    if (req.body.title == "") {
        res.json({
            code: 500,
            message: '标题不能为空'
        })
        return;
    };
    if (req.body.category == "") {
        res.json({
            code: 500,
            message: '分类不能为空'
        })
        return;
    };

    ContentBiaoQing.findOne({
        title: req.body.title
    }).then(function (rs) {
        if (rs) {
            //表示数据库中有值
            // console.log("1111")
            res.send({
                code: 500,
                message: "标题已经存在！标题必须是唯一的"
            })
            return Promise.reject();
        } else {
            // 数据库中没有
            var newCategory = new ContentBiaoQing(req.body).save();
            // console.log(newCategory, "newCategorynewCategory")
            return newCategory;
        }
    }).then(function (newCategory) {
        res.send({
            code: 200,
            message: "保存成功"
        })
    }).catch(err => {
        res.send({
            code: 500,
            message: "操作失败"
        })
    })

});

// 修改表情
router.post("/update", function (req, res, next) {
    let id = req.body.id || "";
    let _body = req.body;
    // console.log(_body, "_body_body")
    ContentBiaoQing.findOne({ _id: id }).then(content => {
        if (content) {
            ContentBiaoQing.findOne({
                _id: { $ne: id },
                title: _body.title
            }).then(otherbiaoqng => {
                if (otherbiaoqng) {
                    res.send({
                        code: 500,
                        message: "该标题已经存在，标题必须是唯一的，请修改后再提交"
                    })
                } else {
                    ContentBiaoQing.update({
                        _id: id
                    }, _body).then(() => {
                        res.send({
                            code: 200,
                            message: "保存成功"
                        })
                    })
                }
            });


        }
    })
})

// 删除表情
router.post("/delete", function (req, res, next) {
    var id = req.body.id || "";
    // remove 删除方法
    ContentBiaoQing.remove({
        _id: id
    }).then(() => {
        res.send({
            code: 200,
            message: "文章删除成功！"
        })
    });
});


router.get('/category', function (req, res, next) {
    var page = parseInt(req.query.page || 0);
    var size = parseInt(req.query.size || 10);
    // var limitVal = size;
    // var totalPage = 0;
    Category.count().then(function (count) {
        // totalPage = Math.ceil(count / limitVal);
        // page = Math.min(page, totalPage);
        // page = Math.max(page, 1);
        var skipVal = page * size;
        Category.find().sort({ _id: -1 }).limit(size).skip(skipVal).then(function (categorys) {
            res.send({
                // categorys: categorys,
                data: categorys,
                page: page,
                total: count
            })
        })
    })

});

router.post('/category/create', function (req, res, next) {
    var name = req.body.name || "";
    let alias = req.body.alias || "";
    // console.log(name,"namename admin")
    if (!name.trim()) {
        res.send({
            code: 500,
            message: "名称不能为空！"
        })
        return;
    };
    // console.log(Category,"CategoryCategory");
    // todo 别名或者分类名称都必须 唯一才行
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            //表示数据库中有值
            // console.log("1111")
            res.send({
                code: 500,
                message: "名称已经存在！"
            })
            return Promise.reject();
        } else {
            // 数据库中没有
            var newCategory = new Category({
                name: name,
                alias
            }).save();
            // console.log(newCategory, "newCategorynewCategory")
            return newCategory;
        }
    }).then(function (newCategory) {
        res.send({
            code: 200,
            message: "保存成功"
        })
    })
})

router.post("/category/update", function (req, res, next) {
    var id = req.body.id || "";
    var name = req.body.name || "";
    let alias = req.body.alias || "";
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.send({
                code: 500,
                message: "名称不存在"
            })
            return Promise.reject();
        } else {
            if (name == category.name) {
                // 当用户没做任何修改的时候
                res.send({
                    code: 500,
                    message: "名称没修过过"
                })
                return Promise.reject();
            } else {
                // 查询本条记录数据库中是否存在
                // id 不是本条id，但是名称却是我要修改的名称
                return Category.findOne({
                    _id: { $ne: id },
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.send({
                code: 500,
                message: "数据库中有此名称，请更换其他名称！"
            })
            return Promise.reject();
        } else {
            // 否则就更新本条数据
            // update(条件,需要更改的值)
            return Category.update({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function () {
        res.send({
            code: 200,
            message: "名称修改成功！"
        })
    })
});

// 删除分类
router.post("/category/delete", function (req, res, next) {
    var id = req.body.id || "";
    // remove 删除方法
    Category.remove({
        _id: id
    }).then(() => {
        res.send({
            code: 200,
            message: "名称删除成功！"
        })
    });
});



// 获取表情标签
router.get('/tags', function (req, res, next) {
    var page = parseInt(req.query.page || 0);
    var size = parseInt(req.query.size || 10);
    // var limitVal = size;
    // var totalPage = 0;
    BiaoQingTag.count().then(function (count) {
        // totalPage = Math.ceil(count / limitVal);
        // page = Math.min(page, totalPage);
        // page = Math.max(page, 1);
        var skipVal = page * size;
        BiaoQingTag.find().sort({ _id: -1 }).limit(size).skip(skipVal).then(function (categorys) {
            res.send({
                // categorys: categorys,
                data: categorys,
                page: page,
                total: count
            })
        })
    })

});

router.post('/tags/create', function (req, res, next) {
    var name = req.body.name || "";
    let alias = req.body.alias || "";
    // console.log(name,"namename admin")
    if (!name.trim()) {
        res.send({
            code: 500,
            message: "名称不能为空！"
        })
        return;
    };
    // console.log(Category,"CategoryCategory");
    // todo 别名或者分类名称都必须 唯一才行
    BiaoQingTag.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            //表示数据库中有值
            // console.log("1111")
            res.send({
                code: 500,
                message: "名称已经存在！"
            })
            return Promise.reject();
        } else {
            // 数据库中没有
            var newTag = new BiaoQingTag({
                name: name,
                alias
            }).save();
            // console.log(newCategory, "newCategorynewCategory")
            return newTag;
        }
    }).then(function (newTag) {
        res.send({
            code: 200,
            message: "保存成功"
        })
    })
})

router.post("/tags/update", function (req, res, next) {
    var id = req.body.id || "";
    var name = req.body.name || "";
    let alias = req.body.alias || "";
    BiaoQingTag.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.send({
                code: 500,
                message: "名称不存在"
            })
            return Promise.reject();
        } else {
            if (name == category.name) {
                // 当用户没做任何修改的时候
                res.send({
                    code: 500,
                    message: "名称没修过过"
                })
                return Promise.reject();
            } else {
                // 查询本条记录数据库中是否存在
                // id 不是本条id，但是名称却是我要修改的名称
                return BiaoQingTag.findOne({
                    _id: { $ne: id },
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.send({
                code: 500,
                message: "数据库中有此名称，请更换其他名称！"
            })
            return Promise.reject();
        } else {
            // 否则就更新本条数据
            // update(条件,需要更改的值)
            return BiaoQingTag.update({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function () {
        res.send({
            code: 200,
            message: "名称修改成功！"
        })
    })
});

// // 删除分类
router.post("/tags/delete", function (req, res, next) {
    var id = req.body.id || "";
    // remove 删除方法
    BiaoQingTag.remove({
        _id: id
    }).then(() => {
        res.send({
            code: 200,
            message: "名称删除成功！"
        })
    });
});







module.exports = router;
