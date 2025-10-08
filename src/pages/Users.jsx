import { useState } from 'react';
import { useData } from '../context/DataContext';
import UserForm from '../components/UserForm';
import './Users.css';

export default function Users() {
  const { users, agents, updateUser, deleteUser, updateAgent, deleteAgent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState('user');
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgents = agents.filter(agent =>
    agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormType(type);
    setShowForm(true);
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'user') {
        deleteUser(id);
      } else {
        deleteAgent(id);
      }
    }
  };

  const handleToggleActive = (id, isActive, type) => {
    if (type === 'user') {
      updateUser(id, { isActive: !isActive });
    } else {
      updateAgent(id, { isActive: !isActive });
    }
  };

  const handleVerify = (id, isVerified) => {
    updateUser(id, { isVerified: !isVerified });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="page-title">Users & Agents Management</h1>
          <p className="page-subtitle">Manage customers and agent accounts</p>
        </div>
        <button className="btn-primary" onClick={() => { setFormType(activeTab === 'customers' ? 'user' : 'agent'); setShowForm(true); }}>
          + Add {activeTab === 'customers' ? 'User' : 'Agent'}
        </button>
      </div>

      <div className="users-controls">
        <div className="tab-buttons">
          <button className={activeTab === 'customers' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('customers')}>
            Customers ({users.length})
          </button>
          <button className={activeTab === 'agents' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('agents')}>
            Agents ({agents.length})
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeTab === 'customers' ? (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="user-name">{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="table-actions">
                    <button className="btn-icon" onClick={() => handleEdit(user, 'user')} title="Edit">
                      ✏️
                    </button>
                    <button className="btn-icon" onClick={() => handleVerify(user.id, user.isVerified)} title="Toggle Verification">
                      {user.isVerified ? '✓' : '?'}
                    </button>
                    <button className="btn-icon" onClick={() => handleToggleActive(user.id, user.isActive, 'user')} title="Toggle Active">
                      {user.isActive ? '🔓' : '🔒'}
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(user.id, 'user')} title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="empty-state">No customers found</div>
          )}
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map(agent => (
                <tr key={agent.id}>
                  <td className="user-name">{agent.fullName}</td>
                  <td>{agent.email}</td>
                  <td>
                    <span className="badge badge-info">{agent.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${agent.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                  <td className="table-actions">
                    <button className="btn-icon" onClick={() => handleEdit(agent, 'agent')} title="Edit">
                      ✏️
                    </button>
                    <button className="btn-icon" onClick={() => handleToggleActive(agent.id, agent.isActive, 'agent')} title="Toggle Active">
                      {agent.isActive ? '🔓' : '🔒'}
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(agent.id, 'agent')} title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAgents.length === 0 && (
            <div className="empty-state">No agents found</div>
          )}
        </div>
      )}

      {showForm && (
        <UserForm
          item={editingItem}
          type={formType}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
