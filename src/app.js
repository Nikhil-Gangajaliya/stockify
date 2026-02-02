// express setup
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:9000"
    ],
    credentials: true
  })
);

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Cookies
app.use(cookieParser());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Optional public folder
app.use(express.static("public"));

// Routes
import userRouter from "./routes/user.routes.js";
import storeRouter from "./routes/store.routes.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import orderRouter from "./routes/order.routes.js";
import invoiceRouter from "./routes/invoice.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/stores", storeRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/dashboard", dashboardRouter);

export { app };
