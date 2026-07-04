import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import ProtectedRoute from '../components/ProtectedRoute';
import { propertyAPI, inquiryAPI, reportAPI } from '../api';
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
  }, [isAdmin]);

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
    setEditPreview(property.primary_image || property.image || '');
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
      setEditPreview('');
      loadData();
    } catch {
      alert('Failed to update property');
    }
  };

  const tabs = [
    { id: 'listings', label: 'My Listings' },
    { id: 'inquiries', label: 'Inquiries' },
    { id: 'reports', label: 'Reports' },
  ];

  const inputClass = 'w-full bg-luxury-black/40 border border-white/5 px-4 py-3.5 text-xs text-luxury-cream focus:border-luxury-gold/50 focus:outline-none transition-colors rounded placeholder-luxury-silver/20';

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-luxury-black min-h-screen text-luxury-cream relative overflow-x-hidden">
        {/* Glow decoration */}
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-luxury-gold/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[92%] mx-auto px-6 relative z-10 font-sans">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-2">Workspace</p>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-luxury-cream tracking-tight leading-tight">
                Listings Portfolio
              </h1>
              <p className="text-luxury-silver/70 text-xs tracking-wider mt-2 max-w-xl font-light">
                Manage, publish, and track real-time inquiries for your private properties.
              </p>
            </div>
            <Button href="/add-property" className="shadow-[0_0_15px_var(--color-luxury-gold-glow)]">Post New Property</Button>
          </div>

          <div className="flex gap-4 mb-10 border-b border-white/5 pb-3 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 rounded cursor-pointer ${
                  tab === t.id
                    ? 'bg-luxury-gold text-luxury-black font-bold shadow-lg shadow-luxury-gold/15'
                    : 'border border-white/5 text-luxury-silver hover:text-luxury-cream hover:border-white/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border border-luxury-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {tab === 'listings' && (
                <div className="space-y-6">
                  {properties.map((p) => (
                    <div key={p.id} className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5 hover:border-luxury-gold/20 transition-all duration-400">
                      {editingId === p.id ? (
                        <form onSubmit={saveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <h3 className="md:col-span-2 text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-2">Edit Listing Details</h3>
                          
                          {['title', 'location', 'city', 'price', 'bedrooms', 'bathrooms', 'area'].map((field) => (
                            <div key={field}>
                              <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver/80 mb-2">{field.replace('_', ' ')}</label>
                              <input
                                placeholder={field.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                value={form[field]}
                                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                required
                                className={inputClass}
                              />
                            </div>
                          ))}

                          <div className="grid grid-cols-3 gap-4 md:col-span-2">
                            <div>
                              <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver/80 mb-2">Listing Type</label>
                              <select value={form.listing_type} onChange={(e) => setForm({ ...form, listing_type: e.target.value })} className={inputClass}>
                                <option value="sale">For Sale</option>
                                <option value="rent">For Rent</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver/80 mb-2">Property Type</label>
                              <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className={inputClass}>
                                {['house', 'apartment', 'villa', 'commercial', 'land'].map((t) => (
                                  <option key={t} value={t}>{t.toUpperCase()}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver/80 mb-2">Listing Status</label>
                              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="md:col-span-2 border-t border-white/5 pt-5 mt-2">
                            <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-3">Primary Listing Image</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="relative border border-dashed border-white/10 hover:border-luxury-gold/50 p-4 transition-colors flex flex-col items-center justify-center min-h-[140px] bg-luxury-black/35 rounded">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setEditFile(file);
                                      setEditPreview(URL.createObjectURL(file));
                                      setForm({ ...form, primary_image: '' });
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {editPreview ? (
                                  <img src={editPreview} alt="Preview" className="h-24 object-cover rounded shadow border border-white/5" />
                                ) : (
                                  <div className="text-center">
                                    <p className="text-[10px] text-luxury-silver uppercase tracking-wider">Click or Drag Image File</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col justify-center">
                                <p className="text-[9px] uppercase tracking-[0.15em] text-luxury-silver mb-2">Or Provide Image URL</p>
                                <input
                                  placeholder="Primary Image URL"
                                  value={form.primary_image}
                                  disabled={!!editFile}
                                  onChange={(e) => {
                                    setForm({ ...form, primary_image: e.target.value });
                                    setEditPreview(e.target.value);
                                  }}
                                  className={inputClass}
                                />
                                {editFile && (
                                  <button
                                    type="button"
                                    onClick={() => { setEditFile(null); setEditPreview(form.primary_image || ''); }}
                                    className="text-[10px] text-red-400 mt-2.5 text-left hover:underline cursor-pointer uppercase tracking-wider font-semibold"
                                  >
                                    Reset to URL
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver/80 mb-2">Description</label>
                            <textarea
                              placeholder="Describe this luxury property..."
                              value={form.description}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                              className={inputClass}
                              rows={4}
                            />
                          </div>

                          <div className="md:col-span-2 pt-2 flex gap-3">
                            <Button type="submit">Save Changes</Button>
                            <button
                              type="button"
                              onClick={() => { setEditingId(null); setForm(emptyForm); }}
                              className="px-5 py-3 border border-white/10 text-[10px] uppercase tracking-wider text-luxury-silver hover:text-luxury-cream rounded cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-5">
                            {p.primary_image || p.image ? (
                              <img 
                                src={p.primary_image || p.image} 
                                alt={p.title} 
                                className="w-20 h-20 object-cover rounded border border-white/5 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-luxury-charcoal rounded border border-white/5 flex items-center justify-center text-luxury-silver/30 text-xs flex-shrink-0">
                                No Img
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <span className="text-[9px] uppercase text-luxury-gold tracking-[0.15em] font-semibold">{p.listing_type === 'rent' ? 'Rent' : 'Sale'}</span>
                                <span className={`text-[8px] uppercase tracking-wider px-2.5 py-0.5 border ${
                                  p.status === 'active' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                  p.status === 'sold' || p.status === 'rented' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                                  'border-white/10 text-luxury-silver bg-white/5'
                                } rounded`}>
                                  {p.status}
                                </span>
                              </div>
                              <h3 className="font-serif text-xl text-luxury-cream font-light">{p.title}</h3>
                              <p className="text-xs text-luxury-silver mt-1.5">
                                {p.city} • {p.location} • <span className="text-luxury-gold font-light">{formatPrice(p.price)}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2.5 items-center">
                            <select
                              value={p.status}
                              onChange={(e) => handleStatusChange(p.id, e.target.value)}
                              className="bg-luxury-black/50 border border-white/5 px-4 py-2.5 text-xs text-luxury-cream cursor-pointer rounded transition-colors focus:border-luxury-gold focus:outline-none"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                            <Link to={`/properties/${p.id}`} className="text-xs text-luxury-gold px-4 py-2.5 border border-luxury-gold/20 hover:border-luxury-gold/50 rounded transition-colors bg-luxury-black/30">
                              View
                            </Link>
                            <button onClick={() => startEdit(p)} className="text-xs text-luxury-silver px-4 py-2.5 border border-white/10 hover:border-white/20 rounded transition-colors bg-luxury-black/30 cursor-pointer">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 px-4 py-2.5 border border-red-400/20 hover:border-red-400 rounded transition-colors bg-luxury-black/30 cursor-pointer">
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <div className="text-center py-24 border border-dashed border-white/5 rounded-lg bg-luxury-charcoal/20">
                      <p className="text-luxury-silver mb-6 text-sm">No properties registered under your portfolio yet.</p>
                      <Button href="/add-property">Post Your First Estate</Button>
                    </div>
                  )}
                </div>
              )}

              {tab === 'inquiries' && (
                <div className="space-y-6">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-2">Active Inquiries ({inquiries.length})</h3>
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-serif text-2xl font-light text-luxury-cream">{inq.name}</p>
                          <p className="text-xs text-luxury-silver mt-1">{inq.email}</p>
                          {inq.property && (
                            <p className="text-xs text-luxury-gold mt-3 font-light">
                              Regarding: <Link to={`/properties/${inq.property.id}`} className="hover:underline font-normal text-luxury-cream">{inq.property.title}</Link>
                            </p>
                          )}
                        </div>
                        <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded border ${
                          inq.status === 'new' ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'border-white/10 text-luxury-silver'
                        }`}>
                          {inq.status || 'new'}
                        </span>
                      </div>
                      <p className="text-xs text-luxury-silver bg-luxury-black/30 p-5 border border-white/5 rounded leading-relaxed mb-4 font-light">{inq.message}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {INQUIRY_STATUSES.filter((s) => s !== inq.status).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleInquiryStatus(inq.id, s)}
                            className="text-[9px] font-semibold uppercase tracking-[0.15em] text-luxury-silver hover:text-luxury-gold px-3.5 py-2 border border-white/5 hover:border-luxury-gold/30 rounded bg-luxury-black/20 cursor-pointer transition-colors"
                          >
                            Mark {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {inquiries.length === 0 && (
                    <p className="text-luxury-silver text-sm py-20 text-center border border-dashed border-white/5 rounded-lg bg-luxury-charcoal/20">No inquiries received yet.</p>
                  )}
                </div>
              )}

              {tab === 'reports' && reports && (
                <div className="space-y-10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { label: 'Total Listings', value: reports.summary?.total_properties ?? 0 },
                      { label: 'Active', value: reports.summary?.active_listings ?? 0 },
                      { label: 'Total Inquiries', value: reports.summary?.total_inquiries ?? 0 },
                      { label: 'New Inquiries', value: reports.summary?.new_inquiries ?? 0 },
                    ].map((s) => (
                      <div key={s.label} className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                        <p className="text-5xl font-bold text-luxury-gold tracking-tight">{s.value}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver mt-3">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-6 border-b border-white/5 pb-3">Listing Status Distribution</h3>
                      <div className="space-y-5">
                        {Object.entries(reports.status_breakdown || {}).map(([status, count]) => {
                          const total = reports.summary?.total_properties || 1;
                          const pct = ((count / total) * 100).toFixed(0);
                          return (
                             <div key={status} className="space-y-2">
                              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-luxury-cream">
                                <span className="font-light">{status.toUpperCase()}</span>
                                <span className="text-luxury-gold">{count} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-luxury-black h-1.5 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-luxury-gold h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-6 border-b border-white/5 pb-3">Inquiry Status Breakdown</h3>
                      <div className="space-y-5">
                        {Object.entries(reports.inquiry_by_status || {}).map(([status, count]) => {
                          const total = reports.summary?.total_inquiries || 1;
                          const pct = ((count / total) * 100).toFixed(0);
                          return (
                            <div key={status} className="space-y-2">
                              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-luxury-cream">
                                <span className="font-light">{status.toUpperCase()}</span>
                                <span className="text-luxury-gold">{count} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-luxury-black h-1.5 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-luxury-gold h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-6 border-b border-white/5 pb-3">Top Listings by Inquiries</h3>
                    <div className="space-y-4">
                      {(reports.listing_performance || []).map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-luxury-gold font-bold">0{idx + 1}</span>
                            <div>
                              <p className="text-luxury-cream font-medium">{p.title}</p>
                              <p className="text-[9px] uppercase text-luxury-silver tracking-widest mt-0.5">{p.city} • {p.status}</p>
                            </div>
                          </div>
                          <span className="text-xs text-luxury-gold font-light">{p.inquiries_count} inquiries</span>
                        </div>
                      ))}
                      {(reports.listing_performance || []).length === 0 && (
                        <p className="text-luxury-silver text-xs py-8 text-center">No inquiry performance data available.</p>
                      )}
                    </div>
                  </div>

                  {(reports.inquiry_trends || []).length > 0 && (
                    <div className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-6 border-b border-white/5 pb-3">Inquiry Trends (6 months)</h3>
                      <div className="space-y-4">
                        {reports.inquiry_trends.map((t) => (
                          <div key={t.month} className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-[0.15em] border-b border-white/5 pb-2.5">
                            <span className="text-luxury-cream">{t.month}</span>
                            <span className="text-luxury-gold bg-luxury-gold/5 px-3 py-1.5 border border-luxury-gold/15 rounded-full">{t.count} inquiries</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
