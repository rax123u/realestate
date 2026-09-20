import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI, resolveImageUrl } from '../../api';
import { MEDIA, formatPrice } from '../../data/fallback';
import { propertyImage } from '../../lib/images';
import Button from '../ui/Button';
import OptimizedImage from '../ui/OptimizedImage';

export default function FeaturedDevelopment() {
  const [property, setProperty] = useState(MEDIA.properties[0]);

  useEffect(() => {
    propertyAPI
      .showcase()
      .then(({ data }) => {
        if (data?.[0]) setProperty(data[0]);
      })
      .catch(() => {});
  }, []);

  const image = resolveImageUrl(propertyImage(property));
  const amenities = property.amenities?.length
    ? property.amenities.slice(0, 6)
    : ['Pool', 'Garden', 'Smart home', 'Terrace', 'Garage', 'Security'];

  return (
    <section id="development" className="section-space" style={{ background: 'var(--color-paper-2)' }}>
      <div className="site-wrap featured-dev">
        <div className="featured-dev__media">
          <OptimizedImage
            src={image}
            alt={property.title}
            className="hero__image"
            width={1400}
            sizes="(max-width: 900px) 100vw, 48vw"
          />
        </div>
        <div>
          <p className="eyebrow">In focus</p>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>{property.title}</h2>
          <p className="lede" style={{ margin: '1.2rem 0' }}>
            {property.description
              || 'A quietly composed residence where proportion, landscape, and material do the work of luxury.'}
          </p>
          <p style={{ fontSize: '1.35rem', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
            {formatPrice(property.price)}
          </p>
          <dl className="property-card__specs" style={{ marginBottom: '1.5rem' }}>
            <div>
              <dt>Beds</dt>
              <dd>{property.bedrooms}</dd>
            </div>
            <div>
              <dt>Baths</dt>
              <dd>{property.bathrooms}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>{property.area?.toLocaleString()} ft²</dd>
            </div>
          </dl>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', listStyle: 'none' }}>
            {amenities.map((item) => (
              <li key={item} style={{ border: '1px solid var(--color-line)', padding: '0.4rem 0.7rem', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {item}
              </li>
            ))}
          </ul>
          <Button to={`/properties/${property.id}`}>View this residence</Button>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/properties" className="text-link">See the full collection</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
