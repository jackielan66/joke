/**
 * Created by Administrator on 2017/3/13.
 * 数据库结构文件
 * 内容表结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { Counter } = require('./Counter')


// 标签模型
const tagSchema = new mongoose.Schema({
    // 标签名称
    name: { type: String, required: true, validate: /\S+/ },
    alias: String,
    // 标签描述
    desc: String,
    // 图标
    icon: String,
    cid: Number
})

tagSchema.pre('save', function (next) {
    let doc = this;
    Counter.findByIdAndUpdate({ _id: 'tagId' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, function (error, counter) {
        if (error)
            return next(error);
        doc.cid = counter.seq;
        next();
    });
});


module.exports = mongoose.model('Tag', tagSchema);




