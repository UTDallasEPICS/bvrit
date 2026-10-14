function PetCard({ pet }) {
  return (
    <article className="pet-card">
      <img src={pet.image} alt={pet.name} className="pet-image" />
      <div className="pet-card-body">
        <div className="pet-card-header">
          <div>
            <h3>{pet.name}</h3>
            <p>{pet.breed}</p>
          </div>
          <span className="pet-status">{pet.status}</span>
        </div>

        <ul className="pet-meta">
          <li>{pet.age}</li>
          <li>{pet.location}</li>
        </ul>

        <button type="button" className="secondary-button pet-button">
          View Details
        </button>
      </div>
    </article>
  );
}

export default PetCard;
