import { useState } from "react";
import { useData } from "../context/DataContext";
import { X } from "lucide-react";

export default function UserForm({ item, type, onClose }) {
  const { addUser, updateUser, addAgent, updateAgent, addBuilder, updateBuilder } = useData();

  const [formData, setFormData] = useState({
    fullName: item?.fullName || "",
    email: item?.email || "",
    phone: item?.phone || "",
    role: item?.role || (type === "user" ? "customer" : type),
    isActive: item?.isActive !== undefined ? item.isActive : true,
    isVerified: item?.isVerified !== undefined ? item.isVerified : false,
    isDocsVerified: item?.isDocsVerified !== undefined ? item.isDocsVerified : false,
    canAddProperty: item?.canAddProperty !== undefined ? item.canAddProperty : true,
    propertyLimit: item?.propertyLimit || (type === "user" ? 5 : type === "agent" ? 10 : 20),
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : inputType === "number" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "user") {
      if (item) {
        updateUser(item.id, formData);
      } else {
        addUser(formData);
      }
    } else if (type === "agent") {
      if (item) {
        updateAgent(item.id, formData);
      } else {
        addAgent(formData);
      }
    } else if (type === "builder") {
      if (item) {
        updateBuilder(item.id, formData);
      } else {
        addBuilder(formData);
      }
    }

    onClose();
  };

  const getTitle = () => {
    const typeLabel = type === "user" ? "Customer" : type === "agent" ? "Agent" : "Builder";
    return item ? `Edit ${typeLabel}` : `Add New ${typeLabel}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Limit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                name="propertyLimit"
                value={formData.propertyLimit}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="canAddProperty"
                  checked={formData.canAddProperty}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Can Add Property</span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active Account</span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDocsVerified"
                  checked={formData.isDocsVerified}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Documents Verified</span>
              </label>
            </div>

            {type === "user" && (
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Email Verified</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {item ? "Update" : "Add"} {type === "user" ? "Customer" : type === "agent" ? "Agent" : "Builder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
