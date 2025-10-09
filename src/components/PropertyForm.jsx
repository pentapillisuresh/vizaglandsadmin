import { useState } from "react";
import { useData } from "../context/DataContext";
import {
  X,
  Home,
  MapPin,
  Landmark,
  IndianRupee,
  Layers,
  Building2,
  Image as ImageIcon,
  ListChecks,
  CheckSquare,
} from "lucide-react";

export default function PropertyForm({ property, onClose }) {
  const { addProperty, updateProperty, agents } = useData();

  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    propertyType: property?.propertyType || "apartment",
    listingType: property?.listingType || "sale",
    price: property?.price || "",
    location: property?.location || "",
    city: property?.city || "",
    state: property?.state || "",
    areaSqft: property?.areaSqft || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    agentId: property?.agentId || agents[0]?.id || "",
    status: property?.status || "pending",
    isFeatured: property?.isFeatured || false,
    images: property?.images?.[0] || "",
    amenities: property?.amenities?.join(", ") || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const propertyData = {
      ...formData,
      price: Number(formData.price),
      areaSqft: Number(formData.areaSqft),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      images: formData.images ? [formData.images] : [],
      amenities: formData.amenities
        ? formData.amenities.split(",").map((a) => a.trim())
        : [],
    };

    if (property) updateProperty(property.id, propertyData);
    else addProperty(propertyData);

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            {property ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <InputField
              label="Property Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* Type */}
            <SelectField
              label="Property Type *"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              options={[
                "apartment",
                "house",
                "villa",
                "plot",
                "commercial",
              ]}
            />

            {/* Listing Type */}
            <SelectField
              label="Listing Type *"
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              options={["sale", "rent"]}
            />

            {/* Price */}
            <InputField
              label="Price (₹) *"
              name="price"
              type="number"
              icon={<IndianRupee className="w-4 h-4 text-gray-500" />}
              value={formData.price}
              onChange={handleChange}
              required
            />

            {/* Area */}
            <InputField
              label="Area (sq.ft) *"
              name="areaSqft"
              type="number"
              icon={<Layers className="w-4 h-4 text-gray-500" />}
              value={formData.areaSqft}
              onChange={handleChange}
              required
            />

            {/* Bedrooms */}
            <InputField
              label="Bedrooms *"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />

            {/* Bathrooms */}
            <InputField
              label="Bathrooms *"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />

            {/* Location */}
            <InputField
              label="Location *"
              name="location"
              icon={<MapPin className="w-4 h-4 text-gray-500" />}
              value={formData.location}
              onChange={handleChange}
              required
            />

            {/* City */}
            <InputField
              label="City *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            {/* State */}
            <InputField
              label="State *"
              name="state"
              icon={<Landmark className="w-4 h-4 text-gray-500" />}
              value={formData.state}
              onChange={handleChange}
              required
            />

            {/* Agent */}
            <SelectField
              label="Agent *"
              name="agentId"
              value={formData.agentId}
              onChange={handleChange}
              options={agents.map((a) => ({
                value: a.id,
                label: a.fullName,
              }))}
            />

            {/* Status */}
            <SelectField
              label="Status *"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={["pending", "active", "sold", "rejected"]}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>

          {/* Image URL */}
          <InputField
            label="Image URL"
            name="images"
            value={formData.images}
            onChange={handleChange}
            icon={<ImageIcon className="w-4 h-4 text-gray-500" />}
            placeholder="https://example.com/image.jpg"
          />

          {/* Amenities */}
          <InputField
            label="Amenities (comma-separated)"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            icon={<ListChecks className="w-4 h-4 text-gray-500" />}
            placeholder="Parking, Gym, Swimming Pool"
          />

          {/* Featured Checkbox */}
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <CheckSquare className="w-4 h-4 text-blue-600" />
            Mark as Featured
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md text-sm font-medium transition-all"
            >
              {property ? "Update Property" : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  icon,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        {icon && <div className="mr-2">{icon}</div>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full text-sm text-gray-800 focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  const opts =
    typeof options[0] === "string"
      ? options.map((o) => ({ value: o, label: o }))
      : options;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
