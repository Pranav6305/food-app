const mongoose = require("mongoose");
const colors = require("colors")

// function mongodb db connection
const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to db ${mongoose.connection.host}`.bgWhite);
    }catch(error){
        console.log("db error",error);
    }
};

module.exports = connectDb