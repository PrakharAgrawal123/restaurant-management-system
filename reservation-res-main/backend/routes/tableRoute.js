import express from "express";
import { getTablesByBranchAndAvailability, createTable } from "../controller/tableController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/branch/:branchId", getTablesByBranchAndAvailability);
router.post("/new", isAuthenticated, authorizeRoles("admin"), createTable);

export default router;
