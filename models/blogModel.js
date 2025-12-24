const mongoose = require('mongoose');

let blogSchema = mongoose.Schema({
    image : String,
    title : String,
    content : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{
    timestamps : true
});


let Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;