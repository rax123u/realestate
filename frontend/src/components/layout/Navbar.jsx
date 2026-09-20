import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Residences', href: '/properties' },
  { label: 'Featured', href: '/#featured' },
  { label: 'Locations', href: '/#locations' },
  { label: 'Journal', href: '/#journal' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar({ overlay = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, canManageListings, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const overHero = overlay || (isHome && !scrolled && !menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, href) => {
    if (!href.startsWith('/#')) return;
    const targetId = href.substring(2);
    if (!isHome) return;
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    if (window.lenis) window.lenis.scrollTo(target, { offset: -72, duration: 1.1 });
    else target.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={`site-header ${overHero ? 'is-over-hero' : 'is-solid'}`}>
      <div className="site-header__inner">
        <Link to="/" className="logo">Aurelius</Link>

        <nav className="nav-links" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={(e) => handleNavClick(e, link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {canManageListings && !isAdmin && <Link to="/my-listings">Workspace</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
          {user ? (
            <button type="button" onClick={logout}>Sign out</button>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
          <Link to="/properties" className="btn-base btn-luxury-solid" style={{ minHeight: '2.55rem', padding: '0.5rem 1.05rem' }}>
            Browse
          </Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M4 4l14 14M4 18L18 4" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div id="mobile-nav" className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>
        {navLinks.map((link) => (
          <Link key={link.href} to={link.href} onClick={(e) => handleNavClick(e, link.href)}>
            {link.label}
          </Link>
        ))}
        {canManageListings && !isAdmin && <Link to="/my-listings">Workspace</Link>}
        {isAdmin && <Link to="/admin">Admin</Link>}
        {user ? (
          <button type="button" onClick={logout}>Sign out</button>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
        <Link to="/properties">Browse residences</Link>
      </div>
    </header>
  );
}
