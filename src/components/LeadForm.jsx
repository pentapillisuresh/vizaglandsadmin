import { useState } from 'react';
import { useData } from '../context/DataContext';
// import './PropertyForm.css';

export default function LeadForm({ lead, onClose }) {
  const { addLead, updateLead, properties, users, agents } = useData();

  const [formData, setFormData] = useState({
    propertyId: lead?.propertyId || properties[0]?.id || '',
    userId: lead?.userId || users[0]?.id || '',
    assignedAgentId: lead?.assignedAgentId || agents[0]?.id || '',
    message: lead?.message || '',
    status: lead?.status || 'new',
    priority: lead?.priority || 'medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lead) {
      updateLead(lead.id, formData);
    } else {
      addLead(formData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Property *</label>
              <select name="propertyId" value={formData.propertyId} onChange={handleChange} className="form-select" required>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>{property.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select name="userId" value={formData.userId} onChange={handleChange} className="form-select" required>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.fullName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign to Agent *</label>
              <select name="assignedAgentId" value={formData.assignedAgentId} onChange={handleChange} className="form-select" required>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="form-select" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select" required>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Customer inquiry or notes..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {lead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
