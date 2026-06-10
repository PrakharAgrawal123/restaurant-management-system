import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  LayoutDashboard,
  LogOut,
  Trash2,
  Utensils,
  MapPin,
  BarChart2,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminAnalytics from "./AdminAnalytics";
import ManageOrders from "./ManageOrders";
import ManageBranches from "./ManageBranches";
import CalendarView from "../../components/CalendarView";
import ManageReviews from "../../components/ManageReviews";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const { user, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const resData = await api.get("/reservation/admin/all");
      setReservations(resData.data.reservations);

      const statsData = await api.get("/analytics/admin/stats");
      setStats(statsData.data.stats);
    } catch (error) {
      toast.error("Failed to fetch admin data");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(
        `/reservation/admin/update/${id}`,
        { status }
      );
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleLogout = async () => {
    try {
      await api.get("/user/logout");
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <TrendingUp size={24} />
          <span>Admin Portal</span>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>
            <BarChart2 size={20} /> Analytics
          </button>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            <Utensils size={20} /> Food Orders
          </button>
          <button className={activeTab === "branches" ? "active" : ""} onClick={() => setActiveTab("branches")}>
            <MapPin size={20} /> Branches
          </button>
          <button className={activeTab === "calendar" ? "active" : ""} onClick={() => setActiveTab("calendar")}>
            <Calendar size={20} /> Booking Calendar
          </button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
            <MessageSquare size={20} /> Reviews
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-profile">
            <span>Welcome, <strong>{user?.name}</strong></span>
          </div>
        </header>

        {activeTab === "overview" && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <p>Reservations</p>
                  <h3>{stats.totalReservations || 0}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <Utensils size={24} />
                </div>
                <div className="stat-info">
                  <p>Total Orders</p>
                  <h3>{stats.totalOrders || 0}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <p>Revenue</p>
                  <h3>${stats.totalRevenue?.toFixed(2) || "0.00"}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <p>Total Users</p>
                  <h3>{stats.totalUsers || 0}</h3>
                </div>
              </div>
            </section>

            <section className="reservations-section">
              <h2>Recent Reservations</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Branch</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.slice(0, 5).map((res) => (
                      <tr key={res._id}>
                        <td>
                          <div className="user-cell">
                            <strong>{res.firstName} {res.lastName}</strong>
                            <span>{res.email}</span>
                          </div>
                        </td>
                        <td>{res.branch?.name || "N/A"}</td>
                        <td>{res.date}</td>
                        <td>{res.time}</td>
                        <td>
                          <span className={`status-badge ${res.status.toLowerCase()}`}>
                            {res.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <select 
                              value={res.status} 
                              onChange={(e) => updateStatus(res._id, e.target.value)}
                              className="status-dropdown-update"
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid var(--border-color)",
                                background: "transparent",
                                color: "var(--text-color)"
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "orders" && <ManageOrders />}
        {activeTab === "branches" && <ManageBranches />}
        {activeTab === "calendar" && <CalendarView reservations={reservations} onUpdateStatus={updateStatus} />}
        {activeTab === "reviews" && <ManageReviews />}
      </main>
    </div>
  );
};

export default AdminDashboard;
