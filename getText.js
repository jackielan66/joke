var express = require('express');
var router = express.Router();
var Content = require("./models/Content.js");
var Category = require("./models/Category.js");
var _ = require('lodash');

/*
*  采集接口
* */
const cheerio = require("cheerio");
const request = require("request");
// let url = 'http://www.52rkl.cn/xinwenge/'; //Url
// let list = []; //章节List
let urlList = [
    'http://www.52rkl.cn/xinwenge/',
    'http://www.52rkl.cn/neihantu/',
    'http://www.52rkl.cn/qingsong/',
    'http://www.52rkl.cn/shentucao/',
    'http://www.52rkl.cn/funlaile/',
    'http://www.52rkl.cn/doumei/',
]

/**
 * 开始采集
 */
function startGetText(){
    urlList.forEach(url=>{
        let _categoryId = "";
        let _categoryName =  "";
        if(url.match('qingsong')){
            _categoryName = '轻松一刻'
        }
        if(url.match('xinwenge')){
            _categoryName = '新闻哥'
        }
        if(url.match('neihantu')){
            _categoryName = '内涵图'
        }
        if(url.match('shentucao')){
            _categoryName = '神吐槽'
        }
        if(url.match('doumei')){
            _categoryName = '逗妹吐槽'
        }
        if(url.match('funlaile')){
            _categoryName = 'FUN来了'
        }
        if(!_categoryName){
            return;
        }


        // step 1 采集分类名字
        Category.findOne({
            name:_categoryName
        }).then(category=>{
            if(!category){
                new Category({
                    name:_categoryName
                }).save();
                return;
            }
            _categoryId=category._id;
            if(!_categoryId){

                return
            }
            // step 2 获取url文件体
            request(url, function (err, res, body) {
                if (!err && res.statusCode == 200) {
                    booksQuery(body,_categoryId)
                } else {
                    console.log('err:' + err)
                }
            })
        })


    })
}

/**
 *  匹配目录页对应的分类id
 *      通过categoryName来找到categoryId;
//  */
// let categoryId = "";
// let categoryName =  "";
// if(url.match('qingsong')){
//     categoryName = '轻松一刻'
// }
// if(url.match('xinwenge')){
//     categoryName = '新闻哥'
// }
//
// let books = function () {
//     Category.findOne({
//         name:categoryName
//     }).then(category=>{
//         if(category){
//             categoryId = category._id;
//             if(!categoryId){
//                 return;
//             }
//             /**
//              * 获取目录页，并且开始采集
//              */
//             request(url, function (err, res, body) {
//                 if (!err && res.statusCode == 200) {
//                     booksQuery(body)
//                 } else {
//                     console.log('err:' + err)
//                 }
//             })
//         }
//     })
// }
//
//
//
//
/**
 *  采集每个详情的url
 */
 function booksQuery(body,_categoryId) {
    $ = cheerio.load(body);
    let list = [];
    // console.log(body,'body');
    // booksName = $('.btitle').find('h1').text(); //小说名称
    $('.excerpts').find('.excerpt').each(function (i, e) { //获取章节UrlList
        list.push($(this).find('a').attr('href'))
    });
    // console.log(list,"list")
    // createFolder(path.join(__dirname, `/book/${booksName}.txt`)); //创建文件夹
    // fs.createWriteStream(path.join(__dirname, `/book/${booksName}.txt`)) //创建txt文件
    // console.log(`开始写入《${booksName}》·······`)
    getBody(list,_categoryId); //获取章节信息
}
//
//
// /**
//  *  采集每一篇内容的详情，并且插入数据库
//  */
function getBody(list,_categoryId) {
    let contents = []; // 本篇文章内容
    list.forEach((v,index)=>{

            request(v, function (err, res, body) {
                if (!err && res.statusCode == 200) {
                    // console.log(body,"body")
                    $ = cheerio.load(body);
                    let content = {};
                    content.title= $('.article-container').find('.article-title').text();
                    content.category=  _categoryId;
                    content.content = $('.article-container .article-content').find('div#nx').nextAll().remove().end().
                    closest('.article-container .article-content').
                    find('#ns,#nx,#nz').remove().end().closest('.article-container .article-content').
                    html();
                    // content.content = $(contentHtml).html();
                    //  $('.article-container .article-content').remove('div#ns');
                    // console.log(
                    //     content.content,
                    //     "contentHtml"
                    // )
                    // 采集完插入文章
                    Content.findOne({title:content.title}).then((isHasContent)=>{
                        if(!isHasContent){
                            (new Content(content)).save().then(content,err=>{
                                // console.log(err,'err')
                                // console.log(content)
                            }) ;
                        }
                    })
                } else {
                    console.log('err:' + err)
                }
            })

    })
}





    
module.exports = startGetText;