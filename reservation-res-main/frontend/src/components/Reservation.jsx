import React, { useState, useEffect } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import api from "../utils/api";
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
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      setBranchesError(false);
      const { data } = await api.get("/branch/all");
      setBranches(data.branches);
    } catch (error) {
      console.error("Failed to fetch branches", error);
      setBranchesError(true);
      toast.error("Failed to load restaurant branches.");
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      if (branch && date && time) {
        try {
          setTablesLoading(true);
          const { data } = await api.get(`/table/branch/${branch}?date=${date}&time=${time}`);
          setTables(data.tables);
        } catch (error) {
          console.error("Failed to fetch tables", error);
          toast.error("Failed to load table layout.");
        } finally {
          setTablesLoading(false);
        }
      } else {
        setTables([]);
      }
    };
    fetchTables();
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
      const { data } = await api.post(
        "/reservation/send",
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
                  {branchesLoading ? (
                    <option value="">Loading branches...</option>
                  ) : branchesError ? (
                    <option value="">Error loading branches. Click to reload.</option>
                  ) : (
                    <>
                      <option value="">Select Branch</option>
                      {branches.map(b => (
                        <option key={b._id} value={b._id}>{b.name} - {b.location}</option>
                      ))}
                    </>
                  )}
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
