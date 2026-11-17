import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function Admin() {
    const [isAdmin, setAdmin] = useState(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:5001/api/check-auth",
                    { withCredentials: true }
                );
                setAdmin(data.isLoggedIn && data.isAdmin);
            } catch (error) {
                console.error("Admin check failed:", error);
                setAdmin(false);
            }
        };

        fetchAdmin();
    }, []);
    return (
        <>
            {isAdmin && <h1>This is admin page</h1>}
            {!isAdmin && <h1>Not Admin Account</h1>}

        </>
    )

}
export default Admin;