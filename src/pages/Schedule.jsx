import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ApiService from '../hooks/ApiService';
import { Eye, Edit, X } from 'lucide-react';

// ============================================================
// Custom Hook: useLeads
// ============================================================
const useLeads = () => {
  const [data, setData] = useState({});
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const adminToken = localStorage.getItem('token');
      if (!adminToken) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await ApiService.get('/leads', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      const allLeads = response?.leads || [];
      // Keep only "callback" leads
      const callbackLeads = allLeads.filter((item) => item.leadType === 'callback');

      const grouped = {};
      callbackLeads.forEach((lead) => {
        // Category: if property and category exist, use its name; otherwise "Other"
        const category = lead?.property?.category?.name?.trim() || 'Other';

        // City: prefer lead.city, else property.address.city, else "N/A"
        const city = lead?.city || lead?.property?.address?.city || 'N/A';

        // Locality: prefer lead.location, else property.address.locality, else "N/A"
        const locality = lead?.location || lead?.property?.address?.locality || 'N/A';

        // Slug: only if property exists
        const slug = lead?.property?.slug || '';

        const normalized = {
          id: lead.id,
          name: lead.name || 'N/A',
          email: lead.email || 'N/A',
          phone: lead.phoneNumber || 'N/A',
          city,
          slug, // may be empty
          location: locality,
          message: lead.message || 'No message',
          remarks: lead.remark || '',        // API uses "remark"
          status: lead.status || 'pending',
        };

        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(normalized);
      });

      setData(grouped);
      setTabs(Object.keys(grouped));
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { data,setData, tabs, loading, error, refetch: fetchLeads };
};

// ============================================================
// Modal Components
// ============================================================
const ViewModal = ({ lead, onClose,onDelete }) => {
  if (!lead) return null;

  const propertyUrl = lead.slug ? `https://vmrdaplots.com/property/${lead.slug}` : null;

  const deleteLead = async () => {
    const id=String(lead.id).trim();
    console.log("leadID::",  id)
    const adminToken = localStorage.getItem('token');

    const res = await ApiService.delete(`/leads/${id}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (res) {
      window.location.reload();
    } else {
      console.log("rrr::", res?.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-[#11233A] mb-4">Lead Details</h2>

        <div className="space-y-3 text-gray-700">
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Phone:</strong> {lead.phone}</p>
          <p><strong>City:</strong> {lead.city}</p>
          <p><strong>Locality:</strong> {lead.location}</p>
          <p><strong>Message:</strong> {lead.message}</p>
          {propertyUrl ? (
            <p>
              <strong>Property:</strong>{' '}
              <a
                href={propertyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {propertyUrl}
              </a>
            </p>
          ) : (
            <p><strong>Property:</strong> Not available</p>
          )}
          <p><strong>Status:</strong> {lead.status}</p>
          <p><strong>Remarks:</strong> {lead.remarks || 'No remarks'}</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 mx-5 bg-[#11233A] gap-2 text-white rounded-md hover:bg-[#0e1c2e] transition"
          >
            Close
          </button>
          <button
            onClick={deleteLead}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-[#0e1c2e] transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ lead, onClose, onSave, isSaving }) => {
  const [status, setStatus] = useState('pending');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setRemark(lead.remarks);
    }
  }, [lead]);

  if (!lead) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(lead.id, status, remark);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
          disabled={isSaving}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-[#11233A] mb-4">Edit Lead</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-gray-700 font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#11233A]"
                disabled={isSaving}
              >
                <option value="pending">Pending</option>
                <option value="site visit">Site Visit</option>
                <option value="closing">Closing</option>
                <option value="notinterest">Not Interested</option>
                <option value="noResponse">No Response</option>
              </select>
            </div>

            <div>
              <label htmlFor="remark" className="block text-gray-700 font-medium mb-1">
                Remark
              </label>
              <textarea
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add your remark"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#11233A]"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#11233A] text-white rounded-md hover:bg-[#0e1c2e] transition disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// Main Component
// ============================================================
const Schedule = () => {
  const { data, setData, tabs, loading, error, refetch } = useLeads();

  const [activeTab, setActiveTab] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [filter, setFilter] = useState('all');

  const [viewModalLead, setViewModalLead] = useState(null);
  const [editModalLead, setEditModalLead] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Set first tab when data loads
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  const currentData = useMemo(() => data[activeTab] || [], [data, activeTab]);

  const cityOptions = useMemo(() => {
    const cities = new Set(currentData.map((item) => item.city));
    return ['All', ...Array.from(cities)];
  }, [currentData]);

  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const matchesCity = selectedCity === 'All' || item.city === selectedCity;
      const matchesFilter =
        filter === 'all' ||
        (filter === 'site visit' && item.status === 'site visit') ||
        (filter === 'closing' && item.status === 'closing') ||
        (filter === 'notinterest' && item.status === 'notinterest') ||
        (filter === 'noResponse' && item.status === 'noResponse') ||
        (filter === 'pending' && item.status === 'pending');
      return matchesCity && matchesFilter;
    });
  }, [currentData, selectedCity, filter]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedCity('All');
  }, []);

  const handleCityChange = useCallback((e) => {
    setSelectedCity(e.target.value);
  }, []);

  const handleViewModal = useCallback((lead) => {
    setViewModalLead(lead);
  }, []);

  const handleEditModal = useCallback((lead) => {
    setEditModalLead(lead);
  }, []);

  const closeModals = useCallback(() => {
    setViewModalLead(null);
    setEditModalLead(null);
  }, []);

  const handleSaveLead = useCallback(
    async (id, status, remark) => {
      if (!id) return;
      setIsSaving(true);
      try {
        const adminToken = localStorage.getItem('token');
        if (!adminToken) {
          alert('No authentication token found. Please log in.');
          return;
        }

        await ApiService.put(
          `/leads/${id}`,
          { status, remark }, // API expects "remark"
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Optimistic update
        setData((prev) => {
          const updatedTab = (prev[activeTab] || []).map((item) =>
            item.id === id ? { ...item, status, remarks: remark } : item
          );
          return { ...prev, [activeTab]: updatedTab };
        });

        closeModals();
        alert('Lead updated successfully!');
      } catch (err) {
        console.error('Error updating lead:', err);
        alert('Failed to update lead. Please try again.');
      } finally {
        setIsSaving(false);
      }
    },
    [activeTab, closeModals]
  );

  const renderStatusBadge = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      'site visit': 'bg-blue-100 text-blue-800',
      closing: 'bg-green-100 text-green-800',
      notinterest: 'bg-red-100 text-red-800',
      noResponse: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${classes[status] || classes.pending}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11233A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[#11233A] text-white rounded-md hover:bg-[#0e1c2e] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#11233A] mb-2">
            Request a Callback
          </h1>
          <p className="text-gray-600">
            Admin Panel - Manage customer inquiries
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#11233A] text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#11233A] hover:text-[#11233A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            {currentData.length > 0 && (
              <div className="mb-4 mr-8">
                <label htmlFor="cityFilter" className="text-gray-700 font-medium mr-2">
                  Filter by City:
                </label>
                <select
                  id="cityFilter"
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#11233A]"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {['all', 'site visit', 'closing', 'notinterest', 'noResponse', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${
                    filter === status
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {activeTab && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              {filteredData.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#11233A] text-white">
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">Name</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">Phone</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">City</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">Locality</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">Status</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="py-4 px-6 text-gray-900 font-medium">{item.name}</td>
                        <td className="py-4 px-6 text-gray-700">{item.phone}</td>
                        <td className="py-4 px-6 text-gray-700">{item.city}</td>
                        <td className="py-4 px-6 text-gray-700">{item.location}</td>
                        <td className="py-4 px-6">{renderStatusBadge(item.status)}</td>
                        <td className="py-4 px-6 flex gap-2">
                          <button
                            onClick={() => handleViewModal(item)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            aria-label="View lead details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditModal(item)}
                            className="text-gray-600 hover:text-green-600 transition-colors"
                            aria-label="Edit lead"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No leads found for {activeTab}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        {viewModalLead && (
          <ViewModal lead={viewModalLead} onClose={closeModals} />
        )}
        {editModalLead && (
          <EditModal
            lead={editModalLead}
            onClose={closeModals}
            onSave={handleSaveLead}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default Schedule;