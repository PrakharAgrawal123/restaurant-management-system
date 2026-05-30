import express from "express";
import {
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
  getAllUsers,
  getDashboardStats,
} from "../controller/adminController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// All routes here are protected and require Admin role
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/reservations", getAllReservations);
router.put("/reservation/:id", updateReservationStatus);
router.delete("/reservation/:id", deleteReservation);
router.get("/users", getAllUsers);
router.get("/stats", getDashboardStats);

export default router;
