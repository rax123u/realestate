import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-luxury-black text-luxury-cream pt-24 pb-12 px-6 relative overflow-hidden w-full">
      {/* Subtle border grids */}
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-[94%] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 relative z-10">
        
        {/* Branding Column */}
        <div className="lg:col-span-5 space-y-6">
          <Link to="/" className="text-xl font-medium tracking-[0.35em] uppercase text-luxury-cream hover:text-luxury-gold transition-colors duration-300">
            Aurelius
          </Link>
          <p className="text-sm text-luxury-silver/80 leading-relaxed max-w-sm font-light">
            Discover architectural masterpieces and exclusive luxury estates curated for those who demand the extraordinary. Guided by design excellence.
          </p>
          <div className="flex gap-3 pt-2">
            {['instagram', 'linkedin', 'twitter', 'facebook'].map((social) => (
              <a
                key={social}
                href={`https://${social}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/5 bg-luxury-charcoal flex items-center justify-center text-luxury-silver hover:text-luxury-gold hover:border-luxury-gold hover:-translate-y-1 transition-all duration-300 shadow-md"
                aria-label={`Follow us on ${social}`}
              >
                <span className="capitalize text-xs font-semibold">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Explore Column */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-semibold">Explore</h4>
          <ul className="space-y-3.5">
            <li>
              <Link to="/properties" className="text-xs uppercase tracking-widest text-luxury-silver hover:text-luxury-cream transition-colors duration-300">
                Browse properties
              </Link>
            </li>
            <li>
              <a href="/#featured" className="text-xs uppercase tracking-widest text-luxury-silver hover:text-luxury-cream transition-colors duration-300">
                Featured estates
              </a>
            </li>
            <li>
              <a href="/#showcase" className="text-xs uppercase tracking-widest text-luxury-silver hover:text-luxury-cream transition-colors duration-300">
                Signature line
              </a>
            </li>
          </ul>
        </div>

        {/* Portals Column */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-semibold">Portals</h4>
          <ul className="space-y-3.5">
            <li>
              <Link to="/login" className="text-xs uppercase tracking-widest text-luxury-silver hover:text-luxury-cream transition-colors duration-300">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-xs uppercase tracking-widest text-luxury-silver hover:text-luxury-cream transition-colors duration-300">
                Register account
              </Link>
            </li>
            <li>
              <Link to="/my-listings" className="text-xs uppercase tracking-widest text-luxury-silver hover:text-luxury-cream transition-colors duration-300">
                Agent dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-3 space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-semibold">Newsletter</h4>
          <p className="text-xs text-luxury-silver/80 leading-relaxed font-light">
            Subscribe to receive private listings, architectural releases, and bespoke market insights directly.
          </p>
          <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="bg-luxury-charcoal/60 border border-white/5 focus:border-luxury-gold/50 px-4 py-3 text-xs text-luxury-cream focus:outline-none transition-colors rounded placeholder-luxury-silver/40"
            />
            <button
              type="submit"
              className="w-full bg-luxury-gold text-luxury-black font-semibold text-[10px] uppercase tracking-[0.2em] py-3.5 hover:bg-luxury-cream transition-all duration-300 rounded cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="w-full max-w-[94%] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <p className="text-[10px] uppercase tracking-wider text-luxury-silver/70">
          &copy; {new Date().getFullYear()} Aurelius Luxury Real Estate. All rights reserved.
        </p>
        <div className="flex gap-6 text-[10px] uppercase tracking-wider text-luxury-silver/70">
          <a href="#" className="hover:text-luxury-cream transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-luxury-cream transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
