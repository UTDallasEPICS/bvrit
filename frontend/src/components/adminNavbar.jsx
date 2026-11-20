import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/pawgoLogo.jpeg";
import "./Navbar.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/pets", label: "Manage Pets" },
  { to: "/admin/adoption-requests", label: "Adoption Requests" },
];

function AdminNavbar() {
  const [logoutError, setLogoutError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/api/login/logout",
        {},
        { withCredentials: true }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to log out.");
      }
      navigate("/login");
    } catch (error) {
      console.error("Logout request failed:", error);
      setLogoutError(
        error.response?.data?.message || error.message || "Unable to log out."
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/admin">
          <img src={logo} alt="PawGo Logo" className="navbar-logo" />
          <span>PawGo</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
          aria-controls="adminNavbarNav"
          aria-expanded="false"
          aria-label="Toggle admin navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {adminLinks.map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <Link className="nav-link" to={to}>
                  {label}
                </Link>
              </li>
            ))}
            <li className="nav-auth-buttons">
              <button
                className="nav-auth-btn nav-signup-btn"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </li>
            {logoutError && (
              <li className="text-danger small" role="alert">
                {logoutError}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
