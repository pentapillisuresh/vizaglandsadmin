import { useState } from "react";
import { useData } from "../context/DataContext";
import { Search, Home, CheckCircle, XCircle, Clock, Eye, IndianRupee, MapPin, Plus, Edit, Trash2, Heart } from "lucide-react";

export default function Properties() {
  const { properties, updatePropertyStatus, addProperty, updateProperty, deleteProperty, users, agents, builders } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [wishlistedProperties, setWishlistedProperties] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "residential",
    propertySubtype: "apartment",
    listingType: "sell",
    price: "",
    city: "",
    locality: "",
    subLocality: "",
    facing: "north",
    photos: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"],
    postedBy: "customer",
    userId: "user1",
  });

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

  const handleWishlistClick = (propertyId, propertyStatus) => {
    if (propertyStatus === "approved") {
      setWishlistedProperties(prev => ({
        ...prev,
        [propertyId]: !prev[propertyId]
      }));

      if (!wishlistedProperties[propertyId]) {
        setNotificationMessage("Property is Live");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    }
  };

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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      deleteProperty(id);
    }
  };

  const handleAdd = () => {
    if (!formData.title || !formData.price || !formData.city) {
      alert("Please fill in all required fields");
      return;
    }
    addProperty({
      ...formData,
      price: parseInt(formData.price),
    });
    setShowAddModal(false);
    resetForm();
    alert("Property added successfully!");
  };

  const handleEdit = () => {
    if (!formData.title || !formData.price || !formData.city) {
      alert("Please fill in all required fields");
      return;
    }
    updateProperty(editingProperty.id, {
      ...formData,
      price: parseInt(formData.price),
    });
    setShowEditModal(false);
    setEditingProperty(null);
    resetForm();
    alert("Property updated successfully!");
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      propertySubtype: property.propertySubtype,
      listingType: property.listingType,
      price: property.price.toString(),
      city: property.city,
      locality: property.locality,
      subLocality: property.subLocality,
      facing: property.facing,
      photos: property.photos,
      postedBy: property.postedBy,
      userId: property.userId,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      propertyType: "residential",
      propertySubtype: "apartment",
      listingType: "sell",
      price: "",
      city: "",
      locality: "",
      subLocality: "",
      facing: "north",
      photos: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"],
      postedBy: "customer",
      userId: "user1",
    });
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

  const PropertyForm = ({ onSubmit, onCancel, submitText }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter property title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter price"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          rows="3"
          placeholder="Enter property description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Subtype</label>
          <select
            value={formData.propertySubtype}
            onChange={(e) => setFormData({ ...formData, propertySubtype: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="penthouse">Penthouse</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
          <select
            value={formData.listingType}
            onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
          <input
            type="text"
            value={formData.locality}
            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter locality"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub Locality</label>
          <input
            type="text"
            value={formData.subLocality}
            onChange={(e) => setFormData({ ...formData, subLocality: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter sub locality"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
          <select
            value={formData.facing}
            onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Posted By</label>
          <select
            value={formData.postedBy}
            onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
            <option value="builder">Builder</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
          <select
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {submitText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-sm text-gray-500">Review and approve property listings</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
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
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => handleWishlistClick(property.id, property.status)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      wishlistedProperties[property.id]
                        ? "bg-red-500 hover:bg-red-600 scale-110"
                        : "bg-white/80 hover:bg-white"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${
                        wishlistedProperties[property.id]
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

                <div className="flex gap-2">
                  {property.status === "pending" && (
                    <>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No properties found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Property</h2>
            <PropertyForm
              onSubmit={handleAdd}
              onCancel={() => {
                setShowAddModal(false);
                resetForm();
              }}
              submitText="Add Property"
            />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Property</h2>
            <PropertyForm
              onSubmit={handleEdit}
              onCancel={() => {
                setShowEditModal(false);
                setEditingProperty(null);
                resetForm();
              }}
              submitText="Update Property"
            />
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
