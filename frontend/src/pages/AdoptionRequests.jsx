import { useEffect, useState } from "react";
import axios from "axios";
import { getPetImageUrl } from "../utils/petImage";
import "./admin.css";

const API_URL = "http://localhost:5001/api/admin";
const applicationFields = [
  ["email", "Email"],
  ["phone", "Contact number"],
  ["age", "Applicant age"],
  ["occupation", "Occupation"],
  ["city", "City"],
  ["state", "State"],
  ["residenceType", "Residence type"],
  ["ownership", "Home ownership"],
  ["hasExperience", "Previous pet experience"],
  ["currentPets", "Currently has pets"],
  ["petDetails", "Current pet details"],
  ["familyMembers", "Household members"],
  ["childrenAtHome", "Children at home"],
  ["reasonForAdoption", "Reason for adoption"],
  ["dailyCareTime", "Daily care time"],
  ["monthlyBudget", "Can meet monthly budget"],
  ["agreeToTerms", "Terms accepted"],
];

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AdoptionRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadRequests = async () => {
      try {
        const response = await axios.get(`${API_URL}/adoption-requests`, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (!response.data.success || !Array.isArray(response.data.data)) {
          throw new Error("Unexpected response while loading applications.");
        }

        setRequests(response.data.data);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          console.error("Error loading adoption requests:", requestError);
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load adoption requests."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadRequests();
    return () => controller.abort();
  }, []);

  const updateStatus = async (request, status) => {
    if (
      request.status !== "Pending" ||
      !window.confirm(
        `${status === "Approved" ? "Approve" : "Reject"} ${request.fullName}'s application?`
      )
    ) {
      return;
    }

    setActionError("");
    setProcessingId(String(request._id));

    try {
      const response = await axios.patch(
        `${API_URL}/adoption-requests/${request._id}/status`,
        { status },
        { withCredentials: true }
      );

      const { relatedRequestIds = [], reviewedAt } = response.data.data;
      const affectedIds = new Set([
        String(request._id),
        ...relatedRequestIds.map(String),
      ]);
      const updatedRequests = requests.map((current) => {
        if (!affectedIds.has(String(current._id))) {
          return current;
        }

        return {
          ...current,
          status:
            String(current._id) === String(request._id) ? status : "Rejected",
          reviewedAt,
        };
      });

      setRequests(updatedRequests);
      setSelectedRequest((current) =>
        current && affectedIds.has(String(current._id))
          ? updatedRequests.find(
              (item) => String(item._id) === String(current._id)
            )
          : current
      );
    } catch (requestError) {
      console.error("Error updating adoption request:", requestError);
      setActionError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update the application."
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <main className="admin-content">
      <header className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">ADOPTION WORKFLOW</p>
          <h1>Adoption Requests</h1>
          <p>Review applications and help applicants find their companion.</p>
        </div>
      </header>

      {actionError && (
        <p className="admin-alert admin-alert-error" role="alert">
          {actionError}
        </p>
      )}
      {error && (
        <p className="admin-alert admin-alert-error" role="alert">
          {error}
        </p>
      )}
      {isLoading && <p className="admin-message">Loading adoption requests...</p>}
      {!isLoading && !error && requests.length === 0 && (
        <section className="admin-empty-state">
          <span aria-hidden="true">📄</span>
          <h2>No adoption requests yet</h2>
          <p>New applications will appear here when someone applies to adopt.</p>
        </section>
      )}

      {!isLoading && !error && requests.length > 0 && (
        <section className="admin-request-list" aria-label="Adoption requests">
          {requests.map((request) => {
            const pet = request.petId;
            const status = request.status || "Pending";
            const isProcessing = processingId === String(request._id);

            return (
              <article className="admin-request-card" key={request._id}>
                <div className="admin-request-main">
                  {pet?.imagePath ? (
                    <img
                      className="admin-request-pet-image"
                      src={getPetImageUrl(pet.imagePath)}
                      alt={pet.name || "Requested pet"}
                    />
                  ) : (
                    <div className="admin-request-pet-image admin-image-placeholder" aria-hidden="true">
                      🐾
                    </div>
                  )}
                  <div className="admin-request-info">
                    <div className="admin-request-heading">
                      <div>
                        <h2>{request.fullName}</h2>
                        <p>{request.email}</p>
                      </div>
                      <span
                        className={`admin-status-badge status-${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="admin-request-pet">
                      Applying to adopt <strong>{pet?.name || "Unavailable pet"}</strong>
                      {request.phone && <span> · {request.phone}</span>}
                    </p>
                    <p className="admin-request-date">
                      Submitted {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="admin-request-actions">
                  <button
                    className="admin-secondary-button"
                    onClick={() => setSelectedRequest(request)}
                    type="button"
                  >
                    View details
                  </button>
                  {status === "Pending" && (
                    <>
                      <button
                        className="admin-approve-button"
                        disabled={Boolean(processingId)}
                        onClick={() => updateStatus(request, "Approved")}
                        type="button"
                      >
                        {isProcessing ? "Saving..." : "Approve"}
                      </button>
                      <button
                        className="admin-reject-button"
                        disabled={Boolean(processingId)}
                        onClick={() => updateStatus(request, "Rejected")}
                        type="button"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {selectedRequest && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setSelectedRequest(null)}
          role="presentation"
        >
          <section
            aria-labelledby="application-details-title"
            aria-modal="true"
            className="admin-detail-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">APPLICATION DETAILS</p>
                <h2 id="application-details-title">
                  {selectedRequest.fullName}
                </h2>
              </div>
              <button
                aria-label="Close application details"
                className="admin-modal-close"
                onClick={() => setSelectedRequest(null)}
                type="button"
              >
                ×
              </button>
            </header>
            <p className="admin-modal-summary">
              {selectedRequest.petId?.name || "Unavailable pet"} · Submitted{" "}
              {formatDate(selectedRequest.createdAt)}
            </p>
            <dl className="admin-detail-grid">
              {applicationFields.map(([field, label]) => {
                const value = selectedRequest[field];
                return (
                  <div className="admin-detail-item" key={field}>
                    <dt>{label}</dt>
                    <dd>
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : value || "Not provided"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdoptionRequests;
