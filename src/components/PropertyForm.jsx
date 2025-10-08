import { useState } from 'react';
import { useData } from '../context/DataContext';
import './PropertyForm.css';

export default function PropertyForm({ property, onClose }) {
  const { addProperty, updateProperty, agents } = useData();

  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    propertyType: property?.propertyType || 'apartment',
    listingType: property?.listingType || 'sale',
    price: property?.price || '',
    location: property?.location || '',
    city: property?.city || '',
    state: property?.state || '',
    areaSqft: property?.areaSqft || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    agentId: property?.agentId || agents[0]?.id || '',
    status: property?.status || 'pending',
    isFeatured: property?.isFeatured || false,
    images: property?.images?.[0] || '',
    amenities: property?.amenities?.join(', ') || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const propertyData = {
      ...formData,
      price: Number(formData.price),
      areaSqft: Number(formData.areaSqft),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      images: formData.images ? [formData.images] : [],
      amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : []
    };

    if (property) {
      updateProperty(property.id, propertyData);
    } else {
      addProperty(propertyData);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{property ? 'Edit Property' : 'Add New Property'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Property Type *</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="form-select" required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Listing Type *</label>
              <select name="listingType" value={formData.listingType} onChange={handleChange} className="form-select" required>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Area (sq.ft) *</label>
              <input
                type="number"
                name="areaSqft"
                value={formData.areaSqft}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Agent *</label>
              <select name="agentId" value={formData.agentId} onChange={handleChange} className="form-select" required>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select" required>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <span>Mark as Featured</span>
              </label>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="images"
                value={formData.images}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Amenities (comma-separated)</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="form-input"
                placeholder="Parking, Gym, Swimming Pool"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {property ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
