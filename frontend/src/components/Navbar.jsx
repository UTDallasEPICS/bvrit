
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/pawgoLogo.jpeg";
import "./navbar.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/check-auth",
          { withCredentials: true }
        );
        if (typeof response.data.isLoggedIn !== "boolean") {
          throw new Error("Authentication check returned an invalid response.");
        }
        if (isMounted) {
          setIsLoggedIn(response.data.isLoggedIn);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        if (isMounted) {
          setIsLoggedIn(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/login/logout",
        {},
        { withCredentials: true }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to log out.");
      }
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout request failed:", error);
      window.alert(
        error.response?.data?.message || error.message || "Unable to log out."
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg py-3">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
        <img
          src={logo}
           alt="PawGo Logo"
             className="navbar-logo"
        />
         <span>PawGo</span>
         </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Adoption */}
            <li className="nav-item">
              <Link className="nav-link" to="/adoption">
                Adoption
              </Link>
            </li>

            {/* AI Assistant */}
            <li className="nav-item">
              <Link className="nav-link" to="/assistant">
                AI Assistant
              </Link>
            </li>

            

            {/* Profile */}
            <li className="nav-item ms-lg-3 dropdown">
              <button
                className="profile-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUserCircle className="profile-icon" />
              </button>

              <ul className="dropdown-menu dropdown-menu-end profile-dropdown-menu">

                <li>
                  <Link className="dropdown-item" to="/profile">
                    <FaUserCircle className="dropdown-icon" />
                    Profile
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/settings">
                    <FaCog className="dropdown-icon" />
                    Settings
                  </Link>
                </li>

              </ul>
            </li>

            {/* Show account actions only after the session check completes. */}
            {isLoggedIn !== null && (
              <li className="nav-auth-buttons">
                {isLoggedIn ? (
                  <button
                    className="nav-auth-btn nav-signup-btn"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      className="nav-auth-btn nav-login-btn"
                      to="/login"
                    >
                      Login
                    </Link>

                    <Link
                      className="nav-auth-btn nav-signup-btn"
                      to="/login?mode=signup"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </li>
            )}

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;

