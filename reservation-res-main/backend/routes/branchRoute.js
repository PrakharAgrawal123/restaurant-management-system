import express from "express";

import {
  createBranch,
  getAllBranches,
  updateBranch,
  deleteBranch,
} from "../controller/branchController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", getAllBranches);

router.post(
  "/new",
  isAuthenticated,
  authorizeRoles("admin"),
  createBranch
);

router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateBranch
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBranch
);

export default router;