import React, { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        "/user/register",
        { name, email, password, role }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      await fetchUser();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <UserPlus size={40} className="auth-icon" />
          <h1>Create Account</h1>
          <p>Join us for the best dining experience</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <User size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Password (Min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
