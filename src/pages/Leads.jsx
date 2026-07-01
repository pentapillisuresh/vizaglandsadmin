import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import ApiService from "../hooks/ApiService";
// import LeadForm from "../components/LeadForm"; // uncomment when ready

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // ---------- Fetch leads (only 'callback' & 'other') ----------
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      // Adjust the endpoint as needed – e.g., "/leads"
      const res = await ApiService.get("/leads", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Normalise response (your sample returns { leads: [...] })
      let allLeads = [];
      if (res?.leads && Array.isArray(res.leads)) allLeads = res.leads;
      else if (Array.isArray(res)) allLeads = res;
      else console.error("Unexpected response:", res);

      // Filter only 'callback' and 'other'
      const filtered = allLeads.filter(
        (lead) => lead.leadType === "callback" || lead.leadType === "other"
      );
      setLeads(filtered);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err.response?.data?.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ---------- API helpers ----------
  const updateLead = async (id, payload) => {
    try {
      const token = localStorage.getItem("token");
      const res = await ApiService.put(`/leads/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res) {
        await fetchLeads();
        return true;
      }
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update lead.");
    }
    return false;
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      const token = localStorage.getItem("token");
      await ApiService.delete(`/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchLeads();
      alert("Lead deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete lead.");
    }
  };

  // ---------- Handlers ----------
  const handleStatusChange = (id, newStatus) => {
    updateLead(id, { status: newStatus });
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  // ---------- Filtering by status ----------
  const filteredByStatus =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => lead.status === filterStatus);

  // ---------- Status options (from your model) ----------
  const statusOptions = [
    "site visit",
    "closing",
    "notinterest",
    "noResponse",
    "pending"
  ];

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchLeads}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lead Management
          </h1>
          <p className="text-sm text-gray-500">
            Showing only "Callback" and "Other" leads
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition-all font-medium text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${
              filterStatus === "all"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            All ({leads.length})
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${
                filterStatus === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {leads.filter((l) => l.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Property Type</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredByStatus.length > 0 ? (
              filteredByStatus.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-blue-50 transition-colors border-b"
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {lead.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {lead.email || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {lead.phoneNumber || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {lead.propertyType || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {lead.city || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {lead.location || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-600 max-w-[180px] truncate">
                    {lead.message || "No message"}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold capitalize bg-white"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(lead)}
                        title="Edit"
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        title="Delete"
                        className="p-2 rounded-md border border-red-200 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-10 text-gray-400">
                  No leads found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          onClose={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
          onSuccess={fetchLeads}
        />
      )}
    </div>
  );
}