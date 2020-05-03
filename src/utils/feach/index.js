// 各种采集入口
const {startGet_163_Text} = require('./163')


function startGetText(){
    startGet_163_Text();
}


let second = 6000;
if (process.env.NODE_ENV == 'prodution') {
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