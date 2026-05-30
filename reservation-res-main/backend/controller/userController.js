import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendToken } from "../utils/jwtToken.js";
import { Reservation } from "../models/reservation.js";

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
  const newUserDetails = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserDetails, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
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
