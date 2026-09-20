import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link to="/" className="logo">Aurelius</Link>
          <p className="lede" style={{ marginTop: '1.35rem', fontSize: '1.02rem' }}>
            Private residences and architectural estates, presented with the clarity of a journal and the care of a private office.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/properties">All residences</Link></li>
            <li><Link to="/#featured">Featured</Link></li>
            <li><Link to="/#locations">Locations</Link></li>
            <li><Link to="/#journal">Journal</Link></li>
          </ul>
        </div>

        <div>
          <h4>Clients</h4>
          <ul>
            <li><Link to="/login">Sign in</Link></li>
            <li><Link to="/register">Create account</Link></li>
            <li><Link to="/my-listings">Agent workspace</Link></li>
            <li><Link to="/#contact">Request a viewing</Link></li>
          </ul>
        </div>

        <div>
          <h4>Private list</h4>
          <p className="lede" style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
            New releases and off-market notes, sent sparingly.
          </p>
          {joined ? (
            <p className="eyebrow" style={{ margin: 0, color: 'var(--color-accent-soft)' }}>You are on the list.</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <label className="sr-only" htmlFor="newsletter-email">Email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Email address"
                className="field field--on-dark"
                style={{ flex: 1 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-base btn-on-dark">Join</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aurelius. All rights reserved.</p>
        <p>Estates · Architecture · Representation</p>
      </div>
    </footer>
  );
}
