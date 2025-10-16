import { useState } from "react";
import { useData } from "../context/DataContext";
import { Search, Home, CheckCircle, XCircle, Clock, Eye, IndianRupee, MapPin } from "lucide-react";

export default function Properties() {
  const { properties, updatePropertyStatus, users, agents, builders } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);

  const allUsers = [...users, ...agents, ...builders];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && property.status === "pending") ||
      (filter === "approved" && property.status === "approved") ||
      (filter === "rejected" && property.status === "rejected");
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id) => {
    if (window.confirm("Are you sure you want to approve this property?")) {
      updatePropertyStatus(id, "approved");
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this property?")) {
      updatePropertyStatus(id, "rejected");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getOwnerName = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    return user ? user.fullName : "Unknown";
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-sm text-gray-500">Review and approve property listings</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or city..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${
                  filter === status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative">
                <img
                  src={
                    property.photos?.[0] ||
                    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                  }
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {getStatusIcon(property.status)}
                    {property.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.city}, {property.locality}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-lg font-bold text-blue-700">
                    <IndianRupee className="w-5 h-5" />
                    {property.price?.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {property.viewsCount}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
                  <span className="capitalize">{property.propertyType}</span>
                  <span className="capitalize">{property.propertySubtype}</span>
                  <span className="capitalize">{property.listingType}</span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <p>Posted by: <span className="font-medium text-gray-700 capitalize">{property.postedBy}</span></p>
                  <p>Owner: <span className="font-medium text-gray-700">{getOwnerName(property.userId)}</span></p>
                </div>

                {property.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(property.id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(property.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {property.status === "approved" && (
                  <div className="text-center py-2 text-sm text-green-600 font-medium">
                    Property is live
                  </div>
                )}

                {property.status === "rejected" && (
                  <div className="text-center py-2 text-sm text-red-600 font-medium">
                    Property was rejected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Home className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No properties found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
