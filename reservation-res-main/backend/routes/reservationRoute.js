import express from "express";
import {
    send_reservation,
    getAllReservations,
    getMyReservations,
    updateReservationStatus
} from "../controller/reservation.js";

import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", isAuthenticated, send_reservation);

router.get("/my", isAuthenticated, getMyReservations);

router.get(
    "/admin/all",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllReservations
);

router.put(
    "/admin/update/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    updateReservationStatus
);

export default router;