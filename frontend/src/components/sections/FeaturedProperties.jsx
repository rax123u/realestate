import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyAPI, resolveImageUrl } from '../../api';
import { MEDIA, formatPrice } from '../../data/fallback';

function PropertyCard({ property }) {
  const imageUrl = property.image || property.images?.[0]?.url || property.primary_image;

  return (
    <div className="group glass-card overflow-hidden rounded-lg flex flex-col h-full">
      <Link to={`/properties/${property.id}`} className="block relative aspect-[4/5] overflow-hidden">
        {/* Float Status Badge */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-luxury-black/60 border border-white/10 backdrop-blur-md rounded">
          <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-luxury-gold">
            {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        <img
          src={resolveImageUrl(imageUrl)}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent pointer-events-none" />
      </Link>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-luxury-gold">
            {property.location}
          </span>
          <Link to={`/properties/${property.id}`} className="block mt-1.5 mb-3 group/title">
            <h3 className="text-xl md:text-2xl font-serif text-luxury-cream leading-tight font-light group-hover/title:text-luxury-gold transition-colors duration-300">
              {property.title}
            </h3>
          </Link>
          <p className="text-lg text-luxury-gold font-light tracking-wide">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Property Specs grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mt-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-luxury-cream">{property.bedrooms}</span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver mt-0.5">Beds</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/5">
            <span className="text-sm font-semibold text-luxury-cream">{property.bathrooms}</span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver mt-0.5">Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-luxury-cream">
              {property.area?.toLocaleString()}
            </span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver mt-0.5">Sq Ft</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState(
    MEDIA.properties.filter((p) => p.featured)
  );

  useEffect(() => {
    propertyAPI
      .featured()
      .then(({ data }) => {
        if (data?.length) setProperties(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="featured" className="py-28 md:py-36 px-6 bg-luxury-black relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[94%] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-subhead mb-3">Exclusive Listings</p>
            <h2 className="text-headline text-luxury-cream">
              Elevate Your Property Experience
            </h2>
          </div>
          <Link 
            to="/properties"
            className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold hover:text-luxury-cream flex items-center gap-1.5 transition-colors font-semibold group self-start md:self-end"
          >
            Browse All Listings
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
