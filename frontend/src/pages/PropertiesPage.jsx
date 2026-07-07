import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { propertyAPI, resolveImageUrl } from '../api';
import { formatPrice } from '../data/fallback';

const LISTING_TYPES = [
  { value: '', label: 'All Listings' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Newest Releases' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'area_desc', label: 'Largest Area' },
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

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
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
  }));
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
      setProperties([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters, page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    fetchProperties(filters, 1);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setSearchParams({});
    setPage(1);
    fetchProperties(emptyFilters, 1);
  };

  const inputClass =
    'w-full bg-luxury-black/40 border border-white/5 px-4 py-3 text-xs text-luxury-cream focus:border-luxury-gold/50 focus:outline-none transition-colors rounded';

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-luxury-black min-h-screen relative overflow-hidden">
        {/* Glow orbs background decoration */}
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-luxury-gold/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[92%] mx-auto px-6 relative z-10">
          <div className="mb-12">
            <p className="text-subhead mb-2">Browse Listings</p>
            <h1 className="text-3.5xl md:text-5xl font-serif font-light text-luxury-cream">Find Your Property</h1>
          </div>

          {/* Search/Filter Panel */}
          <form onSubmit={handleSearch} className="p-8 border border-white/5 bg-luxury-charcoal/40 backdrop-blur-md rounded-lg shadow-xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">Search keyword</label>
                <input
                  placeholder="Title, location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">City</label>
                <input
                  placeholder="City name"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">Listing Status</label>
                <select
                  value={filters.listing_type}
                  onChange={(e) => setFilters({ ...filters, listing_type: e.target.value })}
                  className={inputClass}
                >
                  {LISTING_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">Property Type</label>
                <select
                  value={filters.property_type}
                  onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                  className={inputClass}
                >
                  {PROPERTY_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">Minimum Price</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.min_price}
                  onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">Maximum Price</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.max_price}
                  onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">Min Area (sq ft)</label>
                <input
                  type="number"
                  placeholder="Min Sq Ft"
                  value={filters.min_area}
                  onChange={(e) => setFilters({ ...filters, min_area: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2 font-semibold">Sort Order</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className={inputClass}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center border-t border-white/5 pt-6">
              <Button type="submit" className="shadow-[0_0_15px_var(--color-luxury-gold-glow)]">Apply Filters</Button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs uppercase tracking-widest text-luxury-silver hover:text-luxury-gold font-semibold transition-colors cursor-pointer px-4"
              >
                Reset Filters
              </button>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="glass-panel py-20 text-center rounded-lg border border-white/5">
              <p className="text-luxury-silver/80 text-sm font-light">No properties match your search criteria.</p>
              <button onClick={handleReset} className="text-xs uppercase tracking-widest text-luxury-gold hover:underline mt-4">Reset all filters</button>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-widest text-luxury-silver/60 mb-6 font-semibold">
                {pagination?.total ?? properties.length} properties discovered
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property, idx) => {
                  const imageUrl = property.image || property.primary_image;
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.3) }}
                      className="group glass-card overflow-hidden rounded-lg flex flex-col h-full"
                    >
                      <Link to={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
                        {/* Float Status Badge */}
                        <div className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-luxury-black/60 border border-white/10 backdrop-blur-md rounded">
                          <span className="text-[8px] uppercase tracking-[0.2em] font-semibold text-luxury-gold">
                            {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                        </div>

                        <img
                          src={resolveImageUrl(imageUrl)}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-[1000ms]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent pointer-events-none" />
                      </Link>

                      <div className="p-6 flex flex-col flex-grow justify-between">
                        <div>
                          <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-luxury-gold">
                            {property.location}
                          </span>
                          <Link to={`/properties/${property.id}`} className="block mt-1.5 mb-2 group/title">
                            <h3 className="text-lg md:text-xl font-serif text-luxury-cream leading-tight font-light group-hover/title:text-luxury-gold transition-colors duration-300">
                              {property.title}
                            </h3>
                          </Link>
                          <p className="text-base text-luxury-gold font-light tracking-wide">
                            {formatPrice(property.price)}
                          </p>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mt-6 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-luxury-cream">{property.bedrooms}</span>
                            <span className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver mt-0.5">Beds</span>
                          </div>
                          <div className="flex flex-col items-center border-x border-white/5">
                            <span className="text-sm font-semibold text-luxury-cream">{property.bathrooms}</span>
                            <span className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver mt-0.5">Baths</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-luxury-cream">
                              {property.area?.toLocaleString()}
                            </span>
                            <span className="text-[8px] uppercase tracking-[0.15em] text-luxury-silver mt-0.5">Sq Ft</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {pagination && pagination.last > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16 border-t border-white/5 pt-8">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => p - 1);
                      if (window.lenis) window.lenis.scrollTo(0);
                    }}
                    className="px-5 py-2.5 text-[10px] uppercase tracking-wider border border-white/10 rounded hover:border-luxury-gold disabled:opacity-30 disabled:hover:border-white/10 cursor-pointer transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-silver font-semibold">
                    Page {pagination.current} of {pagination.last}
                  </span>
                  <button
                    disabled={page >= pagination.last}
                    onClick={() => {
                      setPage((p) => p + 1);
                      if (window.lenis) window.lenis.scrollTo(0);
                    }}
                    className="px-5 py-2.5 text-[10px] uppercase tracking-wider border border-white/10 rounded hover:border-luxury-gold disabled:opacity-30 disabled:hover:border-white/10 cursor-pointer transition-colors"
                  >
                    Next
                  </button>
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
