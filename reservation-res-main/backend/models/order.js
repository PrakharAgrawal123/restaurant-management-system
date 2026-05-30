import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: true,
  },
  reservation: {
    type: mongoose.Schema.ObjectId,
    ref: "Reservation",
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.ObjectId,
        ref: "Menu",
        required: true,
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Served", "Cancelled", "Completed"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  orderType: {
    type: String,
    enum: ["Dine-in", "Takeaway", "Delivery"],
    default: "Dine-in",
  },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
