import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { propertyAPI, resolveImageUrl } from '../../api';
import { MEDIA, formatPrice } from '../../data/fallback';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HorizontalShowcase() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    propertyAPI
      .showcase()
      .then(({ data }) => {
        if (data?.length) {
          setProperties(data);
        } else {
          setProperties(MEDIA.properties.filter((p) => p.showcase));
        }
      })
      .catch(() => {
        setProperties(MEDIA.properties.filter((p) => p.showcase));
      });
  }, []);

  return (
    <section id="showcase" className="relative bg-luxury-black py-28 px-6 overflow-hidden w-full">
      {/* Decorative subtle background mesh */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="w-full max-w-[92%] mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-subhead mb-3">Curated Collection</p>
          <h2 className="text-headline text-luxury-cream">Signature Estates</h2>
        </div>
        <p className="text-sm text-luxury-silver/60 max-w-sm font-light">
          A showcase of our most elite properties featuring unparalleled craftsmanship and architectural prestige.
        </p>
      </div>

      <div className="w-full max-w-[92%] mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          className="aspect-[21/10] md:aspect-[21/9] w-full border border-white/5 rounded-lg overflow-hidden shadow-2xl"
        >
          {properties.map((property) => {
            const imageUrl = property.image || property.primary_image;
            return (
              <SwiperSlide key={property.id} className="relative bg-luxury-charcoal flex items-end">
                <img
                  src={resolveImageUrl(imageUrl)}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Visual fade-to-bottom and side gradients for enhanced text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/35 to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/80 via-transparent to-transparent hidden md:block z-0" />

                {/* Glassmorphic Property details info panel */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 max-w-xl p-6 md:p-8 glass-panel rounded-lg z-10 hover:border-luxury-gold/30 transition-all duration-500 shadow-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    <p className="text-[9px] uppercase tracking-[0.25em] text-luxury-gold font-semibold">
                      {property.location}
                    </p>
                  </div>
                  
                  <Link to={`/properties/${property.id}`} className="group inline-block mb-3">
                    <h3 className="text-2xl md:text-3.5xl font-serif text-luxury-cream leading-tight font-light group-hover:text-luxury-gold transition-colors duration-300">
                      {property.title}
                    </h3>
                  </Link>

                  <div className="flex items-baseline justify-between border-t border-white/5 pt-4 mt-2">
                    <p className="text-lg md:text-xl text-luxury-gold font-medium">
                      {formatPrice(property.price)}
                    </p>
                    
                    <Link 
                      to={`/properties/${property.id}`}
                      className="text-[9px] uppercase tracking-[0.2em] text-luxury-cream hover:text-luxury-gold flex items-center gap-1.5 transition-colors group"
                    >
                      View Details
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
