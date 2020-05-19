// 各种采集入口
const { startGet_163_Text } = require('./163')


function startGetText() {
    startGet_163_Text();
}

// let stri  = typeof process.env.NODE_ENV;
// console.log(stri,'stri')
// console.log(process.env.NODE_ENV, 'process.env.NODE_ENV != "production"')
let second = 6000;
if (process.env.NODE_ENV === 'production') {
    console.log('production')
    second = 6000 * 60 * 6
}
const startCollect = function () {
    startGetText();
    setInterval(() => {
        startGetText();
    }, second)
}

//

module.exports = startCollect 