//entry point of app

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("Server crashed !", err);
            process.exit(1);
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed!!!", err);
    })