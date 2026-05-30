import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Item description is required"],
  },
  price: {
    type: Number,
    required: [true, "Item price is required"],
  },
  category: {
    type: String,
    required: [true, "Item category is required"],
    enum: ["Appetizers", "Main Course", "Desserts", "Beverages", "Sides"],
  },
  image: {
    type: String,
    required: [true, "Item image URL is required"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Menu = mongoose.model("Menu", menuSchema);
