import ErrorHandler from "../middlewares/error.js";
import { Branch } from "../models/branch.js";

// Create Branch (Admin)
export const createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({
      success: true,
      branch,
    });
  } catch (error) {
    return next(error);
  }
};

// Get All Branches
export const getAllBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    res.status(200).json({
      success: true,
      branches,
    });
  } catch (error) {
    return next(error);
  }
};

// Update Branch (Admin)
export const updateBranch = async (req, res, next) => {
  try {
    let branch = await Branch.findById(req.params.id);
    if (!branch) {
      return next(new ErrorHandler("Branch not found", 404));
    }
    branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      branch,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete Branch (Admin)
export const deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return next(new ErrorHandler("Branch not found", 404));
    }
    await branch.deleteOne();
    res.status(200).json({
      success: true,
      message: "Branch Deleted Successfully",
    });
  } catch (error) {
    return next(error);
  }
};
