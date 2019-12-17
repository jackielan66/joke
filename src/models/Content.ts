import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";

export type ContentDocument = mongoose.Document & {
    // 分类，id
    category: {
        //类型,保存是一个引用类型
        type: mongoose.Schema.Types.ObjectId,
        // 引用另外一张表的模型
        ref: "Category"
    },
    // 用户，作者，id
    // 略缩图
    thumb: String,
    // 点击量
    views: {
        type: Number,
        default: 0
    },
    // 发布时间
    createAt: Date,
    //文章标题
    title: String,
    keywords: String,
    description: String,
    content:String,
};

let contentSchema = new mongoose.Schema({
    // 分类，id
    category: {
        //类型,保存是一个引用类型
        type: mongoose.Schema.Types.ObjectId,
        // 引用另外一张表的模型
        ref: "Category"
    },
    // 用户，作者，id
    // user :  {
    //     //类型,保存是一个引用类型
    //     type:mongoose.Schema.Types.ObjectId,
    //     // 引用另外一张表的模型
    //     ref:"User"
    // },
    // 略缩图
    thumb: String,
    // 点击量
    views: {
        type: Number,
        default: 0
    },
    // 发布时间
    createAt: {
        type: Date,
        default: new Date()
    },
    //文章标题
    title: String,
    keywords: String,
    description: String,
    content: {
        type: String,
        default: ""
    },
    // 评论内容
    // comments:{
    //     type:Array,
    //     default:[]
    // }
});

export const Content = mongoose.model<ContentDocument>("Content", contentSchema);
