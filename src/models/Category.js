/**
 * Created by Administrator on 2017/3/13.
 * 数据库结构文件
 * 博客分类表结构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { Counter } = require('./Counter')

// 分类名称
const categorySchema = new Schema({
    name: String,
    alias: String,
    cid: { type: Number, default: 0 }
});

categorySchema.pre('save', function (next) {
    let doc = this;
    Counter.findByIdAndUpdate({ _id: 'categoryId' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, function (error, counter) {
        if (error)
            return next(error);
        doc.cid = counter.seq;
        next();
    });
});


module.exports = mongoose.model('Category', categorySchema);

