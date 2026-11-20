import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && !isAdminRoute && <Navbar />}
      <Outlet />
    </>
  );
}

export default App;