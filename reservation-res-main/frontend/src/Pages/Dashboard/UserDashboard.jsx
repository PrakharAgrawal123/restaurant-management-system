import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Trash2, 
  User as UserIcon, 
  LogOut, 
  Utensils, 
  MapPin, 
  Bell, 
  Edit2, 
  Lock, 
  Search, 
  Star, 
  X, 
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatar: ""
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedResForReview, setSelectedResForReview] = useState(null);
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [ambienceRating, setAmbienceRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  const { user, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  // Stats calculation helper
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    history: 0,
    favBranch: "N/A"
  });

  const fetchMyReservations = async () => {
    try {
      const { data } = await api.get("/reservation/my");
      setReservations(data.reservations);
      calculateStats(data.reservations);
    } catch (error) {
      toast.error("Failed to fetch reservations");
    }
  };

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get("/order/myorders");
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notification/my");
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const calculateStats = (resList) => {
    const total = resList.length;
    
    // Upcoming: Pending or Confirmed
    const upcoming = resList.filter(res => res.status === "Pending" || res.status === "Confirmed").length;
    
    // History: Completed or Cancelled
    const history = resList.filter(res => res.status === "Completed" || res.status === "Cancelled").length;

    // Favorite branch: Calculate mode of branch name
    const branchCounts = {};
    resList.forEach(res => {
      const branchName = res.branch?.name || "N/A";
      branchCounts[branchName] = (branchCounts[branchName] || 0) + 1;
    });
    
    let favBranch = "N/A";
    let maxCount = 0;
    Object.entries(branchCounts).forEach(([name, count]) => {
      if (count > maxCount && name !== "N/A") {
        favBranch = name;
        maxCount = count;
      }
    });

    setStats({ total, upcoming, history, favBranch });
  };

  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await api.put(`/user/reservation/cancel/${id}`);
      toast.success("Reservation cancelled successfully");
      fetchMyReservations();
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel reservation");
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

  // Profile management functions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/user/me/update", profileData);
      setUser(data.user);
      toast.success("Profile updated successfully!");
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/password/update", passwordData);
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Review handlers
  const openReviewModal = (res) => {
    setSelectedResForReview(res);
    setFoodRating(5);
    setServiceRating(5);
    setAmbienceRating(5);
    setFeedbackText("");
    setShowReviewModal(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/review/new", {
        reservationId: selectedResForReview._id,
        foodRating,
        serviceRating,
        ambienceRating,
        feedback: feedbackText
      });
      toast.success("Thank you for your review!");
      setShowReviewModal(false);
      fetchMyReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  // Notifications read handlers
  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notification/read/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.put("/notification/readall");
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  useEffect(() => {
    fetchMyReservations();
    fetchMyOrders();
    fetchNotifications();

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  // Search & Filter filterings
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.branch?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.table?.tableNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && res.status === statusFilter;
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="profile-section">
          <div className="avatar-container">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="avatar" className="avatar-image" />
            ) : (
              <div className="avatar-fallback">
                <UserIcon size={36} />
              </div>
            )}
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <span className="badge-status confirmed" style={{textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px"}}>
            {user?.role}
          </span>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={activeTab === "overview" ? "active" : ""} 
            onClick={() => setActiveTab("overview")}
          >
            <ClipboardList size={18} /> Overview
          </button>
          <button 
            className={activeTab === "history" ? "active" : ""} 
            onClick={() => setActiveTab("history")}
          >
            <Calendar size={18} /> My Bookings
          </button>
          <button 
            className={activeTab === "orders" ? "active" : ""} 
            onClick={() => setActiveTab("orders")}
          >
            <Utensils size={18} /> My Orders
          </button>
          <button 
            className={activeTab === "profile" ? "active" : ""} 
            onClick={() => setActiveTab("profile")}
          >
            <Edit2 size={18} /> Edit Profile
          </button>
          <button 
            className={activeTab === "notifications" ? "active" : ""} 
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={18} /> Notifications
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="notification-badge" style={{background: "#ff4757", color: "#fff", padding: "2px 6px", borderRadius: "50%", fontSize: "0.75rem", fontWeight: "bold"}}>
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        
        {/* Tab 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="welcome-banner">
              <h2>Welcome Back, {user?.name}!</h2>
              <p>Ready for your next dining adventure? Manage your bookings and feedback below.</p>
            </div>

            {/* Counters */}
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon"><Calendar size={24} /></div>
                <div className="stat-info">
                  <h3>{stats.total}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon"><Clock size={24} /></div>
                <div className="stat-info">
                  <h3>{stats.upcoming}</h3>
                  <p>Upcoming</p>
                </div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon"><CheckCircle2 size={24} /></div>
                <div className="stat-info">
                  <h3>{stats.history}</h3>
                  <p>Past Dining</p>
                </div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon"><MapPin size={24} /></div>
                <div className="stat-info">
                  <h3 style={{fontSize: "1.2rem", fontWeight: "bold", wordBreak: "break-all"}}>{stats.favBranch}</h3>
                  <p>Fav Branch</p>
                </div>
              </div>
            </div>

            {/* Section Split: Timeline & Quick Actions */}
            <div className="dashboard-section-split">
              <div className="timeline-card">
                <h3>Reservation Timeline</h3>
                <div className="timeline">
                  {reservations.length > 0 ? (
                    reservations.slice(0, 4).map((res) => (
                      <div key={res._id} className={`timeline-item ${res.status.toLowerCase()}`}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <h4>{res.branch?.name} - Table #{res.table?.tableNumber || "N/A"}</h4>
                          <p>{res.date} at {res.time} • {res.numberOfGuests} Guests</p>
                          <span className={`badge-status ${res.status.toLowerCase()}`} style={{fontSize: "0.75rem", padding: "2px 8px", marginTop: "5px"}}>
                            {res.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{color: "var(--secondary-text)"}}>No reservation history found. Make your first reservation today!</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="profile-card" style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <div>
                  <h3>Quick Actions</h3>
                  <p style={{color: "var(--secondary-text)", marginBottom: "20px"}}>Make changes or place requests instantly.</p>
                  <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                    <button onClick={() => navigate("/")} className="save-profile-btn" style={{background: "var(--text-color)", color: "var(--bg-color)"}}>
                      Book a New Table
                    </button>
                    <button onClick={() => navigate("/menu")} className="save-profile-btn" style={{background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-color)", color: "var(--text-color)"}}>
                      Explore Menu & Order
                    </button>
                  </div>
                </div>
                <div style={{marginTop: "30px", borderTop: "1px solid var(--border-color)", paddingTop: "20px"}}>
                  <h4 style={{marginBottom: "10px"}}>Account Status</h4>
                  <div style={{display: "flex", alignItems: "center", gap: "10px", color: "var(--secondary-text)", fontSize: "0.9rem"}}>
                    <CheckCircle2 size={16} className="text-green" style={{color: "#2ecc71"}} /> Active & Verified Customer
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: BOOKINGS LIST (WITH SEARCH, FILTER AND REVIEWS) */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="welcome-banner" style={{padding: "25px 40px", marginBottom: "30px"}}>
              <h2>My Reservations</h2>
              <p>Browse your full booking history, track status, or submit feedback.</p>
            </div>

            <div className="search-filter-bar">
              <div className="search-input-wrapper">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search by Branch, Table number or Booking ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="dashboard-table-card">
              {filteredReservations.length > 0 ? (
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Branch</th>
                      <th>Date / Time</th>
                      <th>Table</th>
                      <th>Guests</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((res) => (
                      <tr key={res._id}>
                        <td style={{fontFamily: "monospace", fontSize: "0.9rem"}}>#{res._id.slice(-6).toUpperCase()}</td>
                        <td>
                          <strong>{res.branch?.name}</strong>
                          <div style={{fontSize: "0.8rem", color: "var(--secondary-text)"}}>{res.branch?.location}</div>
                        </td>
                        <td>
                          <div>{res.date}</div>
                          <div style={{fontSize: "0.8rem", color: "var(--secondary-text)"}}>{res.time}</div>
                        </td>
                        <td>Table {res.table?.tableNumber || "N/A"}</td>
                        <td>{res.numberOfGuests}</td>
                        <td>
                          <span className={`badge-status ${res.status.toLowerCase()}`}>
                            {res.status}
                          </span>
                        </td>
                        <td>
                          {res.status === "Pending" && (
                            <button 
                              onClick={() => cancelReservation(res._id)}
                              className="review-action-btn"
                              style={{color: "#ff4757", borderColor: "#ff4757"}}
                            >
                              <Trash2 size={14} style={{display: "inline", marginRight: "4px"}} /> Cancel
                            </button>
                          )}
                          {res.status === "Completed" && (
                            <button 
                              onClick={() => openReviewModal(res)}
                              className="review-action-btn"
                              style={{color: "#2ecc71", borderColor: "#2ecc71"}}
                            >
                              <MessageSquare size={14} style={{display: "inline", marginRight: "4px"}} /> Rate & Review
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="dashboard-empty-state">
                  <AlertCircle size={48} style={{color: "var(--secondary-text)", marginBottom: "15px"}} />
                  <p>No reservations matching your search.</p>
                  <button onClick={() => { setSearchQuery(""); setStatusFilter("All"); }}>Reset Filters</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 3: MY ORDERS */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="welcome-banner" style={{padding: "25px 40px", marginBottom: "30px"}}>
              <h2>Food Order History</h2>
              <p>Track your dine-in, delivery, or takeaway orders.</p>
            </div>

            <div className="dashboard-table-card">
              {orders.length > 0 ? (
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Branch</th>
                      <th>Items Ordered</th>
                      <th>Total Amount</th>
                      <th>Order Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td style={{fontFamily: "monospace"}}>#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.branch?.name}</td>
                        <td>
                          <div style={{fontSize: "0.9rem"}}>
                            {order.items.map((item, idx) => (
                              <div key={idx}>{item.quantity}x {item.name}</div>
                            ))}
                          </div>
                        </td>
                        <td><strong>${order.totalAmount.toFixed(2)}</strong></td>
                        <td>{order.orderType || "Dine-in"}</td>
                        <td>
                          <span className={`badge-status ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="dashboard-empty-state">
                  <Utensils size={48} style={{color: "var(--secondary-text)", marginBottom: "15px"}} />
                  <p>You haven't ordered any food yet.</p>
                  <button onClick={() => navigate("/menu")}>Explore Menu</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 4: EDIT PROFILE */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="profile-edit-grid">
              
              {/* Profile Details Card */}
              <div className="profile-card">
                <h3>Personal Information</h3>
                <p style={{color: "var(--secondary-text)", marginBottom: "25px"}}>Update your identity and contact info.</p>
                <form onSubmit={handleProfileUpdate}>
                  <div className="avatar-upload-box">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="avatar preview" />
                    ) : (
                      <div className="avatar-fallback" style={{width: "80px", height: "80px", fontSize: "2rem"}}>
                        <UserIcon size={28} />
                      </div>
                    )}
                    <div>
                      <label className="avatar-upload-btn">
                        Upload Image
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarChange} 
                          style={{display: "none"}}
                        />
                      </label>
                      <p style={{fontSize: "0.75rem", color: "var(--secondary-text)", marginTop: "6px"}}>JPG, PNG. Max size 5MB.</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      value={profileData.phoneNumber} 
                      onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea 
                      rows="3"
                      value={profileData.address} 
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                    />
                  </div>
                  <button type="submit" className="save-profile-btn">Save Profile Updates</button>
                </form>
              </div>

              {/* Password Card */}
              <div className="profile-card" style={{height: "fit-content"}}>
                <h3>Change Password</h3>
                <p style={{color: "var(--secondary-text)", marginBottom: "25px"}}>Ensure your account stays secure.</p>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="save-profile-btn" style={{background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-color)"}}>
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="notifications-header">
              <div>
                <h2>In-App Notifications</h2>
                <p style={{color: "var(--secondary-text)"}}>Stay up-to-date with your booking statuses.</p>
              </div>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <button className="mark-all-read-btn" onClick={markAllNotificationsAsRead}>
                  <CheckCircle2 size={16} /> Mark all as read
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    className={`notification-item ${!n.isRead ? "unread" : ""}`}
                    onClick={() => !n.isRead && markNotificationAsRead(n._id)}
                    style={{cursor: !n.isRead ? "pointer" : "default"}}
                  >
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                    <div className="notification-time">
                      {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <Bell size={48} style={{color: "var(--secondary-text)", marginBottom: "15px"}} />
                  <p>You have no notifications yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Review & Feedback Rating Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="review-modal-overlay">
            <motion.div 
              className="review-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="review-modal-header">
                <h3>Submit Review</h3>
                <button className="close-modal-btn" onClick={() => setShowReviewModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <p style={{color: "var(--secondary-text)", marginBottom: "20px"}}>
                Rate your dining experience at <strong>{selectedResForReview?.branch?.name}</strong>.
              </p>
              
              <form onSubmit={submitReview}>
                
                {/* Food Rating */}
                <div className="rating-stars-row">
                  <span>Food Quality</span>
                  <div className="stars-list">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={20} 
                        fill={star <= foodRating ? "#ffbb28" : "none"} 
                        stroke={star <= foodRating ? "#ffbb28" : "var(--secondary-text)"}
                        onClick={() => setFoodRating(star)}
                      />
                    ))}
                  </div>
                </div>

                {/* Service Rating */}
                <div className="rating-stars-row">
                  <span>Service Quality</span>
                  <div className="stars-list">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={20} 
                        fill={star <= serviceRating ? "#ffbb28" : "none"} 
                        stroke={star <= serviceRating ? "#ffbb28" : "var(--secondary-text)"}
                        onClick={() => setServiceRating(star)}
                      />
                    ))}
                  </div>
                </div>

                {/* Ambience Rating */}
                <div className="rating-stars-row">
                  <span>Ambience & Vibe</span>
                  <div className="stars-list">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={20} 
                        fill={star <= ambienceRating ? "#ffbb28" : "none"} 
                        stroke={star <= ambienceRating ? "#ffbb28" : "var(--secondary-text)"}
                        onClick={() => setAmbienceRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{marginTop: "20px"}}>
                  <label>Feedback & Comments</label>
                  <textarea 
                    rows="4" 
                    placeholder="Tell us what you liked or how we can improve..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="save-profile-btn" style={{marginTop: "10px"}}>Submit Feedback</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
