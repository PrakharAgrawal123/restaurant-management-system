import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Users, Calendar, Utensils, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/analytics/admin/stats", {
          withCredentials: true,
        });
        setStats(data.stats);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;
  if (!stats) return <div>No data available</div>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="analytics-container">
      <h2 className="section-title">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users"><Users /></div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon reservations"><Calendar /></div>
          <div className="stat-content">
            <h3>Reservations</h3>
            <p>{stats.totalReservations}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders"><Utensils /></div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue"><DollarSign /></div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p>${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-item">
          <h3>Reservation Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.reservationStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.reservationStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Peak Booking Timings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.peakTimings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
