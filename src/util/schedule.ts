/**定时任务 */

import {  scheduleJob } from "node-schedule";
import { Content } from '../models/Content';
import { Category } from '../models/Category';
import moment from 'moment';
import cheerio from "cheerio";
import request,{} from "request";



export const getText =  scheduleJob('30 *******',()=>{
    console.log('有30');
    startGetText();
})

/*
*  采集接口
* */
let urlList = [
    'http://m.sohu.com/media/117369', // 搜狐神吐槽
    'http://news.ifeng.com/listpage/70664/1/list.shtml', // FUN来了_资讯频道_凤凰网
    'http://tu.duowan.com/tag/5037.html', // 今日囧图
    'http://tu.duowan.com/m/tucao', // 吐槽囧图
    'http://tu.duowan.com/m/bxgif', // 全球搞笑GIF


    'https://3g.163.com/touch/reconstruct/article/list/BD21K0DLwangning/0-10.html', // 轻松一刻
    'https://3g.163.com/touch/reconstruct/article/list/CQ9UDVKOwangning/0-10.html', // 胖编怪聊
    'https://3g.163.com/touch/reconstruct/article/list/CQ9UJIJNwangning/0-10.html', // 曲一刀
    // 'http://www.52rkl.cn/qingsong/',
    // 'http://www.52rkl.cn/shentucao/',
    // 'http://www.52rkl.cn/funlaile/',
    // 'http://www.52rkl.cn/funlaile/',
    // 'http://www.52rkl.cn/huzhou/',
    // 'http://www.52rkl.cn/jiongge/',
    // 'http://www.52rkl.cn/zhizhe/',
    // 'http://www.52rkl.cn/shenjing/'
    // // 'http://www.52rkl.cn/doumei/',
    'https://www.qiushibaike.com/hot/', // 糗事百科
]



/**
 * 开始采集
 */
function startGetText() {

    urlList.forEach(url => {
        let _categoryId = "";
        let _categoryName = "";
        // if (url.match('m.sohu.com/media/117369')) {
        //     _categoryName = '神吐槽'
        // }
        // if (url.match('news.ifeng.com/listpage/70664/1/list.shtml')) {
        //     _categoryName = 'FUN来了'
        // }
        if (url.match('tu.duowan.com/tag/5037.html')) {
            _categoryName = '今日囧图'
        }
        if (url.match('tu.duowan.com/m/tucao')) {
            _categoryName = '吐槽囧图'
        }
        if (url.match('tu.duowan.com/m/bxgif')) {
            _categoryName = '全球搞笑GIF'
        }
        

        if (url.match('/article/list/BD21K0DLwangning/')) {
            _categoryName = '轻松一刻'
        }
        if (url.match('/article/list/CQ9UDVKOwangning/')) {
            _categoryName = '胖编怪聊'
        }
        if (url.match('/article/list/CQ9UJIJNwangning/')) {
            _categoryName = '曲一刀'
        }
        if (url.match('www.qiushibaike.com/hot/')) {
            _categoryName = '糗事百科'
        }


  
        // if(url.match('xinwenge')){
        //     _categoryName = '新闻哥'
        // }
        // if(url.match('neihantu')){
        //     _categoryName = '内涵图'
        // }

        // if(url.match('/doumei')){
        //     _categoryName = '逗妹吐槽'
        // }
        // if(url.match('/funlaile')){
        //     _categoryName = 'FUN来了'
        // }
        // if(url.match('/huzhou')){
        //     _categoryName = '狐诌冷笑话'
        // }
        // if(url.match('/jiongge')){
        //     _categoryName = '囧哥说事'
        // }
        // if(url.match('/zhizhe')){
        //     _categoryName = '智者贱志'
        // }
        // if(url.match('/shenjing')){
        //     _categoryName = '我们都是深井冰 '
        // }

        if (!_categoryName) {
            return;
        }
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
                // console.log(err,'err');
                // console.log(res,'res');
                // console.log(body,'body');
                if (!err && res &&  res.statusCode == 200) {
                    booksQuery(body, _categoryId, _categoryName)
                } else {
                    console.log('err:' + err)
                }
            })
        })


    })
}

