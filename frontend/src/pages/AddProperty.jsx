import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import ProtectedRoute from '../components/ProtectedRoute';
import { propertyAPI } from '../api';
import { compressImageFile } from '../lib/images';

const AMENITY_OPTIONS = [
  'Pool', 'Garage', 'Garden', 'Smart Home', 'Gym', 'Security',
  'Fireplace', 'Balcony', 'Elevator', 'Pet Friendly',
];

const initialForm = {
  title: '',
  location: '',
  city: '',
  listing_type: 'sale',
  property_type: 'house',
  status: 'active',
  price: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  description: '',
  primary_image: '',
  video_url: '',
  amenities: [],
  featured: false,
  showcase: false,
};

function AddPropertyForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [primaryFile, setPrimaryFile] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState('');
  const [extraFiles, setExtraFiles] = useState([]);
  const extraFilesRef = useRef([]);
  const navigate = useNavigate();
  extraFilesRef.current = extraFiles;

  useEffect(() => {
    return () => {
      if (primaryPreview.startsWith('blob:')) URL.revokeObjectURL(primaryPreview);
    };
  }, [primaryPreview]);

  useEffect(() => {
    return () => {
      extraFilesRef.current.forEach((item) => {
        if (item.preview?.startsWith('blob:')) URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePrimaryFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (primaryPreview.startsWith('blob:')) URL.revokeObjectURL(primaryPreview);
    setPrimaryFile(file);
    setPrimaryPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, primary_image: '' }));
  };

  const handleExtraFilesChange = (e) => {
    const files = Array.from(e.target.files || []).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setExtraFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeExtraFile = (index) => {
    setExtraFiles((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.preview?.startsWith('blob:')) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!primaryFile) {
      setError('Choose a primary photograph from your computer.');
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      primary_image: undefined,
      video_url: form.video_url || undefined,
    };

    try {
      const { data: createdProperty } = await propertyAPI.create(payload);

      const upload = async (file, isPrimary) => {
        const prepared = await compressImageFile(file);
        const formData = new FormData();
        formData.append('image', prepared);
        formData.append('is_primary', isPrimary ? '1' : '0');
        await propertyAPI.uploadImage(createdProperty.id, formData);
      };

      if (primaryFile) {
        await upload(primaryFile, true);
      }

      for (const item of extraFiles) {
        await upload(item.file, false);
      }

      navigate('/my-listings');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(', ')
          : err.response?.data?.message || 'Failed to create property',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="workspace">
        <div className="site-wrap">
          <Link to="/my-listings" className="text-link" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            Back to workspace
          </Link>
          <p className="eyebrow">New listing</p>
          <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>Post a property.</h1>
          <p className="lede" style={{ marginBottom: '2.25rem' }}>
            Title, specification, and photographs — enough for a serious buyer to decide.
          </p>

          <form onSubmit={handleSubmit} className="editorial-panel" style={{ padding: '1.75rem', display: 'grid', gap: '1.15rem' }}>
            <div className="filter-form" style={{ marginBottom: 0 }}>
              <label className="luxury-label" style={{ gridColumn: '1 / -1' }}>
                Title
                <input name="title" value={form.title} onChange={handleChange} required className="field" />
              </label>
              <label className="luxury-label">
                Location
                <input name="location" value={form.location} onChange={handleChange} required className="field" />
              </label>
              <label className="luxury-label">
                City
                <input name="city" value={form.city} onChange={handleChange} required className="field" />
              </label>
              <label className="luxury-label">
                Listing type
                <select name="listing_type" value={form.listing_type} onChange={handleChange} className="field">
                  <option value="sale">For sale</option>
                  <option value="rent">For rent</option>
                </select>
              </label>
              <label className="luxury-label">
                Property type
                <select name="property_type" value={form.property_type} onChange={handleChange} className="field">
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </label>
              <label className="luxury-label">
                Price
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required className="field" />
              </label>
              <label className="luxury-label">
                Area (sq ft)
                <input name="area" type="number" min="0" value={form.area} onChange={handleChange} required className="field" />
              </label>
              <label className="luxury-label">
                Bedrooms
                <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange} required className="field" />
              </label>
              <label className="luxury-label">
                Bathrooms
                <input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={handleChange} required className="field" />
              </label>
            </div>

            <div>
              <h2 className="eyebrow">Photographs</h2>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <p className="luxury-label">Primary image</p>
                  <div className="editorial-panel" style={{ padding: '1.15rem', display: 'grid', gap: '0.85rem' }}>
                    {primaryPreview && (
                      <img src={primaryPreview} alt="Primary preview" style={{ width: '100%', maxHeight: '16rem', objectFit: 'cover' }} />
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                      <label className="btn-base btn-luxury">
                        {primaryFile ? 'Replace from computer' : 'Select from computer'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handlePrimaryFileChange}
                          className="sr-only"
                        />
                      </label>
                      {primaryFile && (
                        <button
                          type="button"
                          onClick={() => {
                            if (primaryPreview.startsWith('blob:')) URL.revokeObjectURL(primaryPreview);
                            setPrimaryFile(null);
                            setPrimaryPreview('');
                          }}
                          className="text-link"
                          style={{ background: 'none', border: 0, cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="lede" style={{ fontSize: '0.9rem' }}>
                      {primaryFile ? primaryFile.name : 'JPG, PNG, or WEBP from your computer.'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="luxury-label">Additional images</p>
                  <div className="editorial-panel" style={{ padding: '1.15rem', display: 'grid', gap: '0.85rem' }}>
                    <label className="btn-base btn-luxury" style={{ width: 'fit-content' }}>
                      Select from computer
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        multiple
                        onChange={handleExtraFilesChange}
                        className="sr-only"
                      />
                    </label>
                    {extraFiles.length > 0 && (
                      <div className="thumb-grid">
                        {extraFiles.map((item, idx) => (
                          <div key={`${item.file.name}-${idx}`} className="editorial-panel" style={{ padding: '0.6rem' }}>
                            <img src={item.preview} alt="" style={{ width: '100%', height: '6rem', objectFit: 'cover' }} />
                            <p className="lede" style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>{item.file.name}</p>
                            <button type="button" onClick={() => removeExtraFile(idx)} className="ghost-btn ghost-btn--danger" style={{ marginTop: '0.4rem', width: '100%' }}>
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <label className="luxury-label">
              Video URL (optional)
              <input name="video_url" value={form.video_url} onChange={handleChange} className="field" />
            </label>

            <div>
              <p className="luxury-label">Amenities</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {AMENITY_OPTIONS.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`amenity-chip ${form.amenities.includes(amenity) ? 'is-on' : ''}`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <label className="luxury-label">
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="luxury-textarea-field" />
            </label>

            {error && <p className="form-status--err" role="alert">{error}</p>}

            <div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Publishing…' : 'Publish listing'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AddProperty() {
  return (
    <ProtectedRoute requireListingAccess>
      <AddPropertyForm />
    </ProtectedRoute>
  );
}
