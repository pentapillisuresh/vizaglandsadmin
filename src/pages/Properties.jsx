import { useState, useEffect } from "react";
import { Search, Home, CheckCircle, Tag, XCircle, Clock, Eye, IndianRupee, MapPin, Plus, Edit, Trash2, Heart, HomeIcon, ArrowBigLeft, ThumbsUpIcon } from "lucide-react";
import PropertyForm from "../components/PropertyForm";
import ApiService from "../hooks/ApiService";
import { useNavigate } from "react-router-dom";
import getPhotoSrc from "../hooks/getPhotos";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [wishlistedProperties, setWishlistedProperties] = useState({});
  const [handOver, setHandOver] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all properties from API (handles pagination)
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const adminToken = localStorage.getItem("token");
      
      const res = await ApiService.get("/properties?limit=1000", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      
      // Handle different response structures
      let allProperties = [];
      if (res && Array.isArray(res)) {
        allProperties = res;
      } else if (res && res.properties && Array.isArray(res.properties)) {
        allProperties = res.properties;
      } else if (res && res.data && Array.isArray(res.data)) {
        allProperties = res.data;
      } else {
        console.error("Unexpected response structure:", res);
        allProperties = [];
      }
      
      setProperties(allProperties);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.response?.data?.message || "Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "N/A";
    }
  };

  // ✅ Local filtering logic
  const filteredProperties = properties?.filter((property) => {
    if (!property) return false;
    
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.locality?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && property.status === "pending") ||
      (filter === "rejected" && property.status === "rejected") ||
      (filter === "verified" && property.status === "verified") ||
      (filter === "approved" && (property.status === "verified" || property.status === "approved")) ||
      (filter === "sold" && property.isSold === true) ||
      (filter === "owner" && property?.client?.role === 'owner') ||
      (filter === "agent" && property?.client?.role === 'agent') ||
      (filter === "builder" && property?.client?.role === 'builder');
    
    return matchesSearch && matchesFilter;
  });

  const handleWishlistClick = async (propertyId, propertyStatus, isActive) => {
    if (propertyStatus === "verified" || propertyStatus === "approved") {
      setWishlistedProperties((prev) => ({
        ...prev,
        [propertyId]: !prev[propertyId],
      }));
    }

    try {
      const adminToken = localStorage.getItem("token");
      if (!adminToken) {
        alert("Admin token not found. Please log in again.");
        return;
      }

      const response = await ApiService.put(
        `/properties/${propertyId}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response) {
        if (!wishlistedProperties[propertyId]) {
          setNotificationMessage("Property is Live");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
        await fetchProperties();
        console.log("Property updated successfully!");
      } else {
        console.error("Error updating property:", response?.message);
        alert("Failed to update property. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || err.message || "An unexpected error occurred.");
    }
  };

  const handleOverClick = async (propertyId, propertyStatus, isHandOver) => {
    if (propertyStatus === "verified" || propertyStatus === "approved") {
      setHandOver((prev) => ({
        ...prev,
        [propertyId]: !prev[propertyId],
      }));
    }

    try {
      const adminToken = localStorage.getItem("token");
      if (!adminToken) {
        alert("Admin token not found. Please log in again.");
        return;
      }

      const response = await ApiService.put(
        `/properties/${propertyId}`,
        { isHandOver },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response) {
        if (!handOver[propertyId]) {
          setNotificationMessage(isHandOver ? "Property management Handovered" : "Property management Stopped");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
        await fetchProperties();
        console.log("Property updated successfully!");
      } else {
        console.error("Error updating property:", response?.message);
        alert("Failed to update property. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || err.message || "An unexpected error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      const adminToken = localStorage.getItem("token");
      try {
        await ApiService.delete(`/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        });
        await fetchProperties();
        alert("Property deleted successfully!");
      } catch (err) {
        console.error("Error deleting property:", err);
        alert(err.response?.data?.message || "Failed to delete property.");
      }
    }
  };

  const handleSold = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to mark this property as SOLD? This action cannot be undone."
      )
    ) {
      const adminToken = localStorage.getItem('token');
      try {
        const res = await ApiService.put(`/properties/${id}`, { isSold: true }, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        });
        if (res) {
          alert("Property marked as sold successfully!");
          await fetchProperties();
        }
      } catch (err) {
        console.error("Error marking property as sold:", err);
        alert(err.response?.data?.message || "Failed to mark property as sold.");
      }
    }
  };

  const handleAddProperty = async (formData) => {
    const adminToken = localStorage.getItem("token");
    const adminClientData = localStorage.getItem("adminClientData");
    
    try {
      const clientData = adminClientData ? JSON.parse(adminClientData) : null;
      formData.clientId = clientData?.id;
      
      const res = await ApiService.post("/properties/admin-property", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res && (res.status === 200 || res.status === 201)) {
        setShowAddModal(false);
        await fetchProperties();
        alert("Property added successfully!");
      } else {
        throw new Error(res?.message || "Failed to add property");
      }
    } catch (err) {
      console.error("Error adding property:", err);
      alert(err.response?.data?.message || err.message || "An error occurred while adding the property.");
    }
  };

  const handleUpdateProperty = async (formData) => {
    console.log("Updating property:", formData);

    try {
      const adminToken = localStorage.getItem("token");

      const response = await ApiService.put(`/properties/${formData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response) {
        setShowEditModal(false);
        setEditingProperty(null);
        await fetchProperties();
        alert("Property updated successfully!");
      } else {
        alert("Failed to update property");
      }
    } catch (err) {
      console.error("Error updating property:", err);
      alert(err.response?.data?.message || err.message || "An error occurred while updating property");
    }
  };

  const handleEdit = (listing) => {
    navigate(`/post-property?edit=${listing.id}`, {
      state: {
        listing,
        mode: 'edit',
        isProject: false
      },
    });
  };

  const handleStatus = async (id, status) => {
    try {
      const adminToken = localStorage.getItem("token");

      const response = await ApiService.put(`/properties/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response) {
        await fetchProperties();
        alert("Property status updated successfully!");
      } else {
        alert("Failed to update property status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || err.message || "An error occurred while updating status");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
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
    switch (status?.toLowerCase()) {
      case "verified":
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchProperties}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-400">
            <div className="bg-white/20 rounded-full p-2">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <p className="font-bold text-lg">{notificationMessage}</p>
              <p className="text-sm text-green-50">Added to your wishlist</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center space-x-3">
          <ArrowBigLeft
            size={20}
            className="w-8 h-8 text-red-500 transition-all duration-300 cursor-pointer hover:scale-110"
            onClick={() => navigate("/")}
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Property Management
            </h1>
            <p className="text-sm text-gray-500">
              Review and manage property listings
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Total Properties: {properties.length}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            navigate('/post-property', {
              state: {
                isProject: false
              },
            })
          }
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Filters Section - Improved Layout */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        {/* Row 1: Role Filters */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Role:</label>
          <div className="flex gap-2 flex-wrap">
            {["owner", "agent", "builder"].map((status) => (
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

        {/* Row 2: Search and Status Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search Bar - Left Side */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Search Properties:</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or city..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filters - Right Side */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Status:</label>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "verified", "rejected", "sold"].map((status) => (
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
      </div>

      {/* Property Cards */}
      {filteredProperties.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={getPhotoSrc(property.photos)}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => handleWishlistClick(property.id, property.status, !property.isActive)}
                      disabled={property.status === "pending" || property.status === "rejected"}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 
                      ${property.status === "pending" || property.status === "rejected"
                          ? "opacity-50 cursor-not-allowed"
                          : property.isActive
                            ? "bg-red-500 hover:bg-red-600 scale-110"
                            : "bg-white/80 hover:bg-white shadow-md hover:shadow-lg"
                        }`}
                    >
                      <ThumbsUpIcon
                        className={`w-6 h-6 transition-all duration-300 
                      ${property.isActive
                            ? "fill-white text-white"
                            : "text-gray-700 hover:text-red-500"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-3
                  bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white drop-shadow">
                      Handover
                    </span>
                    <button
                      onClick={() =>
                        handleOverClick(property.id, property.status, !property.isHandOver)
                      }
                      disabled={property.status === "pending" || property.status === "rejected"}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-all
                      ${property.status === "pending" || property.status === "rejected" 
                          ? "opacity-40 cursor-not-allowed bg-gray-400"
                          : property.isHandOver
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`
                          inline-block h-5 w-5 bg-white rounded-full transform transition-transform shadow-sm
                          ${property.isHandOver ? "translate-x-5" : "translate-x-1"}
                        `}
                      ></span>
                    </button>
                  </div>
                  
                  <div className="absolute top-3 left-3">
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

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {property.address?.city}, {property.address?.locality}
                    </span>
                    {property?.isSold && (
                      <span className="px-2 py-1 ml-2 text-xs font-semibold bg-red-100 text-red-700 rounded-full whitespace-nowrap">
                        SOLD
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-lg font-bold text-blue-700">
                      <IndianRupee className="w-5 h-5" />
                      {property.price?.toLocaleString("en-IN")}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      {property.viewCount || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
                    <span className="capitalize">{property.category?.name || "N/A"}</span>
                    <span className="capitalize">{property.marketType || "N/A"}</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-3 space-y-1">
                    <p>
                      Posted by:{" "}
                      <span className="font-medium text-gray-700 capitalize">
                        {property?.client?.role || "Admin"}
                      </span>
                    </p>
                    <p>
                      Owner:{" "}
                      <span className="font-medium text-gray-700 capitalize">
                        {property?.client?.fullName || "Unknown"}
                      </span>
                    </p>
                    <p>
                      Created On:{" "}
                      <span className="font-medium text-gray-700">
                        {formatDate(property.createdAt)}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap mt-auto">
                    {(property.status === "rejected" || property.status === "pending") && (
                      <button
                        onClick={() => handleStatus(property.id, "verified")}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    {(property.status === "verified" || property.status === "pending") && (
                      <button
                        onClick={() => handleStatus(property.id, "rejected")}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(property)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    {(!property?.isSold && property?.status === "verified") && (
                      <button
                        onClick={() => handleSold(property?.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                      >
                        <Tag className="w-4 h-4" />
                        Mark as Sold
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Home className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No properties found
          </h3>
          <p className="text-sm text-gray-500">
            {searchTerm || filter !== "all" 
              ? "Try adjusting your filters or search terms" 
              : "Click 'Add Property' to create your first listing"}
          </p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Property
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <PropertyForm
                onSubmit={handleAddProperty}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">Edit Property</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProperty(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <PropertyForm
                initialData={editingProperty}
                onSubmit={handleUpdateProperty}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingProperty(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}