/**
 *  采集每个详情的url
 */
function booksQuery(body:any, _categoryId:string, _categoryName:string) {
    let list = [];
    if (_categoryName == '神吐槽') {
        let $ = cheerio.load(body, { decodeEntities: false });
        let newlyDom = $('.feed-list-container[data-spm-stop="init"] .feed-list-area .feed-item').eq(0);         // 获取最新列表数据
        let url = "http://m.sohu.com/" + $(newlyDom).find('a').attr('href');         // 详情的具体url
        let content:any = {
            thumb: $(newlyDom).find('.onePic__img-area img').attr('original')
        };
        request(url, function (err, res, body) {
            $ = cheerio.load(body, { decodeEntities: false });
            if (!err && res.statusCode == 200) {
                content.title = $('.article-content-wrapper h2.title-info').text();
                content.keywords = $('meta[name="keywords"]').attr('content');
                content.description = $('meta[name="description"]').attr('content');
                content.category = _categoryId;
                content.createAt = new Date();
                $('.article-content-wrapper #articleContent .hidden-content .article-tags').remove();
                $('.article-content-wrapper #articleContent .hidden-content .statement').remove();
                let contentDom = $('.article-content-wrapper #articleContent .display-content').html()
                    + $('.article-content-wrapper #articleContent .hidden-content').html()
                content.content = contentDom;
                // .remove('.article-tags');
                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }

    if (_categoryName == 'FUN来了') {
        let $ = cheerio.load(body, { decodeEntities: false });
        let newlyDom = $('.col_L .box650 .box_list').eq(0);         // 获取最新列表数据
        let url = $(newlyDom).find('h2 a').attr('href');         // 详情的具体url
        let content:any = {
            thumb: $(newlyDom).find('.box_pic img').attr('src')
        };
        request(url, function (err, res, body) {
            let $ = cheerio.load(body, { decodeEntities: false });
            if (!err && res.statusCode == 200) {
                content.title = $('#artical_topic').text();
                content.keywords = $('#main_content').text().trim().slice(0, 30)
                content.description = $('#main_content').text().trim().slice(0, 100)
                content.category = _categoryId;
                content.createAt = new Date();
                $('#main_content p').last().remove()
                content.content = $('#main_content').html();
                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }

    if (_categoryName == '吐槽囧图') {
        let $ = cheerio.load(body, { decodeEntities: false });
        let newlyDom = $('#pic-list li').eq(1);         // 获取最新列表数据
        let url = 'http://tu.duowan.com/index.php?r=show/getByGallery/&gid='

        let getUrl = $(newlyDom).children('a').attr('href') || "";
        let urlArr = []
        let id = '0';
        if (getUrl.indexOf('.htm') > -1) {
            urlArr = getUrl.split('.htm')
        } else {
            return
        }
        if (urlArr.length > 0) {
            let str = urlArr[0];
            id = str.split('/')[str.split('/').length - 1]
        } else {
            return
        }
        url = url + id
        let content:any = {
            thumb: $(newlyDom).children('a').find('img').attr('src')
        };
        request(url, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                let requestJSON = JSON.parse(body)
                content.title = requestJSON.gallery_title;
                content.keywords = content.title
                content.description = content.title
                content.category = _categoryId;
                content.createAt = new Date();

                let contentHtml = "";
                if (Array.isArray(requestJSON.picInfo)) {
                    requestJSON.picInfo.forEach((v:any) => {
                        contentHtml += `<figure class="text-center"><img alt='${v.add_intro}' data-src='${v.source}' /><p class="text-center" >${v.add_intro}</p></figure>`
                    })
                }
                content.content = contentHtml;

                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }

    if (_categoryName == '全球搞笑GIF') {
        let $ = cheerio.load(body, { decodeEntities: false });
        let newlyDom = $('#pic-list li').eq(1);         // 获取最新列表数据
        let url = 'http://tu.duowan.com/index.php?r=show/getByGallery/&gid='

        let getUrl = $(newlyDom).children('a').attr('href') || "";
        let urlArr = []
        let id = '0';
        if (getUrl.indexOf('.htm') > -1) {
            urlArr = getUrl.split('.htm')
        } else {
            return
        }
        if (urlArr.length > 0) {
            let str = urlArr[0];
            id = str.split('/')[str.split('/').length - 1]
        } else {
            return
        }
        url = url + id
        let content:any = {
            thumb: $(newlyDom).children('a').find('img').attr('src')
        };
        request(url, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                let requestJSON = JSON.parse(body)
                content.title = requestJSON.gallery_title;
                content.keywords = content.title
                content.description = content.title
                content.category = _categoryId;
                content.createAt = new Date();

                let contentHtml = "";
                if (Array.isArray(requestJSON.picInfo)) {
                    requestJSON.picInfo.forEach((v:any) => {
                        contentHtml += `<figure class="text-center"><img alt='${v.add_intro}' data-src='${v.source}' /><p class="text-center" >${v.add_intro}</p></figure>`
                    })
                }
                content.content = contentHtml;

                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }
    


    if (_categoryName == '今日囧图') {
        let $ = cheerio.load(body, { decodeEntities: false });
        let newlyDom = $('#pic-list li').eq(1);         // 获取最新列表数据
        let url = 'http://tu.duowan.com/index.php?r=show/getByGallery/&gid='

        let getUrl = $(newlyDom).children('a').attr('href') || "";
        let urlArr = []
        let id = '0';
        if (getUrl.indexOf('.htm') > -1) {
            urlArr = getUrl.split('.htm')
        } else {
            return
        }
        if (urlArr.length > 0) {
            let str = urlArr[0];
            id = str.split('/')[str.split('/').length - 1]
        } else {
            return
        }
        url = url + id
        let content:any = {
            thumb: $(newlyDom).children('a').find('img').attr('src')
        };
        request(url, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                let requestJSON = JSON.parse(body)
                content.title = requestJSON.gallery_title;
                content.keywords = content.title
                content.description = content.title
                content.category = _categoryId;
                content.createAt = new Date();

                let contentHtml = "";
                if (Array.isArray(requestJSON.picInfo)) {
                    requestJSON.picInfo.forEach((v:any) => {
                        contentHtml += `<figure class="text-center"><img alt='${v.add_intro}' data-src='${v.source}' /><p class="text-center" >${v.add_intro}</p></figure>`
                    })
                }
                content.content = contentHtml;

                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }



    if (_categoryName == '曲一刀') {
        // console.log(body)
        let string:any;
        if (typeof body == 'string') {
            if (body.includes('artiList(')) {
                string = eval(body)
            } else {
                return
            }
        } else {
            return
        }
        let newlyDom;

        if (string.CQ9UJIJNwangning) {
            newlyDom = string.CQ9UJIJNwangning[0]
        } else {
            return
        }
        // 获取最新列表数据
        let url = newlyDom.url
        let content:any = {
            thumb: newlyDom.imgsrc
        };
        request(url, function (err:any, res:any, body:any) {
            if (!err && res.statusCode == 200) {
                let $ = cheerio.load(body, { decodeEntities: false });
                content.title = $('article h1.title').text()
                // if(content.title.indexOf('轻松一刻')>-1){
                //     let title = `轻松一刻[${moment(newlyDom.ptime).format('YYYY-MM-DD')}]` 
                //     content.title = content.title.replace('轻松一刻',title)
                // }
                content.keywords = content.title
                content.description = content.title
                content.category = _categoryId;
                content.createAt = new Date();
              
                content.content =$('article .content').html()

                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }

    if (_categoryName == '胖编怪聊') {
        // console.log(body)
        let string:any;
        if (typeof body == 'string') {
            if (body.includes('artiList(')) {
                string = eval(body)
            } else {
                return
            }
        } else {
            return
        }
        let newlyDom;

        if (string.CQ9UDVKOwangning) {
            newlyDom = string.CQ9UDVKOwangning[0]
        } else {
            return
        }
        // 获取最新列表数据
        let url = newlyDom.url
        let docid = string.docid;
        let content:any = {
            thumb: newlyDom.imgsrc
        };
        request(url, function (err:any, res:any, body:any) {
            if (!err && res.statusCode == 200) {
                let $ = cheerio.load(body, { decodeEntities: false });
                content.title = $('article h1.title').text()
                // if(content.title.indexOf('轻松一刻')>-1){
                //     let title = `轻松一刻[${moment(newlyDom.ptime).format('YYYY-MM-DD')}]` 
                //     content.title = content.title.replace('轻松一刻',title)
                // }
                content.keywords = content.title
                content.description = content.title
                content.category = _categoryId;
                content.createAt = new Date();
              
                content.content =$('article .content').html()

                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }
    
    if (_categoryName == '轻松一刻') {
        // console.log(body)
        let string:any;
        if (typeof body == 'string') {
            if (body.includes('artiList(')) {
                string = eval(body)
            } else {
                return
            }
        } else {
            return
        }
        let newlyDom:any;

        if (string.BD21K0DLwangning) {
            newlyDom = string.BD21K0DLwangning[0]
        } else {
            return
        }
        // 获取最新列表数据
        let url = newlyDom.url
        let docid = string.docid;
        let content:any = {
            thumb: newlyDom.imgsrc
        };
        request(url, function (err:any, res:any, body:any) {
            if (!err && res.statusCode == 200) {
                let $ = cheerio.load(body, { decodeEntities: false });
                content.title = $('article h1.title').text()
                if(content.title.indexOf('轻松一刻')>-1){
                    let title = `轻松一刻[${moment(newlyDom.ptime).format('YYYY-MM-DD')}]` 
                    content.title = content.title.replace('轻松一刻',title)
                }
                content.keywords = content.title
                content.description = content.title
                content.category = _categoryId;
                content.createAt = new Date();
              
                content.content =$('article .content').html()

                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }



    if (_categoryName == '新闻哥') {
        return;
    }

    if (_categoryName == '糗事百科') {
        let $ = cheerio.load(body, { decodeEntities: false });
        let newlyDom = $('a[class="text"]');         // 获取最新列表数据
        // console.log('$',newlyDom[0])
        let url = $(body).find('a').html();         // 详情的具体url
        console.log('$url',url)
        let content:any = {
            thumb: ''
        };

        // console.log('url',url)
        request('https://www.qiushibaike.com/' + url, function (err, res, body) {
            $ = cheerio.load(body, { decodeEntities: false });
            console.log($('#content').html(),'content$')
            if (!err && res.statusCode == 200) {
                content.title = $('#content .article-title').text();
                content.keywords = $('#content .article-title').text();
                content.description =$('#content .article-title').text();
                content.category = _categoryId;
                content.createAt = new Date();
                content.content = $('#conten .content').html();
                // console.log(content,'content')
                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log(_categoryName + '采集错误  err:' + err)
            }
        })
    }



}
//
//
// /**
//  *  采集每一篇内容的详情，并且插入数据库
//  */
function getBody(list:any, _categoryId:string) {
    let contents = []; // 本篇文章内容
    list.forEach((v:any, index:number) => {

        request(v, function (err:any, res:any, body:any) {
            if (!err && res.statusCode == 200) {
                // console.log(body,"body")
                let $ = cheerio.load(body);
                let content:any = {};
                content.title = $('.article-container').find('.article-title').text();
                content.category = _categoryId;
                content.content = $('.article-container .article-content').find('div#nx').nextAll().remove().end().
                    closest('.article-container .article-content').
                    find('#ns,#nx,#nz').remove().end().closest('.article-container .article-content').
                    html();
                content.createAt = new Date()
                // content.content = $(contentHtml).html();
                //  $('.article-container .article-content').remove('div#ns');
                // console.log(
                //     content.content,
                //     "contentHtml"
                // )
                // 采集完插入文章
                Content.findOne({ title: content.title }).then((isHasContent) => {
                    if (!isHasContent) {
                        (new Content(content)).save().then(content, err => {
                            // console.log(err,'err')
                            // console.log(content)
                        });
                    }
                })
            } else {
                console.log('err:' + err)
            }
        })

    })
}


function artiList(body) {
    return body
}

