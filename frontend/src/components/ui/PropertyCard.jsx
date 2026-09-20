import { Link, useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../api';
import { formatPrice } from '../../data/fallback';
import { propertyImage } from '../../lib/images';
import OptimizedImage from './OptimizedImage';

export default function PropertyCard({ property, onToggleSave, saved = false, signedIn = false }) {
  const navigate = useNavigate();
  const imageUrl = resolveImageUrl(propertyImage(property));
  const listing = property.listing_type === 'rent' ? 'For Rent' : 'For Sale';
  const typeLabel = property.property_type
    ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)
    : null;

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!signedIn) {
      navigate('/login');
      return;
    }
    onToggleSave?.(property.id);
  };

  return (
    <article className="property-card">
      <Link to={`/properties/${property.id}`} className="property-card__media">
        <OptimizedImage
          src={imageUrl}
          alt={property.title}
          className="property-card__image"
          width={900}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
        />
        <div className="property-card__tags">
          <span>{listing}</span>
          {typeLabel && <span>{typeLabel}</span>}
        </div>
      </Link>

      <div className="property-card__body">
        <p className="property-card__location">
          {[property.city, property.location].filter(Boolean).join(' · ') || 'Private location'}
        </p>
        <h3 className="property-card__title">
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h3>
        <p className="property-card__price">{formatPrice(property.price)}</p>

        <dl className="property-card__specs">
          <div>
            <dt>Beds</dt>
            <dd>{property.bedrooms ?? '—'}</dd>
          </div>
          <div>
            <dt>Baths</dt>
            <dd>{property.bathrooms ?? '—'}</dd>
          </div>
          <div>
            <dt>Area</dt>
            <dd>{property.area ? `${property.area.toLocaleString()} ft²` : '—'}</dd>
          </div>
        </dl>

        <div className="property-card__actions">
          <Link to={`/properties/${property.id}`} className="text-link">
            View residence
          </Link>
          {onToggleSave && (
            <button
              type="button"
              className={`save-btn ${saved ? 'is-saved' : ''}`}
              onClick={handleSave}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from saved homes' : 'Save this property'}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
