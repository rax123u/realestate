import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { propertyAPI, inquiryAPI, resolveImageUrl } from '../api';
import { MEDIA, formatPrice } from '../data/fallback';
import { useAuth } from '../context/AuthContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    propertyAPI
      .get(id)
      .then(({ data }) => setProperty(data))
      .catch(() => {
        const fallback = MEDIA.properties.find((p) => p.id === Number(id));
        setProperty(fallback || MEDIA.properties[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      setInquiryForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setInquiryStatus({ type: '', message: '' });

    try {
      await inquiryAPI.create({
        ...inquiryForm,
        property_id: Number(id),
      });
      setInquiryStatus({ type: 'success', message: 'Your inquiry has been sent. We will contact you shortly.' });
      setInquiryForm({ name: user?.name || '', email: user?.email || '', message: '' });
    } catch {
      setInquiryStatus({ type: 'error', message: 'Failed to send inquiry. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-10 h-10 border border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center gap-4">
        <p className="text-luxury-silver font-light">Property not found</p>
        <Link to="/properties" className="text-luxury-gold text-xs uppercase tracking-widest hover:underline">Browse Properties</Link>
      </div>
    );
  }

  const images = property.images?.length
    ? property.images.map(img => ({ ...img, url: resolveImageUrl(img.url) }))
    : [{ url: resolveImageUrl(property.image || property.primary_image) }];

  const amenities = property.amenities?.length
    ? property.amenities
    : ['Infinity Pool', 'Private Cinema', 'Wine Cellar', 'Smart Home', 'Rooftop Terrace', 'Concierge'];

  const statusLabel = {
    active: 'Available',
    sold: 'Sold',
    rented: 'Rented',
    expired: 'Expired',
  };

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-luxury-black min-h-screen relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[92%] mx-auto px-6 relative z-10 font-sans">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/properties" className="text-[10px] uppercase tracking-[0.25em] text-luxury-silver hover:text-luxury-gold mb-8 inline-flex items-center gap-2 group transition-colors">
              <span className="group-hover:-translate-x-1.5 transition-transform duration-300">&larr;</span> Back to listings
            </Link>

            {/* Main Immersive Slider */}
            <div className="border border-white/5 rounded-lg overflow-hidden shadow-2xl mb-16">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="aspect-[21/10] md:aspect-[21/9] w-full"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img 
                      src={img.url || img} 
                      alt={`${property.title} ${i + 1}`} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Content Panel (Left) */}
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <div className="flex flex-wrap gap-2.5 mb-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-luxury-gold bg-luxury-gold/10 px-2.5 py-1 rounded">
                      {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-luxury-silver bg-white/5 px-2.5 py-1 rounded">
                      {property.property_type}
                    </span>
                    {property.status && (
                      <span className={`text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 rounded border ${
                        property.status === 'active' 
                          ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                          : 'border-white/10 bg-white/5 text-luxury-silver'
                      }`}>
                        {statusLabel[property.status] || property.status}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-luxury-gold">
                    {property.city} — {property.location}
                  </span>
                  
                  <h1 className="text-4xl md:text-5xl font-serif text-luxury-cream mt-2 mb-4 font-light leading-tight">
                    {property.title}
                  </h1>
                  
                  <p className="text-2.5xl text-luxury-gold font-light tracking-wide">
                    {formatPrice(property.price)}
                  </p>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-cream font-semibold mb-4">Overview</h3>
                  <p className="text-luxury-silver/95 leading-relaxed font-light font-sans text-base">
                    {property.description || 'An extraordinary luxury residence offering Market-leading design, ultimate comfort, and sophistication.'}
                  </p>
                </div>
              </div>

              {/* Sidebar Panel (Right) */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Stats summary */}
                <div className="p-6 md:p-8 glass-panel rounded-lg hover:border-luxury-gold/10 transition-colors shadow-xl">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-serif font-light text-luxury-cream">{property.bedrooms}</p>
                      <p className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver/80 mt-1">Beds</p>
                    </div>
                    <div className="border-x border-white/5">
                      <p className="text-2xl font-serif font-light text-luxury-cream">{property.bathrooms}</p>
                      <p className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver/80 mt-1">Baths</p>
                    </div>
                    <div>
                      <p className="text-2xl font-serif font-light text-luxury-cream">{property.area?.toLocaleString()}</p>
                      <p className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver/80 mt-1">Sq Ft</p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="p-6 md:p-8 glass-panel rounded-lg hover:border-luxury-gold/10 transition-colors shadow-xl">
                  <h4 className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver font-semibold mb-4">Specifications</h4>
                  <ul className="space-y-3">
                    {amenities.map((a) => (
                      <li key={a} className="text-xs text-luxury-silver/90 flex items-center gap-3 font-light">
                        <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lead Inquiry Form */}
                {property.status === 'active' && (
                  <div className="p-6 md:p-8 glass-panel rounded-lg hover:border-luxury-gold/10 transition-colors shadow-xl">
                    <h4 className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver font-semibold mb-5">Inquire About This Estate</h4>
                    
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        required
                        className="w-full bg-luxury-black/35 border border-white/5 focus:border-luxury-gold/50 px-4 py-3 text-xs text-luxury-cream focus:outline-none transition-colors rounded placeholder-luxury-silver/20"
                      />
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        required
                        className="w-full bg-luxury-black/35 border border-white/5 focus:border-luxury-gold/50 px-4 py-3 text-xs text-luxury-cream focus:outline-none transition-colors rounded placeholder-luxury-silver/20"
                      />
                      <textarea
                        placeholder="Type message details..."
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        required
                        rows={3}
                        className="w-full bg-luxury-black/35 border border-white/5 focus:border-luxury-gold/50 px-4 py-3 text-xs text-luxury-cream focus:outline-none transition-colors resize-none rounded placeholder-luxury-silver/20"
                      />
                      
                      {inquiryStatus.message && (
                        <p className={`text-[10px] font-medium tracking-wide ${inquiryStatus.type === 'success' ? 'text-luxury-gold' : 'text-red-400'}`}>
                          {inquiryStatus.message}
                        </p>
                      )}
                      
                      <Button type="submit" disabled={submitting} className="w-full py-3.5 mt-2 shadow-[0_0_15px_var(--color-luxury-gold-glow)]">
                        {submitting ? 'Sending...' : 'Submit Inquiry'}
                      </Button>
                    </form>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
