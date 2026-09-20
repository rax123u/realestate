import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import PropertyCard from '../components/ui/PropertyCard';
import OptimizedImage from '../components/ui/OptimizedImage';
import { propertyAPI, inquiryAPI, resolveImageUrl } from '../api';
import { MEDIA, formatPrice } from '../data/fallback';
import { useAuth } from '../context/AuthContext';
import useFavorites from '../hooks/useFavorites';
import { propertyImage } from '../lib/images';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isSaved, toggle } = useFavorites();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '', viewing: true });
  const [inquiryStatus, setInquiryStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setInquiryStatus({ type: '', message: '' });
    propertyAPI
      .get(id)
      .then(({ data }) => setProperty(data))
      .catch(() => {
        const fallback = MEDIA.properties.find((p) => p.id === Number(id));
        setProperty(fallback || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    propertyAPI
      .list({ per_page: 4, city: property?.city })
      .then(({ data }) => {
        const list = data.data || data || [];
        setSimilar(list.filter((item) => String(item.id) !== String(id)).slice(0, 3));
      })
      .catch(() => setSimilar(MEDIA.properties.filter((p) => String(p.id) !== String(id)).slice(0, 3)));
  }, [id, property?.city]);

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
        name: inquiryForm.name,
        email: inquiryForm.email,
        message: inquiryForm.viewing
          ? `Schedule viewing request for ${property.title}.\n\n${inquiryForm.message}`
          : inquiryForm.message,
        property_id: Number(id),
      });
      setInquiryStatus({ type: 'success', message: 'Enquiry sent. We will contact you shortly.' });
      setInquiryForm({ name: user?.name || '', email: user?.email || '', message: '', viewing: true });
    } catch {
      setInquiryStatus({ type: 'error', message: 'Failed to send enquiry. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="site-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
            <div className="spinner" aria-label="Loading residence" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="site-wrap empty-state">
            <h1 className="section-title" style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Property not found.</h1>
            <Link to="/properties" className="text-link">Browse listings</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const images = property.images?.length
    ? property.images.map((img) => resolveImageUrl(img.url))
    : [resolveImageUrl(propertyImage(property))].filter(Boolean);

  const amenities = property.amenities?.length
    ? property.amenities
    : ['Infinity Pool', 'Private Cinema', 'Wine Cellar', 'Smart Home', 'Rooftop Terrace', 'Concierge'];

  const statusLabel = {
    active: 'Available',
    sold: 'Sold',
    rented: 'Rented',
    expired: 'Expired',
  };

  const agent = property.agent || MEDIA.agent;
  const main = images[activeImage] || images[0];
  const thumbs = images.filter((_, i) => i !== activeImage).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="site-wrap">
          <Link to="/properties" className="text-link" style={{ display: 'inline-block', marginBottom: '1.75rem' }}>
            Back to listings
          </Link>

          <div className={`detail-gallery ${images.length < 2 ? 'is-single' : ''}`}>
            <button
              type="button"
              className="detail-gallery__main"
              onClick={() => images.length > 1 && setActiveImage((i) => (i + 1) % images.length)}
              aria-label="Show next photograph"
              style={{ border: 0, padding: 0, cursor: images.length > 1 ? 'pointer' : 'default' }}
            >
              {main && (
                <OptimizedImage src={main} alt={`${property.title}, photograph ${activeImage + 1}`} width={1600} eager sizes="(max-width: 900px) 100vw, 70vw" />
              )}
            </button>
            <div className="detail-gallery__side">
              {thumbs.map((url, i) => {
                const index = images.indexOf(url);
                return (
                  <button
                    key={url + i}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View photograph ${index + 1}`}
                    style={{ border: 0, padding: 0, cursor: 'pointer', minHeight: '30vh' }}
                  >
                    <OptimizedImage src={url} alt="" width={800} sizes="30vw" />
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(280px, 0.85fr)', gap: '3rem' }} className="detail-layout">
            <div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
                <span className={`pill ${property.listing_type === 'rent' ? 'pill--rent' : 'pill--sale'}`}>
                  {property.listing_type === 'rent' ? 'For rent' : 'For sale'}
                </span>
                {property.property_type && <span className="pill">{property.property_type}</span>}
                {property.status && (
                  <span className={`pill ${property.status === 'active' ? 'pill--active' : 'pill--sold'}`}>
                    {statusLabel[property.status] || property.status}
                  </span>
                )}
              </div>
              <p className="eyebrow">{[property.city, property.location].filter(Boolean).join(' — ')}</p>
              <h1 className="section-title">{property.title}</h1>
              <p style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--color-accent)', margin: '1rem 0 2rem' }}>
                {formatPrice(property.price)}
              </p>

              <dl className="property-card__specs" style={{ maxWidth: '28rem', marginBottom: '2.5rem' }}>
                <div>
                  <dt>Bedrooms</dt>
                  <dd>{property.bedrooms ?? '—'}</dd>
                </div>
                <div>
                  <dt>Bathrooms</dt>
                  <dd>{property.bathrooms ?? '—'}</dd>
                </div>
                <div>
                  <dt>Area</dt>
                  <dd>{property.area ? `${property.area.toLocaleString()} ft²` : '—'}</dd>
                </div>
              </dl>

              <h2 className="eyebrow">Description</h2>
              <p className="lede" style={{ marginBottom: '2.5rem' }}>
                {property.description || 'An extraordinary residence offering considered design, comfort, and a precise relationship to its site.'}
              </p>

              <h2 className="eyebrow">Features</h2>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 1.5rem', listStyle: 'none', marginBottom: '2.5rem' }}>
                {amenities.map((item) => (
                  <li key={item} style={{ borderTop: '1px solid var(--color-line)', paddingTop: '0.6rem' }}>{item}</li>
                ))}
              </ul>

              <h2 className="eyebrow">Location</h2>
              <p className="lede">{property.location}{property.city ? `, ${property.city}` : ''}</p>
              {property.city && (
                <p style={{ marginTop: '0.75rem' }}>
                  <Link to={`/properties?city=${encodeURIComponent(property.city)}`} className="text-link">
                    More in {property.city}
                  </Link>
                </p>
              )}

              <div className="editorial-panel" style={{ padding: '1.5rem', marginTop: '2.5rem' }}>
                <p className="eyebrow">Advisor</p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 400 }}>{agent.name}</h3>
                <p style={{ color: 'var(--color-ink-soft)' }}>{agent.title || 'Private client advisor'}</p>
                {agent.phone && <p style={{ marginTop: '0.75rem' }}><a href={`tel:${agent.phone}`}>{agent.phone}</a></p>}
                {agent.email && <p><a href={`mailto:${agent.email}`}>{agent.email}</a></p>}
              </div>
            </div>

            <aside className="sticky-cta">
              <div className="editorial-panel" style={{ padding: '1.6rem' }}>
                <h2 className="eyebrow">Enquire / viewing</h2>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', lineHeight: 1, marginBottom: '1rem' }}>
                  {formatPrice(property.price)}
                </p>
                <button
                  type="button"
                  className={`save-btn ${isSaved(property.id) ? 'is-saved' : ''}`}
                  onClick={() => (user ? toggle(property.id) : navigate('/login'))}
                  style={{ marginBottom: '1.25rem' }}
                >
                  {isSaved(property.id) ? 'Saved to your list' : 'Save this residence'}
                </button>
                {property.status === 'active' || !property.status ? (
                  <form onSubmit={handleInquirySubmit} style={{ display: 'grid', gap: '0.75rem' }}>
                    <input
                      required
                      placeholder="Name"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="field"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="field"
                    />
                    <textarea
                      required
                      placeholder="Preferred dates, questions, or notes"
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="luxury-textarea-field"
                      rows={4}
                    />
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={inquiryForm.viewing}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, viewing: e.target.checked })}
                      />
                      Schedule a viewing
                    </label>
                    {inquiryStatus.message && (
                      <p role="status" className={inquiryStatus.type === 'success' ? 'form-status--ok' : 'form-status--err'}>
                        {inquiryStatus.message}
                      </p>
                    )}
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Sending…' : 'Send enquiry'}
                    </Button>
                  </form>
                ) : (
                  <p className="lede" style={{ fontSize: '1rem' }}>This listing is no longer available for enquiry.</p>
                )}
              </div>
            </aside>
          </div>

          {similar.length > 0 && (
            <section style={{ marginTop: '5rem' }}>
              <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '2rem' }}>Similar residences</h2>
              <div className="property-grid">
                {similar.map((item) => (
                  <PropertyCard
                    key={item.id}
                    property={item}
                    saved={isSaved(item.id)}
                    signedIn={Boolean(user)}
                    onToggleSave={toggle}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
