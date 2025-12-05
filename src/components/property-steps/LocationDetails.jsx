import { useState, useEffect } from "react";
import ApiService from "../../hooks/ApiService";
import getAdvantages from "../../hooks/getNearBy";

const LocationDetails = ({ data, updateData, onNext, isEditMode,isProject }) => {
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState(data.address?.city || "");
  const [locality, setLocality] = useState(data.address?.locality || "");
  const [subLocality, setSubLocality] = useState(data.address?.sublocality || "");
  const [apartmentDoorNo, setApartmentDoorNo] = useState(data.address?.apartmentDoorNo || "");
  const [roadFacing, setRoadFacing] = useState(data.address?.road_facing || "");
  const [pincode, setPincode] = useState(data.address?.pincode || "");
  const [lat, setLat] = useState(data.address?.lat || "");
  const [lon, setLon] = useState(data.address?.lon || "");
  const [advantages, setAdvantages] = useState(getAdvantages(data));


  // ✅ Detect if property is land-like
  const subtype = (data.propertySubtype || "").trim().toLowerCase();
  const isLand =
    subtype.includes("land") ||
    subtype.includes("plot") ||
    subtype === "farmhouse";

  // ✅ Label for apartment/society input
  const [apartmentLabel, setApartmentLabel] = useState("");

  useEffect(() => {
    switch (data.propertySubtype) {
      case "Flat/Apartment":
        setApartmentLabel("Apartment Name");
        break;
      case "IndependentHouse/Villa":
      case "Independent House / Villa":
        setApartmentLabel("Society / Villa Name");
        break;
      default:
        setApartmentLabel("");
        break;
    }
  }, [data.propertySubtype]);

  // ✅ Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await ApiService.get("/city", {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setCities(res);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // ✅ Populate localities when city changes
  useEffect(() => {
    if (city && cities.length > 0) {
      const selectedCity = cities.find(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );
      setLocalities(selectedCity ? selectedCity.locality : []);
      // Keep locality if it exists in selected city's locality list
      if (!selectedCity?.locality.includes(locality)) {
        setLocality("");
      }
    }
  }, [city, cities]);

  // ✅ Prefill data in edit mode (once cities are loaded)
  useEffect(() => {
    if (isEditMode && data.address && cities.length > 0) {
      setCity(data.address.city || "");
      setLocality(data.address.locality || "");
      console.log("locality::", data.address.locality)
      setSubLocality(data.address.subLocality || "");
      console.log("subLocality::", data.address.subLocality)
      setApartmentDoorNo(data.address.apartmentDoorNo || "");
      setRoadFacing(data.address.road_facing || "");
      setPincode(data.address.pincode || "");
      setLat(data.address.lat || "");
      setLon(data.address.lon || "");
      setAdvantages(
        data.address.near_by?.length
          ? data.address.near_by
          : [{ info: "", distance: "250 m" }]
      );

      const selectedCity = cities.find(
        (c) => c.city.toLowerCase() === (data.address.city || "").toLowerCase()
      );
      setLocalities(selectedCity ? selectedCity.locality : []);
    }
  }, [isEditMode, data, cities]);

  // ✅ Update parent when city/locality changes
  useEffect(() => {
    if (!city && !locality) return;
    updateData({
      address: {
        ...data.address,
        city,
        locality,
      },
    });
  }, [city, locality]);

  // ✅ Handlers
  const handleContinue = () => {
    updateData({
      address: {
        city,
        locality,
        sublocality: subLocality,
        apartmentDoorNo: isLand ? "" : apartmentDoorNo,
        road_facing: roadFacing,
        pincode,
        lat,
        lon,
        near_by: advantages,
      },
    });
    onNext();
  };

  const handleAdvantageChange = (index, key, value) => {
    const updated = [...advantages];
    updated[index][key] = value;
    setAdvantages(updated);
  };

  const handleAddMore = () => {
    setAdvantages([...advantages, { info: "", distance: "250 m" }]);
  };

  const handleRemove = (index) => {
    const updated = advantages.filter((_, i) => i !== index);
    setAdvantages(updated);
  };

  // ✅ Render
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold text-blue-900 mb-2">
          {isEditMode ? `Edit ${!isProject?"Property":"Project"} Location` : `Where is your ${!isProject?"Property":"Project"} located?`}
        </h2>
        <p className="font-roboto text-gray-600">
          Accurate location details help you reach the right buyers.
        </p>
      </div>

      {/* 🏙️ City Dropdown */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          City <span className="text-red-500">*</span>
        </label>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading cities...</p>
        ) : (
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     outline-none font-roboto bg-white"
          >
            <option value="">Select a City</option>
            {cities?.map((c) => (
              <option key={c.id} value={c.city}>
                {c.city}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 📍 Locality */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          Locality <span className="text-red-500">*</span>
        </label>
        <select
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          disabled={!city}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-orange-500 focus:border-transparent
                   outline-none font-roboto bg-white ${!city ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <option value="">
            {city ? "Select a Locality" : "Select a City first"}
          </option>
          {localities?.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* 🏘️ Sub Locality */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          {isLand ? "Village" : "Sub Locality"}
        </label>
        <input
          type="text"
          value={subLocality}
          onChange={(e) => setSubLocality(e.target.value)}
          placeholder="e.g., Sector 5"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     outline-none font-roboto"
        />
      </div>

      {/* 🏢 Apartment / Society */}
      {!isLand && apartmentLabel && (
        <div>
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
            {apartmentLabel}
          </label>
          <input
            type="text"
            value={apartmentDoorNo}
            onChange={(e) => setApartmentDoorNo(e.target.value)}
            placeholder="e.g., D-201, Sunrise Apartments"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent
                       outline-none font-roboto"
          />
        </div>
      )}

      {/* 🚗 Road Facing */}
      <div>
        <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          Road Facing <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={roadFacing}
          onChange={(e) => setRoadFacing(e.target.value)}
          placeholder="100 fts"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     outline-none font-roboto"
        />
      </div>

      {/* 🌍 Coordinates */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <div className="flex-1">
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
            Latitude (Optional)
          </label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g., 17.6868"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent
                       outline-none font-roboto"
          />
        </div>
        <div className="flex-1">
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
            Longitude (Optional)
          </label>
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="e.g., 83.2185"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-roboto"
          />
        </div>
      </div>

      {/* 🏫 Location Advantages */}
      <div className="pt-10 border-t border-gray-200">
        <h2 className="font-serif text-2xl font-bold text-blue-900 mb-2">
          Location Advantages
        </h2>
        <p className="font-roboto text-gray-600 mb-6">
          Add nearby landmarks and distances
        </p>

        {Array.isArray(advantages) && advantages.map((item, index) => (         
           <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-4"
          >
            <input
              type="text"
              value={item.info}
              onChange={(e) => handleAdvantageChange(index, "info", e.target.value)}
              placeholder="e.g., Near Hospital, Bus Stop"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-2 sm:mb-0"
            />
            <select
              value={item.distance}
              onChange={(e) => handleAdvantageChange(index, "distance", e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option>250 m</option>
              <option>500 m</option>
              <option>1 km</option>
              <option>2 km</option>
              <option>5 km</option>
            </select>
            {advantages.length > 1 && (
              <button
                onClick={() => handleRemove(index)}
                className="bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-3 rounded-lg ml-0 sm:ml-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddMore}
          className="text-blue-900 font-medium mt-4 border border-blue-900 px-6 py-2 rounded-lg hover:bg-blue-900 hover:text-white transition"
        >
          + Add More
        </button>
      </div>

      {/* Continue Button */}
      <div className="pt-8">
        <button
          onClick={handleContinue}
          disabled={!city || !locality}
          className="bg-blue-900 hover:bg-blue-800 text-white font-roboto font-medium
                     px-10 py-3 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditMode ? "Save & Continue" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default LocationDetails;
