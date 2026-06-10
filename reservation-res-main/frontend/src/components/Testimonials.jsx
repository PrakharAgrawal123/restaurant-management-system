import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/review/all");
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Default reviews if DB is empty
 const defaultReviews = [
  {
    _id: "def1",
    user: { name: "Rahul Sharma" },
    feedback: "Food was really delicious and the service was excellent. We booked a table for a family dinner and everything was well managed. The ambience was also very pleasant.",
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 4
  },
  {
    _id: "def2",
    user: { name: "Priya Verma" },
    feedback: "I visited with my friends and we had a great experience. The staff was polite, the food arrived on time, and the restaurant was very clean. Highly recommended.",
    foodRating: 4,
    serviceRating: 5,
    ambienceRating: 5
  },
  {
    _id: "def3",
    user: { name: "Amit Singh" },
    feedback: "One of the best dining experiences I've had recently. The food quality was amazing and the reservation process was very smooth. Will definitely visit again.",
    foodRating: 5,
    serviceRating: 4,
    ambienceRating: 5
  },
  {
    _id: "def4",
    user: { name: "Sneha Gupta" },
    feedback: "The restaurant has a wonderful atmosphere and the staff is very cooperative. Perfect place for family gatherings and celebrations.",
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5
  },
  {
    _id: "def5",
    user: { name: "Vikram Patel" },
    feedback: "Good food, reasonable pricing, and quick service. The online reservation feature made the whole experience hassle-free.",
    foodRating: 4,
    serviceRating: 4,
    ambienceRating: 5
  }
];

  const activeReviews = reviews.length > 0 ? reviews : defaultReviews;

  const renderStars = (rating) => {
    return (
      <div style={{ display: "flex", gap: "2px", justifyContent: "center", margin: "10px 0" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            size={16} 
            fill={s <= rating ? "#ffbb28" : "none"} 
            stroke={s <= rating ? "#ffbb28" : "var(--secondary-text)"}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="menu" id="testimonials" style={{ background: "var(--accent-color)" }}>
      <div className="container" style={{ minWidth: "100%" }}>
        <div className="heading_section" style={{ marginBottom: "50px" }}>
          <h1 className="heading" style={{ textAlign: "center" }}>GUEST REVIEWS</h1>
          <p>Read what our happy diners say about our food, service, and ambience.</p>
        </div>

        <div className="dishes_container" style={{ display: "flex", gap: "30px", justifyContent: "center", flexWrap: "wrap", width: "100%", padding: "0 40px" }}>
          {activeReviews.slice(0, 3).map((rev) => {
            const avgRating = Math.round((rev.foodRating + rev.serviceRating + rev.ambienceRating) / 3);
            return (
              <motion.div 
                key={rev._id}
                className="card"
                style={{ 
                  flex: "1 1 300px", 
                  maxWidth: "400px", 
                  background: "var(--card-bg)", 
                  border: "1px solid var(--border-color)", 
                  padding: "35px", 
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ background: "var(--text-color)", color: "var(--bg-color)", padding: "10px", borderRadius: "50%", marginBottom: "15px" }}>
                  <Quote size={20} />
                </div>
                
                <p style={{ fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.6", color: "var(--secondary-text)", flex: "1" }}>
                  "{rev.feedback}"
                </p>

                <div style={{ marginTop: "20px", borderTop: "1px solid var(--border-color)", width: "100%", paddingTop: "15px" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--text-color)" }}>
                    {rev.user?.name || "Verified Guest"}
                  </h4>
                  {renderStars(avgRating)}
                  <div style={{ fontSize: "0.75rem", color: "var(--secondary-text)", display: "flex", gap: "8px", justifyContent: "center", marginTop: "5px" }}>
                    <span>Food: {rev.foodRating}★</span>
                    <span>Service: {rev.serviceRating}★</span>
                    <span>Ambience: {rev.ambienceRating}★</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
