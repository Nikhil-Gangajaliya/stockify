// express setup

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:3000"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 

import userRouter from "./routes/user.routes.js";
import storeRouter from "./routes/store.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/stores", storeRouter);


export { app };   