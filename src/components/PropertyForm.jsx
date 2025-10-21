import { useState, useEffect } from "react";
import { Home } from "lucide-react";

export default function PropertyForm({ initialData = null, onSubmit, onCancel, allUsers }) {
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
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    furnishingStatus: "unfurnished",
    floorNumber: "",
    totalFloors: "",
    carpetArea: "",
    builtUpArea: "",
    plotArea: "",
    gardenArea: "",
    parkingSpaces: "",
    swimmingPool: false,
    gym: false,
    clubHouse: false,
    cafeteriaAvailable: false,
    conferenceRooms: "",
    powerBackup: false,
    airConditioned: false,
    waterSupply: "24x7",
    electricity: "24x7",
    security: false,
    maintenance: "",
    ageOfProperty: "new",
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.city) {
      alert("Please fill in all required fields (Title, Price, City)");
      return;
    }

    const submitData = {
      ...formData,
      price: parseInt(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
      balconies: formData.balconies ? parseInt(formData.balconies) : undefined,
      floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : undefined,
      totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
      carpetArea: formData.carpetArea ? parseInt(formData.carpetArea) : undefined,
      builtUpArea: formData.builtUpArea ? parseInt(formData.builtUpArea) : undefined,
      plotArea: formData.plotArea ? parseInt(formData.plotArea) : undefined,
      gardenArea: formData.gardenArea ? parseInt(formData.gardenArea) : undefined,
      parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : undefined,
      conferenceRooms: formData.conferenceRooms ? parseInt(formData.conferenceRooms) : undefined,
      maintenance: formData.maintenance ? parseInt(formData.maintenance) : undefined,
    };

    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderResidentialFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <input
            type="number"
            min="0"
            value={formData.bedrooms}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Number of bedrooms"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <input
            type="number"
            min="0"
            value={formData.bathrooms}
            onChange={(e) => handleChange("bathrooms", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Number of bathrooms"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Balconies</label>
          <input
            type="number"
            min="0"
            value={formData.balconies}
            onChange={(e) => handleChange("balconies", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Number of balconies"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing Status</label>
          <select
            value={formData.furnishingStatus}
            onChange={(e) => handleChange("furnishingStatus", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="fully-furnished">Fully Furnished</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age of Property</label>
          <select
            value={formData.ageOfProperty}
            onChange={(e) => handleChange("ageOfProperty", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="new">New (0-1 years)</option>
            <option value="1-5">1-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
          <input
            type="number"
            min="0"
            value={formData.floorNumber}
            onChange={(e) => handleChange("floorNumber", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Floor number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
          <input
            type="number"
            min="0"
            value={formData.totalFloors}
            onChange={(e) => handleChange("totalFloors", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Total floors in building"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq.ft)</label>
          <input
            type="number"
            min="0"
            value={formData.carpetArea}
            onChange={(e) => handleChange("carpetArea", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Carpet area"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Built-up Area (sq.ft)</label>
          <input
            type="number"
            min="0"
            value={formData.builtUpArea}
            onChange={(e) => handleChange("builtUpArea", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Built-up area"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plot Area (sq.ft)</label>
          <input
            type="number"
            min="0"
            value={formData.plotArea}
            onChange={(e) => handleChange("plotArea", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Plot area"
          />
        </div>
      </div>
    </>
  );

  const renderVillaSpecificFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Garden Area (sq.ft)</label>
          <input
            type="number"
            min="0"
            value={formData.gardenArea}
            onChange={(e) => handleChange("gardenArea", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Garden area"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spaces</label>
          <input
            type="number"
            min="0"
            value={formData.parkingSpaces}
            onChange={(e) => handleChange("parkingSpaces", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Number of parking spaces"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Premium Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.swimmingPool}
              onChange={(e) => handleChange("swimmingPool", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Swimming Pool</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.gym}
              onChange={(e) => handleChange("gym", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Gym</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.clubHouse}
              onChange={(e) => handleChange("clubHouse", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Club House</span>
          </label>
        </div>
      </div>
    </>
  );

  const renderCommercialFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Built-up Area (sq.ft)</label>
          <input
            type="number"
            min="0"
            value={formData.builtUpArea}
            onChange={(e) => handleChange("builtUpArea", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Built-up area"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spaces</label>
          <input
            type="number"
            min="0"
            value={formData.parkingSpaces}
            onChange={(e) => handleChange("parkingSpaces", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Number of parking spaces"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conference Rooms</label>
          <input
            type="number"
            min="0"
            value={formData.conferenceRooms}
            onChange={(e) => handleChange("conferenceRooms", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Number of conference rooms"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Commercial Facilities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.cafeteriaAvailable}
              onChange={(e) => handleChange("cafeteriaAvailable", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Cafeteria</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.powerBackup}
              onChange={(e) => handleChange("powerBackup", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Power Backup</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.airConditioned}
              onChange={(e) => handleChange("airConditioned", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Air Conditioned</span>
          </label>
        </div>
      </div>
    </>
  );

  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Water Supply</label>
          <select
            value={formData.waterSupply}
            onChange={(e) => handleChange("waterSupply", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="24x7">24x7</option>
            <option value="limited">Limited Hours</option>
            <option value="borewell">Borewell</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Electricity</label>
          <select
            value={formData.electricity}
            onChange={(e) => handleChange("electricity", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="24x7">24x7</option>
            <option value="limited">Limited</option>
            <option value="backup">With Backup</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Maintenance (₹)
          </label>
          <input
            type="number"
            min="0"
            value={formData.maintenance}
            onChange={(e) => handleChange("maintenance", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Monthly maintenance"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.security}
              onChange={(e) => handleChange("security", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">24x7 Security</span>
          </label>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter property title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter price"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
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
            onChange={(e) => handleChange("propertyType", e.target.value)}
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
            onChange={(e) => handleChange("propertySubtype", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            {formData.propertyType === "residential" ? (
              <>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="penthouse">Penthouse</option>
              </>
            ) : (
              <>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="warehouse">Warehouse</option>
                <option value="showroom">Showroom</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
          <select
            value={formData.listingType}
            onChange={(e) => handleChange("listingType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
          <input
            type="text"
            value={formData.locality}
            onChange={(e) => handleChange("locality", e.target.value)}
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
            onChange={(e) => handleChange("subLocality", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Enter sub locality"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
          <select
            value={formData.facing}
            onChange={(e) => handleChange("facing", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="north-east">North-East</option>
            <option value="north-west">North-West</option>
            <option value="south-east">South-East</option>
            <option value="south-west">South-West</option>
          </select>
        </div>
      </div>

      {formData.propertyType === "residential" && (
        <div className="border-t border-gray-200 pt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Residential Property Details
          </h3>
          {renderResidentialFields()}
          {formData.propertySubtype === "villa" && (
            <div className="mt-4">{renderVillaSpecificFields()}</div>
          )}
        </div>
      )}

      {formData.propertyType === "commercial" && (
        <div className="border-t border-gray-200 pt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Commercial Property Details
          </h3>
          {renderCommercialFields()}
        </div>
      )}

      <div className="border-t border-gray-200 pt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Common Amenities</h3>
        {renderCommonFields()}
      </div>

      {allUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posted By</label>
            <select
              value={formData.postedBy}
              onChange={(e) => handleChange("postedBy", e.target.value)}
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
              onChange={(e) => handleChange("userId", e.target.value)}
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
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {initialData ? "Update Property" : "Add Property"}
        </button>
      </div>
    </div>
  );
}
