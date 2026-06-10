import express from "express";
import { createReview, getAllReviews, deleteReview } from "../controller/reviewController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createReview);
router.get("/all", getAllReviews);
router.delete("/delete/:id", isAuthenticated, authorizeRoles("admin"), deleteReview);

export default router;
