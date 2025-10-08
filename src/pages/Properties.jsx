import { useState } from 'react';
import { useData } from '../context/DataContext';
import PropertyForm from '../components/PropertyForm';
import './Properties.css';

export default function Properties() {
  const { properties, agents, updateProperty, deleteProperty } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
    }
  };

  const handleApprove = (id) => {
    updateProperty(id, { status: 'active' });
  };

  const handleReject = (id) => {
    updateProperty(id, { status: 'rejected' });
  };

  const handleFeature = (id, isFeatured) => {
    updateProperty(id, { isFeatured: !isFeatured });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.fullName : 'Unassigned';
  };

  return (
    <div className="properties-page">
      <div className="properties-header">
        <div>
          <h1 className="page-title">Property Management</h1>
          <p className="page-subtitle">Manage all property listings and approvals</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Property
        </button>
      </div>

      <div className="properties-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by title or city..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('all')}>
            All ({properties.length})
          </button>
          <button className={filter === 'active' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('active')}>
            Active ({properties.filter(p => p.status === 'active').length})
          </button>
          <button className={filter === 'pending' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('pending')}>
            Pending ({properties.filter(p => p.status === 'pending').length})
          </button>
          <button className={filter === 'sold' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('sold')}>
            Sold ({properties.filter(p => p.status === 'sold').length})
          </button>
          <button className={filter === 'rejected' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('rejected')}>
            Rejected ({properties.filter(p => p.status === 'rejected').length})
          </button>
        </div>
      </div>

      <div className="properties-grid">
        {filteredProperties.map(property => (
          <div key={property.id} className="property-card">
            <div className="property-image" style={{ backgroundImage: `url(${property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'})` }}>
              <div className="property-badges">
                <span className={`status-badge status-${property.status}`}>{property.status}</span>
                {property.isFeatured && <span className="featured-badge">Featured</span>}
              </div>
            </div>
            <div className="property-content">
              <h3 className="property-title">{property.title}</h3>
              <div className="property-meta">
                <span className="property-type">{property.propertyType}</span>
                <span className="property-listing">{property.listingType}</span>
              </div>
              <div className="property-location">📍 {property.location}, {property.city}</div>
              <div className="property-details">
                <span>{property.bedrooms} BHK</span>
                <span>{property.areaSqft} sq.ft</span>
                <span>{property.viewsCount} views</span>
              </div>
              <div className="property-price">₹{property.price.toLocaleString('en-IN')}</div>
              <div className="property-agent">Agent: {getAgentName(property.agentId)}</div>
              <div className="property-actions">
                <button className="btn-icon" onClick={() => handleEdit(property)} title="Edit">
                  ✏️
                </button>
                <button className="btn-icon" onClick={() => handleFeature(property.id, property.isFeatured)} title="Toggle Featured">
                  {property.isFeatured ? '⭐' : '☆'}
                </button>
                {property.status === 'pending' && (
                  <>
                    <button className="btn-icon btn-success" onClick={() => handleApprove(property.id)} title="Approve">
                      ✓
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleReject(property.id)} title="Reject">
                      ✗
                    </button>
                  </>
                )}
                <button className="btn-icon btn-danger" onClick={() => handleDelete(property.id)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>No properties found</h3>
          <p>Try adjusting your filters or add a new property</p>
        </div>
      )}

      {showForm && (
        <PropertyForm
          property={editingProperty}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
