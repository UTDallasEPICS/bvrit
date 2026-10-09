const serviceList = [
  {
    title: 'Veterinary Care',
    description: 'Healthy checkups and trusted support for every stage of your pet journey.'
  },
  {
    title: 'Grooming',
    description: 'Comfort-focused grooming to keep your pets clean, happy, and confident.'
  },
  {
    title: 'Pet Supplies',
    description: 'Essentials that make day-to-day care easier for both pets and owners.'
  },
  {
    title: 'Pet Boarding',
    description: 'A safe, friendly place for pets while you are away from home.'
  }
];

function Services() {
  return (
    <section className="services-section section-spacing">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Care Services</p>
          <h2>Everything your pet needs in one place</h2>
        </div>

        <div className="services-grid">
          {serviceList.map((service) => (
            <article key={service.title} className="service-card">
              <div className="service-icon" aria-hidden="true">✓</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
