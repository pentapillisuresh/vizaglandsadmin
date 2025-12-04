import { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, Settings, MapPin, IndianRupee, Eye, Edit } from "lucide-react";
import ApiService from "../hooks/ApiService";
import { useNavigate } from "react-router-dom";
import getPhotoSrc from "../hooks/getPhotos";

export default function UserDetails({ user, type, onClose }) {
  const [isDocsVerified, setIsDocsVerified] = useState(user.isDocsVerified);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionData, setPermissionData] = useState({
    canAddProperty: user.canAddProperty,
    propertyLimit: user.propertyLimit,
  });
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
const navigate=useNavigate();
  const userProperties = user.properties || [];

  useEffect(() => {
    console.log("user::", user)
  }, [])

  // 🔹 Local handlers for toggles (placeholder for real API integration)
  const handleApproveDocs = () => {
    setIsDocsVerified(true);
    const rrr = {
      status: 'active',
      isVerified: true
    }
    handleUpdatePermission(rrr)
  };

  const handleRejectDocs = () => {
    setIsDocsVerified(false);
    const rrr = {
      status: 'suspended',
      isVerified: false

    }
    handleUpdatePermission(rrr)
  };

  const handleUpdatePermission = async (updateData) => {
    const adminToken = localStorage.getItem('token');

    try {
      const res = await ApiService.put(`/clients/${user.id}`,
        updateData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      }
      );
      alert("limit updated successfully!");
      if (res) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update profile");
    }
    setShowPermissionModal(false);
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
        window.location.reload();
      } else {
        console.log("rrr::", response?.message)
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApproveProperty = (propertyId) => {
    if (window.confirm("Are you sure you want to approve this property?")) {
      alert(`Property ${propertyId} approved`);
    }
  };

  const handleRejectProperty = (propertyId) => {
    if (window.confirm("Are you sure you want to reject this property?")) {
      alert(`Property ${propertyId} rejected`);
    }
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
  const handleEdit = (listing) => {
    navigate(`/post-property?edit=${listing.id}`, {
      state: {
        listing, // or any other data you want to send
        mode: 'edit',
      },
    });    // setShowEditModal(true);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{type} Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 🔹 Personal Info + Account Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Personal Information
              </h3>
              <div className="space-y-3">
                {user.profilePic && (
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="w-20 h-20 rounded-full object-cover mb-3 border"
                  />
                )}
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.companyName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.address || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Joined Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Account</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Can Add Property</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.canAddProperty
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {user.canAddProperty ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Property Usage</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.propertiesAdded} / {user.propertyLimit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Document Verification */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Document Verification
              </h3>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isDocsVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
                  }`}
              >
                {isDocsVerified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {user.kycUploadFile ? (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {user.kycProofName || "KYC Document"} - {user.kycProofNumber || "KYC Number"}
                  </p>
                  <img
                    src={user.kycUploadFile}
                    alt="KYC Proof"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">No KYC file uploaded</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApproveDocs}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={handleRejectDocs}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>

          {/* 🔹 Property Permissions */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Property Permissions
              </h3>
              <button
                onClick={() => setShowPermissionModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Limit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Current Limit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.propertyLimit}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Properties Added</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.propertiesAdded}
                </p>
              </div>
            </div>
          </div>

          {/* 🔹 Properties */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Properties ({userProperties.length})
            </h3>
            {userProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <img
                      src={getPhotoSrc(property.photos)}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {property.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {property.status}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.address || "No address info"}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm font-semibold text-blue-700">
                          <IndianRupee className="w-4 h-4" />
                          {parseFloat(property.price).toLocaleString("en-IN")}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="w-3 h-3 mr-1" />
                          {property.viewCount || 0}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t">
                      <button
                          onClick={() => handleEdit(property)}
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-xs flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        {(property.status === "rejected" || property.status === "pending") && (
                          <>
                            <button
                              onClick={() => handleStatus(property.id, "verified")}
                              className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-xs flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            </>
                          )}
                        {(property.status === "verified" || property.status === "pending") && (
                          <>
                            <button
                              onClick={() => handleStatus(property.id, "rejected")}
                              className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-xs flex items-center justify-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">No properties added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Manage Property Limit Modal */}
        {showPermissionModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Manage Property Limit
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={permissionData.propertyLimit}
                    onChange={(e) =>
                      setPermissionData((prev) => ({
                        ...prev,
                        propertyLimit: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissionData.canAddProperty}
                      onChange={(e) =>
                        setPermissionData((prev) => ({
                          ...prev,
                          canAddProperty: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Allow to add properties
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const rrr = {
                      postLimit: permissionData.propertyLimit
                    }
                    handleUpdatePermission(rrr)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
