var express = require('express');
var path = require("path");
const moment = require("moment")
require('dotenv').config({ 
    path:path.resolve(process.cwd(), '.env.example')
 })
const { SITE_DOCMENT_TITLE } = require("./config")


console.log(process.cwd(),"process.cwd()")  


//创建app应用 。。等同nodejs中的http.createSever()
var app = express();

//  加载数据库模块
var mongoose = require('mongoose');


var Category = require('./models/Category');
const Content = require('./models/Content');
const Tag = require('./models/Tag')

//配置模板应用
// view engine setup
app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
    imports: {
        dateFormat: function (date, format = "YYYY-MM-DD") {
            return moment(date).format(format)
        }
    }
});
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'art');





// 全局通用类别设置
app.use((req, res, next) => {
    Category.find().then(categories => {
        res.categories = categories;
        next();
    })
})

// 全局通用热门内容
app.use((req, res, next) => {
    Content.find({}).sort({ views: -1 }).limit(10).then(hotContents => {
        res.hotContents = hotContents;
        next();
    })
})

// 全局通用热门内容
app.use((req, res, next) => {
    Tag.find({}).limit(10).then(tags => {
        res.tags = tags;
        next();
    })
})




// app.use('/api', require('./routers/api.js'));
app.use('/', require('./routers/client.js'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/*', (req, res, next)=>{
    res.status(404).render('404.html', {
        title: 'No Found'
    })
});


let MONGODB_URI =  process.env.MONGODB_URI_LOCAL;

if(process.env.NODE_ENV=== 'production'){
    MONGODB_URI =  process.env.MONGODB_URI;
}
console.log(MONGODB_URI,'===MONGODB_URI')
// 监听数据库
mongoose.connect(MONGODB_URI, function (err) {
    if (err) {
        console.log(err,"数据库连接失败");
    } else {
        app.listen(3001);
        console.log(`数据库连接成功，监听端口为 3001`);
        //监听http请求
    }
});

let testCaiji = require('./utils/feach')
testCaiji()

// 添加tags便签，每周进行一次
require('./utils/tag')






