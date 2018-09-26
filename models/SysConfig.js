/**
 * Created by Administrator on 2017/3/13.
 * 数据库结构文件
 * 系统配置
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sysConfigSchema = new Schema({
    webname:{
        type:String,
        default:'哈哈网站'
    },
});

module.exports = mongoose.model("SysConfig",sysConfigSchema);

