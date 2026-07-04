import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import ProtectedRoute from '../components/ProtectedRoute';
import { propertyAPI } from '../api';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePrimaryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrimaryFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
      // Clear manual URL string if file is chosen
      setForm((prev) => ({ ...prev, primary_image: '' }));
    }
  };

  const handleExtraFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setExtraFiles((prev) => [...prev, ...files]);
  };

  const removeExtraFile = (index) => {
    setExtraFiles((prev) => prev.filter((_, i) => i !== index));
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

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      primary_image: form.primary_image || undefined,
      video_url: form.video_url || undefined,
    };

    try {
      // 1. Create property
      const { data: createdProperty } = await propertyAPI.create(payload);

      // 2. Upload primary image file if selected
      if (primaryFile) {
        const formData = new FormData();
        formData.append('image', primaryFile);
        formData.append('is_primary', '1');
        await propertyAPI.uploadImage(createdProperty.id, formData);
      }

      // 3. Upload additional image files if selected
      if (extraFiles.length > 0) {
        for (const file of extraFiles) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('is_primary', '0');
          await propertyAPI.uploadImage(createdProperty.id, formData);
        }
      }

      navigate('/my-listings');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(', ')
          : err.response?.data?.message || 'Failed to create property'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-luxury-black border border-white/10 px-4 py-2 text-sm text-luxury-cream focus:border-luxury-gold focus:outline-none';

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 bg-luxury-black min-h-screen relative overflow-x-hidden">
        <div className="w-full max-w-[92%] lg:max-w-[70vw] mx-auto px-6">
          <Link to="/my-listings" className="text-xs text-luxury-silver hover:text-luxury-gold mb-6 inline-block">
            &larr; Back to My Listings
          </Link>
          <h1 className="text-3xl font-bold text-luxury-cream mb-2">Post a Property</h1>
          <p className="text-luxury-silver text-sm mb-8">
            List your property for sale or rent with full details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-white/10 bg-luxury-charcoal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Location</label>
                <input name="location" value={form.location} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">City</label>
                <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Listing Type</label>
                <select name="listing_type" value={form.listing_type} onChange={handleChange} className={inputClass}>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Property Type</label>
                <select name="property_type" value={form.property_type} onChange={handleChange} className={inputClass}>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Price</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Area (sq ft)</label>
                <input name="area" type="number" value={form.area} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Bedrooms</label>
                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Bathrooms</label>
                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} required className={inputClass} />
              </div>
              
              <div className="md:col-span-2 border-t border-white/5 pt-4">
                <h3 className="text-sm font-semibold text-luxury-cream mb-4">Property Images</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-2">Primary Image File</label>
                    <div className="relative border border-dashed border-white/10 hover:border-luxury-gold/50 p-4 transition-colors flex flex-col items-center justify-center min-h-[140px] bg-luxury-black">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePrimaryFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {primaryPreview ? (
                        <img src={primaryPreview} alt="Primary Preview" className="w-full h-28 object-cover rounded" />
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-luxury-silver">Click or Drag Image File</p>
                          <p className="text-xs text-luxury-silver/60 mt-1">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-2">Or Primary Image URL</label>
                    <input
                      name="primary_image"
                      value={form.primary_image}
                      onChange={handleChange}
                      disabled={!!primaryFile}
                      className={`${inputClass} h-12`}
                      placeholder={primaryFile ? "Using uploaded file..." : "https://example.com/image.jpg"}
                    />
                    {primaryFile && (
                      <button
                        type="button"
                        onClick={() => { setPrimaryFile(null); setPrimaryPreview(''); }}
                        className="text-xs text-red-400 mt-2 hover:underline cursor-pointer"
                      >
                        Reset Uploaded File
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-2">Additional Images</label>
                <div className="border border-dashed border-white/10 p-4 bg-luxury-black flex flex-col items-center justify-center min-h-[100px] relative hover:border-luxury-gold/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleExtraFilesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-sm text-luxury-silver">Select Multiple Additional Images</p>
                  <p className="text-xs text-luxury-silver/60 mt-1">Upload additional property views</p>
                </div>
                
                {extraFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {extraFiles.map((file, idx) => (
                      <div key={idx} className="relative group border border-white/5 bg-luxury-black p-2 rounded">
                        <p className="text-xs text-luxury-cream truncate pr-6">{file.name}</p>
                        <p className="text-[10px] text-luxury-silver">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={() => removeExtraFile(idx)}
                          className="absolute right-2 top-2 text-red-400 hover:text-red-500 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Video URL (optional)</label>
                <input name="video_url" value={form.video_url} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`text-xs px-3 py-1 border cursor-pointer ${
                        form.amenities.includes(a)
                          ? 'border-luxury-gold text-luxury-gold'
                          : 'border-white/10 text-luxury-silver'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-luxury-silver mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </Button>
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
