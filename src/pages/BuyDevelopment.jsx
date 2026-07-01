import React, { useState, useEffect } from "react";
import { Search, Eye, X, Loader2 } from "lucide-react";
import ApiService from "../hooks/ApiService";

const BuyDevelopment = () => {
  const [activeTab, setActiveTab] = useState("investorInquiry");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError("");
        const adminToken = localStorage.getItem("token");
        const response = await ApiService.get("/leads", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });

        // Extract leads array from response
        const allLeads = response?.leads || [];
        // Filter only investorInquiry and developmentInquiry
        const filtered = allLeads.filter(
          (lead) =>
            lead.leadType === "investorInquiry" ||
            lead.leadType === "developmentInquiry"
        );
        setLeads(filtered);
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError(err.response?.data?.message || "Failed to load leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Switch tabs
  const handleTabChange = (type) => {
    setActiveTab(type);
    setSearchTerm(""); // reset search on tab change (optional)
  };

  // Filter by tab and search
  const filteredLeads = leads
    .filter((lead) => lead.leadType === activeTab)
    .filter((lead) => {
      const term = searchTerm.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.city?.toLowerCase().includes(term) ||
        lead.phoneNumber?.includes(term)
      );
    });

  // Helper to get status badge color
  const getStatusColor = (status) => {
    const map = {
      "site visit": "bg-blue-100 text-blue-700",
      closing: "bg-green-100 text-green-700",
      notinterest: "bg-gray-100 text-gray-700",
      noResponse: "bg-yellow-100 text-yellow-700",
      pending: "bg-orange-100 text-orange-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "—";
    }
  };

  // Loading / error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#003366]">
          Leads Management
        </h1>
        <p className="text-gray-500">
          Manage investor and development leads
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex space-x-3">
          {[
            { key: "investorInquiry", label: "Investor" },
            { key: "developmentInquiry", label: "Development" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`px-5 py-2 rounded-lg font-medium border capitalize ${
                activeTab === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No leads found for this tab.
          </div>
        ) : (
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Property Type</th>
                <th className="px-4 py-3 hidden md:table-cell">City</th>
                <th className="px-4 py-3 hidden md:table-cell">Location</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedItem(lead)}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {lead.name || "—"}
                  </td>
                  <td className="px-4 py-3">{lead.email || "—"}</td>
                  <td className="px-4 py-3">{lead.phoneNumber || "—"}</td>
                  <td className="px-4 py-3">{lead.propertyType || "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {lead.city || "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {lead.location || "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Eye className="text-blue-600 hover:text-blue-800 inline" size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-[90vh] relative">
            <div className="bg-blue-600 text-white px-5 py-3 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-semibold">Lead Details</h2>
              <button onClick={() => setSelectedItem(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {selectedItem.name || "—"}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedItem.email || "—"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {selectedItem.phoneNumber || "—"}
              </p>
              <p>
                <span className="font-semibold">Property Type:</span>{" "}
                {selectedItem.propertyType || "—"}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {selectedItem.city || "—"}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {selectedItem.location || "—"}
              </p>
              {selectedItem.investmentAmount && (
                <p>
                  <span className="font-semibold">Investment Amount:</span> ₹
                  {selectedItem.investmentAmount.toLocaleString()}
                </p>
              )}
              <p>
                <span className="font-semibold">Message:</span>{" "}
                {selectedItem.message || "—"}
              </p>
              <p>
                <span className="font-semibold">Lead Type:</span>{" "}
                {selectedItem.leadType || "—"}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedItem.status
                  )}`}
                >
                  {selectedItem.status || "pending"}
                </span>
              </p>
              {selectedItem.remark && (
                <p>
                  <span className="font-semibold">Remark:</span>{" "}
                  {selectedItem.remark}
                </p>
              )}
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {formatDate(selectedItem.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyDevelopment;