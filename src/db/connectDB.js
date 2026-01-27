// db connection

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { log } from "node:console";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected. DB Host : ${conn.connection.host}`);        
    } catch (error) {
        console.log("MongoDB connection failed.", error);
        process.exit(1);
    }
}

export default connectDB;