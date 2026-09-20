import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import OptimizedImage from '../components/ui/OptimizedImage';

const ROLES = [
  { value: 'user', label: 'Buyer / renter', description: 'Search and enquire' },
  { value: 'agent', label: 'Agent', description: 'List and manage properties' },
  { value: 'owner', label: 'Owner', description: 'List your own homes' },
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
          : err.response?.data?.message || 'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80"
          alt="Architectural residence"
          eager
          width={1400}
          sizes="50vw"
        />
        <div className="auth-visual__copy">
          <Link to="/" className="logo" style={{ color: 'var(--color-paper)' }}>Aurelius</Link>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', lineHeight: 0.95, marginTop: '1.5rem', maxWidth: '13ch' }}>
            Join a quieter marketplace.
          </p>
        </div>
      </div>
      <div className="auth-form">
        <div className="luxury-form-wrapper" style={{ maxWidth: '32rem' }}>
          <h1 className="section-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}>Create account</h1>
          <form onSubmit={handleSubmit} className="luxury-form-card" style={{ marginTop: '1.5rem' }}>
            <fieldset className="luxury-form-group" style={{ border: 0 }}>
              <legend className="luxury-label">Account type</legend>
              {ROLES.map((role) => (
                <label key={role.value} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-line)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={form.role === role.value}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                  <span>
                    <strong>{role.label}</strong>
                    <span style={{ display: 'block', color: 'var(--color-ink-soft)', fontWeight: 400, fontSize: '0.9rem' }}>{role.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            {['name', 'email', 'password', 'password_confirmation'].map((field) => (
              <div key={field} className="luxury-form-group">
                <label className="luxury-label" htmlFor={field}>
                  {field === 'password_confirmation' ? 'Confirm password' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required
                  className="luxury-input-field"
                />
              </div>
            ))}
            {error && <p role="alert" style={{ color: '#9b2c2c' }}>{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </form>
          <p style={{ marginTop: '1.25rem', color: 'var(--color-ink-soft)' }}>
            Already registered? <Link to="/login" className="text-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
