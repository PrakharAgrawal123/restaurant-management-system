import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  reservation: {
    type: mongoose.Schema.ObjectId,
    ref: "Reservation",
    required: true,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: true,
  },
  foodRating: {
    type: Number,
    required: [true, "Food rating is required"],
    min: 1,
    max: 5,
  },
  serviceRating: {
    type: Number,
    required: [true, "Service rating is required"],
    min: 1,
    max: 5,
  },
  ambienceRating: {
    type: Number,
    required: [true, "Ambience rating is required"],
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    required: [true, "Feedback comment is required"],
  },
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
