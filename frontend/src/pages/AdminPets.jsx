import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getPetImageUrl } from "../utils/petImage";
import "./admin.css";

const API_URL = "http://localhost:5001/api/admin";

function AdminPets() {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();

    const loadPets = async () => {
      try {
        const response = await axios.get(`${API_URL}/pets`, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error("Unexpected response while loading pets.");
        }

        setPets(response.data.data);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          console.error("Error loading admin pets:", requestError);
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

    loadPets();
    return () => controller.abort();
  }, []);

  return (
    <main className="admin-content">
      <header className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">PET CATALOG</p>
          <h1>Manage Pets</h1>
          <p>Keep your adoption listings accurate and up to date.</p>
        </div>
        <Link className="admin-primary-button" to="/admin/pets/new">
          Add a pet
        </Link>
      </header>

      {location.state?.notice && (
        <div className="admin-alert admin-alert-success" role="status">
          {location.state.notice}
        </div>
      )}

      {isLoading && <p className="admin-message">Loading pets...</p>}
      {error && (
        <p className="admin-alert admin-alert-error" role="alert">
          {error}
        </p>
      )}
      {!isLoading && !error && pets.length === 0 && (
        <section className="admin-empty-state">
          <span aria-hidden="true">🐾</span>
          <h2>No pets listed yet</h2>
          <p>Add your first pet to make them visible to potential adopters.</p>
          <Link className="admin-primary-button" to="/admin/pets/new">
            Add the first pet
          </Link>
        </section>
      )}

      {!isLoading && !error && pets.length > 0 && (
        <section className="admin-pet-grid" aria-label="All pets">
          {pets.map((pet) => (
            <article className="admin-pet-card" key={pet._id}>
              {pet.imagePath ? (
                <img
                  className="admin-pet-image"
                  src={getPetImageUrl(pet.imagePath)}
                  alt={pet.name}
                />
              ) : (
                <div className="admin-pet-image admin-image-placeholder" aria-hidden="true">
                  🐾
                </div>
              )}
              <div className="admin-pet-card-body">
                <div className="admin-pet-title">
                  <h2>{pet.name}</h2>
                  <span
                    className={`admin-status-badge ${
                      pet.adoptionStatus === "Adopted" ? "status-neutral" : "status-success"
                    }`}
                  >
                    {pet.adoptionStatus || "Available"}
                  </span>
                </div>
                <p className="admin-pet-age">Age: {pet.age}</p>
                <div className="admin-pet-details">
                  {pet.gender && <span>{pet.gender}</span>}
                  <span>
                    {pet.vaccinationStatus ? "Vaccinated" : "Not vaccinated"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminPets;
