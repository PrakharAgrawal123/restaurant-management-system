import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Star, Trash2, MessageSquare, AlertCircle } from "lucide-react";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/review/all");
      setReviews(data.reviews);
      setFilteredReviews(data.reviews);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await api.delete(`/review/delete/${id}`);
        toast.success("Review deleted successfully");
        fetchReviews();
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  // Filter reviews
  useEffect(() => {
    let result = reviews;

    // Filter by Rating (using average of food, service, ambience ratings)
    if (ratingFilter !== "All") {
      const targetRating = parseInt(ratingFilter);
      result = result.filter((r) => {
        const avg = Math.round((r.foodRating + r.serviceRating + r.ambienceRating) / 3);
        return avg === targetRating;
      });
    }

    // Filter by Branch name
    if (branchFilter !== "All") {
      result = result.filter((r) => r.branch?.name === branchFilter);
    }

    setFilteredReviews(result);
  }, [ratingFilter, branchFilter, reviews]);

  // Unique branches for dropdown filter
  const uniqueBranches = Array.from(
    new Set(reviews.map((r) => r.branch?.name).filter(Boolean))
  );

  const renderStars = (rating) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            size={14} 
            fill={s <= rating ? "#ffbb28" : "none"} 
            stroke={s <= rating ? "#ffbb28" : "var(--secondary-text)"}
          />
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading Reviews...</div>;

  return (
    <div className="manage-reviews-container">
      <h2>Manage Customer Reviews</h2>
      
      <div className="calendar-filters" style={{ margin: "20px 0" }}>
        <select 
          value={ratingFilter} 
          onChange={(e) => setRatingFilter(e.target.value)}
          className="calendar-filter-select"
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select 
          value={branchFilter} 
          onChange={(e) => setBranchFilter(e.target.value)}
          className="calendar-filter-select"
        >
          <option value="All">All Branches</option>
          {uniqueBranches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="dashboard-table-card">
        {filteredReviews.length > 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Branch</th>
                <th>Ratings (F / S / A)</th>
                <th>Feedback</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev) => (
                <tr key={rev._id}>
                  <td>
                    <strong>{rev.user?.name || "Anonymous"}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--secondary-text)" }}>{rev.user?.email}</div>
                  </td>
                  <td>{rev.branch?.name || "N/A"}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem" }}>
                        <span style={{ minWidth: "50px" }}>Food:</span> {renderStars(rev.foodRating)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem" }}>
                        <span style={{ minWidth: "50px" }}>Service:</span> {renderStars(rev.serviceRating)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem" }}>
                        <span style={{ minWidth: "50px" }}>Ambience:</span> {renderStars(rev.ambienceRating)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: "300px", fontSize: "0.95rem" }}>
                      "{rev.feedback}"
                    </div>
                  </td>
                  <td>{new Date(rev.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(rev._id)}
                      className="review-action-btn"
                      style={{ color: "#ff4757", borderColor: "#ff4757" }}
                    >
                      <Trash2 size={14} style={{ display: "inline", marginRight: "4px" }} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="dashboard-empty-state">
            <MessageSquare size={48} style={{ color: "var(--secondary-text)", marginBottom: "15px" }} />
            <p>No reviews found matching the filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
