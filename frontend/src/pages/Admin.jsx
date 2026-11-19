import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";

function Admin() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/check-auth",
          { withCredentials: true }
        );

        if (typeof data.isLoggedIn !== "boolean") {
          throw new Error("Authentication check returned an invalid response.");
        }

        if (isMounted) {
          setIsAdmin(data.isLoggedIn && data.isAdmin === true);
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        if (isMounted) {
          setIsAdmin(false);
        }
      }
    };

    fetchAdmin();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isAdmin === null) {
    return <p>Checking admin access...</p>;
  }

  if (!isAdmin) {
    return <h2>Access Denied</h2>;
  }

  return <AdminDashboard />;
}

export default Admin;
