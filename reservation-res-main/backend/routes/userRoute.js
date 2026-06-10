import express from "express";
import {
  register,
  login,
  logout,
  getMyProfile,
  updateProfile,
  getMyReservations,
  cancelReservation,
  forgotPassword,
  changePassword,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMyProfile);
router.put("/me/update", isAuthenticated, updateProfile);
router.put("/password/update", isAuthenticated, changePassword);
router.get("/myreservations", isAuthenticated, getMyReservations);
router.put("/reservation/cancel/:id", isAuthenticated, cancelReservation);

export default router;
