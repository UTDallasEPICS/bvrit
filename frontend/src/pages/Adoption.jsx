
import { useEffect, useState } from "react";
import axios from "axios";
import "./Adoption.css";

const getPetImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
        /^https?:\/\//i.test(imagePath) &&
        !imagePath.includes("localhost:5173")
    ) {
        return imagePath;
    }

    const relativePath = imagePath
        .replace(/^https?:\/\/localhost:5173\/?/i, "")
        .replace(/^\/+/, "")
        .replace(/^(?:frontend\/src\/|src\/)?uploads?\/?/i, "");

    return `http://localhost:5001/uploads/${relativePath}`;
};

function Adoption() {
    const [pet, setPet] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5001/api/petdata",
                    { withCredentials: true }
                );

                if (!Array.isArray(response.data)) {
                    throw new Error("Unexpected response while loading pets.");
                }

                setPet(response.data);
            } catch (error) {
                console.error(error);
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load pets."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="adoption-page">

            {/* Header */}
            <section className="adoption-header">
                <span className="adoption-tag">
                    Find Your New Best Friend
                </span>

                <h1>
                    Give a Pet a <span>Forever Home</span>
                </h1>

                <p>
                    Every pet deserves love, care, and a safe home.
                    Explore our adorable pets and find your perfect companion.
                </p>
            </section>

            {/* Loading */}
            {isLoading && (
                <div className="adoption-loading">
                    <div className="adoption-spinner"></div>
                    <p>Finding your furry friends...</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="adoption-error" role="alert">
                    Login to view pets available for adoption.
                </div>
            )}

            {/* Empty */}
            {!isLoading && !error && pet.length === 0 && (
                <div className="adoption-empty">
                    <div className="empty-icon">🐾</div>
                    <h2>No Pets Available</h2>
                    <p>
                        There are currently no pets listed for adoption.
                        Please check back later!
                    </p>
                </div>
            )}

            {/* Pet Grid */}
            {!isLoading && !error && pet.length > 0 && (
                <section className="pet-grid">

                    {pet.map((p) => (
                        <article className="pet-card" key={p._id}>

                            <div className="pet-image-container">
                                {p.imagePath ? (
                                    <img
                                        src={getPetImageUrl(p.imagePath)}
                                        alt={p.name}
                                        className="pet-image"
                                        onError={(e) => {
                                            e.currentTarget.src = "/pet-placeholder.png";
                                        }}
                                    />
                                ) : (
                                    <div className="pet-image-placeholder">
                                        🐶
                                    </div>
                                )}

                                <span className="availability-badge">
                                    Available for Adoption
                                </span>
                            </div>

                            <div className="pet-card-content">

                                <div className="pet-title-row">
                                    <h2>{p.name}</h2>
                                    <span className="pet-age">
                                        {p.age}
                                    </span>
                                </div>

                                <div className="pet-info">
                                    <span>Vaccination Status</span>

                                    <span className={`vaccination-badge ${
                                        p.vaccinationStatus
                                            ? "vaccinated"
                                            : "not-vaccinated"
                                    }`}>
                                        {p.vaccinationStatus
                                            ? "Vaccinated"
                                            : "Not Vaccinated"}
                                    </span>
                                </div>

                                <button className="meet-pet-button">
                                    Meet {p.name}
                                    <span>→</span>
                                </button>

                            </div>
                        </article>
                    ))}

                </section>
            )}
        </div>
    );
}

export default Adoption;
