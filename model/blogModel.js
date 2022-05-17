const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const blog = new Schema({
    post_title: {
        type: String,
        required: true
    },
    post_subtitle: {
        type: String,
        required: true
    },
    editor1: {
        type: String,
        required: true
    },
    post_image: {
        type: String,
        required: false
    },
    name:{
        type:String
    },
    status:{
        type:Number
    }
});

blog.plugin(mongoosePaginate);

const Blogs = new mongoose.model("allblog", blog);
module.exports = Blogs;
