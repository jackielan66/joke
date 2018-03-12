/**
 * Created by Administrator on 2017/3/13.
 * 数据库结构文件
 * 用户结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username:String,
    password:String,
    isAdmin:false,
    createAt:{
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model("User",userSchema);

