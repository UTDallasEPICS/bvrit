function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
          </div>
          <p>
            Helping pets find loving homes and families discover the joy of responsible care.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Adopt</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>

        <div>
          <h3>Services</h3>
          <ul className="footer-links">
            <li><a href="#">Veterinary Care</a></li>
            <li><a href="#">Grooming</a></li>
            <li><a href="#">Supplies</a></li>
            <li><a href="#">Boarding</a></li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-links">
            <li><a href="mailto:hello@pawgo.com">hello@pawgo.com</a></li>
            <li><a href="tel:+15550199">(555) 0199</a></li>
            <li>24 Pet Lane</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 PawGo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
