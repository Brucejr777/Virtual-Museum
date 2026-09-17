import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-feature">
        <div>
          <p className="eyebrow light">Open every day</p>
          <h2>Carry the museum<br />wherever you go.</h2>
        </div>
        <Link className="button button-light" to="/collections">Browse all collections</Link>
      </div>
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand footer-brand-name" to="/">
            <span className="brand-mark" aria-hidden="true">M</span>
            <span><strong>Meridian</strong><small>Archive</small></span>
          </Link>
          <p>A borderless museum for the objects, ideas, and makers that shaped our shared imagination.</p>
        </div>
        <div className="footer-column">
          <h3>Visit</h3>
          <Link to="/exhibitions">Exhibitions</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/timeline">Timeline</Link>
          <Link to="/favorites">My collection</Link>
        </div>
        <div className="footer-column">
          <h3>Discover</h3>
          <Link to="/artists">Artists</Link>
          <Link to="/search">Search</Link>
          <Link to="/about">Our story</Link>
          <Link to="/about#contact">Contact</Link>
        </div>
        <div className="footer-column footer-newsletter">
          <h3>Field notes</h3>
          <p>Occasional dispatches from the archive, without the noise.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" placeholder="Your email address" required />
            <button type="submit" aria-label="Subscribe">→</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 The Meridian Archive. A fictional cultural institution.</p>
        <p>Images from public-domain and open-access collections.</p>
        <Link to="/about">Accessibility</Link>
      </div>
    </footer>
  );
}
