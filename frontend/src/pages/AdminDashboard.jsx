import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, propertyAPI, inquiryAPI, reportAPI } from '../api';
import { formatPrice } from '../data/fallback';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
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
    } catch {
      /* fallback empty */
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      primary_image: form.primary_image || undefined,
    };

    try {
      if (editingId) {
        await propertyAPI.update(editingId, payload);
      } else {
        await propertyAPI.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
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

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      location: p.location,
      city: p.city || '',
      listing_type: p.listing_type || 'sale',
      property_type: p.property_type || 'house',
      status: p.status || 'active',
      price: String(p.price),
      bedrooms: String(p.bedrooms),
      bathrooms: String(p.bathrooms),
      area: String(p.area),
      description: p.description || '',
      primary_image: p.primary_image || p.image || '',
      amenities: p.amenities || [],
      featured: p.featured || false,
      showcase: p.showcase || false,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-10 h-10 border border-luxury-gold border-t-transparent rounded-full animate-spin" />
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
              <p className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-2">Administration</p>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-luxury-cream tracking-tight leading-tight">
                Administrative Console
              </h1>
              <p className="text-luxury-silver/70 text-xs tracking-wider mt-2 max-w-xl font-light">
                Global platform analytics, user directories, and system databases.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadData} className="shadow-[0_0_15px_var(--color-luxury-gold-glow)]">Refresh Console</Button>
            </div>
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
              {tab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Properties', value: stats?.properties ?? properties.length },
                      { label: 'Total Inquiries', value: stats?.inquiries ?? inquiries.length },
                      { label: 'New Inquiries', value: stats?.new_inquiries ?? 0 },
                      { label: 'Registered Users', value: stats?.users ?? users.length },
                      { label: 'Saved Favorites', value: stats?.favorites ?? 0 },
                    ].map((s) => (
                      <div key={s.label} className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5 hover:border-luxury-gold/30 transition-all duration-300">
                        <p className="text-4xl font-bold text-luxury-gold tracking-tight">{s.value}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-luxury-silver mt-2">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 glass-panel rounded-lg border border-white/5">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-6 border-b border-white/5 pb-3">Quick Navigation</h3>
                      <div className="space-y-3">
                        <button onClick={() => setTab('properties')} className="w-full text-left p-4 border border-white/5 hover:border-luxury-gold/20 hover:bg-luxury-charcoal/30 transition-all text-xs rounded flex justify-between items-center text-luxury-cream uppercase tracking-wider">
                          <span>Listing Registry database</span>
                          <span className="text-luxury-gold">&rarr;</span>
                        </button>
                        <button onClick={() => setTab('inquiries')} className="w-full text-left p-4 border border-white/5 hover:border-luxury-gold/20 hover:bg-luxury-charcoal/30 transition-all text-xs rounded flex justify-between items-center text-luxury-cream uppercase tracking-wider">
                          <span>Inquiries tracker</span>
                          <span className="text-luxury-gold">&rarr;</span>
                        </button>
                        <button onClick={() => setTab('users')} className="w-full text-left p-4 border border-white/5 hover:border-luxury-gold/20 hover:bg-luxury-charcoal/30 transition-all text-xs rounded flex justify-between items-center text-luxury-cream uppercase tracking-wider">
                          <span>System accounts directory</span>
                          <span className="text-luxury-gold">&rarr;</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-6 glass-panel rounded-lg flex flex-col justify-center items-center text-center border border-white/5 shadow-2xl">
                      <p className="text-luxury-gold text-4xl mb-3 font-light">★</p>
                      <h4 className="font-serif text-2xl text-luxury-cream font-light">System Status</h4>
                      <p className="text-xs text-luxury-silver/80 mt-2 font-light max-w-xs leading-relaxed">
                        All application systems operational. Sanctum secure session guarding active.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'properties' && (
                <div className="space-y-10 animate-fade-in">
                  <form onSubmit={handlePropertySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                    <h3 className="md:col-span-2 text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-2">
                      {editingId ? 'Edit Property Details' : 'Create New Luxury Listing'}
                    </h3>
                    
                    {['title', 'location', 'city', 'price', 'bedrooms', 'bathrooms', 'area', 'primary_image'].map((field) => (
                      <div key={field}>
                        <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver/80 mb-2">{field.replace('_', ' ')}</label>
                        <input
                          placeholder={field.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          required={!['primary_image'].includes(field)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                    
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
                    <div className="flex items-center gap-6 pt-5">
                      <label className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.15em] text-luxury-silver cursor-pointer select-none font-semibold">
                        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-luxury-gold w-4 h-4" />
                        Featured listing
                      </label>
                      <label className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.15em] text-luxury-silver cursor-pointer select-none font-semibold">
                        <input type="checkbox" checked={form.showcase} onChange={(e) => setForm({ ...form, showcase: e.target.checked })} className="accent-luxury-gold w-4 h-4" />
                        Showcase slide
                      </label>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-[9px] uppercase tracking-[0.15em] text-luxury-silver/80 mb-2">Description</label>
                      <textarea
                        placeholder="Property description and unique features..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className={inputClass}
                        rows={4}
                      />
                    </div>
                    
                    <div className="md:col-span-2 pt-2 flex gap-3">
                      <Button type="submit">{editingId ? 'Update Listing' : 'Publish Listing'}</Button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); setForm(emptyForm); }}
                          className="px-5 py-3 border border-white/10 text-[10px] uppercase tracking-wider text-luxury-silver hover:text-luxury-cream rounded cursor-pointer transition-colors"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">Active Properties Database ({properties.length})</h3>
                    {properties.map((p) => (
                      <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 glass-panel rounded-lg shadow-2xl border border-white/5 hover:border-luxury-gold/20 transition-all duration-300 gap-4">
                        <div className="flex items-center gap-5">
                          {p.primary_image || p.image ? (
                            <img src={p.primary_image || p.image} alt={p.title} className="w-16 h-16 object-cover rounded border border-white/5" />
                          ) : (
                            <div className="w-16 h-16 bg-luxury-black rounded flex items-center justify-center text-luxury-silver/30 text-xs border border-white/5">No image</div>
                          )}
                          <div>
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="text-[9px] uppercase text-luxury-gold tracking-[0.15em] font-semibold">{p.listing_type}</span>
                              <span className="text-[8px] uppercase px-2.5 py-0.5 border border-white/10 text-luxury-silver bg-luxury-black/35 rounded">
                                {p.status}
                              </span>
                            </div>
                            <h4 className="font-serif text-lg text-luxury-cream font-light">{p.title}</h4>
                            <p className="text-xs text-luxury-silver mt-1">
                              {p.city} • {p.location} • <span className="text-luxury-gold font-light">{formatPrice(p.price)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="text-xs text-luxury-gold px-4 py-2.5 border border-luxury-gold/20 hover:border-luxury-gold rounded transition-colors bg-luxury-black/30 cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 px-4 py-2.5 border border-red-400/20 hover:border-red-400 rounded transition-colors bg-luxury-black/30 cursor-pointer">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {properties.length === 0 && (
                      <p className="text-luxury-silver text-sm py-8 text-center border border-dashed border-white/5 rounded-lg">No properties found in database.</p>
                    )}
                  </div>
                </div>
              )}

              {tab === 'inquiries' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">System Inquiries ({inquiries.length})</h3>
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-6 glass-panel rounded-lg border border-white/5 shadow-2xl">
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
                    <p className="text-luxury-silver text-sm py-16 text-center border border-dashed border-white/5 rounded-lg bg-luxury-charcoal/20">No inquires received yet.</p>
                  )}
                </div>
              )}

              {tab === 'reports' && reports && (
                <div className="space-y-10 animate-fade-in">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { label: 'Total Listings', value: reports.summary?.total_properties },
                      { label: 'Active Listings', value: reports.summary?.active_listings },
                      { label: 'Total Inquiries', value: reports.summary?.total_inquiries },
                      { label: 'New Inquiries', value: reports.summary?.new_inquiries },
                    ].map((s) => (
                      <div key={s.label} className="p-6 glass-panel rounded-lg shadow-2xl border border-white/5">
                        <p className="text-5xl font-bold text-luxury-gold tracking-tight">{s.value ?? 0}</p>
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
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-6 border-b border-white/5 pb-3">Inquiry Trends (6 months)</h3>
                      <div className="space-y-4">
                        {(reports.inquiry_trends || []).map((t) => (
                          <div key={t.month} className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-[0.15em] border-b border-white/5 pb-2.5">
                            <span className="text-luxury-cream">{t.month}</span>
                            <span className="text-luxury-gold bg-luxury-gold/5 px-3 py-1.5 border border-luxury-gold/15 rounded-full">{t.count} inquiries</span>
                          </div>
                        ))}
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
                    </div>
                  </div>
                </div>
              )}

              {tab === 'users' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">Registered Users Database ({users.length})</h3>
                  <div className="space-y-3">
                    {users.map((u) => (
                      <div key={u.id} className="flex justify-between items-center p-6 glass-panel rounded-lg shadow-lg border border-white/5 hover:border-luxury-gold/20 transition-all duration-300">
                        <div>
                          <p className="font-serif text-xl font-light text-luxury-cream">{u.name}</p>
                          <p className="text-xs text-luxury-silver mt-1">{u.email}</p>
                        </div>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-luxury-gold border border-luxury-gold/20 px-3.5 py-1 bg-luxury-gold/5 rounded">
                          {u.role}
                        </span>
                      </div>
                    ))}
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
