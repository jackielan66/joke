/**
 * Created by Administrator on 2017/3/13.
 * 数据库结构文件
 * 博客分类表结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    name:String,
    createAt:{
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model("Category",categorySchema);

