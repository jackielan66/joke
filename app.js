let express = require("express");
let swig = require("swig");
let bodyParser = require("body-parser");
let app = express();
let Cookies = require("cookies")
let mongoose = require("mongoose");
let path = require('path');
let getText = require('./getText');

getText();

var Category = require("./models/Category.js");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);
    // req.cookies = new Cookies(req, res);
    // console.log(req.cookies,"req");
    if (req.cookies.get("Bearer")) {
        // console.log(req.cookies.get("Bearer"),"req.cookies.get(\"Bearer\")")
        req.username = JSON.parse(req.cookies.get("Bearer")).username;
    }
    Category.find({}).then(categorys => {
        // 全局匹配栏目
        req.categorys = categorys;
    })
    next();
})



// 第一步：定义当前应用所用的模板引擎
// 第一个模板参数，模板名称同时也是模板文件后缀，  第二个参数，解析处理模板的内容的方法
app.engine('html', swig.renderFile);

//第二步：设置模板文件存放的目录
// 第一个参数必须是views，第二个路径
app.set('views', './views');

// 第三步 ： 注册所使用的模板引擎，
//第一个参数必须是view engine
//第二个参数和app.engine这个方法中第一的模板引擎名称（第一个参数必须是）必须是一样的
app.set('view engine', 'html');

//取消模板缓存，开发过程中就不要每次重启服务
// 这个模板有个缓存功能，即每次需要重启服务器才能更新模板里的文件，这样在开发过程中会有很大的麻烦
swig.setDefaults({
    cache: false
});

app.use('/public', express.static(__dirname + '/public'));

app.use('/admin', require('./routers/admin.js'));

app.use('/api', require('./routers/api.js'));
app.use('/app/api', require('./routers/appapi.js'));
app.use('/', require('./routers/path.js'));
app.get('*', function (req, res) {
    res.status(404).render('404.html', {
        title: 'No Found'
    })
});

let arguments = process.argv.splice(1);
let port = 9000;
if (arguments.length >= 2) {
    port = 80;
}
// console.log(arguments,"arguments")

mongoose.connect("mongodb://localhost:27017/joke", err => {
    if (err) {
        console.log("启动失败");
    } else {
        app.listen(port);
        console.log("服务启动成功,port是", port);
    }
});