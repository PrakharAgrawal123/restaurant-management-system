import React, { useState, useEffect } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import TableLayout from "./TableLayout";

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [table, setTable] = useState("");
  
  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/v1/branch/all");
        setBranches(data.branches);
      } catch (error) {
        console.error("Failed to fetch branches");
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    // This is a mock: In a real app, you'd fetch tables based on branch and availability
    // For now, I'll generate some mock tables if a branch is selected
    if (branch) {
      setTables([
        { _id: "t1", tableNumber: "1", capacity: 2, status: "Available" },
        { _id: "t2", tableNumber: "2", capacity: 4, status: "Available" },
        { _id: "t3", tableNumber: "3", capacity: 2, status: "Reserved" },
        { _id: "t4", tableNumber: "4", capacity: 6, status: "Available" },
        { _id: "t5", tableNumber: "5", capacity: 4, status: "Available" },
        { _id: "t6", tableNumber: "6", capacity: 2, status: "Available" },
      ]);
    }
  }, [branch, date, time]);

  const handleReservation = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to make a reservation");
      navigate("/login");
      return;
    }

    if (!branch) {
      toast.error("Please select a branch");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/reservation/send",
        { 
          firstName, 
          lastName, 
          email, 
          phone, 
          date, 
          time, 
          branch, 
          numberOfGuests, 
          table 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      navigate("/success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <motion.div 
          className="banner"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/reservation.png" alt="res" />
        </motion.div>
        <motion.div 
          className="banner"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>Select your branch and table</p>
            <form onSubmit={handleReservation}>
              <div className="form-row">
                <select 
                  value={branch} 
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="branch-select"
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>{b.name} - {b.location}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Guests"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              {branch && date && time && (
                <TableLayout 
                  tables={tables} 
                  selectedTable={table} 
                  onSelectTable={setTable} 
                />
              )}

              <button type="submit" className="submit-reservation">
                RESERVE NOW{" "}
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reservation;
