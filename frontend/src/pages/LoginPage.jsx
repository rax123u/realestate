import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import OptimizedImage from '../components/ui/OptimizedImage';

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
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(' ')
          : err.response?.data?.message
            || (err.request && !err.response
              ? 'Cannot reach the server. Make sure the API is running on localhost:8000.'
              : 'Invalid credentials.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80"
          alt="Aurelius residence"
          eager
          width={1400}
          sizes="50vw"
        />
        <div className="auth-visual__copy">
          <Link to="/" className="logo" style={{ color: 'var(--color-paper)' }}>Aurelius</Link>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', lineHeight: 0.95, marginTop: '1.5rem', maxWidth: '12ch' }}>
            Return to the collection.
          </p>
        </div>
      </div>
      <div className="auth-form">
        <div className="luxury-form-wrapper">
          <Link to="/" className="logo" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>Aurelius</Link>
          <h1 className="section-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}>Sign in</h1>
          <p className="lede" style={{ margin: '0.75rem 0 2rem', fontSize: '1rem' }}>Access saved homes and your workspace.</p>
          <form onSubmit={handleSubmit} className="luxury-form-card">
            <div className="luxury-form-group">
              <label className="luxury-label" htmlFor="login-email">Email</label>
              <input id="login-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="luxury-input-field" />
            </div>
            <div className="luxury-form-group">
              <label className="luxury-label" htmlFor="login-password">Password</label>
              <input id="login-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="luxury-input-field" />
            </div>
            {error && <p role="alert" style={{ color: '#9b2c2c' }}>{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p style={{ marginTop: '1.25rem', color: 'var(--color-ink-soft)' }}>
            New here? <Link to="/register" className="text-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
