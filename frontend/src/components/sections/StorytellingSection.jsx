import { motion } from 'framer-motion';
import { MEDIA } from '../../data/fallback';

export default function StorytellingSection() {
  const slides = MEDIA.storytelling;

  return (
    <section id="story" className="relative bg-luxury-black py-28 md:py-36 border-t border-white/5 overflow-hidden w-full">
      <div className="w-full max-w-[94%] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          
          {/* Left Sticky Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit flex flex-col justify-between">
            <div>
              <p className="text-subhead mb-3">Our Philosophy</p>
              <h2 className="text-3xl sm:text-4xl lg:text-4.5xl xl:text-5xl font-serif font-light text-luxury-cream mb-6 tracking-tight leading-tight">
                Architectural <br/>
                <span className="text-luxury-gold font-normal">Prestige</span>
              </h2>
              <p className="text-sm text-luxury-silver/80 font-light leading-relaxed max-w-md font-sans mb-8">
                We believe that a residence is more than just structure. It is a profound expression of your lifestyle, curated through visionary architecture, custom detailing, and location prestige.
              </p>
            </div>
            
            {/* Visual indicators */}
            <div className="hidden lg:flex flex-col gap-4 mt-8 pt-8 border-t border-white/5">
              {slides.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-luxury-gold/50">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-xs text-luxury-silver uppercase tracking-widest">{s.text.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Scrolling Visual Stack */}
          <div className="lg:col-span-7 space-y-20 md:space-y-32">
            {slides.map((slide, i) => (
              <div
                key={i}
                className="group relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/5 shadow-2xl bg-luxury-charcoal"
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.text}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-[1500ms] ease-out opacity-85"
                />
                
                {/* Dark overlay gradients for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/40 to-transparent" />

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 z-10">
                  <span className="text-[9px] font-semibold text-luxury-gold uppercase tracking-[0.3em] block mb-2">
                    Chapter {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl md:text-2.5xl font-serif font-light text-luxury-cream tracking-wide uppercase">
                    {slide.text}
                  </h3>
                </div>

                {/* Index Counter */}
                <div className="absolute top-6 right-6 text-white/30 text-xs font-semibold tracking-widest font-sans">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
