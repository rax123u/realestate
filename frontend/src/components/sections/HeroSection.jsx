import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import OptimizedImage from '../ui/OptimizedImage';

export default function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({ search: '', city: '', listing_type: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section id="hero" className="hero">
      <div className="hero__backdrop" aria-hidden="true">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80"
          alt=""
          width={2000}
          eager
          sizes="100vw"
        />
        <div className="hero__veil" />
      </div>

      <div className="site-wrap hero__content">
        <p className="eyebrow eyebrow--light">Private real estate</p>
        <h1 className="hero-title">
          Architecture
          <br />
          as residence.
        </h1>
        <p className="lede lede--light" style={{ marginTop: '1.6rem', maxWidth: '34rem' }}>
          A quieter marketplace for considered homes — searched by place, specified with precision, and introduced in person.
        </p>
        <div className="hero__meta">
          <span>
            <strong>48</strong>
            <small>Residences</small>
          </span>
          <span>
            <strong>12</strong>
            <small>Cities</small>
          </span>
          <span>
            <strong>1:1</strong>
            <small>Advisor access</small>
          </span>
        </div>
      </div>

      <form className="search-panel hero__search" onSubmit={handleSearch} role="search">
        <label>
          Keyword
          <input
            className="field"
            placeholder="Residence, street, or estate"
            value={query.search}
            onChange={(e) => setQuery({ ...query, search: e.target.value })}
          />
        </label>
        <label>
          City
          <input
            className="field"
            placeholder="City"
            value={query.city}
            onChange={(e) => setQuery({ ...query, city: e.target.value })}
          />
        </label>
        <label>
          Status
          <select
            className="field"
            value={query.listing_type}
            onChange={(e) => setQuery({ ...query, listing_type: e.target.value })}
          >
            <option value="">Any</option>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </label>
        <Button type="submit">Search homes</Button>
      </form>
    </section>
  );
}
