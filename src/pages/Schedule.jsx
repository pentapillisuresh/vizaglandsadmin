import { useState } from "react";

export default function Schedule() {
  const tabs = ["Plots", "Flats", "Lands", "Commercial", "Villas"];
  const [activeTab, setActiveTab] = useState("Plots");
  const [selectedCity, setSelectedCity] = useState("All");

  // Initial data (with optional remarks)
  const initialData = {
    Plots: [
      {
        id: 1,
        name: "Ravi Kumar",
        email: "ravi@example.com",
        phone: "9876543210",
        city: "Hyderabad",
        message: "Need details for plot #23",
        remarks: "",
      },
      {
        id: 2,
        name: "Anjali R",
        email: "anjali@example.com",
        phone: "9988776655",
        city: "Vizag",
        message: "Interested in 200 sq yard plot",
        remarks: "",
      },
      {
        id: 6,
        name: "Rajesh",
        email: "rajesh@example.com",
        phone: "9876002222",
        city: "Hyderabad",
        message: "Want 300 sq yard plot",
        remarks: "",
      },
    ],
    Flats: [
      {
        id: 3,
        name: "Suresh",
        email: "suresh@example.com",
        phone: "9123456789",
        city: "Vijayawada",
        message: "Need 3BHK flat in city center",
        remarks: "",
      },
      {
        id: 7,
        name: "Divya",
        email: "divya@example.com",
        phone: "9000088888",
        city: "Hyderabad",
        message: "Interested in gated community flats",
        remarks: "",
      },
    ],
    Lands: [],
    Commercial: [
      {
        id: 4,
        name: "Priya",
        email: "priya@example.com",
        phone: "9000012345",
        city: "Hyderabad",
        message: "Looking for office space in Banjara Hills",
        remarks: "",
      },
      {
        id: 8,
        name: "Manoj",
        email: "manoj@example.com",
        phone: "9112233445",
        city: "Chennai",
        message: "Commercial space near airport",
        remarks: "",
      },
    ],
    Villas: [
      {
        id: 5,
        name: "Kiran",
        email: "kiran@example.com",
        phone: "9876000000",
        city: "Vizag",
        message: "Luxury villa details please",
        remarks: "",
      },
      {
        id: 9,
        name: "Pooja",
        email: "pooja@example.com",
        phone: "9998877665",
        city: "Hyderabad",
        message: "Villa with swimming pool",
        remarks: "",
      },
    ],
  };

  const [data, setData] = useState(initialData);

  // Get all unique cities for selected tab
  const cities = ["All", ...new Set(data[activeTab].map((item) => item.city))];

  // Filter data based on selected city
  const filteredData =
    selectedCity === "All"
      ? data[activeTab]
      : data[activeTab].filter((item) => item.city === selectedCity);

  // Handle remarks change (update state)
  const handleRemarkChange = (id, newRemark) => {
    setData((prevData) => ({
      ...prevData,
      [activeTab]: prevData[activeTab].map((item) =>
        item.id === id ? { ...item, remarks: newRemark } : item
      ),
    }));
  };

  // Optional Save Handler (e.g., future API call)
  const handleSaveRemark = (id) => {
    const entry = data[activeTab].find((item) => item.id === id);
    console.log(`Saved remark for ${entry.name}:`, entry.remarks);
    alert(`Remark saved for ${entry.name}!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#11233A] mb-2">Request a Callback</h1>
          <p className="text-gray-600">Admin Panel - Manage customer inquiries</p>
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

        {/* City Filter */}
        {data[activeTab].length > 0 && (
          <div className="mb-4">
            <label className="text-gray-700 font-medium mr-3">Filter by City:</label>
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#11233A] text-white">
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Phone</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">City</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Message</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="py-4 px-6 text-gray-900 font-medium">{item.name}</td>
                      <td className="py-4 px-6 text-gray-700">{item.email}</td>
                      <td className="py-4 px-6 text-gray-700">{item.phone}</td>
                      <td className="py-4 px-6 text-gray-700">{item.city}</td>
                      <td className="py-4 px-6 text-gray-700">{item.message}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-sm font-medium">
                          No callback requests found for {activeTab}
                          {selectedCity !== "All" && ` in ${selectedCity}`}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
