import React, { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Key } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/password/forgot", { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-header">
          <Key size={40} className="auth-icon" />
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleForgot}>
          <div className="input-group">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
