import { useState } from 'react';
import { useData } from '../context/DataContext';
// import './PropertyForm.css';

export default function BannerForm({ banner, onClose }) {
  const { addBanner, updateBanner } = useData();

  const [formData, setFormData] = useState({
    title: banner?.title || '',
    imageUrl: banner?.imageUrl || '',
    linkUrl: banner?.linkUrl || '',
    position: banner?.position || 'home',
    displayOrder: banner?.displayOrder || 0,
    isActive: banner?.isActive !== undefined ? banner.isActive : true
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
    const bannerData = {
      ...formData,
      displayOrder: Number(formData.displayOrder)
    };

    if (banner) {
      updateBanner(banner.id, bannerData);
    } else {
      addBanner(bannerData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{banner ? 'Edit Banner' : 'Add New Banner'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Banner Title *</label>
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
              <label className="form-label">Image URL *</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Link URL</label>
              <input
                type="url"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Position *</label>
              <select name="position" value={formData.position} onChange={handleChange} className="form-select" required>
                <option value="home">Home</option>
                <option value="properties">Properties</option>
                <option value="about">About</option>
                <option value="contact">Contact</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Display Order *</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active Banner</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {banner ? 'Update Banner' : 'Add Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
