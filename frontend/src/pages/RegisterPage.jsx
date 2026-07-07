import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const ROLES = [
  { value: 'user', label: 'Buyer / Renter', description: 'Search and inquire about properties' },
  { value: 'agent', label: 'Real Estate Agent', description: 'Post and manage property listings' },
  { value: 'owner', label: 'Property Owner', description: 'List your properties for sale or rent' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate(form.role === 'user' ? '/properties' : '/my-listings');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(', ')
          : err.response?.data?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex font-sans relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[550px] h-[550px] rounded-full bg-luxury-gold/5 blur-[150px] pointer-events-none" />

      {/* Visual Showcase Panel (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-luxury-charcoal border-r border-white/5">
        {/* Subtle grid layer */}
        <div className="absolute inset-0 grid-bg opacity-20 z-10 pointer-events-none" />
        
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80"
          alt="Aurelius Azure Penthouse"
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
              "Simplicity is the ultimate sophistication."
            </p>
            <footer className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-semibold">
              — Leonardo da Vinci
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form Panel (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 md:px-12 py-12 relative z-20 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="luxury-form-wrapper space-y-8 my-auto"
        >
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-block lg:hidden text-2xl font-medium tracking-[0.3em] uppercase text-luxury-cream mb-8">
              Aurelius
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-luxury-cream tracking-wide">Create Account</h1>
            <p className="text-luxury-silver/80 text-[10px] mt-3 uppercase tracking-[0.25em] font-semibold">Join the Aurelius estate network</p>
          </div>

          <form onSubmit={handleSubmit} className="luxury-form-card">
            <div className="luxury-form-group">
              <label className="luxury-label">Account Type</label>
              <div className="grid grid-cols-1 gap-2.5">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all duration-300 rounded ${
                      form.role === role.value
                        ? 'border-luxury-gold bg-luxury-black/60 shadow-[0_0_10px_var(--color-luxury-gold-glow)]'
                        : 'border-white/5 hover:border-white/15 bg-luxury-black/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={form.role === role.value}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="mt-1 accent-luxury-gold"
                    />
                    <div>
                      <p className="text-xs font-semibold text-luxury-cream">{role.label}</p>
                      <p className="text-[10px] text-luxury-silver/70 mt-0.5 font-light">{role.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {['name', 'email', 'password', 'password_confirmation'].map((field) => (
              <div key={field} className="luxury-form-group">
                <label className="luxury-label">
                  {field === 'password_confirmation' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required
                  className="luxury-input-field"
                  placeholder={field === 'password_confirmation' ? '••••••••' : field === 'email' ? 'name@example.com' : `Your ${field}`}
                />
              </div>
            ))}

            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full py-4.5 mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-[0_0_20px_var(--color-luxury-gold-glow)]">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center lg:text-left text-xs text-luxury-silver/80 font-light tracking-wide">
            Already have an account?{' '}
            <Link to="/login" className="text-luxury-gold font-medium hover:underline ml-1 uppercase text-[10px] tracking-widest">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
