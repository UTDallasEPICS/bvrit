import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/petdata",
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected response while loading pets.");
        }

        setPets(response.data);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          console.error("Error loading pets:", requestError);
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load pets."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchPets();
    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <p>Loading pets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <h2>Pets</h2>
      {pets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        pets.map((pet) => (
          <div key={pet._id}>
            <h3>{pet.name}</h3>
          </div>
        ))
      )}
    </main>
  );
}

export default AdminDashboard;
