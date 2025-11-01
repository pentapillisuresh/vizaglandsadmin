import { useState, useEffect } from "react";
import { Search, Home, CheckCircle, XCircle, Clock, Eye, IndianRupee, MapPin, Plus, Edit, Trash2, Heart, HomeIcon, ArrowBigLeft } from "lucide-react";
import PropertyForm from "../components/PropertyForm";
import ApiService from "../hooks/ApiService";
import { useNavigate } from "react-router-dom";

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
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();
  // ✅ Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://vizaglandservices.esotericprojects.tech/api/properties");
      if (!res.ok) throw new Error("Failed to fetch properties");
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProperties();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Local filtering logic
  const filteredProperties = properties?.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && property.status === "pending") ||
      (filter === "approved" && property.status === "approved") ||
      (filter === "rejected" && property.status === "rejected") ||
      (filter === "verified" && property.status === "verified");
    return matchesSearch && matchesFilter;
  });

  const handleWishlistClick = async (propertyId, propertyStatus, isActive) => {
    if (propertyStatus === "verified" || propertyStatus === "approved") {
      // Toggle wishlist state locally
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

      // Make API request
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
        // Show notification when property is made live
        if (!wishlistedProperties[propertyId]) {
          setNotificationMessage("Property is Live");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
        fetchProperties()
        // Optional: reload or refetch data
        // window.location.reload(); // reloads the current page
        // OR ideally: refetch data instead of reloading
        // fetchProperties();

        console.log("Property updated successfully!");
      } else {
        console.error("Error updating property:", response?.message);
        alert("Failed to update property. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "An unexpected error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      try {
        await fetch(`https://vizaglandservices.esotericprojects.tech/api/properties/${id}`, {
          method: "DELETE",
        });
        setProperties((prev) => prev.filter((p) => p.id !== id));
        alert("Property deleted successfully!");
      } catch (err) {
        alert("Failed to delete property.");
      }
    }
  };

  const handleAddProperty = async (formData) => {
    const adminToken = localStorage.getItem("token");
    const adminClientData = localStorage.getItem("adminClientData");
    formData.clientId = adminClientData.id;
    try {
      const res = await ApiService.post("/properties/admin-property", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = res.property;

      if (!res || res.status !== 200) {
        throw new Error(data?.message || "Failed to add property");
      }

      setShowEditModal(false);
      window.location.reload()
      alert("Property added successfully!");
    } catch (err) {
      console.error("Error adding property:", err);
      alert(err.message || "An error occurred while adding the property.");
    }
  };

  const handleUpdateProperty = async (formData) => {
    console.log("from::", formData)

    try {
      const adminToken = localStorage.getItem("token");

      const response = await ApiService.put(`/properties/${formData.id}`, formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        },
      )

      if (response) {
        setShowEditModal(false);
        navigate('./properties')
      } else {
        console.log("rrr::", response?.message)
      }

      setProperties((prev) =>
        prev.map((p) => (p.id === editingProperty.id ? response.property : p))
      );
      setShowEditModal(false);
      setEditingProperty(null);
      alert("Property updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const adminToken = localStorage.getItem("token");

      const response = await ApiService.put(`/properties/${id}`, { status },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        },
      )

      if (response) {
        navigate('./properties')
      } else {
        console.log("rrr::", response?.message)
      }

      setProperties((prev) =>
        prev.map((p) => (p.id === editingProperty.id ? data.property : p))
      );
      alert("Property updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    switch (status) {
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 animate-pulse">Loading properties...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium py-10">{error}</div>
    );

  return (
    <div className="p-6">
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
            className="w-8 h-8 text-red-500 transition-all duration-300 cursor-pointer"
            onClick={()=>navigate("/")}
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Property Management
            </h1>
            <p className="text-sm text-gray-500">
              Review and manage property listings
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Filters */}
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
            {["all", "pending", "approved", "verified", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${filter === status
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
      </div>

      {/* Property Cards */}
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
                    JSON.parse(property.photos)?.[0] ||
                    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                  }
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleWishlistClick(property.id, property.status, !property.isActive)
                    }
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${property.isActive
                      ? "bg-red-500 hover:bg-red-600 scale-110"
                      : "bg-white/80 hover:bg-white"
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${property.isActive
                        ? "fill-white text-white"
                        : "text-gray-700 hover:text-red-500"
                        }`}
                    />
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

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address.city}, {property.address.locality}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-lg font-bold text-blue-700">
                    <IndianRupee className="w-5 h-5" />
                    {property.price?.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {property.viewCount}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
                  <span className="capitalize">{property.category.name}</span>
                  <span className="capitalize">{property.marketType}</span>
                  {/* <span className="capitalize">{property.createdAt}</span> */}
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <p>
                    Posted by:{" "}
                    <span className="font-medium text-gray-700 capitalize">
                      {property?.client?.role || "Admin"}
                    </span>
                  </p>
                  <p>
                    Owner:{" "}
                    <span className="font-medium text-gray-700 capitalize" >
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

                <div className="flex gap-2">
                  {property.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatus(property.id, "verified")}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(property.id, "rejected")}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => openEditModal(property)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Add/Edit Modals */}
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
      `}</style>
    </div>
  );
}
