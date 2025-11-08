const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async()=>{
    try {
     const connectionInstance =   await mongoose.connect(`${process.env.MONGO_URI}/OpiRaj-PH-B12A10`)
     console.log(`mongodb connected , DBHost: ${connectionInstance.connection.host}`)
    } 
    catch (error) {
       console.log("error", error) 
    }
}
module.exports = connectDB