import { Link } from 'react-router-dom';
import OptimizedImage from '../ui/OptimizedImage';
import SectionHeader from '../ui/SectionHeader';

const LOCATIONS = [
  { city: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80' },
  { city: 'Malibu', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80' },
  { city: 'Aspen', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=1200&q=80' },
  { city: 'Scottsdale', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80' },
];

export default function LocationsSection() {
  return (
    <section id="locations" className="section-space">
      <div className="site-wrap">
        <SectionHeader eyebrow="Locations" title="Places we represent." />
        <div className="location-grid">
          {LOCATIONS.map((item) => (
            <Link key={item.city} to={`/properties?city=${encodeURIComponent(item.city)}`} className="tile">
              <OptimizedImage src={item.image} alt={`${item.city} landscape`} width={900} sizes="(max-width: 768px) 100vw, 25vw" />
              <div className="tile__content">
                <p className="eyebrow eyebrow--light">Explore</p>
                <h3>{item.city}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
