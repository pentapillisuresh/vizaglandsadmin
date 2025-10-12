import { useState } from "react";

export default function Schedule() {
  const tabs = ["Plots", "Flats", "Lands", "Commercial", "Villas"];
  const [activeTab, setActiveTab] = useState("Plots");

  const data = {
    Plots: [
      { id: 1, name: "Ravi Kumar", email: "ravi@example.com", phone: "9876543210", message: "Need details for plot #23" },
      { id: 2, name: "Anjali R", email: "anjali@example.com", phone: "9988776655", message: "Interested in 200 sq yard plot" },
    ],
    Flats: [
      { id: 3, name: "Suresh", email: "suresh@example.com", phone: "9123456789", message: "Need 3BHK flat in city center" },
    ],
    Lands: [],
    Commercial: [
      { id: 4, name: "Priya", email: "priya@example.com", phone: "9000012345", message: "Looking for office space in Banjara Hills" },
    ],
    Villas: [
      { id: 5, name: "Kiran", email: "kiran@example.com", phone: "9876000000", message: "Luxury villa details please" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#11233A] mb-2">Request a Callback</h1>
          <p className="text-gray-600">Admin Panel - Manage customer inquiries</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#11233A] text-white">
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Phone</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data[activeTab].length > 0 ? (
                  data[activeTab].map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="py-4 px-6 text-gray-900 font-medium">{item.name}</td>
                      <td className="py-4 px-6 text-gray-700">{item.email}</td>
                      <td className="py-4 px-6 text-gray-700">{item.phone}</td>
                      <td className="py-4 px-6 text-gray-700">{item.message}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm font-medium">No callback requests found for {activeTab}</p>
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
