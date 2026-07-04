import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Browse', href: '/properties' },
  { label: 'Featured', href: '/#featured' },
  { label: 'Showcase', href: '/#showcase' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, canManageListings, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      const targetId = href.substring(2);
      if (isHome) {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          if (window.lenis) {
            window.lenis.scrollTo(target, { offset: -80, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          setMenuOpen(false);
        }
      }
    }
  };

  const showSolid = scrolled || !isHome;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolid 
          ? 'bg-luxury-black/85 border-b border-white/5 py-4 backdrop-blur-lg' 
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-[92%] mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-lg font-medium tracking-[0.35em] uppercase text-luxury-cream hover:text-luxury-gold transition-colors duration-300"
        >
          Aurelius
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-[10px] font-semibold uppercase tracking-[0.25em] text-luxury-silver hover:text-luxury-gold transition-colors duration-300 py-2 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions panel */}
        <div className="hidden md:flex items-center gap-8">
          {canManageListings && !isAdmin && (
            <Link
              to="/my-listings"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-gold hover:text-luxury-cream transition-colors duration-300"
            >
              My Listings
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-gold hover:text-luxury-cream transition-colors duration-300"
            >
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={logout}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-silver hover:text-luxury-cream transition-colors duration-300 cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-cream border border-white/10 hover:border-luxury-gold px-5 py-2.5 rounded transition-all duration-300 hover:text-luxury-gold hover:shadow-[0_0_15px_var(--color-luxury-gold-glow)]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger menu */}
        <button
          className="md:hidden text-luxury-cream cursor-pointer p-2 hover:text-luxury-gold transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M4 4l12 12M4 16L16 4" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drop-down Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-luxury-black/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    if (!link.href.startsWith('/#')) setMenuOpen(false);
                  }}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-silver hover:text-luxury-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <hr className="border-white/5 my-2" />

              {canManageListings && !isAdmin && (
                <Link 
                  to="/my-listings" 
                  onClick={() => setMenuOpen(false)} 
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold"
                >
                  My Listings
                </Link>
              )}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={() => setMenuOpen(false)} 
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold"
                >
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <button 
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }} 
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-left text-luxury-silver cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)} 
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-cream hover:text-luxury-gold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
