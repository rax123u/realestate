import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { lazy, Suspense, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './lib/motion';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AddProperty = lazy(() => import('./pages/AddProperty'));
const MyListingsPage = lazy(() => import('./pages/MyListingsPage'));

gsap.registerPlugin(ScrollTrigger);

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-paper)' }}>
      <div className="spinner" aria-label="Loading page" />
    </div>
  );
}

function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      autoRaf: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    window.lenis = lenis;
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      window.clearTimeout(refresh);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return null;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageFallback />}>
      <div key={location.pathname} className="w-full flex-grow flex flex-col">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Suspense>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (!el) return false;
        if (window.lenis) window.lenis.scrollTo(el, { offset: -80, duration: 1.05 });
        else el.scrollIntoView({ behavior: 'smooth' });
        return true;
      };
      if (scrollToHash()) return undefined;
      const timer = window.setTimeout(scrollToHash, 160);
      return () => window.clearTimeout(timer);
    }

    if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    return undefined;
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll />
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
