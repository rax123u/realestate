import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';

const CATEGORIES = [
  { type: 'house', label: 'Houses', count: 'Family residences' },
  { type: 'apartment', label: 'Apartments', count: 'Urban living' },
  { type: 'villa', label: 'Villas', count: 'Private estates' },
  { type: 'commercial', label: 'Commercial', count: 'Workspaces' },
  { type: 'land', label: 'Land', count: 'Sites & plots' },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="section-space" style={{ paddingTop: 0 }}>
      <div className="site-wrap">
        <SectionHeader eyebrow="Typology" title="Search by property type." />
        <div className="category-grid">
          {CATEGORIES.map((item) => (
            <Link key={item.type} to={`/properties?property_type=${item.type}`} className="category-link">
              <span>{item.count}</span>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
