import { useState } from 'react';
import Button from '../ui/Button';
import { inquiryAPI } from '../../api';
import { MEDIA } from '../../data/fallback';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '', viewing: false });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const agent = MEDIA.agent;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await inquiryAPI.create({
        name: form.name,
        email: form.email,
        message: form.viewing
          ? `Request a viewing.\n\n${form.message}`
          : form.message,
      });
      setStatus({ type: 'success', message: 'Received. An advisor will be in touch shortly.' });
      setForm({ name: '', email: '', message: '', viewing: false });
    } catch {
      setStatus({
        type: 'error',
        message: 'Unable to send just now. Please try again or email the advisor directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-space" style={{ background: 'var(--color-paper-2)' }}>
      <div className="site-wrap featured-dev">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Speak with an advisor.</h2>
          <p className="lede" style={{ margin: '1.25rem 0 2rem' }}>
            Enquiries, viewings, and off-market introductions. We respond personally — not with a ticket queue.
          </p>
          <div className="editorial-panel" style={{ padding: '1.5rem' }}>
            <p className="eyebrow">Senior advisor</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400 }}>{agent.name}</h3>
            <p style={{ color: 'var(--color-ink-soft)', marginBottom: '1rem' }}>{agent.title}</p>
            <p><a href={`tel:${agent.phone}`}>{agent.phone}</a></p>
            <p><a href={`mailto:${agent.email}`}>{agent.email}</a></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="luxury-form-card" style={{ maxWidth: 'none' }}>
          <div className="luxury-form-group">
            <label className="luxury-label" htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" value={form.name} onChange={handleChange} required className="luxury-input-field" />
          </div>
          <div className="luxury-form-group">
            <label className="luxury-label" htmlFor="contact-email">Email</label>
            <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} required className="luxury-input-field" />
          </div>
          <div className="luxury-form-group">
            <label className="luxury-label" htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} required className="luxury-textarea-field" />
          </div>
          <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.9rem' }}>
            <input type="checkbox" name="viewing" checked={form.viewing} onChange={handleChange} />
            Request a viewing
          </label>
          {status.message && (
            <p role="status" style={{ color: status.type === 'success' ? 'var(--color-accent)' : '#9b2c2c' }}>
              {status.message}
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send enquiry'}
          </Button>
        </form>
      </div>
    </section>
  );
}
