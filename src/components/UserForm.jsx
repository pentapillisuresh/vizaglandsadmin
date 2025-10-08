import { useState } from 'react';
import { useData } from '../context/DataContext';
import './PropertyForm.css';

export default function UserForm({ item, type, onClose }) {
  const { addUser, updateUser, addAgent, updateAgent } = useData();

  const [formData, setFormData] = useState({
    fullName: item?.fullName || '',
    email: item?.email || '',
    phone: item?.phone || '',
    role: item?.role || 'agent',
    isActive: item?.isActive !== undefined ? item.isActive : true,
    isVerified: item?.isVerified !== undefined ? item.isVerified : false
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === 'user') {
      if (item) {
        updateUser(item.id, formData);
      } else {
        addUser(formData);
      }
    } else {
      if (item) {
        updateAgent(item.id, formData);
      } else {
        addAgent(formData);
      }
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {item ? `Edit ${type === 'user' ? 'Customer' : 'Agent'}` : `Add New ${type === 'user' ? 'Customer' : 'Agent'}`}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {type === 'agent' && (
              <div className="form-group full-width">
                <label className="form-label">Role *</label>
                <select name="role" value={formData.role} onChange={handleChange} className="form-select" required>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active Account</span>
              </label>
            </div>

            {type === 'user' && (
              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                  />
                  <span>Verified Account</span>
                </label>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {item ? `Update ${type === 'user' ? 'Customer' : 'Agent'}` : `Add ${type === 'user' ? 'Customer' : 'Agent'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
