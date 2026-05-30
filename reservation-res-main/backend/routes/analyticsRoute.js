import express from "express";

import {
    getAdminAnalytics,
} from "../controller/analyticsController.js";

import {
    isAuthenticated,
    authorizeRoles,
} from "../middlewares/auth.js";

const router = express.Router();

router.get(
    "/admin/stats",
    isAuthenticated,
    authorizeRoles("admin"),
    getAdminAnalytics
);

export default router;