import { useState } from 'react';
import { useData } from '../context/DataContext';
import LeadForm from '../components/LeadForm';
import './Leads.css';

export default function Leads() {
  const { leads, properties, users, agents, updateLead, deleteLead } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.status === filter);

  const getPropertyTitle = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Unknown User';
  };

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.fullName : 'Unassigned';
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
    }
  };

  const handleStatusChange = (id, status) => {
    updateLead(id, { status });
  };

  const handlePriorityChange = (id, priority) => {
    updateLead(id, { priority });
  };

  return (
    <div className="leads-page">
      <div className="leads-header">
        <div>
          <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">Track and manage customer inquiries</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Lead
        </button>
      </div>

      <div className="leads-filters">
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('all')}>
            All ({leads.length})
          </button>
          <button className={filter === 'new' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('new')}>
            New ({leads.filter(l => l.status === 'new').length})
          </button>
          <button className={filter === 'contacted' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('contacted')}>
            Contacted ({leads.filter(l => l.status === 'contacted').length})
          </button>
          <button className={filter === 'qualified' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('qualified')}>
            Qualified ({leads.filter(l => l.status === 'qualified').length})
          </button>
          <button className={filter === 'converted' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter('converted')}>
            Converted ({leads.filter(l => l.status === 'converted').length})
          </button>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Customer</th>
              <th>Message</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id}>
                <td className="lead-property">{getPropertyTitle(lead.propertyId)}</td>
                <td>{getUserName(lead.userId)}</td>
                <td className="lead-message">{lead.message || 'No message'}</td>
                <td>{getAgentName(lead.assignedAgentId)}</td>
                <td>
                  <select
                    className={`priority-select priority-${lead.priority}`}
                    value={lead.priority}
                    onChange={(e) => handlePriorityChange(lead.id, e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td>
                  <select
                    className={`status-select status-${lead.status}`}
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="table-actions">
                  <button className="btn-icon" onClick={() => handleEdit(lead)} title="Edit">
                    ✏️
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(lead.id)} title="Delete">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeads.length === 0 && (
          <div className="empty-state">No leads found</div>
        )}
      </div>

      {showForm && (
        <LeadForm
          lead={editingLead}
          onClose={() => { setShowForm(false); setEditingLead(null); }}
        />
      )}
    </div>
  );
}
