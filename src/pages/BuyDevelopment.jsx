import React, { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";
import ApiService from "../hooks/ApiService";
import getPhotoSrc from "../hooks/getPhotos";

const BuyDevelopment = () => {
  const [activeTab, setActiveTab] = useState("investorInquiry"); // default to "buy"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const adminToken = localStorage.getItem("token");
        const response = await ApiService.get("/leads", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });

        // ✅ Filter out callback leads
        const validLeads = (response.leads || []).filter(
          (lead) => lead.leadType !== "callback"
        );
        setLeads(validLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Switch between tabs
  const tabData = (type) => {
    switch (type) {
      case "buy":
        setActiveTab("investorInquiry");
        break;
      case "development":
        setActiveTab("developmentInquiry");
        break;
      default:
        break;
    }
  };

  // Filter leads by tab type and search
  const filteredLeads = leads
    .filter((lead) => lead.leadType === activeTab)
    .filter(
      (lead) =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#003366]">
          Leads Management
        </h1>
        <p className="text-gray-500">
          Manage all investor and development leads efficiently
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex space-x-3">
          {/* Tabs (no callback tab now) */}
          {["buy", "development"].map((type) => (
            <button
              key={type}
              onClick={() => tabData(type)}
              className={`px-5 py-2 rounded-lg font-medium border capitalize ${
                (activeTab === "investorInquiry" && type === "buy") ||
                (activeTab === "developmentInquiry" && type === "development")
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
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
                <th className="px-4 py-3">Property</th>
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
                    {lead.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">{lead.email || "N/A"}</td>
                  <td className="px-4 py-3">{lead.phoneNumber || "N/A"}</td>
                  <td className="px-4 py-3">
                    {lead.property?.propertyName || "N/A"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {lead.city || lead.property?.address?.city || "N/A"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {lead.location || lead.property?.address?.locality || "N/A"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === "new"
                          ? "text-yellow-600 bg-yellow-100"
                          : "text-green-600 bg-green-100"
                      }`}
                    >
                      {lead.status}
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
              <p><span className="font-semibold">Name:</span> {selectedItem.name}</p>
              <p><span className="font-semibold">Email:</span> {selectedItem.email}</p>
              <p><span className="font-semibold">Phone:</span> {selectedItem.phoneNumber}</p>
              <p><span className="font-semibold">Message:</span> {selectedItem.message || "—"}</p>

              {selectedItem.property && (
                <>
                  <p><span className="font-semibold">Property:</span> {selectedItem.property.propertyName}</p>
                  <p><span className="font-semibold">Category:</span> {selectedItem.property.category?.name}</p>
                  <p><span className="font-semibold">Price:</span> ₹{selectedItem.property.price}</p>
                  <p><span className="font-semibold">City:</span> {selectedItem.property.address?.city}</p>
                  <p><span className="font-semibold">Locality:</span> {selectedItem.property.address?.locality}</p>
                  {selectedItem.property.photos && (
                    <div>
                      <span className="font-semibold">Images:</span>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {selectedItem.property.photos.map((img, i) => (
                          <img key={i} src={img} alt="Property" className="rounded border" />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedItem.status === "new"
                      ? "text-yellow-600 bg-yellow-100"
                      : "text-green-600 bg-green-100"
                  }`}
                >
                  {selectedItem.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(selectedItem.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyDevelopment;
