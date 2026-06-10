import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import MenuCard from "../../components/MenuCard";
import Cart from "../../components/Cart";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { ShoppingCart, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  
  // Interactive state filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc, rating-desc
  
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  // Use Global Cart Context
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, total } = useCart();

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Appetizers", "Desserts", "Beverages", "Sides"];
  const tags = ["All", "Trending", "Chef Recommended", "Best Seller", "New Arrival"];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/menu/all");
        setMenuItems(data.menuItems || []);
        setFilteredItems(data.menuItems || []);
      } catch (error) {
        toast.error("Failed to fetch menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Filter and Sort Effect
  useEffect(() => {
    let result = [...menuItems];

    // 1. Text Search Filter
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 3. Tag Badge Filter
    if (selectedTag !== "All") {
      result = result.filter((item) => item.tag === selectedTag);
    }

    // 4. Sorting logic
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, selectedTag, sortBy, menuItems]);

  const placeOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      return;
    }

    try {
      const branchesRes = await api.get("/branch/all");
      const branchId = branchesRes.data.branches[0]?._id;

      if (!branchId) {
        toast.error("No restaurant branches available");
        return;
      }

      await api.post("/order/new", {
        branch: branchId,
        items: cart.map(i => ({ menuItem: i._id, quantity: i.quantity })),
        orderType: "Dine-in"
      });

      toast.success("Order placed successfully!");
      clearCart();
      setShowCart(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className={`menu-page-wrapper ${theme}`}>
      <Navbar />

      <div className="menu-page">
        <header className="menu-header">
          <div>
            <h1>OUR MENU</h1>
            <p className="menu-subtitle">Savor the gourmet experience from our kitchen to your table.</p>
          </div>
          <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
            <ShoppingCart size={20} />
            <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </button>
        </header>

        {/* Filter Controls Bar */}
        <div className="menu-controls">
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search delicious dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
          </div>

          <div className="sort-filter-group">
            <div className="sort-dropdown-wrapper">
              <ArrowUpDown className="sort-icon" size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="menu-sort-select"
              >
                <option value="default">Sort by (Default)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: Highest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="menu-categories-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tags Filtering Sub-Bar */}
        <div className="menu-tags-bar">
          <span className="filter-label">Filter by Tag:</span>
          {tags.map((tg) => (
            <button
              key={tg}
              className={`tag-tab-btn ${selectedTag === tg ? "active" : ""}`}
              onClick={() => setSelectedTag(tg)}
            >
              {tg}
            </button>
          ))}
        </div>

        {/* Skeletons or Grid */}
        {loading ? (
          <div className="skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-text title"></div>
                <div className="skeleton-text desc"></div>
                <div className="skeleton-footer">
                  <div className="skeleton-text price"></div>
                  <div className="skeleton-btn"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="no-items-found">
                <h3>No dishes match your filters</h3>
                <p>Try resetting the search query or changing category and tags.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedTag("All");
                    setSortBy("default");
                  }} 
                  className="reset-filters-btn"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <motion.div className="menu-grid" layout>
                <AnimatePresence mode="popLayout">
                  {filteredItems.map(item => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MenuCard item={item} onAddToCart={addToCart} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}

        {showCart && (
          <div className="cart-modal-overlay">
            <div className="cart-modal-content">
              <button className="close-cart" onClick={() => setShowCart(false)}>&times;</button>
              <Cart
                cartItems={cart}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onPlaceOrder={placeOrder}
                total={total}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;
