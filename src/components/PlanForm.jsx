import { useState } from 'react';
import { useData } from '../context/DataContext';
import './PropertyForm.css';

export default function PlanForm({ plan, onClose }) {
  const { addPlan, updatePlan } = useData();

  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    price: plan?.price || '',
    durationDays: plan?.durationDays || 30,
    features: plan?.features?.join('\n') || '',
    isActive: plan?.isActive !== undefined ? plan.isActive : true
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
    const planData = {
      ...formData,
      price: Number(formData.price),
      durationDays: Number(formData.durationDays),
      features: formData.features.split('\n').filter(f => f.trim())
    };

    if (plan) {
      updatePlan(plan.id, planData);
    } else {
      addPlan(planData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{plan ? 'Edit Plan' : 'Add New Plan'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Plan Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
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

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Days) *</label>
              <input
                type="number"
                name="durationDays"
                value={formData.durationDays}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active Plan</span>
              </label>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Features (one per line) *</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="form-textarea"
                rows="6"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {plan ? 'Update Plan' : 'Add Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
