import express from "express";

import {
  createMenuItem,
  getAllMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from "../controller/menuController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", getAllMenuItems);

router.post(
  "/new",
  isAuthenticated,
  authorizeRoles("admin"),
  createMenuItem
);

router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateMenuItem
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteMenuItem
);

export default router;