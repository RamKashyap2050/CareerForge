import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleClose = () => {};

  const handleLogout = async () => {
    try {
      // Make a POST request to the logout route on the server
      await axios.post("/users/logout");

      // Close the menu after logout
      handleClose();

      // Optionally, you can clear any stored user data (e.g., tokens, localStorage)
      localStorage.removeItem("token"); // If you're using JWT or any stored token

      // Optionally, redirect the user to the login or homepage after logout
      window.location.href = "/login"; // Or use a routing library like react-router
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const handleCustomResume = () => {
    navigate("/customresume");
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };
  const handleJobListings = () => {
    navigate("/joblistings")
  }
  const styles = {
    appBar: {
      backgroundColor: "#00796b",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      color: "#ffffff",
      fontSize: "24px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    menuIcon: {
      fontSize: "28px",
      color: "#ffffff",
      cursor: "pointer",
      display: "none",
    },
    menuItems: {
      position: "absolute",
      top: "60px",
      right: "20px",
      backgroundColor: "#333",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 100,
      display: menuOpen ? "block" : "none",
    },
    menuItem: {
      padding: "10px 20px",
      color: "#ffffff",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      cursor: "pointer",
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
    },
    menuButton: {
      display: "none",
    },
    "@media (max-width: 768px)": {
      menuIcon: {
        display: "block",
      },
      menuButton: {
        display: "block",
      },
      profileSection: {
        display: "none",
      },
    },
  };

  return (
    <div style={styles.appBar}>
      <div style={styles.title}>CareerForge</div>
      <div style={styles.profileSection}>
        <img
          src={
            "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg"
          }
          alt="Profile"
          style={styles.avatar}
          onClick={handleMenu}
        />
      </div>
      <div style={styles.menuButton} onClick={handleMenu}>
        <i style={styles.menuIcon} className="fas fa-bars"></i>
      </div>
      <div style={styles.menuItems}>
        <div style={styles.menuItem} onClick={handleDashboard}>
          Dashboard
        </div>
        <div style={styles.menuItem} onClick={handleCustomResume}>
          Create Custom Resume
        </div>
        <div style={styles.menuItem} onClick={handleJobListings}>
          View Job Listings
        </div>
        <div style={styles.menuItem} onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Navbar;
