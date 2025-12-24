const mongoose = require('mongoose');


let userSchema = mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true
    },
    password : String
});
let User = mongoose.model("User",userSchema);

module.exports = User;