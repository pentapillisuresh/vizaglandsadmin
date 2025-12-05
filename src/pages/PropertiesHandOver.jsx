import { useState, useEffect } from "react";
import { Search, Home, CheckCircle, Tag, XCircle, Clock, Eye, IndianRupee, MapPin, Plus, Edit, Trash2, Heart, HomeIcon, ArrowBigLeft, ThumbsUpIcon } from "lucide-react";
import PropertyForm from "../components/PropertyForm";
import ApiService from "../hooks/ApiService";
import { useNavigate } from "react-router-dom";
import getPhotoSrc from "../hooks/getPhotos";

export default function PropertiesHandOver() {
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
  // ✅ Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await ApiService.get("/properties", {
        headers: {
          // Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json'"
        }
      }
      );
      setProperties(res.properties || []);
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
  
    // 👇 DEFAULT handover check TRUE
    const handOverFilter = property.isHandOver === true;
  
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && property.status === "pending") ||
      (filter === "rejected" && property.status === "rejected") ||
      (filter === "verified" && property.status === "verified") ||
      (filter === "sold" && property.isSold === true) ||
      (filter === "owner" && property?.client?.role === "owner") ||
      (filter === "agent" && property?.client?.role === "agent") ||
      (filter === "builder" && property?.client?.role === "builder");
  
    return handOverFilter && matchesSearch && matchesFilter;
  });
  

  const handleOverClick = async (propertyId, propertyStatus, isHandOver) => {
    if (propertyStatus === "verified" || propertyStatus === "approved") {
      // Toggle wishlist state locally
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

      // Make API request
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
        // Show notification when property is made live
        if (!handOver[propertyId]) {
          setNotificationMessage(isHandOver ? "Property management handOvered " : "Property management Stopped");
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
      const adminToken = localStorage.getItem("token");
      try {
        await ApiService.delete(`/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json'"
          }
        });
        setProperties((prev) => prev.filter((p) => p.id !== id));
        alert("Property deleted successfully!");
      } catch (err) {
        alert("Failed to delete property.");
      }
    }
  };

  const handleSold = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to make as SOLD this property? This action cannot be undone."
      )
    ) {
      const adminToken = localStorage.getItem('token');
      try {
        const res = await ApiService.put(`/properties/${id}`, { isSold: true }, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json'"
          }
        });
        if (res) {
          alert("Property update isSold successfully!");
        }
        fetchProperties()
      } catch (err) {
        alert("Failed to delete property.");
      }
    }
  };

  const handleEdit = (listing) => {
    navigate(`/post-property?edit=${listing.id}`, {
      state: {
        listing, // or any other data you want to send
        mode: 'edit',
        isProject: false   // 👈 pass boolean here
      },
    });    // setShowEditModal(true);
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
            onClick={() => navigate("/")}
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
          onClick={() =>
            navigate('/post-property', {
              state: {
                isProject: false   // 👈 pass boolean here
              },
            })
          }
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            {["owner", "agent", "builder"].map(
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
          <div className="relative w-full md:w-76">
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
            {["all", "pending", "verified", "rejected", "sold"].map(
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
                  src={getPhotoSrc(property.photos)}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />


                <div className="absolute bottom-0 right-3 flex items-center gap-3
                bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">

                  {/* Label */}
                  <span className="text-sm font-semibold text-white drop-shadow">
                    Handover
                  </span>

                  {/* Toggle Switch */}
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
                      }
    `}
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

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address.city}, {property.address.locality}
                  {property?.isSold && (
                    <span className="px-2 py-1 ml-4 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                      SOLD
                    </span>)
                  }
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
                
                 

                  <button
                    onClick={() => handleEdit(property)}
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
                  {(!property?.isSold && property?.status === "verified") && (
                    <button
                      onClick={() => handleSold(property?.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      <Tag className="w-4 h-4" />
                      Sold
                    </button>
                  )}

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
