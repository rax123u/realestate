import { useEffect, useState } from 'react';
import { testimonialAPI } from '../../api';
import { MEDIA } from '../../data/fallback';
import SectionHeader from '../ui/SectionHeader';

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
    <section id="stories" className="section-space quote-band">
      <div className="site-wrap">
        <SectionHeader
          eyebrow="Client notes"
          title="Trusted in private conversation."
        />
        <div className="quote-grid">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="quote-card">
              <p>&ldquo;{item.quote}&rdquo;</p>
              <footer>
                {item.avatar && <img src={item.avatar} alt="" />}
                <div>
                  <cite>{item.name}</cite>
                  <small>{item.role}</small>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
