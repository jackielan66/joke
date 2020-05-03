var express = require('express');
var path = require("path");

//创建app应用 。。等同nodejs中的http.createSever()
var app = express();

//  加载数据库模块
var mongoose = require('mongoose');

// 加载body-parser，用来处理前端传过来的数据
var bodyParser = require('body-parser');


// 加载cookie模块
var Cookie = require('cookies');

// 引入用户查找模型，实时判断当中用户是否是管理员
// var User = require('./models/User.js');
var Category = require('./models/Category');
// var BiaoQingTags = require('./models/BiaoQingTag')

//配置模板应用
// view engine setup
app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'art');


// 全局使用设置
app.use(bodyParser.urlencoded({ extended: true }));

// cookie设置
app.use(function (req, res, next) {
    req.cookies = new Cookie(req, res);
    req.userInfo = {};
    if(req.cookies.get("userInfo")){
        // 有值则说明登录状态
        try{
            // req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            // User.findById(req.userInfo._id).then(function (userInfo) {
            //     req.userInfo.isAdmin = userInfo.isAdmin;
            //     next()
            // })
        }catch (e){
            next();
        }
        // req.userInfo = JSON.parse(req.cookies.get("userInfo"))
        //实时获取当前的用户登录信息，是否有管理员
    }else{
        next();
    }
    // console.log(req.cookies.get("userInfo"))

})

// 全局通用类别设置
app.use((req,res,next)=>{
    Category.find().then(categories=>{
        res.categories = categories;
        next();
    })
    // BiaoQingTags.find().limit(30).then(tags=>{
    //     res.biaoqingtags = tags;
    //     
    // })
  
})



// app.use('/admin/biaoqing', require('./routers/admin/biaoqing'));
// app.use('/api', require('./routers/api.js'));
app.use('/', require('./routers/client.js'));
app.use('/public', express.static(__dirname + '/public'));


// 监听数据库
mongoose.connect('mongodb://localhost:27017/joke', function (err) {
    if (err) {
        console.log("数据库连接失败");
    } else {
        app.listen(3001);
        console.log(`数据库连接成功，监听端口为 3001`);
        //监听http请求
    }
});

let testCaiji =  require('./utils/feach')
testCaiji()





