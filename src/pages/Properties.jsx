import { useState } from "react";
import { useData } from "../context/DataContext";
import PropertyForm from "../components/PropertyForm";
import {
  Search,
  Home,
  Star,
  StarOff,
  Edit,
  CheckCircle2,
  XCircle,
  Trash2,
  MapPin,
  IndianRupee,
  Building2,
  Eye,
} from "lucide-react";

export default function Properties() {
  const { properties, agents, builders, updateProperty, deleteProperty } =
    useData();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter((property) => {
    const matchesFilter = filter === "all" || property.status === filter;
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteProperty(id);
    }
  };

  const handleApprove = (id) => updateProperty(id, { status: "active" });
  const handleReject = (id) => updateProperty(id, { status: "rejected" });
  const handleFeature = (id, isFeatured) =>
    updateProperty(id, { isFeatured: !isFeatured });

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const getAgentName = (userId) => {
    const agent = agents.find((a) => a.id === userId);
    const builder = builders.find((b) => b.id === userId);
    return agent?.fullName || builder?.fullName || "Unassigned";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Property Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage all property listings and approvals
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition-all font-medium text-sm"
        >
          + Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search */}
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

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap justify-center md:justify-end">
            {["all", "active", "pending", "sold", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${
                  filter === status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {status === "all"
                  ? properties.length
                  : properties.filter((p) => p.status === status).length}
                )
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div
                className="h-52 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${
                    property.photos?.[0] ||
                    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                  })`,
                }}
              >
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      property.status === "active"
                        ? "bg-green-100 text-green-700"
                        : property.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : property.status === "sold"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {property.status}
                  </span>
                  {property.isFeatured && (
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    {property.locality || "Unknown"},{" "}
                    {property.city || "Unknown"}
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 capitalize">
                      {property.propertyType || "N/A"}
                    </span>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 capitalize">
                      {property.listingType || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>{property.facing || "N/A"}</span>
                    <span>
                      <Eye className="inline w-4 h-4 mr-1" />
                      {property.viewsCount || 0} views
                    </span>
                  </div>

                  <div className="flex items-center text-xl font-semibold text-blue-800 mb-2">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    {property.price?.toLocaleString("en-IN") || "N/A"}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-1" />
                    Agent: {getAgentName(property.userId)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(property)}
                      title="Edit"
                      className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() =>
                        handleFeature(property.id, property.isFeatured)
                      }
                      title="Toggle Featured"
                      className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                    >
                      {property.isFeatured ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {property.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(property.id)}
                          title="Approve"
                          className="p-2 rounded-md border border-green-200 hover:bg-green-50 transition"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleReject(property.id)}
                          title="Reject"
                          className="p-2 rounded-md border border-red-200 hover:bg-red-50 transition"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(property.id)}
                      title="Delete"
                      className="p-2 rounded-md border border-red-200 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Home className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No properties found
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or add a new property
          </p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <PropertyForm property={editingProperty} onClose={handleCloseForm} />
      )}
    </div>
  );
}
