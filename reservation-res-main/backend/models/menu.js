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
    enum: ["Appetizers", "Main Course", "Desserts", "Beverages", "Sides", "Breakfast", "Lunch", "Dinner"],
  },
  image: {
    type: String,
    required: [true, "Item image URL is required"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  prepTime: {
    type: String,
    default: "20 mins",
  },
  calories: {
    type: Number,
    default: 350,
  },
  ingredients: {
    type: [String],
    default: [],
  },
  nutritionalInfo: {
    protein: { type: String, default: "15g" },
    fat: { type: String, default: "10g" },
    carbs: { type: String, default: "30g" },
    fiber: { type: String, default: "4g" },
  },
  chefRecommendation: {
    type: String,
    default: "Pairs beautifully with clean herbal teas or a fresh lime beverage.",
  },
  servingSize: {
    type: String,
    default: "1 serving",
  },
  allergens: {
    type: [String],
    default: [],
  },
  reviews: [
    {
      username: { type: String },
      rating: { type: Number },
      comment: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
  aboutDish: {
    type: String,
    default: "",
  },
  whyLove: {
    type: String,
    default: "",
  },
  chefNotes: {
    type: String,
    default: "",
  },
  tag: {
    type: String,
    enum: ["None", "Trending", "Chef Recommended", "Best Seller", "New Arrival"],
    default: "None",
  },
}, { timestamps: true });

export const Menu = mongoose.model("Menu", menuSchema);
