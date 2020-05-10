/** 
**  采集 获取163 网易新闻
*/
var Content = require("../../models/Content.js");
var Category = require("../../models/Category.js");
const Tag = require("../../models/Tag.js");
var _ = require('lodash');
const cheerio = require("cheerio");
const request = require("request");

const { getKeyWord } = require('../tool');


/*
*  采集接口
* */
let urlList = [
    'https://3g.163.com/touch/reconstruct/article/list/BD21K0DLwangning/0-10.html', // 轻松一刻
    'https://3g.163.com/touch/reconstruct/article/list/CQ9UDVKOwangning/0-10.html', // 胖编怪聊
    'https://3g.163.com/touch/reconstruct/article/list/CQ9UJIJNwangning/0-10.html', // 曲一刀
]

const mapCategoryNameToKey = [
    {
        name: '曲一刀',
        value: "CQ9UJIJNwangning"
    },
    {
        name: '胖编怪聊',
        value: "CQ9UDVKOwangning"
    },
    {
        name: '轻松一刻',
        value: "BD21K0DLwangning"
    },
]


/**
 * 开始采集
 */
function startGet_163_Text() {
    urlList.forEach(url => {
        let _categoryId = "";
        let _categoryName = "";
        if (url.match('/article/list/BD21K0DLwangning/')) {
            _categoryName = '轻松一刻'
        }
        if (url.match('/article/list/CQ9UDVKOwangning/')) {
            _categoryName = '胖编怪聊'
        }
        if (url.match('/article/list/CQ9UJIJNwangning/')) {
            _categoryName = '曲一刀'
        }
        if (!_categoryName) {
            return;
        }
        _categoryName = _categoryName.trim();
        // step 1 采集分类名字
        Category.findOne({
            name: _categoryName
        }).then(category => {
            if (!category) {
                new Category({
                    name: _categoryName
                }).save();
                return;
            }
            _categoryId = category._id;
            if (!_categoryId) {
                return
            }
            // step 2 获取url文件体
            request(url, function (err, res, body) {
                if (!err && res.statusCode == 200) {
                    booksQuery(body, _categoryId, _categoryName)
                } else {
                    console.log('err:' + err)
                }
            })
        })
    })
}

function booksQuery(body, _categoryId, _categoryName) {
    let string = ""
    if (typeof body == 'string') {
        if (body.includes('artiList(')) {
            string = eval(body)
        }
    }
    if (string == "") {
        return;
    }

    let key = mapCategoryNameToKey.find(item => item.name == _categoryName).value;
    let canGetSourceList = string[key]; // 能采集的资源列表
    getEveryNews(canGetSourceList, _categoryId, _categoryName)
}

function getEveryNews(arcList = [], categoryId, categoryName) {
    // 获取列表页的 文章列表，然后每篇独自采集
    if (arcList.length == 0) return;

    arcList.forEach((newsItem, index) => {
        if (index > 5) return; // 本次不采集10遍以上

        let content = {
            thumb: newsItem.imgsrc,
            docid: newsItem.docid,
            description: newsItem.digest
        };
        if (newsItem.source != categoryName) return; // 添加合法性，类目名称一样才开始采集，确认每个类型下都是同一个类型的网易新闻

        request(newsItem.url, async (err, res, body) => {
            if (!err && res.statusCode == 200) {
                $ = cheerio.load(body, { decodeEntities: false });
                content.title = $('article h1.title').text().trim();
                content.description = $('article .content').text().replace(/\s+/g, "");

                // 关键词是否有bug待定
                content.keywords = getKeyWord(content.title, 2).join(',');

                if (content.description.length > 72) {
                    content.description = content.description.substring(0, 72);
                }
                content.category = categoryId;
                content.content = $('article .content').html();
                content.originalLink = newsItem.url;

                let _condition = {
                    "$or": [{ title: content.title }, { docid: content.docid }]
                }
                try {
                    let isHasContent = await Content.findOne(_condition);
                    if (!isHasContent) {
                        // // 随机插入两条tag
                        let count = await Tag.count();
                        var random = Math.floor(Math.random() * count);
                        Tag.findOne().skip(random).exec(
                            function (err, result) {
                                // Tada! random user
                                // console.log(result, "Tag=== ====")
                                if (result) {
                                    content.tags = [result._id]
                                }
                                new Content(content).save()
                            });
                    }
                } catch (error) {

                }

            } else {
                console.log('采集错误  err:' + err)
            }

        })
    })
}



function artiList(body) {
    return body
}




exports.startGet_163_Text = startGet_163_Text