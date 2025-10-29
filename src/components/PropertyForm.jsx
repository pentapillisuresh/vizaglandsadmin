import { useState, useEffect } from "react";
import { Home, MapPin, Film, Image, User } from "lucide-react";
import ApiService from "../hooks/ApiService";
import EditPhotosForm from "./editPhotos";

export default function PropertyForm({ initialData = null, onSubmit, onCancel, allUsers = [] }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    categoryId: "",
    propertyName: "",
    title: "",
    description: "",
    marketType: "sale", // sale, rent, lease
    propertyKind: "residential",
    catType: "Residential",
    price: "",
    photos: [],
    videos: [],
    youtubeUrl: "",
    amenities: [],
    address: {
      city: "",
      locality: "",
      subLocality: "",
      apartmentDoorNo: "",
      nearby: "",
      landmark: "",
      pincode: "",
    },
    propertyProfile: {
      type: "",
      bedrooms: 0,
      bathrooms: 0,
      balconies: 0,
      floorNumber: 0,
      totalFloors: 0,
      carpetArea: 0,
      furnishedStatus: "unfurnished",
      facing: "East",
      areaUnit: "sqft",
      parkingSpaces: 0,
      securityAvailable: false,
      waterSupply: "24x7",
      powerBackup: false,
      gym: false,
      swimmingPool: false,
      clubHouse: false,
    },
    clientId: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      // const clientToken = localStorage.getItem('token');

      try {
        const response = await ApiService.get('/categories', {
          headers: {
            // Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response?.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);



  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        address: initialData.address || prev.address,
        propertyProfile: initialData.propertyProfile || prev.propertyProfile,
        clientId: initialData.client?.id || prev.clientId,
      }));
    }
  }, [initialData]);

  // ✅ Update nested and flat fields
  const handleChange = (field, value, nested = null) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: { ...prev[nested], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckbox = (field, checked, nested = null) => {
    handleChange(field, checked, nested);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.address.city) {
      alert("Please fill in required fields: Title, Price, and City");
      return;
    }
    onSubmit({ ...formData, price: parseFloat(formData.price) });
  };

  return (
    <div className="space-y-6">
      {/* ========================= BASIC INFO ========================= */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Property Name"
            value={formData.propertyName}
            onChange={(e) => handleChange("propertyName", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full"
          />
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full"
          />
          <select
            value={formData.marketType}
            onChange={(e) => handleChange("marketType", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full"
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="lease">For Lease</option>
          </select>
          <select
            value={formData.catType}
            onChange={(e) => handleChange("propertyKind", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat, inx) => (
              <option key={inx} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full mt-3"
          rows={3}
        />
      </div>

      {/* ========================= ADDRESS ========================= */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Address Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.keys(formData.address)
            .filter((key) => key !== "id" && key !== "propertyId")
            .map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData.address[key]}
                onChange={(e) => handleChange(key, e.target.value, "address")}
                className="border rounded-lg px-3 py-2 text-sm w-full capitalize"
              />
            ))}

        </div>
      </div>

      {/* ========================= PROPERTY PROFILE ========================= */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Home className="w-4 h-4" /> Property Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Type"
            value={formData.propertyProfile.type}
            onChange={(e) => handleChange("type", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Bedrooms"
            value={formData.propertyProfile.bedrooms}
            onChange={(e) => handleChange("bedrooms", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Bathrooms"
            value={formData.propertyProfile.bathrooms}
            onChange={(e) => handleChange("bathrooms", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Balconies"
            value={formData.propertyProfile.balconies}
            onChange={(e) => handleChange("balconies", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Floor Number"
            value={formData.propertyProfile.floorNumber}
            onChange={(e) => handleChange("floorNumber", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Total Floors"
            value={formData.propertyProfile.totalFloors}
            onChange={(e) => handleChange("totalFloors", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Carpet Area"
            value={formData.propertyProfile.carpetArea}
            onChange={(e) => handleChange("carpetArea", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={formData.propertyProfile.furnishedStatus}
            onChange={(e) => handleChange("furnishedStatus", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="fully-furnished">Fully-Furnished</option>
          </select>
          <select
            value={formData.propertyProfile.facing}
            onChange={(e) => handleChange("facing", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option>East</option>
            <option>West</option>
            <option>North</option>
            <option>South</option>
          </select>
          <input
            type="text"
            placeholder="Area Unit"
            value={formData.propertyProfile.areaUnit}
            onChange={(e) => handleChange("areaUnit", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Parking Spaces"
            value={formData.propertyProfile.parkingSpaces}
            onChange={(e) => handleChange("parkingSpaces", e.target.value, "propertyProfile")}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* --- Boolean amenities --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
          {[
            ["securityAvailable", "Security"],
            ["powerBackup", "Power Backup"],
            ["gym", "Gym"],
            ["swimmingPool", "Swimming Pool"],
            ["clubHouse", "Club House"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.propertyProfile[key]}
                onChange={(e) => handleCheckbox(key, e.target.checked, "propertyProfile")}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ========================= MEDIA ========================= */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Image className="w-4 h-4" /> Media
        </h3>
        <EditPhotosForm
          existingPhotos={formData.photos}
          setPropertyURLs={(value) =>
            setFormData((prev) => ({ ...prev, photos: value }))
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Video URLs (comma-separated)"
            value={formData.videos.join(", ")}
            onChange={(e) => handleChange("videos", e.target.value.split(","))}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="YouTube URL"
            value={formData.youtubeUrl}
            onChange={(e) => handleChange("youtubeUrl", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
          />
        </div>
      </div>


      {/* ========================= ACTION BUTTONS ========================= */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          {initialData ? "Update Property" : "Add Property"}
        </button>
      </div>
    </div>
  );
}
