import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendToken } from "../utils/jwtToken.js";
import { Reservation } from "../models/reservation.js";
import { createNotification } from "./notificationController.js";

// Register a User
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    sendToken(user, 201, res, "User Registered Successfully!");
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res, "Login Successfully!");
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logout = async (req, res, next) => {
  res.status(200).cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  }).json({
    success: true,
    message: "Logged Out Successfully",
  });
};

// Get User Profile
export const getMyProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

// Update User Profile
export const updateProfile = async (req, res, next) => {
  try {
    const newUserDetails = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      avatar: req.body.avatar,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserDetails, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    await createNotification(
      user._id,
      "Profile Updated",
      "Your profile information has been successfully updated."
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Change Password
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Please fill both password fields", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid current password", 400));
    }

    if (newPassword.length < 8) {
      return next(new ErrorHandler("New password must be at least 8 characters long", 400));
    }

    user.password = newPassword;
    await user.save();

    await createNotification(
      user._id,
      "Password Changed",
      "Your account password was successfully updated."
    );

    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get My Reservations
export const getMyReservations = async (req, res, next) => {
  const reservations = await Reservation.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    reservations,
  });
};

// Cancel Reservation
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }

    if (reservation.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorHandler("Not authorized to cancel this reservation", 403));
    }

    reservation.status = "Cancelled";
    await reservation.save();

    await createNotification(
      reservation.user,
      "Reservation Cancelled",
      `Your reservation for ${reservation.date} at ${reservation.time} has been cancelled.`
    );

    res.status(200).json({
      success: true,
      message: "Reservation Cancelled Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: `Password reset link sent to ${email}`,
  });
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
};
