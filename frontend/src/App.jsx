import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/adminNavbar";
function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";
  const adminNavbarPaths = [
    "/admin",
    "/adminhome",
    "/adoptionrequests",
    "/addpet",
  ];
  const showNavbarAdmin = adminNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbarAdmin ? (
        <AdminNavbar />
      ) : (
        !hideNavbar && <Navbar />
      )}
      <Outlet />
    </>
  );
}

export default App;