import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, propertyAPI, inquiryAPI, reportAPI, resolveImageUrl } from '../api';
import { formatPrice } from '../data/fallback';
import { compressImageFile } from '../lib/images';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'expired', label: 'Expired' },
];

const INQUIRY_STATUSES = ['new', 'read', 'responded', 'archived'];

const emptyForm = {
  title: '', location: '', city: '', listing_type: 'sale', property_type: 'house',
  status: 'active', price: '', bedrooms: '', bathrooms: '', area: '', description: '',
  primary_image: '', amenities: [], featured: false, showcase: false,
};

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState(null);
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const clearImage = () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes, inqRes, usersRes, reportRes] = await Promise.allSettled([
        adminAPI.stats(),
        propertyAPI.list({ all_statuses: 1, per_page: 100 }),
        inquiryAPI.list(),
        adminAPI.users(),
        reportAPI.get(),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (propsRes.status === 'fulfilled') setProperties(propsRes.value.data.data || propsRes.value.data);
      if (inqRes.status === 'fulfilled') setInquiries(inqRes.value.data);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      if (reportRes.status === 'fulfilled') setReports(reportRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      alert('Choose a primary photograph from your computer.');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      primary_image: undefined,
    };

    try {
      let propertyId = editingId;
      if (editingId) {
        await propertyAPI.update(editingId, payload);
      } else {
        const { data } = await propertyAPI.create(payload);
        propertyId = data.id;
      }

      if (imageFile && propertyId) {
        const prepared = await compressImageFile(imageFile);
        const formData = new FormData();
        formData.append('image', prepared);
        formData.append('is_primary', '1');
        await propertyAPI.uploadImage(propertyId, formData);
      }

      setForm(emptyForm);
      setEditingId(null);
      clearImage();
      loadData();
    } catch (err) {
      const errors = err.response?.data?.errors;
      alert(errors ? Object.values(errors).flat().join(', ') : 'Failed to save property.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      await propertyAPI.delete(id);
      loadData();
    } catch {
      alert('Failed to delete property.');
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      await inquiryAPI.update(id, { status });
      loadData();
    } catch {
      alert('Failed to update inquiry.');
    }
  };

  const startEdit = (property) => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setEditingId(property.id);
    setImageFile(null);
    setImagePreview(resolveImageUrl(property.primary_image || property.image || ''));
    setForm({
      title: property.title,
      location: property.location,
      city: property.city || '',
      listing_type: property.listing_type || 'sale',
      property_type: property.property_type || 'house',
      status: property.status || 'active',
      price: String(property.price),
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      area: String(property.area),
      description: property.description || '',
      primary_image: '',
      amenities: property.amenities || [],
      featured: property.featured || false,
      showcase: property.showcase || false,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-paper)' }}>
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'properties', label: 'Properties' },
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'reports', label: 'Reports' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <>
      <Navbar />
      <main className="workspace">
        <div className="site-wrap">
          <div className="workspace-head">
            <div>
              <p className="eyebrow">Administration</p>
              <h1 className="section-title">The office.</h1>
              <p className="lede" style={{ marginTop: '0.75rem' }}>
                Listings, inquiries, accounts, and performance — in one place.
              </p>
            </div>
            <Button onClick={loadData}>Refresh</Button>
          </div>

          <div className="tabs" role="tablist">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`tab ${tab === item.id ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <div className="spinner" aria-label="Loading console" />
            </div>
          ) : (
            <>
              {tab === 'overview' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="stat-grid stat-grid--wide">
                    {[
                      { label: 'Properties', value: stats?.properties ?? properties.length },
                      { label: 'Inquiries', value: stats?.inquiries ?? inquiries.length },
                      { label: 'New inquiries', value: stats?.new_inquiries ?? 0 },
                      { label: 'Users', value: stats?.users ?? users.length },
                      { label: 'Saved homes', value: stats?.favorites ?? 0 },
                    ].map((stat) => (
                      <div key={stat.label} className="stat-card">
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="featured-dev">
                    <div className="editorial-panel" style={{ padding: '1.5rem', display: 'grid', gap: '0.65rem' }}>
                      <h3 className="eyebrow">Quick navigation</h3>
                      {[
                        ['properties', 'Listing registry'],
                        ['inquiries', 'Inquiry tracker'],
                        ['users', 'Accounts directory'],
                      ].map(([id, label]) => (
                        <button key={id} type="button" onClick={() => setTab(id)} className="listing-row" style={{ width: '100%', cursor: 'pointer' }}>
                          <span>{label}</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      ))}
                    </div>
                    <div className="editorial-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <p className="eyebrow">System</p>
                      <h3 className="section-title" style={{ fontSize: '2.2rem' }}>Operational.</h3>
                      <p className="lede" style={{ marginTop: '0.75rem' }}>
                        Sessions are guarded. Listings and inquiries update in real time from the private office.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'properties' && (
                <div style={{ display: 'grid', gap: '1.75rem' }}>
                  <form onSubmit={handlePropertySubmit} className="editorial-panel filter-form" style={{ padding: '1.5rem', marginBottom: 0 }}>
                    <h3 className="eyebrow" style={{ gridColumn: '1 / -1' }}>
                      {editingId ? 'Edit listing' : 'Create listing'}
                    </h3>
                    {['title', 'location', 'city', 'price', 'bedrooms', 'bathrooms', 'area'].map((field) => (
                      <label key={field} className="luxury-label">
                        {field.replace('_', ' ')}
                        <input
                          value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          required
                          className="field"
                        />
                      </label>
                    ))}
                    <div className="luxury-label" style={{ gridColumn: '1 / -1' }}>
                      Primary image
                      <div className="editorial-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
                        {imagePreview && (
                          <img src={imagePreview} alt="Primary preview" style={{ width: '100%', maxHeight: '14rem', objectFit: 'cover' }} />
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                          <label className="btn-base btn-luxury">
                            {imageFile || imagePreview ? 'Replace from computer' : 'Select from computer'}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/jpg"
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                          {imageFile && (
                            <button type="button" className="text-link" style={{ background: 'none', border: 0, cursor: 'pointer' }} onClick={clearImage}>
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="lede" style={{ fontSize: '0.9rem' }}>
                          {imageFile ? imageFile.name : 'JPG, PNG, or WEBP from your computer.'}
                        </p>
                      </div>
                    </div>
                    <label className="luxury-label">
                      Listing type
                      <select value={form.listing_type} onChange={(e) => setForm({ ...form, listing_type: e.target.value })} className="field">
                        <option value="sale">For sale</option>
                        <option value="rent">For rent</option>
                      </select>
                    </label>
                    <label className="luxury-label">
                      Type
                      <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="field">
                        {['house', 'apartment', 'villa', 'commercial', 'land'].map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </label>
                    <label className="luxury-label">
                      Status
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="field">
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', fontSize: '0.85rem' }}>
                        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                        Featured
                      </label>
                      <label style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', fontSize: '0.85rem' }}>
                        <input type="checkbox" checked={form.showcase} onChange={(e) => setForm({ ...form, showcase: e.target.checked })} />
                        Showcase
                      </label>
                    </div>
                    <label className="luxury-label" style={{ gridColumn: '1 / -1' }}>
                      Description
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="luxury-textarea-field"
                        rows={4}
                      />
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Button type="submit">{editingId ? 'Update listing' : 'Publish listing'}</Button>
                      {editingId && (
                        <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(emptyForm); clearImage(); }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  <div style={{ display: 'grid', gap: '0.85rem' }}>
                    <p className="eyebrow">{properties.length} properties</p>
                    {properties.map((property) => (
                      <div key={property.id} className="listing-row">
                        <div className="listing-row__meta">
                          {property.primary_image || property.image ? (
                            <img src={resolveImageUrl(property.primary_image || property.image)} alt="" />
                          ) : (
                            <div className="listing-thumb" />
                          )}
                          <div>
                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                              <span className={`pill ${property.listing_type === 'rent' ? 'pill--rent' : 'pill--sale'}`}>{property.listing_type}</span>
                              <span className={`pill ${property.status === 'active' ? 'pill--active' : 'pill--sold'}`}>{property.status}</span>
                            </div>
                            <h3>{property.title}</h3>
                            <p className="lede" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                              {[property.city, property.location].filter(Boolean).join(' · ')} · {formatPrice(property.price)}
                            </p>
                          </div>
                        </div>
                        <div className="listing-row__actions">
                          <button type="button" onClick={() => startEdit(property)} className="ghost-btn">Edit</button>
                          <button type="button" onClick={() => handleDelete(property.id)} className="ghost-btn ghost-btn--danger">Delete</button>
                        </div>
                      </div>
                    ))}
                    {properties.length === 0 && <div className="empty-state"><p>No properties found.</p></div>}
                  </div>
                </div>
              )}

              {tab === 'inquiries' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <p className="eyebrow">{inquiries.length} inquiries</p>
                  {inquiries.map((inquiry) => (
                    <article key={inquiry.id} className="editorial-panel" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 400 }}>{inquiry.name}</h3>
                          <p className="lede" style={{ fontSize: '0.95rem' }}>{inquiry.email}</p>
                          {inquiry.property && (
                            <p style={{ marginTop: '0.65rem' }}>
                              Regarding: <Link to={`/properties/${inquiry.property.id}`} className="text-link">{inquiry.property.title}</Link>
                            </p>
                          )}
                        </div>
                        <span className={`pill ${inquiry.status === 'new' || !inquiry.status ? 'pill--new' : ''}`}>
                          {inquiry.status || 'new'}
                        </span>
                      </div>
                      <p className="lede" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{inquiry.message}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                        {INQUIRY_STATUSES.filter((status) => status !== inquiry.status).map((status) => (
                          <button key={status} type="button" onClick={() => handleInquiryStatus(inquiry.id, status)} className="ghost-btn">
                            Mark {status}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                  {inquiries.length === 0 && <div className="empty-state"><p>No inquiries received yet.</p></div>}
                </div>
              )}

              {tab === 'reports' && reports && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="stat-grid">
                    {[
                      { label: 'Total listings', value: reports.summary?.total_properties ?? 0 },
                      { label: 'Active listings', value: reports.summary?.active_listings ?? 0 },
                      { label: 'Total inquiries', value: reports.summary?.total_inquiries ?? 0 },
                      { label: 'New inquiries', value: reports.summary?.new_inquiries ?? 0 },
                    ].map((stat) => (
                      <div key={stat.label} className="stat-card">
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="featured-dev">
                    <div className="editorial-panel" style={{ padding: '1.5rem' }}>
                      <h3 className="eyebrow">Listing status</h3>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {Object.entries(reports.status_breakdown || {}).map(([status, count]) => {
                          const total = reports.summary?.total_properties || 1;
                          const pct = ((count / total) * 100).toFixed(0);
                          return (
                            <div key={status}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span className="luxury-label" style={{ margin: 0 }}>{status}</span>
                                <span>{count} · {pct}%</span>
                              </div>
                              <div className="progress"><span style={{ width: `${pct}%` }} /></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="editorial-panel" style={{ padding: '1.5rem' }}>
                      <h3 className="eyebrow">Inquiry trends</h3>
                      <div style={{ display: 'grid', gap: '0.85rem' }}>
                        {(reports.inquiry_trends || []).map((item) => (
                          <div key={item.month} className="listing-row" style={{ padding: 0, border: 0 }}>
                            <span>{item.month}</span>
                            <span>{item.count} inquiries</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="editorial-panel" style={{ padding: '1.5rem' }}>
                    <h3 className="eyebrow">Top listings</h3>
                    <div style={{ display: 'grid', gap: '0.85rem' }}>
                      {(reports.listing_performance || []).map((item, index) => (
                        <div key={item.id} className="listing-row" style={{ padding: 0, border: 0 }}>
                          <div>
                            <p className="luxury-label">0{index + 1}</p>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 400 }}>{item.title}</h3>
                          </div>
                          <span>{item.inquiries_count} inquiries</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'users' && (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <p className="eyebrow">{users.length} accounts</p>
                  {users.map((account) => (
                    <div key={account.id} className="listing-row">
                      <div>
                        <h3>{account.name}</h3>
                        <p className="lede" style={{ fontSize: '0.9rem' }}>{account.email}</p>
                      </div>
                      <span className="pill pill--new">{account.role}</span>
                    </div>
                  ))}
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
