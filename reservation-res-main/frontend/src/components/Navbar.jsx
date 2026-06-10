import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
    <nav>
      <div className="logo">Universal Yums</div>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          {data[0].navbarLinks.map((element) => (
            <ScrollLink
              to={element.link}
              spy={true}
              smooth={true}
              duration={500}
              key={element.id}
              onClick={() => setShow(false)}
            >
              {element.title}
            </ScrollLink>
          ))}
          
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
                onClick={handleNavbarLogout}
                className="nav-logout-btn"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--secondary-text)",
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
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <ScrollLink
            to="reservation"
            spy={true}
            smooth={true}
            duration={500}
            className="menuBtn"
            onClick={() => setShow(false)}
          >
            RESERVE NOW
          </ScrollLink>
        </div>
      </div>
      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
