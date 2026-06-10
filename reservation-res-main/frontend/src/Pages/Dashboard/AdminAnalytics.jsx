import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { Users, Calendar, Utensils, DollarSign, Award, Percent } from "lucide-react";
import toast from "react-hot-toast";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/analytics/admin/stats");
        setStats(data.stats);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlignment: "center" }}>Loading Analytics Dashboard...</div>;
  if (!stats) return <div style={{ padding: "40px", textAlignment: "center" }}>No data available</div>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const GRADIENT_COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="analytics-container" style={{ padding: "20px 0" }}>
      <h2 className="section-title" style={{ marginBottom: "25px" }}>Business Analytics Dashboard</h2>
      
      {/* Metrics Row */}
      <div className="stats-grid" style={{ marginBottom: "40px" }}>
        <div className="stat-card blue">
          <div className="stat-icon"><Users /></div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><Calendar /></div>
          <div className="stat-content">
            <h3>{stats.totalReservations}</h3>
            <p>Total Reservations</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><Utensils /></div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><DollarSign /></div>
          <div className="stat-content">
            <h3>${stats.totalRevenue?.toFixed(2) || "0.00"}</h3>
            <p>Revenue Generated</p>
          </div>
        </div>
      </div>

      {/* Charts Layout Grids */}
      <div className="charts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" }}>
        
        {/* Chart 1: Monthly Reservations */}
        <div className="chart-item" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "25px", borderRadius: "18px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Monthly Reservations Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.monthlyReservations}>
              <defs>
                <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" stroke="var(--secondary-text)" />
              <YAxis stroke="var(--secondary-text)" />
              <Tooltip />
              <Area type="monotone" dataKey="Reservations" stroke="#8884d8" fillOpacity={1} fill="url(#colorRes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Customer Growth */}
        <div className="chart-item" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "25px", borderRadius: "18px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Customer Signups Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" stroke="var(--secondary-text)" />
              <YAxis stroke="var(--secondary-text)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Customers" stroke="#82ca9d" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Popular Branches */}
        <div className="chart-item" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "25px", borderRadius: "18px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Most Popular Restaurant Branches</h3>
          {stats.popularBranches?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.popularBranches}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="var(--secondary-text)" />
                <YAxis stroke="var(--secondary-text)" />
                <Tooltip />
                <Bar dataKey="bookings" fill="#FF8042" radius={[10, 10, 0, 0]}>
                  {stats.popularBranches.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary-text)" }}>
              No branch booking data available.
            </div>
          )}
        </div>

        {/* Chart 4: Popular Tables */}
        <div className="chart-item" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "25px", borderRadius: "18px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Most Reserved Tables</h3>
          {stats.popularTables?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.popularTables}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.popularTables.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary-text)" }}>
              No table booking data available.
            </div>
          )}
        </div>

        {/* Chart 5: Reservation Status */}
        <div className="chart-item" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "25px", borderRadius: "18px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Reservation Status Distribution</h3>
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

        {/* Chart 6: Peak Booking Timings */}
        <div className="chart-item" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", padding: "25px", borderRadius: "18px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "1.1rem" }}>Peak Booking Timings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.peakTimings}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="_id" stroke="var(--secondary-text)" />
              <YAxis stroke="var(--secondary-text)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Bookings" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
