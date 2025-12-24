const mongoose = require('mongoose');


async function connectDB(){
    try {
        await mongoose.connect('mongodb://localhost:27017/relationship');
        console.log("Database connected")
    } catch (error) {
        console.error("Error while conecting to DB", error)
    }
};


module.exports = connectDB;