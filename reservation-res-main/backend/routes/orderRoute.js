import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controller/orderController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/new",
  isAuthenticated,
  createOrder
);

router.get(
  "/myorders",
  isAuthenticated,
  getMyOrders
);

router.get(
  "/admin/all",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

router.put(
  "/admin/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrderStatus
);

export default router;