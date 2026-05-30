import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: [true, "Table number is required"],
  },
  capacity: {
    type: Number,
    required: [true, "Table capacity is required"],
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Occupied", "Reserved", "Maintenance"],
    default: "Available",
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
}, { timestamps: true });

export const Table = mongoose.model("Table", tableSchema);
