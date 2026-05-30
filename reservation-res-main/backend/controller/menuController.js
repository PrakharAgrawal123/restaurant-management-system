import ErrorHandler from "../middlewares/error.js";
import { Menu } from "../models/menu.js";

// Create Menu Item (Admin)
export const createMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.create(req.body);
    res.status(201).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    return next(error);
  }
};

// Get All Menu Items
export const getAllMenuItems = async (req, res, next) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json({
      success: true,
      menuItems,
    });
  } catch (error) {
    return next(error);
  }
};

// Update Menu Item (Admin)
export const updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return next(new ErrorHandler("Menu Item not found", 404));
    }
    menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete Menu Item (Admin)
export const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return next(new ErrorHandler("Menu Item not found", 404));
    }
    await menuItem.deleteOne();
    res.status(200).json({
      success: true,
      message: "Menu Item Deleted Successfully",
    });
  } catch (error) {
    return next(error);
  }
};
