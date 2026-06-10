import { Notification } from "../models/notification.js";

// Create Notification Helper (Internal use)
export const createNotification = async (userId, title, message) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

// Get My Notifications
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort("-createdAt");
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// Mark All Notifications as Read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};
