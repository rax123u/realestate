import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import PropertyCard from '../components/ui/PropertyCard';
import { propertyAPI } from '../api';
import { MEDIA } from '../data/fallback';
import useFavorites from '../hooks/useFavorites';

function filterFallback(params) {
  const list = MEDIA.properties.filter((property) => {
    if (params.search) {
      const query = params.search.toLowerCase();
      const haystack = `${property.title} ${property.location} ${property.city || ''}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (params.city && !`${property.city || ''} ${property.location || ''}`.toLowerCase().includes(params.city.toLowerCase())) {
      return false;
    }
    if (params.listing_type && property.listing_type !== params.listing_type) return false;
    if (params.property_type && property.property_type !== params.property_type) return false;
    if (params.min_price && property.price < Number(params.min_price)) return false;
    if (params.max_price && property.price > Number(params.max_price)) return false;
    if (params.bedrooms && (property.bedrooms || 0) < Number(params.bedrooms)) return false;
    return true;
  });

  return [...list].sort((a, b) => {
    if (params.sort === 'price_asc') return a.price - b.price;
    if (params.sort === 'price_desc') return b.price - a.price;
    if (params.sort === 'area_desc') return (b.area || 0) - (a.area || 0);
    return 0;
  });
}

const LISTING_TYPES = [
  { value: '', label: 'All listings' },
  { value: 'sale', label: 'For sale' },
  { value: 'rent', label: 'For rent' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'All types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'area_desc', label: 'Largest area' },
];

const emptyFilters = {
  search: '',
  city: '',
  listing_type: '',
  property_type: '',
  min_price: '',
  max_price: '',
  min_area: '',
  max_area: '',
  bedrooms: '',
  sort: 'latest',
};

function filtersFromParams(searchParams) {
  return {
    ...emptyFilters,
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    listing_type: searchParams.get('listing_type') || '',
    property_type: searchParams.get('property_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_area: searchParams.get('min_area') || '',
    max_area: searchParams.get('max_area') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    sort: searchParams.get('sort') || 'latest',
  };
}

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSaved, toggle, user } = useFavorites();
  const urlKey = searchParams.toString();
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchProperties = async (params, pageNum = 1) => {
    setLoading(true);
    try {
      const query = { per_page: 12, page: pageNum };
      Object.entries(params).forEach(([key, value]) => {
        if (value) query[key] = value;
      });
      const { data } = await propertyAPI.list(query);
      setProperties(data.data || data);
      setPagination({
        current: data.current_page,
        last: data.last_page,
        total: data.total,
      });
    } catch {
      const fallback = filterFallback(params);
      setProperties(fallback);
      setPagination({ current: 1, last: 1, total: fallback.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const next = filtersFromParams(searchParams);
    setFilters(next);
    fetchProperties(next, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey, page]);

  const resultLabel = useMemo(() => {
    const total = pagination?.total ?? properties.length;
    return `${total} ${total === 1 ? 'residence' : 'residences'}`;
  }, [pagination, properties.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setPage(1);
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setPage(1);
    setSearchParams({});
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="site-wrap">
          <p className="eyebrow">The collection</p>
          <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>Find a residence.</h1>
          <p className="lede" style={{ marginBottom: '2.25rem' }}>
            Filter by place, price, and typology. Every listing is specified so a serious buyer can decide.
          </p>

          <form onSubmit={handleSearch} className="filter-form editorial-panel" style={{ padding: '1.35rem' }}>
            <label className="luxury-label">
              Keyword
              <input className="field" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Title or location" />
            </label>
            <label className="luxury-label">
              City
              <input className="field" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} placeholder="City" />
            </label>
            <label className="luxury-label">
              Status
              <select className="field" value={filters.listing_type} onChange={(e) => setFilters({ ...filters, listing_type: e.target.value })}>
                {LISTING_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label className="luxury-label">
              Type
              <select className="field" value={filters.property_type} onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}>
                {PROPERTY_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label className="luxury-label">
              Min price
              <input className="field" type="number" min="0" value={filters.min_price} onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} placeholder="0" />
            </label>
            <label className="luxury-label">
              Max price
              <input className="field" type="number" min="0" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} placeholder="Any" />
            </label>
            <label className="luxury-label">
              Bedrooms
              <input className="field" type="number" min="0" value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })} placeholder="Any" />
            </label>
            <label className="luxury-label">
              Sort
              <select className="field" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', gridColumn: '1 / -1' }}>
              <Button type="submit">Apply filters</Button>
              <button type="button" onClick={handleReset} className="text-link" style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                Reset
              </button>
            </div>
          </form>

          {loading ? (
            <div className="skeleton-grid" aria-hidden="true">
              {[0, 1, 2].map((i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <p className="section-title" style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Nothing matches.</p>
              <p className="lede" style={{ margin: '0 auto 1.5rem' }}>Try a broader city, type, or price range.</p>
              <button type="button" onClick={handleReset} className="text-link" style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow">{resultLabel}</p>
              <div className="property-grid">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    saved={isSaved(property.id)}
                    signedIn={Boolean(user)}
                    onToggleSave={toggle}
                  />
                ))}
              </div>
              {pagination && pagination.last > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem', alignItems: 'center' }}>
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => p - 1);
                      window.lenis ? window.lenis.scrollTo(0) : window.scrollTo(0, 0);
                    }}
                  >
                    Previous
                  </Button>
                  <span className="eyebrow" style={{ margin: 0 }}>
                    Page {pagination.current} of {pagination.last}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= pagination.last}
                    onClick={() => {
                      setPage((p) => p + 1);
                      window.lenis ? window.lenis.scrollTo(0) : window.scrollTo(0, 0);
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
