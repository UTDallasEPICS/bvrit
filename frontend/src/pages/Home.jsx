
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import PetCard from '../components/PetCard.jsx';
import Footer from '../components/Footer.jsx';
import { getHomeData } from '../services/homeService.js';

const features = [
  {
    icon: '❤',
    title: 'Find Loving Pets',
    description: 'Browse friendly companions that match your lifestyle and home.'
  },
  {
    icon: '✓',
    title: 'Trusted Adoption',
    description: 'A simple, safe process built around care, transparency, and peace of mind.'
  },
  {
    icon: 'AI',
    title: 'AI Pet Assistant',
    description: 'Helpful guidance for feeding, routines, and everyday care questions.'
  },
  
{
  icon: '✦',
  title: 'Personalized Pet Support',
  description: 'Get helpful guidance tailored to your pet’s needs, habits, and everyday routines.'
}


];

const samplePets = [
  {
    name: 'Ramu',
    age: '2 years',
    location: 'Nagole',
    status: 'Ready to adopt',
    image: 'src/assets/images-2.jpeg'
  },
  {
    name: 'Laxmi',
    age: '1 year',
    location: 'Nagole',
    status: 'New arrival',
        image: 'src/assets/catimage.webp'

  },
  {
    name: 'Bheema',
    age: '3 years',
    location: 'Nagole',
    status: 'Ready to adopt',
    image: 'src/assets/indiandog.jpg'
  }
];

function Home() {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      const data = await getHomeData();
      setHomeData(data);
    };

    loadHomeData();
  }, []);

  return (
    <>
      

      <main>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="container hero-grid">

            <div className="hero-copy">
              <p className="eyebrow">
                {homeData
                  ? homeData.message
                  : 'Pet adoption made simple'}
              </p>

              <h1>Find Your Perfect Companion</h1>

              <p className="hero-text">
                PawGo connects loving families with friendly pets and
                trusted care support, making every adoption feel safe,
                joyful, and personal.
              </p>

              <div className="hero-actions">
                <button type="button" className="primary-button">
                  Explore Pets
                </button>

                <button type="button" className="secondary-button">
                  Learn More
                </button>
              </div>

              <div className="hero-stats" aria-label="PawGo statistics">
                <div>
                  <strong>3.5k+</strong>
                  <span>Happy adoptions</span>
                </div>

                <div>
                  <strong>120+</strong>
                  <span>Trusted partners</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>AI assistance</span>
                </div>
              </div>
            </div>

            <div
              className="hero-visual"
              aria-label="Happy pets illustration"
            >
                <div className="pet-spotlight">
                <img
                 src="src/assets/indie dog.webp.avif"
                  alt="Happy dog sitting outdoors"
                />
              </div>

              <div className="floating-card floating-card-top">
                <span
                  className="dot success-dot"
                  aria-hidden="true"
                ></span>

                <div>
                  <strong>Verified</strong>
                  <p>Healthy & cared for</p>
                </div>
              </div>

              <div className="floating-card floating-card-bottom">
                <span
                  className="dot info-dot"
                  aria-hidden="true"
                ></span>

                <div>
                  <strong>AI Assistant</strong>
                  <p>Available anytime</p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* Features Section */}
        <section className="features-section section-spacing">
          <div className="container">

            <div className="section-heading">
              <p className="eyebrow">Why PawGo</p>

              <h2>
                Thoughtful support for every pet and family
              </h2>
            </div>

            <div className="feature-grid">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>

          </div>
        </section>


        {/* Adoption Section */}
        <section className="adoption-section section-spacing">
          <div className="container">

            <div className="section-heading split-heading">

              <div>
                <p className="eyebrow">Meet pets</p>

                <h2>
                  Meet Pets Looking for a Home
                </h2>
              </div>

              <button
                type="button"
                className="secondary-button"
              >
                View all pets
              </button>

            </div>

            <div className="pet-grid">
              {samplePets.map((pet) => (
                <PetCard
                  key={pet.name}
                  pet={pet}
                />
              ))}
            </div>

          </div>
        </section>


        {/* CTA Section */}
        <section className="cta-section section-spacing">
          <div className="container cta-box">

            <div>
              <p className="eyebrow">Start today</p>

              <h2>
                Every Pet Deserves a Loving Home
              </h2>
            </div>

            <button
              type="button"
              className="primary-button"
            >
              Start Your Journey
            </button>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Home;

