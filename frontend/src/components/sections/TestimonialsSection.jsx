import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { testimonialAPI } from '../../api';
import { MEDIA } from '../../data/fallback';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(MEDIA.testimonials);

  useEffect(() => {
    testimonialAPI
      .list()
      .then(({ data }) => {
        if (data?.length) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-28 md:py-36 px-6 bg-luxury-black relative overflow-hidden w-full">
      {/* Decorative ambient background orb */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[94%] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-subhead mb-3">Client Stories</p>
          <h2 className="text-headline text-luxury-cream">Trusted by Discerning Clients</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-card p-8 md:p-10 rounded-lg flex flex-col justify-between"
            >
              <div>
                <svg className="w-8 h-8 text-luxury-gold mb-6 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm text-luxury-silver/90 font-light leading-relaxed mb-8 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-2">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-luxury-gold/30"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-sm text-luxury-cream">{t.name}</p>
                  <p className="text-[10px] text-luxury-silver/80 uppercase tracking-widest mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
