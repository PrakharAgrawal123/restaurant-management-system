import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Calendar, Clock, Trash2, User as UserIcon, LogOut, Utensils, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const fetchMyReservations = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/reservation/my",
        { withCredentials: true }
      );
      setReservations(data.reservations);
    } catch (error) {
      toast.error("Failed to fetch reservations");
    }
  };

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/order/myorders",
        { withCredentials: true }
      );
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    try {
      await axios.put(
        `http://localhost:5000/api/v1/reservation/admin/update/${id}`,
        { status: "Cancelled" },
        { withCredentials: true }
      );
      toast.success("Reservation cancelled");
      fetchMyReservations();
    } catch (error) {
      toast.error("Failed to cancel reservation");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    fetchMyReservations();
    fetchMyOrders();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="profile-section">
          <div className="avatar">
            <UserIcon size={40} />
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={activeTab === "reservations" ? "active" : ""} 
            onClick={() => setActiveTab("reservations")}
          >
            My Reservations
          </button>
          <button 
            className={activeTab === "orders" ? "active" : ""} 
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>

      <main className="dashboard-content">
        <header className="content-header">
          <h1>{activeTab === "reservations" ? "My Reservations" : "My Orders"}</h1>
          <p>{activeTab === "reservations" ? "Manage your upcoming dining experiences" : "Track your delicious meals"}</p>
        </header>

        <div className="reservations-grid">
          {activeTab === "reservations" ? (
            reservations.length > 0 ? (
              reservations.map((res) => (
                <motion.div 
                  key={res._id} 
                  className="reservation-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className={`card-status ${res.status.toLowerCase()}`}>
                    {res.status}
                  </div>
                  <div className="card-body">
                    <div className="info-item">
                      <MapPin size={18} />
                      <span>{res.branch?.name}</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={18} />
                      <span>{res.date}</span>
                    </div>
                    <div className="info-item">
                      <Clock size={18} />
                      <span>{res.time}</span>
                    </div>
                    <div className="guest-info">
                      <p>{res.numberOfGuests} Guests</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    {res.status === "Pending" && (
                      <button 
                        onClick={() => cancelReservation(res._id)}
                        className="cancel-btn"
                      >
                        <Trash2 size={16} /> Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <p>You have no reservations yet.</p>
                <button onClick={() => navigate("/")}>Book Now</button>
              </div>
            )
          ) : (
            orders.length > 0 ? (
              orders.map((order) => (
                <motion.div 
                  key={order._id} 
                  className="reservation-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className={`card-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                  <div className="card-body">
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <p>You have no orders yet.</p>
                <button onClick={() => navigate("/")}>Explore Menu</button>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
