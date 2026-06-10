import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import { Table } from "../models/table.js";
import sendEmail from "../utils/sendEmail.js";
import { createNotification } from "./notificationController.js";

// Send Reservation
export const send_reservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone, branch, numberOfGuests, table } = req.body;
  
  if (!firstName || !lastName || !email || !date || !time || !phone || !branch || !numberOfGuests) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    // Check if table is already booked for that date/time
    if (table) {
      const existingBooking = await Reservation.findOne({
        table,
        date,
        time,
        status: { $in: ["Pending", "Approved"] }
      });

      if (existingBooking) {
        return next(new ErrorHandler("This table is already booked for the selected time.", 400));
      }
    }

    const reservation = await Reservation.create({ 
      firstName, 
      lastName, 
      email, 
      date, 
      time, 
      phone,
      branch,
      numberOfGuests,
      table,
      user: req.user._id 
    });

    // Send in-app notification
    await createNotification(
      req.user._id,
      "Reservation Placed",
      `Your reservation request for ${date} at ${time} has been placed successfully.`
    );

    // Send Confirmation Email
    try {
      await sendEmail({
        email: email,
        subject: "Reservation Received - Restaurant Management",
        message: `Hello ${firstName},\n\nYour reservation request for ${date} at ${time} has been received and is currently Pending approval.\n\nThank you!`,
        html: `<h1>Reservation Received</h1><p>Hello ${firstName},</p><p>Your reservation request for <b>${date}</b> at <b>${time}</b> has been received and is currently <b>Pending</b> approval.</p><p>Thank you!</p>`
      });
    } catch (err) {
      console.log("Email error: ", err);
    }

    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
      reservation
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }
    return next(error);
  }
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
      `Your reservation for ${reservation.date} at ${reservation.time} is now ${reservation.status}.`
    );

    // Send Status Update Email
    try {
      await sendEmail({
        email: reservation.email,
        subject: `Reservation Status Updated: ${reservation.status}`,
        message: `Hello ${reservation.firstName},\n\nYour reservation status has been updated to: ${reservation.status}.\n\nThank you!`,
        html: `<h1>Reservation Status Update</h1><p>Hello ${reservation.firstName},</p><p>Your reservation status has been updated to: <b>${reservation.status}</b>.</p><p>Thank you!</p>`
      });
    } catch (err) {
      console.log("Email error: ", err);
    }

    res.status(200).json({
      success: true,
      message: `Reservation status updated to ${reservation.status}`
    });
  } catch (error) {
    return next(error);
  }
};

// Get All Reservations (Admin)
export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().populate("user branch table").sort("-createdAt");
    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    return next(error);
  }
};

// Get My Reservations
export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).populate("branch table").sort("-createdAt");
    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    return next(error);
  }
};

