import { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../hooks/ApiService";

export default function Schedule() {
  const [tabs, setTabs] = useState([]); // dynamic from API
  const [activeTab, setActiveTab] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch leads from API
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

        const rrr = res?.leads || [];
        const leads=rrr.filter((item)=>item.leadType==='callback')
console.log("rrr::",leads)
        // 🔹 Group leads dynamically by property category name
        const grouped = {};

        leads.forEach((lead) => {
          const category =lead?.property?.category?.name?.trim() || "Quote";
          // if (!category) return; // 🚫 Skip leads with no category

          const city =
            lead?.property?.address?.city || lead?.city || "N/A";

          const normalized = {
            id: lead.id,
            name: lead.name || "N/A",
            email: lead.email || "N/A",
            phone: lead.phoneNumber || "N/A",
            city,
            message: lead.message || "No message",
            remarks: lead.remark || "",
            propertyCategory: category,
          };

          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(normalized);
        });

        setData(grouped);

        // Only use valid category tabs
        const uniqueTabs = Object.keys(grouped);
        setTabs(uniqueTabs);
        setActiveTab(uniqueTabs[0] || "quote");
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

  // 🔹 Get all unique cities for selected tab
  const cities = ["All", ...new Set(currentData.map((item) => item.city))];

  // 🔹 Filter data based on selected city
  const filteredData =
    selectedCity === "All"
      ? currentData
      : currentData.filter((item) => item.city === selectedCity);

  // 🔹 Handle remark changes
  const handleRemarkChange = (id, newRemark) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((item) =>
        item.id === id ? { ...item, remarks: newRemark } : item
      ),
    }));
  };

  // 🔹 Save remark (local for now — ready for PUT API)
  const handleSaveRemark = async (id) => {
    const entry = data[activeTab].find((item) => item.id === id);
    console.log("entry::", entry)
    try {
      const adminToken = localStorage.getItem('token');
      const res = await ApiService.put(`/leads/${id}`, { remark: entry.remarks }, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      })
      if (res) {
        const leads = res?.lead;
        alert(`Remark saved for ${entry.name}: "${entry.remarks}"`);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to update remark lead. Please try again.");
    }

    // Future: PUT request to backend to save remark
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
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab
                ? "bg-[#11233A] text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:border-[#11233A] hover:text-[#11233A]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-center text-gray-600 py-10">Loading leads...</p>
        )}
        {error && (
          <p className="text-center text-red-500 py-10">{error}</p>
        )}

        {/* Table Section */}
        {!loading && !error && activeTab && (
          <>
            {currentData.length > 0 && (
              <div className="mb-4">
                <label className="text-gray-700 font-medium mr-3">
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

            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                {filteredData.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#11233A] text-white">
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          Name
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          City
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          Message
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50 transition-colors`}
                        >
                          <td className="py-4 px-6 text-gray-900 font-medium">
                            {item.name}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {item.email}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {item.phone}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {item.city}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            {item.message}
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item.remarks}
                                onChange={(e) =>
                                  handleRemarkChange(item.id, e.target.value)
                                }
                                placeholder="Add remark..."
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#11233A]"
                              />
                              <button
                                onClick={() => handleSaveRemark(item.id)}
                                className="px-3 py-1 bg-[#11233A] text-white rounded-md text-sm hover:bg-[#0e1c2e] transition"
                              >
                                Save
                              </button>
                            </div>
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
          </>
        )}

        {!loading && !error && !activeTab && (
          <div className="text-center py-12 text-gray-500">
            No leads available.
          </div>
        )}
      </div>
    </div>
  );
}
