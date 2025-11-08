import { useState } from "react";
import { useData } from "../context/DataContext";
// import LeadForm from "../components/LeadForm";
import {
  User,
  Home,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  Circle,
  CheckCircle2,
  AlertTriangle,
  Star,
} from "lucide-react";

export default function Leads() {
  const { leads, properties, users, agents, updateLead, deleteLead } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredLeads = leads.filter(
    (lead) => filter === "all" || lead.status === filter
  );

  const getPropertyTitle = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.title : "Unknown Property";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  const getAgentName = (agentId) => {
    const agent = agents.find((a) => a.id === agentId);
    return agent ? agent.fullName : "Unassigned";
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id);
    }
  };

  const handleStatusChange = (id, status) => {
    updateLead(id, { status });
  };

  const handlePriorityChange = (id, priority) => {
    updateLead(id, { priority });
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    qualified: "bg-purple-100 text-purple-700",
    converted: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };

  const priorityColors = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-sm text-gray-500">
            Track and manage customer inquiries
          </p>
        </div>
        <button
          className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition-all font-medium text-sm"
          onClick={() => setShowForm(true)}
        >
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex flex-wrap gap-2">
          {['site visit', 'closing','notinterest' ,'noResponse','pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {status === "all"
                ? leads.length
                : leads.filter((l) => l.status === status).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b">
            <tr>
              <th className="px-5 py-3">Property</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Assigned To</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-blue-50 transition-colors border-b"
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {getPropertyTitle(lead.propertyId)}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {getUserName(lead.userId)}
                  </td>
                  <td className="px-5 py-3 text-gray-600 max-w-[220px] truncate">
                    {lead.message || "No message"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {getAgentName(lead.assignedAgentId)}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={lead.priority}
                      onChange={(e) =>
                        handlePriorityChange(lead.id, e.target.value)
                      }
                      className={`border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold capitalize ${priorityColors[lead.priority]}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value)
                      }
                      className={`border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold capitalize ${statusColors[lead.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
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
                        onClick={() => handleDelete(lead.id)}
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
                <td colSpan="8" className="text-center py-10 text-gray-400">
                  No leads found
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
        />
      )}
    </div>
  );
}
