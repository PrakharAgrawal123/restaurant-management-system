import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { User, LogOut, Sun, Moon, ShoppingCart, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavbarLogout = async () => {
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

  return (
    <nav className="nav-container">
      <div className="logo-section" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        Universal Yums
      </div>

      {/* Main Navigation Links */}
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        {show && (
          <button className="mobile-close-btn" onClick={() => setShow(false)}>
            <X size={24} />
          </button>
        )}
        
        <div className="links">
          {/* Render home page section links */}
          {data[0].navbarLinks.map((element) => (
            isHomePage ? (
              <ScrollLink
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                offset={-80}
                key={element.id}
                onClick={() => setShow(false)}
              >
                {element.title}
              </ScrollLink>
            ) : (
              <RouterLink
                to={`/#${element.link}`}
                key={element.id}
                onClick={() => setShow(false)}
              >
                {element.title}
              </RouterLink>
            )
          ))}

          {/* Add a dedicated MENU page link */}
          <RouterLink 
            to="/menu" 
            className={location.pathname === "/menu" ? "active-route" : ""}
            onClick={() => setShow(false)}
          >
            MENU
          </RouterLink>
          
          {/* User authenticated navigation */}
          {isAuthenticated ? (
            <>
              <RouterLink 
                to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="dashboard-link"
                onClick={() => setShow(false)}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <User size={18} /> Dashboard
              </RouterLink>
              <button 
                onClick={() => {
                  handleNavbarLogout();
                  setShow(false);
                }}
                className="nav-logout-btn"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  fontWeight: "300",
                  letterSpacing: "1.4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <RouterLink to="/login" onClick={() => setShow(false)}>Login</RouterLink>
              <RouterLink to="/register" onClick={() => setShow(false)}>Register</RouterLink>
            </>
          )}
        </div>

        {/* Global Toolbar Action buttons */}
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {location.pathname !== "/menu" && (
            <RouterLink to="/menu" className="nav-cart-btn" title="View Cart">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </RouterLink>
          )}

          {isHomePage ? (
            <ScrollLink
              to="reservation"
              spy={true}
              smooth={true}
              duration={500}
              offset={-80}
              className="menuBtn"
              onClick={() => setShow(false)}
            >
              RESERVE NOW
            </ScrollLink>
          ) : (
            <RouterLink
              to="/#reservation"
              className="menuBtn"
              onClick={() => setShow(false)}
            >
              RESERVE NOW
            </RouterLink>
          )}
        </div>
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
