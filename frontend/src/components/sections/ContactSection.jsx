import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { inquiryAPI } from '../../api';
import { MEDIA } from '../../data/fallback';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const agent = MEDIA.agent;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await inquiryAPI.create(form);
      setStatus({ type: 'success', message: 'Your inquiry has been sent. We will be in touch shortly.' });
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus({
        type: 'error',
        message: 'Failed to send inquiry. Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 md:py-36 px-6 bg-luxury-charcoal relative overflow-hidden w-full">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[94%] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto">
        <div className="mb-12">
          <p className="text-subhead mb-3">Get in Touch</p>
          <h2 className="text-headline text-luxury-cream">Begin Your Luxury Journey</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Inquiry Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-6 space-y-8 glass-panel p-8 md:p-10 rounded-lg hover:border-luxury-gold/20 transition-all duration-500 shadow-xl"
          >
            <h3 className="text-xl font-serif text-luxury-cream font-light mb-4">Send An Inquiry</h3>
            
            <div className="relative group">
              <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-silver mb-2 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-luxury-black/35 border border-white/5 focus:border-luxury-gold/50 px-4 py-3 text-sm text-luxury-cream focus:outline-none transition-colors rounded"
              />
            </div>
            
            <div className="relative group">
              <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-silver mb-2 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-luxury-black/35 border border-white/5 focus:border-luxury-gold/50 px-4 py-3 text-sm text-luxury-cream focus:outline-none transition-colors rounded"
              />
            </div>

            <div className="relative group">
              <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-silver mb-2 font-semibold">
                Message Detail
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-luxury-black/35 border border-white/5 focus:border-luxury-gold/50 px-4 py-3 text-sm text-luxury-cream focus:outline-none transition-colors resize-none rounded"
              />
            </div>

            {status.message && (
              <p
                className={`text-xs font-medium tracking-wide ${status.type === 'success' ? 'text-luxury-gold' : 'text-red-400'}`}
              >
                {status.message}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full py-4 shadow-[0_0_15px_var(--color-luxury-gold-glow)]">
              {loading ? 'Sending Request...' : 'Send Inquiry'}
            </Button>
          </form>

          {/* Agent info and Location Map */}
          <div className="lg:col-span-6 space-y-8 flex flex-col justify-between">
            {/* Agent info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 md:p-8 glass-panel rounded-lg hover:border-luxury-gold/20 transition-all duration-500 shadow-xl">
              <svg 
                className="w-24 h-24 rounded-full border-2 border-luxury-gold/25 p-2 bg-luxury-black/40 flex-shrink-0"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path className="text-luxury-silver/40" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle className="text-luxury-gold/50" cx="12" cy="7" r="4" />
              </svg>
              <div className="text-center sm:text-left">
                <span className="inline-block text-[9px] font-semibold uppercase tracking-[0.25em] text-luxury-gold bg-luxury-gold/10 px-2.5 py-0.5 rounded mb-2.5">
                  Your Senior Advisor
                </span>
                <h3 className="text-xl font-serif font-light text-luxury-cream mb-1">{agent.name}</h3>
                <p className="text-xs uppercase tracking-widest text-luxury-silver/80 mb-4">{agent.title}</p>
                <div className="space-y-1.5 text-xs text-luxury-silver font-light">
                  <p className="hover:text-luxury-gold transition-colors">{agent.phone}</p>
                  <p className="hover:text-luxury-gold transition-colors">{agent.email}</p>
                </div>
              </div>
            </div>

            {/* Map Frame */}
            <div className="relative aspect-video w-full overflow-hidden border border-white/5 rounded-lg shadow-xl bg-luxury-black">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.966309!2d-73.978134!3d40.758896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1700000000000"
                className="absolute inset-0 w-full h-full border-0 grayscale opacity-75 hover:opacity-90 hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
