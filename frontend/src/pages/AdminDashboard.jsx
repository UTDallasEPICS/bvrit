import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./admin.css";

const API_URL = "http://localhost:5001/api/admin";
const statisticCards = [
  { key: "totalPets", label: "Pets available", icon: "🐾", tone: "blue" },
  { key: "totalRequests", label: "Applications received", icon: "📄", tone: "purple" },
  { key: "pendingRequests", label: "Pending applications", icon: "⏳", tone: "orange" },
  { key: "approvedRequests", label: "Approved applications", icon: "💙", tone: "green" },
];

function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadStatistics = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/dashboard`, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (!response.data.success || !response.data.data) {
          throw new Error("Unexpected response while loading dashboard statistics.");
        }

        setStatistics(response.data.data);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          console.error("Error loading dashboard statistics:", requestError);
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadStatistics();
    return () => controller.abort();
  }, [refreshKey]);

  return (
    <main className="admin-content">
      <header className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">PAWGO ADMINISTRATION</p>
          <h1>Dashboard</h1>
          <p>Here is what is happening across your adoption program.</p>
        </div>
        <Link className="admin-primary-button" to="/admin/pets/new">
          Add a pet
        </Link>
      </header>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>
            Try again
          </button>
        </div>
      )}

      <section className="admin-stat-grid" aria-label="Dashboard statistics">
        {statisticCards.map((card) => (
          <article className="admin-stat-card" key={card.key}>
            <span className={`admin-stat-icon ${card.tone}`} aria-hidden="true">
              {card.icon}
            </span>
            <div>
              <p>{card.label}</p>
              <strong>
                {isLoading
                  ? "..."
                  : new Intl.NumberFormat().format(statistics?.[card.key] ?? 0)}
              </strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-welcome-panel">
        <div>
          <p className="admin-eyebrow">A LITTLE CARE GOES A LONG WAY</p>
          <h2>Help every pet find a loving home.</h2>
          <p>
            Review applications, keep pet listings up to date, and help
            adopters take the next step.
          </p>
        </div>
        <Link className="admin-secondary-button" to="/admin/adoption-requests">
          Review adoption requests
        </Link>
      </section>
    </main>
  );
}

export default AdminDashboard;
