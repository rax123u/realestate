import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Try admin@aurelius.com / password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex font-sans relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[550px] h-[550px] rounded-full bg-luxury-gold/5 blur-[150px] pointer-events-none" />

      {/* Visual Showcase Panel (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-luxury-charcoal border-r border-white/5">
        {/* Subtle grid layer */}
        <div className="absolute inset-0 grid-bg opacity-20 z-10 pointer-events-none" />
        
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
          alt="Aurelius Property Showcase"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/35 to-transparent z-10" />
        
        <div className="absolute bottom-16 left-16 right-16 z-20 space-y-6">
          <Link to="/" className="text-2xl font-medium tracking-[0.35em] uppercase text-luxury-cream hover:text-luxury-gold transition-colors">
            Aurelius
          </Link>
          <div className="h-[1px] w-12 bg-luxury-gold" />
          <blockquote className="space-y-4">
            <p className="text-3xl md:text-4.5xl font-serif font-light text-luxury-cream leading-snug">
              "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
            </p>
            <footer className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-semibold">
              — Le Corbusier
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form Panel (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 md:px-12 py-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="luxury-form-wrapper space-y-10"
        >
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-block lg:hidden text-2xl font-medium tracking-[0.3em] uppercase text-luxury-cream mb-8">
              Aurelius
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-luxury-cream tracking-wide">Welcome Back</h1>
            <p className="text-luxury-silver/80 text-[10px] mt-3 uppercase tracking-[0.25em] font-semibold">Access your luxury portfolio dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="luxury-form-card">
            <div className="luxury-form-group">
              <label className="luxury-label">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="luxury-input-field"
                placeholder="email@example.com"
              />
            </div>
            
            <div className="luxury-form-group">
              <div className="flex justify-between items-center">
                <label className="luxury-label">Password</label>
                <a href="#" className="text-[10px] uppercase tracking-wider text-luxury-gold hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="luxury-input-field"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full py-4.5 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-[0_0_20px_var(--color-luxury-gold-glow)]">
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center lg:text-left text-xs text-luxury-silver/80 font-light tracking-wide">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-luxury-gold font-medium hover:underline ml-1 uppercase text-[10px] tracking-widest">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
