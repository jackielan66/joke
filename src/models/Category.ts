import mongoose from "mongoose";

export type CategoryDocument = mongoose.Document & {
    name:String,
    path: String;
    password: String;
    createAt:Date
};


const categorySchema = new mongoose.Schema({
    name:String,
    path: String,
    createAt:{
        type:Date,
        default:new Date()
    }
});


export const Category = mongoose.model<CategoryDocument>("Category", categorySchema);
