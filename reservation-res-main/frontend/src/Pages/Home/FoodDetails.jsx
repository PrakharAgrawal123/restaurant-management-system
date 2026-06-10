import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { Star, Clock, Flame, ShieldAlert, Award, Coffee, ArrowLeft, Plus, Check } from "lucide-react";
import "./FoodDetails.css";
import toast from "react-hot-toast";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { theme } = useTheme();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/menu/${id}`);
        setItem(data.menuItem);
      } catch (error) {
        toast.error("Failed to load dish details");
        navigate("/menu");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="details-loading-container">
          <div className="skeleton-hero"></div>
          <div className="skeleton-content-grid">
            <div className="skeleton-block"></div>
            <div className="skeleton-block"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!item) return null;

  const isInCart = cart.some((c) => c._id === item._id);
  const cartItem = cart.find((c) => c._id === item._id);

  return (
    <div className={`details-page-wrapper ${theme}`}>
      <Navbar />

      <main className="details-container">
        <motion.button 
          className="back-btn"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft size={18} /> Back to menu
        </motion.button>

        {/* Hero Section */}
        <section className="food-hero-section">
          <div className="food-hero-grid">
            <motion.div 
              className="food-hero-image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img src={item.image} alt={item.name} className="food-large-img" />
              {item.tag && item.tag !== "None" && (
                <span className={`detail-badge ${item.tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.tag}
                </span>
              )}
            </motion.div>

            <motion.div 
              className="food-hero-details"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="food-category">{item.category}</div>
              <h1 className="food-name-title">{item.name}</h1>
              
              <div className="food-rating-row">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(item.rating) ? "star-filled" : "star-empty"}
                    />
                  ))}
                  <span className="rating-value">{item.rating}</span>
                </div>
                <span className="review-count">({item.reviews?.length || 0} reviews)</span>
              </div>

              <p className="food-short-desc">{item.description}</p>

              <div className="food-metrics-grid">
                <div className="metric-box">
                  <Clock size={20} className="metric-icon green" />
                  <div>
                    <span className="metric-label">Prep Time</span>
                    <span className="metric-val">{item.prepTime || "20 mins"}</span>
                  </div>
                </div>
                <div className="metric-box">
                  <Flame size={20} className="metric-icon red" />
                  <div>
                    <span className="metric-label">Calories</span>
                    <span className="metric-val">{item.calories || 350} kcal</span>
                  </div>
                </div>
                <div className="metric-box">
                  <Coffee size={20} className="metric-icon orange" />
                  <div>
                    <span className="metric-label">Serving</span>
                    <span className="metric-val">{item.servingSize || "1 serving"}</span>
                  </div>
                </div>
              </div>

              <div className="food-price-row">
                <div>
                  <span className="price-label">Price</span>
                  <div className="food-price">${item.price.toFixed(2)}</div>
                </div>

                <button 
                  onClick={() => addToCart(item)}
                  className={`detail-add-btn ${isInCart ? "added" : ""}`}
                  disabled={!item.isAvailable}
                >
                  {isInCart ? (
                    <>
                      <Check size={18} /> In Cart ({cartItem.quantity})
                    </>
                  ) : (
                    <>
                      <Plus size={18} /> {item.isAvailable ? "Add to Order" : "Sold Out"}
                    </>
                  )}
                </button>
              </div>

              {item.allergens && item.allergens.length > 0 && item.allergens[0] !== "None" && (
                <div className="allergens-alert">
                  <ShieldAlert size={18} />
                  <span><strong>Allergens:</strong> {item.allergens.join(", ")}</span>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Content Tabs Section */}
        <section className="food-info-tabs-section">
          <div className="tabs-header">
            <button 
              className={`tab-link ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About This Dish
            </button>
            <button 
              className={`tab-link ${activeTab === "ingredients" ? "active" : ""}`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients Used
            </button>
            <button 
              className={`tab-link ${activeTab === "nutrition" ? "active" : ""}`}
              onClick={() => setActiveTab("nutrition")}
            >
              Nutritional Facts
            </button>
            <button 
              className={`tab-link ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({item.reviews?.length || 0})
            </button>
          </div>

          <div className="tab-content-container">
            {activeTab === "about" && (
              <motion.div 
                className="tab-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="tab-grid">
                  <div className="tab-main-col">
                    <h3>The Story of {item.name}</h3>
                    <p>{item.aboutDish || "Selected from the finest farm-fresh ingredients and slow-cooked to capture the rich natural flavors of traditional seasoning."}</p>
                    
                    <div className="why-love-box">
                      <h4>Why Customers Love It</h4>
                      <p>{item.whyLove || "Renowned for its savory balance and gourmet presentation, this dish delivers comforting flavor combinations that make it a guest favorite."}</p>
                    </div>
                  </div>

                  <div className="tab-side-col">
                    <div className="chef-notes-card">
                      <div className="chef-notes-header">
                        <Award size={20} />
                        <h4>Chef's Special Notes</h4>
                      </div>
                      <p>"{item.chefNotes || "Always ensure the dish is rested properly and served warm to highlight the natural oils and aromatics in the seasoning."}"</p>
                      {item.chefRecommendation && (
                        <div className="chef-rec">
                          <strong>Pairing:</strong> {item.chefRecommendation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ingredients" && (
              <motion.div 
                className="tab-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3>Pure & Fresh Ingredients</h3>
                <p>We source all ingredients from certified organic local farmers to ensure top quality and flavor integrity.</p>
                <div className="ingredients-tags-container">
                  {item.ingredients && item.ingredients.length > 0 ? (
                    item.ingredients.map((ing, idx) => (
                      <span key={idx} className="ing-tag">{ing}</span>
                    ))
                  ) : (
                    <span className="ing-tag">Natural Herbs & Spices</span>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "nutrition" && (
              <motion.div 
                className="tab-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3>Nutritional Profile</h3>
                <p>Estimated values per serving size of {item.servingSize || "1 plate"}.</p>
                <div className="nutrition-grid">
                  <div className="nutrition-card">
                    <span className="nut-num">{item.nutritionalInfo?.protein || "15g"}</span>
                    <span className="nut-label">Protein</span>
                  </div>
                  <div className="nutrition-card">
                    <span className="nut-num">{item.nutritionalInfo?.fat || "10g"}</span>
                    <span className="nut-label">Fat</span>
                  </div>
                  <div className="nutrition-card">
                    <span className="nut-num">{item.nutritionalInfo?.carbs || "30g"}</span>
                    <span className="nut-label">Carbohydrates</span>
                  </div>
                  <div className="nutrition-card">
                    <span className="nut-num">{item.nutritionalInfo?.fiber || "4g"}</span>
                    <span className="nut-label">Dietary Fiber</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div 
                className="tab-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="reviews-section">
                  <h3>Guest Feedbacks</h3>
                  {item.reviews && item.reviews.length > 0 ? (
                    <div className="reviews-list">
                      {item.reviews.map((rev) => (
                        <div key={rev._id || rev.username} className="review-card">
                          <div className="review-header">
                            <div>
                              <h5 className="reviewer-name">{rev.username}</h5>
                              <span className="review-date">
                                {new Date(rev.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="review-stars">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < rev.rating ? "star-filled" : "star-empty"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="review-text">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-reviews">No reviews yet. Be the first to try this dish!</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FoodDetails;
