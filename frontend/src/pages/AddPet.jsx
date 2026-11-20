import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";

const API_URL = "http://localhost:5001/api/admin";

function AddPet() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    vaccinationStatus: "false",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!image) {
      setError("Choose a pet image to upload.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    payload.append("image", image);

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/pets`, payload, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to add pet.");
      }

      navigate("/admin/pets", {
        state: { notice: `${response.data.data.name} was added successfully.` },
      });
    } catch (requestError) {
      console.error("Error adding pet:", requestError);
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to add pet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-content">
      <header className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">PET CATALOG</p>
          <h1>Add a new pet</h1>
          <p>Share a pet’s details with people looking to adopt.</p>
        </div>
        <Link className="admin-secondary-button" to="/admin/pets">
          Back to pets
        </Link>
      </header>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        {error && (
          <p className="admin-alert admin-alert-error" role="alert">
            {error}
          </p>
        )}

        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Pet name</span>
            <input
              autoComplete="off"
              maxLength={100}
              name="name"
              onChange={handleChange}
              required
              value={formData.name}
            />
          </label>

          <label className="admin-field">
            <span>Age</span>
            <input
              maxLength={50}
              name="age"
              onChange={handleChange}
              placeholder="e.g. 2 years"
              required
              value={formData.age}
            />
          </label>

          <label className="admin-field">
            <span>Gender <small>(optional)</small></span>
            <select name="gender" onChange={handleChange} value={formData.gender}>
              <option value="">Not specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="admin-field">
            <span>Vaccination status</span>
            <select
              name="vaccinationStatus"
              onChange={handleChange}
              value={formData.vaccinationStatus}
            >
              <option value="false">Not vaccinated</option>
              <option value="true">Vaccinated</option>
            </select>
          </label>

          <label className="admin-field admin-field-full">
            <span>Pet image</span>
            <input
              accept="image/jpeg,image/png,image/webp"
              name="image"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
              required
              type="file"
            />
            <small>JPG, PNG, or WebP. Maximum file size: 5 MB.</small>
          </label>
        </div>

        <div className="admin-form-actions">
          <button
            className="admin-primary-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving pet..." : "Save pet"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddPet;
