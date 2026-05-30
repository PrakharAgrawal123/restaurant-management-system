import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
            <RouterLink 
              to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="dashboard-link"
              onClick={() => setShow(false)}
            >
              <User size={18} /> Dashboard
            </RouterLink>
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
