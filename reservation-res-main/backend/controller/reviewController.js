import { Review } from "../models/review.js";
import { Reservation } from "../models/reservation.js";
import ErrorHandler from "../middlewares/error.js";

// Create Review
export const createReview = async (req, res, next) => {
  const { reservationId, foodRating, serviceRating, ambienceRating, feedback } = req.body;

  try {
    if (!reservationId || !foodRating || !serviceRating || !ambienceRating || !feedback) {
      return next(new ErrorHandler("Please fill all review fields", 400));
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }

    // Check if reservation is Completed
    if (reservation.status !== "Completed") {
      return next(new ErrorHandler("You can only review completed reservations.", 400));
    }

    // Check ownership
    if (reservation.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to review this reservation.", 403));
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ reservation: reservationId });
    if (existingReview) {
      return next(new ErrorHandler("You have already reviewed this reservation.", 400));
    }

    const review = await Review.create({
      user: req.user._id,
      reservation: reservationId,
      branch: reservation.branch,
      foodRating,
      serviceRating,
      ambienceRating,
      feedback,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback!",
      review,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Reviews
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email avatar")
      .populate("branch", "name location")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Review (Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
