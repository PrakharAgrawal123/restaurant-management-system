import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorMiddleware } from "./middlewares/error.js";

import reservationRouter from "./routes/reservationRoute.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import branchRouter from "./routes/branchRoute.js";
import menuRouter from "./routes/menuRoute.js";
import orderRouter from "./routes/orderRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import tableRouter from "./routes/tableRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

import { dbConnection } from "./database/dbConnection.js";

const app = express();

dotenv.config({ path: "./config.env" });

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/table", tableRouter);
app.use("/api/v1/notification", notificationRouter);

// Default Route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "RESTAURANT RESERVATION API RUNNING",
  });
});

// Database Connection
dbConnection();

// Error Middleware
app.use(errorMiddleware);

export default app;