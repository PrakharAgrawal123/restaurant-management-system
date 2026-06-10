import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    minLength: [3, "Name must be at least 3 characters"],
    maxLength: [30, "Name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
