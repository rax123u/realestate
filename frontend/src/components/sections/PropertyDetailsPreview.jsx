import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { propertyAPI, resolveImageUrl } from '../../api';
import { MEDIA, formatPrice } from '../../data/fallback';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function PropertyDetailsPreview() {
  const [property, setProperty] = useState(MEDIA.properties[0]);

  useEffect(() => {
    propertyAPI
      .featured()
      .then(({ data }) => {
        if (data?.[0]) setProperty(data[0]);
      })
      .catch(() => {});
  }, []);

  const images = property.images?.length
    ? property.images
    : [
        { url: property.image },
        { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80' },
        { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80' },
        { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80' },
      ];

  const amenities = property.amenities || [
    'Infinity Pool',
    'Private Cinema',
    'Wine Cellar',
    'Smart Home System',
    'Rooftop Terrace',
    'Concierge Service',
  ];

  return (
    <section id="details" className="py-28 md:py-36 bg-luxury-charcoal relative overflow-hidden w-full">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-luxury-gold/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[94%] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-6">
        <div className="mb-16">
          <p className="text-subhead mb-3">Property Preview</p>
          <h2 className="text-headline text-luxury-cream">Architecture That Inspires</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Swiper Gallery */}
          <div className="lg:col-span-6 relative border border-white/5 rounded-lg overflow-hidden shadow-2xl">
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              effect="fade"
              navigation
              pagination={{ clickable: true }}
              className="aspect-[4/3] w-full"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={resolveImageUrl(img.url || img)}
                    alt={`${property.title} - ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Details Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-luxury-gold" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-luxury-gold">
                {property.location}
              </p>
            </div>
            
            <h3 className="text-3xl md:text-4.5xl font-serif text-luxury-cream mb-4 font-light leading-tight">
              {property.title}
            </h3>
            
            <p className="text-xl md:text-2xl text-luxury-gold font-light tracking-wide mb-8">
              {formatPrice(property.price)}
            </p>

            <p className="text-sm text-luxury-silver/80 font-light leading-relaxed mb-8 font-sans">
              {property.description ||
                'An extraordinary residence that redefines luxury living. Meticulously crafted with the finest materials and cutting-edge design, this property offers an unparalleled lifestyle experience.'}
            </p>

            {/* Stats block */}
            <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-y border-white/5 text-center">
              <div>
                <p className="text-3xl font-serif font-light text-luxury-cream">{property.bedrooms}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver mt-1.5">Bedrooms</p>
              </div>
              <div className="border-x border-white/5">
                <p className="text-3xl font-serif font-light text-luxury-cream">{property.bathrooms}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver mt-1.5">Bathrooms</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-light text-luxury-cream">
                  {property.area?.toLocaleString()}
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver mt-1.5">Sq Ft</p>
              </div>
            </div>

            {/* Amenities block */}
            <div className="mb-10">
              <p className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver mb-4 font-semibold">
                Featured Amenities
              </p>
              <div className="flex flex-wrap gap-2.5">
                {amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3.5 py-1.5 text-[10px] font-medium tracking-wider uppercase border border-white/5 bg-luxury-black/30 text-luxury-silver hover:border-luxury-gold/30 hover:text-luxury-cream transition-colors duration-300 rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <Button href="#contact" className="self-start shadow-[0_0_15px_var(--color-luxury-gold-glow)]">
              Book Viewing
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
