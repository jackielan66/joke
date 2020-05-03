const main = require('./main')

module.exports = app => {
    // app.post('/main', user.login);
    // 首页
    app.get('/', function (req, res, next) {
        res.render('admin/index.html', {
            userInfo: req.userInfo
        })
    });
}