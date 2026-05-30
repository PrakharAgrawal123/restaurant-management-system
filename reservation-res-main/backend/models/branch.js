import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Branch name is required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Branch location is required"],
  },
  address: {
    type: String,
    required: [true, "Branch address is required"],
  },
  phone: {
    type: String,
    required: [true, "Branch phone number is required"],
  },
  email: {
    type: String,
    required: [true, "Branch email is required"],
  },
  openingHours: {
    type: String,
    default: "09:00 AM - 11:00 PM",
  },
  image: {
    type: String, // URL to branch image
  },
}, { timestamps: true });

export const Branch = mongoose.model("Branch", branchSchema);
