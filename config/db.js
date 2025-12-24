const mongoose = require('mongoose');


async function connectDB(){
    try {
        await mongoose.connect('mongodb+srv://Adil0910:adil0910@cluster0.icayqlq.mongodb.net/blog');
        console.log("Database connected")
    } catch (error) {
        console.error("Error while conecting to DB", error)
    }
};


module.exports = connectDB;

