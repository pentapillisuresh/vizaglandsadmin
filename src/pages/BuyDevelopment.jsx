import React, { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, X } from "lucide-react";

const BuyDevelopment = () => {
  const [activeTab, setActiveTab] = useState("buy");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Dummy data for buyers
  const buyData = [
    {
      id: 1,
      name: "Arun Kumar",
      email: "arun.kumar@example.com",
      phone: "+91 9876543210",
      budget: "₹65 Lakhs",
      city: "Vizag",
      location: "Madhurawada",
      remarks: "Interested in 200 sq yd plot",
      verified: true,
      status: "Active",
      joined: "20/01/2024",
    },
    {
      id: 2,
      name: "Sonia Patel",
      email: "sonia.patel@example.com",
      phone: "+91 9998877665",
      budget: "₹90 Lakhs",
      city: "Hyderabad",
      location: "Kukatpally",
      remarks: "Looking for apartment",
      verified: false,
      status: "Active",
      joined: "05/02/2024",
    },
  ];

  // Dummy data for developers
  const developmentData = [
    {
      id: 1,
      name: "Vijay Constructions",
      email: "vijay.cons@example.com",
      phone: "+91 9123456789",
      budget: "₹5 Cr",
      city: "Vizag",
      location: "Bheemili",
      remarks: "Planning gated community project on 5 acres",
      verified: true,
      status: "Active",
      joined: "10/03/2024",
      propertyType: "Land",
      area: "5 Acres",
      images: [
        "https://img.freepik.com/free-photo/beautiful-landscape-with-small-village_23-2149721819.jpg?t=st=1760536765~exp=1760540365~hmac=856c91609739c0be2cf3b8a565e43a569ea56df3cbaf4b9faf0c8b47f417ef6d&w=1060",
       
      ],
    },
    {
      id: 2,
      name: "SK Builders",
      email: "sk.builders@example.com",
      phone: "+91 9988776655",
      budget: "₹8 Cr",
      city: "Hyderabad",
      location: "Gachibowli",
      remarks: "Looking for joint venture land for villas",
      verified: false,
      status: "Pending",
      joined: "25/03/2024",
      propertyType: "Plot",
      area: "3 Acres",
      images: ["https://img.freepik.com/premium-photo/ai76c215bcbd4142ab9e8206048c7df3f5_925713-1.jpg?w=1060"],
    },
  ];

  // Filter by active tab and search
  const activeData =
    activeTab === "buy"
      ? buyData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : developmentData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#003366]">
          {activeTab === "buy" ? "Buyers Management" : "Development Leads"}
        </h1>
        <p className="text-gray-500">
          Manage all {activeTab === "buy" ? "buyers" : "developers"} efficiently
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-5 py-2 rounded-lg font-medium border ${
              activeTab === "buy"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab("development")}
            className={`px-5 py-2 rounded-lg font-medium border ${
              activeTab === "development"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Development
          </button>
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
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3 hidden md:table-cell">City</th>
              <th className="px-4 py-3 hidden md:table-cell">Location</th>
              <th className="px-4 py-3 hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {item.name}
                </td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.budget}</td>
                <td className="px-4 py-3 hidden md:table-cell">{item.city}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {item.location}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Active"
                        ? "text-green-600 bg-green-100"
                        : "text-yellow-600 bg-yellow-100"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Eye className="text-blue-600 hover:text-blue-800 inline" size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-[90vh] relative">
            <div className="bg-blue-600 text-white px-5 py-3 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {activeTab === "buy" ? "Buyer Details" : "Development Details"}
              </h2>
              <button onClick={() => setSelectedItem(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p>
                <span className="font-semibold">Name:</span> {selectedItem.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {selectedItem.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {selectedItem.phone}
              </p>
              <p>
                <span className="font-semibold">Budget:</span> {selectedItem.budget}
              </p>
              <p>
                <span className="font-semibold">City:</span> {selectedItem.city}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {selectedItem.location}
              </p>

              {activeTab === "development" && (
                <>
                  <p>
                    <span className="font-semibold">Property Type:</span>{" "}
                    {selectedItem.propertyType}
                  </p>
                  <p>
                    <span className="font-semibold">Area:</span> {selectedItem.area}
                  </p>
                  <div>
                    <span className="font-semibold">Images:</span>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {selectedItem.images?.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="property"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <p>
                <span className="font-semibold">Remarks:</span>{" "}
                {selectedItem.remarks}
              </p>

              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedItem.status === "Active"
                      ? "text-green-600 bg-green-100"
                      : "text-yellow-600 bg-yellow-100"
                  }`}
                >
                  {selectedItem.status}
                </span>
              </p>

              <p>
                <span className="font-semibold">Joined:</span>{" "}
                {selectedItem.joined}
              </p>
            </div>
          </div>
        </div>
      )}

  
    </div>
  );
};

export default BuyDevelopment;
