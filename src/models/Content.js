/**
 *  内容模型
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { Counter } = require('./Counter')


const contentSchema = new Schema({
    cid: { type: Number, default: 0 },

    // 分类，id
    category: {
        //类型,保存是一个引用类型
        type: mongoose.Schema.Types.ObjectId,
        // 引用另外一张表的模型
        ref: "Category"
    },
    // 用户，作者，id
    // user: {
    //     //类型,保存是一个引用类型
    //     type: mongoose.Schema.Types.ObjectId,
    //     // 引用另外一张表的模型
    //     ref: "User"
    // },
    // 点击量
    views: {
        type: Number,
        default: 0
    },
    createAt: { type: Date, default: Date.now },
    title: String,
    thumb: String,
    //介绍
    description: {
        type: String,
        default: "输入的内容值"
    },
    content: String,
    docid: String,// 目前如果是网易类，有个文章唯一id，用来判断唯一性，避免重复采集
    originalLink: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
});

contentSchema.pre('save', function (next) {
    let doc = this;
    Counter.findByIdAndUpdate({ _id: 'contentId' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, function (error, counter) {
        if (error)
            return next(error);
        doc.cid = counter.seq;
        next();
    });
});

module.exports = mongoose.model('Content', contentSchema);

