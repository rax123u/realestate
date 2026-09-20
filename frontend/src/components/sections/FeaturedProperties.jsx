import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI } from '../../api';
import { MEDIA } from '../../data/fallback';
import { fadeUp } from '../../lib/motion';
import useFavorites from '../../hooks/useFavorites';
import PropertyCard from '../ui/PropertyCard';
import SectionHeader from '../ui/SectionHeader';

export default function FeaturedProperties() {
  const sectionRef = useRef(null);
  const { isSaved, toggle, user } = useFavorites();
  const [properties, setProperties] = useState(
    MEDIA.properties.filter((p) => p.featured).slice(0, 3),
  );

  useEffect(() => {
    propertyAPI
      .featured()
      .then(({ data }) => {
        if (data?.length) setProperties(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.property-card');
    if (!cards?.length) return undefined;
    return fadeUp(cards, { trigger: sectionRef.current, stagger: 0.12 });
  }, [properties]);

  return (
    <section id="featured" className="section-space" ref={sectionRef}>
      <div className="site-wrap">
        <SectionHeader
          eyebrow="Featured residences"
          title="Homes worth lingering over."
          action={<Link to="/properties" className="text-link">All listings</Link>}
        />
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              saved={isSaved(property.id)}
              signedIn={Boolean(user)}
              onToggleSave={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
