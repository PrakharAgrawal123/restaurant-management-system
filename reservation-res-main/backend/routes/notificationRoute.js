import express from "express";
import { getMyNotifications, markAsRead, markAllAsRead } from "../controller/notificationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/my", isAuthenticated, getMyNotifications);
router.put("/read/:id", isAuthenticated, markAsRead);
router.put("/readall", isAuthenticated, markAllAsRead);

export default router;
