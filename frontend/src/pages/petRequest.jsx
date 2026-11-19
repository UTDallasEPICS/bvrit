import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./petRequest.css";

const API_URL = "http://localhost:5001/api";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  occupation: "",
  city: "",
  state: "",
  residenceType: "",
  ownership: "",
  hasExperience: "",
  currentPets: "",
  petDetails: "",
  familyMembers: "",
  childrenAtHome: "",
  reasonForAdoption: "",
  dailyCareTime: "",
  monthlyBudget: "",
  agreeToTerms: false,
};

function getPetImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath) && !imagePath.includes("localhost:5173")) {
    return imagePath;
  }

  const relativePath = imagePath
    .replace(/^https?:\/\/localhost:5173\/?/i, "")
    .replace(/^\/+/, "")
    .replace(/^(?:frontend\/src\/|src\/)?uploads?\/?/i, "");

  return `http://localhost:5001/uploads/${relativePath}`;
}

function getRequestErrorMessage(error) {
  if (error.response?.status === 401) {
    return "Please log in to submit an adoption application.";
  }

  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

function PetRequest() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPet = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/petdata`, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected response while loading pets.");
        }

        const selectedPet = response.data.find(
          (item) => String(item._id) === petId
        );
        setPet(selectedPet || null);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          console.error("Error fetching pet:", requestError);
          setError(getRequestErrorMessage(requestError));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPet();
    return () => controller.abort();
  }, [petId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      await axios.post(
        `${API_URL}/adoption/apply`,
        { petId, ...formData },
        { withCredentials: true }
      );
      setSubmitted(true);
    } catch (requestError) {
      console.error("Error submitting adoption application:", requestError);
      setSubmitError(getRequestErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="pet-request-message">Loading pet AdoptionForm...</p>;
  }

  if (error) {
    return (
      <main className="pet-request-message" role="alert">
        <p>{error}</p>
        {error.startsWith("Please log in") && <Link to="/login">Log in</Link>}
      </main>
    );
  }

  if (!pet) {
    return (
      <main className="pet-request-message">
        <h1>Pet not found</h1>
        <p>This pet may no longer be available for adoption.</p>
        <Link to="/adoption">Browse available pets</Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="pet-request-message" role="status">
        <h1>Application submitted</h1>
        <p>
          Thank you for applying to adopt {pet.name}. We have received your
          application.
        </p>
        <Link to="/adoption">Back to available pets</Link>
      </main>
    );
  }

  return (
    <main className="pet-request-page">
      <section className="pet-request-selected">
        {pet.imagePath ? (
          <img src={getPetImageUrl(pet.imagePath)} alt={pet.name} />
        ) : (
          <div className="pet-request-image-placeholder" aria-hidden="true">
            🐾
          </div>
        )}
        <div>
          <span className="pet-request-eyebrow">Your future companion</span>
          <h1>Adopting {pet.name}</h1>
          <p>Age: {pet.age}</p>
          <p>
            Vaccination: {pet.vaccinationStatus ? "Vaccinated" : "Not vaccinated"}
          </p>
        </div>
      </section>

      <form className="pet-request-form" onSubmit={handleSubmit}>
        <header>
          <h2>Adoption Application</h2>
          <p>Tell us about yourself and the home you can offer.</p>
        </header>

        <fieldset>
          <legend>Personal information</legend>
          <div className="pet-request-fields">
            <label>
              Full name
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Phone number
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </label>
            <label>
              Age
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Occupation
              <input
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              City
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                autoComplete="address-level2"
                required
              />
            </label>
            <label>
              State
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                autoComplete="address-level1"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Living situation</legend>
          <div className="pet-request-fields">
            <label>
              Residence type
              <select
                name="residenceType"
                value={formData.residenceType}
                onChange={handleChange}
                required
              >
                <option value="">Select residence type</option>
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent house</option>
                <option value="Shared Accommodation">Shared accommodation</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Do you own or rent your home?
              <select
                name="ownership"
                value={formData.ownership}
                onChange={handleChange}
                required
              >
                <option value="">Select one</option>
                <option value="Own">Own</option>
                <option value="Rent">Rent</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pet experience</legend>
          <div className="pet-request-fields">
            <label>
              Have you owned a pet before?
              <select
                name="hasExperience"
                value={formData.hasExperience}
                onChange={handleChange}
                required
              >
                <option value="">Select one</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label>
              Do you currently have pets?
              <select
                name="currentPets"
                value={formData.currentPets}
                onChange={handleChange}
                required
              >
                <option value="">Select one</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label className="pet-request-full-width">
              If you currently have pets, please provide details
              <textarea
                name="petDetails"
                value={formData.petDetails}
                onChange={handleChange}
                rows="3"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Family and adoption plans</legend>
          <div className="pet-request-fields">
            <label>
              Number of people in your household
              <input
                type="number"
                name="familyMembers"
                min="1"
                value={formData.familyMembers}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Are there children at home?
              <select
                name="childrenAtHome"
                value={formData.childrenAtHome}
                onChange={handleChange}
                required
              >
                <option value="">Select one</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label className="pet-request-full-width">
              Why do you want to adopt {pet.name}?
              <textarea
                name="reasonForAdoption"
                value={formData.reasonForAdoption}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>
            <label>
              How much time can you spend with the pet daily?
              <select
                name="dailyCareTime"
                value={formData.dailyCareTime}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                <option value="Less than 1 hour">Less than 1 hour</option>
                <option value="1-3 hours">1-3 hours</option>
                <option value="3-5 hours">3-5 hours</option>
                <option value="More than 5 hours">More than 5 hours</option>
              </select>
            </label>
            <label>
              Are you financially prepared for pet care?
              <select
                name="monthlyBudget"
                value={formData.monthlyBudget}
                onChange={handleChange}
                required
              >
                <option value="">Select one</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
          </div>
        </fieldset>

        <label className="pet-request-agreement">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
          />
          <span>
            I confirm that the information provided is correct and understand
            that submitting this application does not guarantee adoption.
          </span>
        </label>

        {submitError && (
          <p className="pet-request-error" role="alert">
            {submitError}{" "}
            {submitError.startsWith("Please log in") && (
              <Link to="/login">Log in</Link>
            )}
          </p>
        )}

        <button className="pet-request-submit" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit adoption request"}
        </button>
      </form>
    </main>
  );
}

export default PetRequest;
