import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import { User } from "../models/user.js";
import { createNotification } from "./notificationController.js";

// Get All Reservations (Admin)
export const getAllReservations = async (req, res, next) => {
  const reservations = await Reservation.find().populate("user", "name email");

  res.status(200).json({
    success: true,
    reservations,
  });
};

// Update Reservation Status (Admin)
export const updateReservationStatus = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }

    reservation.status = req.body.status;
    await reservation.save();

    // Send in-app notification
    await createNotification(
      reservation.user,
      "Reservation Status: " + reservation.status,
      `Your reservation for ${reservation.date} at ${reservation.time} has been updated to ${reservation.status}.`
    );

    res.status(200).json({
      success: true,
      message: "Reservation Status Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Reservation (Admin)
export const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }

    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      message: "Reservation Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users (Admin)
export const getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
};

// Get Dashboard Stats (Admin)
export const getDashboardStats = async (req, res, next) => {
  const totalReservations = await Reservation.countDocuments();
  const pendingReservations = await Reservation.countDocuments({ status: "Pending" });
  const confirmedReservations = await Reservation.countDocuments({ status: "Confirmed" });
  const totalUsers = await User.countDocuments({ role: "user" });

  res.status(200).json({
    success: true,
    stats: {
      totalReservations,
      pendingReservations,
      confirmedReservations,
      totalUsers,
    },
  });
};
