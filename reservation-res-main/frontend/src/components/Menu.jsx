import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { Star, Flame, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Categories list
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Desserts"];

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/menu/all");
        // We can show all or just the ones that are available
        setDishes(data.menuItems || []);
        setFilteredDishes(data.menuItems || []);
      } catch (error) {
        console.error("Failed to load dishes", error);
        // Fallback placeholder to not break home page if API is down during boot
        const mockDishes = [
          {
            _id: "1",
            name: "Roasted Lamb Rump",
            description: "Tender lamb served with seasonal root vegetables and rich red wine jus.",
            price: 28.5,
            category: "Dinner",
            image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
            rating: 4.8,
            tag: "Best Seller"
          },
          {
            _id: "2",
            name: "Citrus Cured Salmon",
            description: "Fresh Atlantic salmon cured with citrus zest, served with dill cream.",
            price: 18.0,
            category: "Dinner",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&auto=format&fit=crop",
            rating: 4.7,
            tag: "Chef Recommended"
          },
          {
            _id: "3",
            name: "Pan Seared Sea Bass",
            description: "Crispy skin sea bass on a bed of braised leeks and white wine sauce.",
            price: 32.0,
            category: "Breakfast",
            image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop",
            rating: 4.9,
            tag: "Trending"
          }
        ];
        setDishes(mockDishes);
        setFilteredDishes(mockDishes);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularDishes();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredDishes(dishes);
    } else {
      setFilteredDishes(dishes.filter(dish => dish.category === category));
    }
  };

  return (
    <section className="menu" id="menu">
      <div className="container">
        <div className="heading_section">
          <h1 className="heading">POPULAR DISHES</h1>
          <p>Explore our signature creations, hand-picked by our chef and prepared with premium ingredients.</p>
        </div>

        {/* Category Tabs */}
        <div className="menu-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`menu-tab-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="dishes-loading">
            <div className="skeleton-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-text title"></div>
                  <div className="skeleton-text desc"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div 
            className="dishes_container_grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((element) => (
                <motion.div
                  className="premium-dish-card"
                  key={element._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-image-box">
                    <img src={element.image} alt={element.name} />
                    <span className="card-category-badge">{element.category}</span>
                    {element.tag && element.tag !== "None" && (
                      <span className={`card-tag-badge ${element.tag.toLowerCase().replace(/\s+/g, '-')}`}>
                        {element.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header-row">
                      <h3>{element.name}</h3>
                      <span className="price-tag">${element.price.toFixed(2)}</span>
                    </div>

                    <div className="card-meta">
                      <div className="rating">
                        <Star size={14} className="star-icon" />
                        <span>{element.rating || 4.5}</span>
                      </div>
                      {element.calories && (
                        <div className="calories">
                          <Flame size={14} className="flame-icon" />
                          <span>{element.calories} kcal</span>
                        </div>
                      )}
                    </div>

                    <p className="card-description">
                      {element.description.length > 80
                        ? `${element.description.slice(0, 80)}...`
                        : element.description}
                    </p>

                    <Link to={`/menu/${element._id}`} className="explore-btn">
                      Explore Item <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Menu;
