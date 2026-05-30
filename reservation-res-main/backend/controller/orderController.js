import ErrorHandler from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Menu } from "../models/menu.js";

// Create New Order
export const createOrder = async (req, res, next) => {
  const { branch, reservation, items, orderType } = req.body;

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem) {
        return next(new ErrorHandler(`Menu item not found with id: ${item.menuItem}`, 404));
      }
      totalAmount += menuItem.price * item.quantity;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      branch,
      reservation,
      items: orderItems,
      totalAmount,
      orderType,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(error);
  }
};

// Get My Orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("branch").sort("-createdAt");
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(error);
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user branch").sort("-createdAt");
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(error);
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Status Updated",
    });
  } catch (error) {
    return next(error);
  }
};
