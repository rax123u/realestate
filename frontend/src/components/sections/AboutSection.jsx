import { Link } from 'react-router-dom';
import OptimizedImage from '../ui/OptimizedImage';

export default function AboutSection() {
  return (
    <section id="about" className="section-space">
      <div className="site-wrap featured-dev">
        <div>
          <p className="eyebrow">The practice</p>
          <h2 className="section-title">A brokerage with an architectural conscience.</h2>
          <p className="lede" style={{ marginTop: '1.5rem' }}>
            Aurelius is a real estate company first. We help clients search, compare, and acquire property with complete information — price, specification, location, and a clear path to viewing.
          </p>
          <p className="lede" style={{ marginTop: '1rem' }}>
            What we refuse is noise. Listings are photographed with care, written with precision, and presented so a serious buyer can decide.
          </p>
          <p style={{ marginTop: '1.75rem' }}>
            <Link to="/#contact" className="text-link">Request an introduction</Link>
          </p>
        </div>
        <div className="hero__media" style={{ minHeight: '28rem' }}>
          <OptimizedImage
            src="https://images.unsplash.com/photo-1600566753190-17f17baa2f2f?w=1400&q=80"
            alt="Interior of a considered contemporary home"
            width={1400}
            sizes="(max-width: 900px) 100vw, 48vw"
            className="hero__image"
          />
        </div>
      </div>
    </section>
  );
}
