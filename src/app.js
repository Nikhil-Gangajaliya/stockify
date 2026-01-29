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
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import orderRouter from "./routes/order.routes.js";
import invoiceRouter from "./routes/invoice.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/stores", storeRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/dashboard", dashboardRouter);

export { app };   