import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import ProtectedRoute from '../components/ProtectedRoute';
import { propertyAPI, inquiryAPI, reportAPI, resolveImageUrl } from '../api';
import { formatPrice } from '../data/fallback';
import { useAuth } from '../context/AuthContext';

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
  primary_image: '',
};

function MyListingsContent() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('listings');
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [propsRes, inqRes, reportRes] = await Promise.allSettled([
        isAdmin ? propertyAPI.list({ all_statuses: 1 }) : propertyAPI.myListings(),
        inquiryAPI.list(),
        reportAPI.get(),
      ]);
      if (propsRes.status === 'fulfilled') {
        const data = propsRes.value.data;
        setProperties(Array.isArray(data) ? data : data.data || []);
      }
      if (inqRes.status === 'fulfilled') setInquiries(inqRes.value.data);
      if (reportRes.status === 'fulfilled') setReports(reportRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    return () => {
      if (editPreview.startsWith('blob:')) URL.revokeObjectURL(editPreview);
    };
  }, [editPreview]);

  const handleStatusChange = async (id, status) => {
    try {
      await propertyAPI.update(id, { status });
      loadData();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await propertyAPI.delete(id);
      loadData();
    } catch {
      alert('Failed to delete listing');
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      await inquiryAPI.update(id, { status });
      loadData();
    } catch {
      alert('Failed to update inquiry');
    }
  };

  const startEdit = (property) => {
    if (editPreview.startsWith('blob:')) URL.revokeObjectURL(editPreview);
    setEditingId(property.id);
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
      primary_image: property.primary_image || property.image || '',
    });
    setEditFile(null);
    setEditPreview(resolveImageUrl(property.primary_image || property.image || ''));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await propertyAPI.update(editingId, {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        primary_image: form.primary_image || undefined,
      });

      if (editFile) {
        const formData = new FormData();
        formData.append('image', editFile);
        formData.append('is_primary', '1');
        await propertyAPI.uploadImage(editingId, formData);
      }

      setEditingId(null);
      setForm(emptyForm);
      setEditFile(null);
      if (editPreview.startsWith('blob:')) URL.revokeObjectURL(editPreview);
      setEditPreview('');
      loadData();
    } catch {
      alert('Failed to update property');
    }
  };

  const tabs = [
    { id: 'listings', label: 'Listings' },
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <>
      <Navbar />
      <main className="workspace">
        <div className="site-wrap">
          <div className="workspace-head">
            <div>
              <p className="eyebrow">Workspace</p>
              <h1 className="section-title">Your portfolio.</h1>
              <p className="lede" style={{ marginTop: '0.75rem' }}>
                Publish, update, and track inquiries for the residences you represent.
              </p>
            </div>
            <Button to="/add-property">Post property</Button>
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
              <div className="spinner" aria-label="Loading workspace" />
            </div>
          ) : (
            <>
              {tab === 'listings' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {properties.map((property) => (
                    <div key={property.id} className="editorial-panel" style={{ padding: '1.25rem' }}>
                      {editingId === property.id ? (
                        <form onSubmit={saveEdit} className="filter-form" style={{ marginBottom: 0 }}>
                          <h3 className="eyebrow" style={{ gridColumn: '1 / -1' }}>Edit listing</h3>
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
                          <div style={{ gridColumn: '1 / -1' }}>
                            <p className="luxury-label">Primary image</p>
                            <div className="file-drop">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  if (editPreview.startsWith('blob:')) URL.revokeObjectURL(editPreview);
                                  setEditFile(file);
                                  setEditPreview(URL.createObjectURL(file));
                                  setForm({ ...form, primary_image: '' });
                                }}
                              />
                              {editPreview ? (
                                <img src={editPreview} alt="Preview" style={{ height: '6rem', objectFit: 'cover' }} />
                              ) : (
                                <p>Click or drop a file</p>
                              )}
                            </div>
                            <label className="luxury-label" style={{ marginTop: '0.85rem' }}>
                              Or image URL
                              <input
                                value={form.primary_image}
                                disabled={!!editFile}
                                onChange={(e) => {
                                  setForm({ ...form, primary_image: e.target.value });
                                  setEditPreview(resolveImageUrl(e.target.value));
                                }}
                                className="field"
                              />
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
                            <Button type="submit">Save changes</Button>
                            <button
                              type="button"
                              className="ghost-btn"
                              onClick={() => {
                                if (editPreview.startsWith('blob:')) URL.revokeObjectURL(editPreview);
                                setEditingId(null);
                                setForm(emptyForm);
                                setEditFile(null);
                                setEditPreview('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="listing-row">
                          <div className="listing-row__meta">
                            {property.primary_image || property.image ? (
                              <img src={resolveImageUrl(property.primary_image || property.image)} alt="" />
                            ) : (
                              <div className="listing-thumb" />
                            )}
                            <div>
                              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                <span className={`pill ${property.listing_type === 'rent' ? 'pill--rent' : 'pill--sale'}`}>
                                  {property.listing_type === 'rent' ? 'Rent' : 'Sale'}
                                </span>
                                <span className={`pill ${property.status === 'active' ? 'pill--active' : 'pill--sold'}`}>
                                  {property.status}
                                </span>
                              </div>
                              <h3>{property.title}</h3>
                              <p className="lede" style={{ fontSize: '0.92rem', marginTop: '0.3rem' }}>
                                {[property.city, property.location].filter(Boolean).join(' · ')} · {formatPrice(property.price)}
                              </p>
                            </div>
                          </div>
                          <div className="listing-row__actions">
                            <select
                              value={property.status}
                              onChange={(e) => handleStatusChange(property.id, e.target.value)}
                              className="field"
                              style={{ width: 'auto', minWidth: '8.5rem' }}
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                            <Link to={`/properties/${property.id}`} className="ghost-btn">View</Link>
                            <button type="button" onClick={() => startEdit(property)} className="ghost-btn">Edit</button>
                            <button type="button" onClick={() => handleDelete(property.id)} className="ghost-btn ghost-btn--danger">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <div className="empty-state">
                      <p className="lede" style={{ margin: '0 auto 1.25rem' }}>No properties in this portfolio yet.</p>
                      <Button to="/add-property">Post your first estate</Button>
                    </div>
                  )}
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
                  {inquiries.length === 0 && (
                    <div className="empty-state">
                      <p>No inquiries received yet.</p>
                    </div>
                  )}
                </div>
              )}

              {tab === 'reports' && reports && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="stat-grid">
                    {[
                      { label: 'Total listings', value: reports.summary?.total_properties ?? 0 },
                      { label: 'Active', value: reports.summary?.active_listings ?? 0 },
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
                      <h3 className="eyebrow">Inquiry status</h3>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {Object.entries(reports.inquiry_by_status || {}).map(([status, count]) => {
                          const total = reports.summary?.total_inquiries || 1;
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
                  </div>

                  <div className="editorial-panel" style={{ padding: '1.5rem' }}>
                    <h3 className="eyebrow">Top listings</h3>
                    <div style={{ display: 'grid', gap: '0.9rem' }}>
                      {(reports.listing_performance || []).map((item, index) => (
                        <div key={item.id} className="listing-row" style={{ padding: 0, border: 0 }}>
                          <div>
                            <p className="luxury-label" style={{ marginBottom: '0.25rem' }}>0{index + 1}</p>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 400 }}>{item.title}</h3>
                            <p className="lede" style={{ fontSize: '0.85rem' }}>{item.city} · {item.status}</p>
                          </div>
                          <span>{item.inquiries_count} inquiries</span>
                        </div>
                      ))}
                      {(reports.listing_performance || []).length === 0 && (
                        <p className="lede">No inquiry performance data yet.</p>
                      )}
                    </div>
                  </div>
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

export default function MyListingsPage() {
  return (
    <ProtectedRoute requireListingAccess>
      <MyListingsContent />
    </ProtectedRoute>
  );
}
