import { useState, useEffect } from "react";
import ApiService from "../hooks/ApiService";
import { Eye, Edit, X } from "lucide-react";

export default function Schedule() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedRemark, setUpdatedRemark] = useState("");

  // 🔹 Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const adminToken = localStorage.getItem("token");
        const res = await ApiService.get("/leads", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });

        const allLeads = res?.leads || [];
        const callbackLeads = allLeads.filter(
          (item) => item.leadType === "callback"
        );

        const grouped = {};

        callbackLeads.forEach((lead) => {
          const category = lead?.property?.category?.name?.trim() || "Quote";
          const city = lead?.property?.address?.city || lead?.city || "N/A";
          const locality =
            lead?.property?.address?.locality || lead?.location || "N/A";

          const normalized = {
            id: lead.id,
            name: lead.name || "N/A",
            email: lead.email || "N/A",
            phone: lead.phoneNumber || "N/A",
            city,
            location: locality,
            message: lead.message || "No message",
            remarks: lead.remark || "",
            status: lead.status || "pending",
          };

          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(normalized);
        });

        setData(grouped);
        const uniqueTabs = Object.keys(grouped);
        setTabs(uniqueTabs);
        setActiveTab(uniqueTabs[0] || "");
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to fetch leads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const currentData = data[activeTab] || [];
  const cities = ["All", ...new Set(currentData.map((item) => item.city))];

  // 🔹 Filter by city + status
  const filteredData = currentData.filter((item) => {
    const matchesCity = selectedCity === "All" || item.city === selectedCity;
    const matchesFilter =
      filter === "all" ||
      (filter === "site visit" && item.status === "site visit") ||
      (filter === "closing" && item.status === "closing") ||
      (filter === "notinterest" && item.status === "notinterest") ||
      (filter === "noResponse" && item.status === "noResponse") ||
      (filter === "pending" && item.status === "pending");
    return matchesCity && matchesFilter;
  });

  // 🔹 View Lead Modal
  const openViewModal = (lead) => {
    setSelectedLead(lead);
    setViewModal(true);
  };

  // 🔹 Edit Lead Modal
  const openEditModal = (lead) => {
    setSelectedLead(lead);
    setUpdatedStatus(lead.status);
    setUpdatedRemark(lead.remarks);
    setEditModal(true);
  };

  const closeModals = () => {
    setViewModal(false);
    setEditModal(false);
    setSelectedLead(null);
  };

  // 🔹 Save updated status and remark
  const handleSaveUpdates = async () => {
    if (!selectedLead) return;

    try {
      const adminToken = localStorage.getItem("token");
      await ApiService.put(
        `/leads/${selectedLead.id}`,
        {
          status: updatedStatus,
          remark: updatedRemark,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item) =>
          item.id === selectedLead.id
            ? { ...item, status: updatedStatus, remarks: updatedRemark }
            : item
        ),
      }));

      closeModals();
      alert("Lead updated successfully!");
    } catch (err) {
      console.error("Error updating lead:", err);
      alert("Failed to update lead. Please try again.");
    }
  };

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
              onClick={() => {
                setActiveTab(tab);
                setSelectedCity("All");
              }}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#11233A] text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-[#11233A] hover:text-[#11233A]"
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
                <label className="text-gray-700 font-medium mr-2">
                  Filter by City:
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#11233A]"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {["all", "site visit", "closing", "notinterest", "noResponse", "pending"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${
                    filter === status
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Table */}
        {loading && <p className="text-center text-gray-600 py-10">Loading leads...</p>}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && !error && activeTab && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              {filteredData.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#11233A] text-white">
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">
                        Name
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">
                        Phone
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">
                        City
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">
                        Locality
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="py-4 px-6 text-gray-900 font-medium">
                          {item.name}
                        </td>
                        <td className="py-4 px-6 text-gray-700">{item.phone}</td>
                        <td className="py-4 px-6 text-gray-700">{item.city}</td>
                        <td className="py-4 px-6 text-gray-700">
                          {item.location}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.status === "closing"
                                ? "bg-green-100 text-green-800"
                                : item.status === "notinterest"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex gap-2">
                          <button
                            onClick={() => openViewModal(item)}
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-gray-600 hover:text-green-600"
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

        {/* 🔹 View Lead Modal */}
        {viewModal && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={closeModals}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold text-[#11233A] mb-4">
                Lead Details
              </h2>

              <div className="space-y-3 text-gray-700">
                <p><strong>Name:</strong> {selectedLead.name}</p>
                <p><strong>Email:</strong> {selectedLead.email}</p>
                <p><strong>Phone:</strong> {selectedLead.phone}</p>
                <p><strong>City:</strong> {selectedLead.city}</p>
                <p><strong>Locality:</strong> {selectedLead.location}</p>
                <p><strong>Message:</strong> {selectedLead.message}</p>
                <p><strong>Status:</strong> {selectedLead.status}</p>
                <p><strong>Remarks:</strong> {selectedLead.remarks || "No remarks"}</p>
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-[#11233A] text-white rounded-md hover:bg-[#0e1c2e] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Edit Lead Modal */}
        {editModal && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={closeModals}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold text-[#11233A] mb-4">
                Edit Lead
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#11233A]"
                  >
                    <option value="pending">Pending</option>
                    <option value="site visit">Site Visit</option>
                    <option value="closing">Closing</option>
                    <option value="notinterest">Not Interested</option>
                    <option value="noResponse">No Response</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Remark
                  </label>
                  <textarea
                    value={updatedRemark}
                    onChange={(e) => setUpdatedRemark(e.target.value)}
                    placeholder="Add your remark"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#11233A]"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdates}
                  className="px-4 py-2 bg-[#11233A] text-white rounded-md hover:bg-[#0e1c2e] transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
