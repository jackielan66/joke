let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let contentSchema =  new Schema({
        // 分类，id
        category :  {
            //类型,保存是一个引用类型
            type:mongoose.Schema.Types.ObjectId,
            // 引用另外一张表的模型
            ref:"Category"
        },
        // 用户，作者，id
        // user :  {
        //     //类型,保存是一个引用类型
        //     type:mongoose.Schema.Types.ObjectId,
        //     // 引用另外一张表的模型
        //     ref:"User"
        // },
        // 点击量
        views:{
            type:Number,
            default:0
        },
        // 发布时间
        createAt: {
            type:Date,
            default:new Date()
        },
        //文章标题
        title : String,
        //内容
        content:{
            type:String,
            default:""
        },
        // 评论内容
        // comments:{
        //     type:Array,
        //     default:[]
        // }
});

module.exports = mongoose.model("Content",contentSchema);


