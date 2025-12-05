import { useState, useEffect } from "react";

const PropertyProfile = ({ data = {}, onNext, updateData }) => {
  // Property subtype
  const [propertySubtype, setPropertySubtype] = useState(data.propertySubtype || "");

  // --- Plot / Land fields ---
  const [plotArea, setPlotArea] = useState(0);
  const [landArea, setLandArea] = useState(0);
  const [plotAreaUnit, setPlotAreaUnit] = useState("sq yards");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [facing, setFacing] = useState("");
  const [frontage, setFrontage] = useState("");
  const [price, setPrice] = useState(null);
  const [advance, setAdvance] = useState(null);
  const [showPlotSize, setShowPlotSize] = useState(false);
  const [plotSize, setPlotSize] = useState(null);
  const [showUDS_area, setShowUDS_area] = useState(false);
  const [UDS_area, setUDS_area] = useState(null);

  // --- Apartment / Villa / Residential fields ---
  const [bedrooms, setBedrooms] = useState(null);
  const [bathrooms, setBathrooms] = useState(null);
  const [balconies, setBalconies] = useState(null);
  const [poojaRoom, setPoojaRoom] = useState(true);
  const [carpetArea, setCarpetArea] = useState(null);
  const [builtArea, setBuiltArea] = useState(null);
  const [superBuiltArea, setSuperBuiltArea] = useState(null);
  const [areaUnit, setAreaUnit] = useState("sqft");
  const [parkingType, setParkingType] = useState("");
  const [closedParking, setClosedParking] = useState(0);
  const [openParking, setOpenParking] = useState(0);
  const [status, setStatus] = useState("Ready to Move");
  const [possession, setPossession] = useState("");
  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [units, setUnits] = useState(0);
  const [officeNumber, setOfficeNumber] = useState("");
  const [shopNumber, setShopNumber] = useState("");

  // --- Floor details ---
  const [totalFloors, setTotalFloors] = useState("");
  const [propertyOnFloor, setPropertyOnFloor] = useState("");

  // --- Commercial fields ---
  const [roadWidth, setRoadWidth] = useState(0);
  const [cornerShop, setCornerShop] = useState(false);
  const [pantryAvailable, setPantryAvailable] = useState(false);
  const [washroomAvailable, setWashroomAvailable] = useState(false);
  const [liftAvailable, setLiftAvailable] = useState(false);
  const [powerBackup, setPowerBackup] = useState(false);
  const [acAvailable, setAcAvailable] = useState(false);
  const [furnishedStatus, setFurnishedStatus] = useState("unfurnished");
  const [cabins, setCabins] = useState(null);
  const [conferenceRooms, setConferenceRooms] = useState(null);
  const [workstations, setWorkstations] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState(null);
  const [securityAvailable, setSecurityAvailable] = useState(false);
  const [waterSupply, setWaterSupply] = useState("");

  // --- Toggles ---
  const [showBuiltArea, setShowBuiltArea] = useState(false);
  const [showSuperBuiltArea, setShowSuperBuiltArea] = useState(false);
  const [showCommercialAddons, setShowCommercialAddons] = useState(false);

  // --- Facing options ---
  const facingOptions = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

  // --- Property type flags ---
  const isPlotOrLand = ["Plot", "Land", "Commercial Land", "Warehouse / Godown", "Industrial Building"].includes(propertySubtype);
  const isLand = ["Land", "Commercial Land", "Warehouse / Godown", "Industrial Building"].includes(propertySubtype);
  const isFlatOrVilla = ["Flat/Apartment", "Independent House / Villa"].includes(propertySubtype);
  const isVilla = ["Independent House / Villa", "Farmhouse"].includes(propertySubtype);
  const isFlat = propertySubtype === "Flat/Apartment";
  const isPlot = propertySubtype === "Plot";
  const isOfficeSpace = propertySubtype === "Office Space";
  const isShopShowroom = propertySubtype === "Shop / Showroom";
  const needsFloorDetails = isFlatOrVilla || isOfficeSpace || isShopShowroom;
  const needsUnitNumber = isFlat || isOfficeSpace || isShopShowroom;
  const canHaveCommercialAddons = isOfficeSpace || isShopShowroom;

  // --- Validation functions ---
  const validateClosedParking = (value) => {
    const numValue = parseInt(value);
    return numValue >= 0 && numValue <= 10;
  };

  const validateOpenParking = (value) => {
    const numValue = parseInt(value); 
    return numValue > 0 && numValue <= 10;
  };

  const validatePropertyOnFloor = (value) => {
    const numValue = parseInt(value);
    return numValue > 0 && numValue <= 99;
  };

  const validateTotalFloors = (value) => {
    const numValue = parseInt(value);
    return numValue >= 1 && numValue <= 99;
  };

  // --- Handler functions with validation ---
  const handleClosedParkingChange = (value) => {
    const numValue = parseInt(value);
    if (validateClosedParking(numValue)) {
      setClosedParking(numValue);
    }
  };

  const handleOpenParkingChange = (value) => {
    const numValue = parseInt(value);
    if (validateOpenParking(numValue)) {
      setOpenParking(numValue);
    }
  };

  const handlePropertyOnFloorChange = (value) => {
    const numValue = parseInt(value);
    if (validatePropertyOnFloor(numValue)) {
      setPropertyOnFloor(numValue);
    } else if (value === "") {
      setPropertyOnFloor("");
    }
  };

  const handleTotalFloorsChange = (value) => {
    const numValue = parseInt(value);
    if (validateTotalFloors(numValue)) {
      setTotalFloors(numValue);
    } else if (value === "") {
      setTotalFloors("");
    }
  };

  // --- Initialize state on edit/add ---
  useEffect(() => {
    if (!data) return;

    setPlotArea(data?.propertyProfile?.plotArea || 1);
    setLandArea(data?.propertyProfile?.landArea || 1);
    setPlotAreaUnit(data?.propertyProfile?.plotAreaUnit || (isLand ? "acres" : isPlot ? "sq yards" : "sqft"));
    setLength(data?.propertyProfile?.length || "");
    setBreadth(data?.propertyProfile?.breadth || "");
    setFacing(data?.propertyProfile?.facing || "");
    setFrontage(data?.propertyProfile?.frontage || "");
    setPrice(data?.price || null);
    setAdvance(data?.advance || null);
    setBedrooms(data?.propertyProfile?.bedrooms || null);
    setBathrooms(data?.propertyProfile?.bathrooms || null);
    setBalconies(data?.propertyProfile?.balconies || null);
    setPoojaRoom(data?.propertyProfile?.poojaRoom ?? true);
    setCarpetArea(data?.propertyProfile?.carpetArea || null);
    setBuiltArea(data?.propertyProfile?.buildArea || null);
    setSuperBuiltArea(data?.propertyProfile?.superBuildArea || null);
    setAreaUnit(data?.propertyProfile?.areaUnit || (isLand ? "acres" : "sqft"));
    setParkingType(data?.propertyProfile?.parkingType || "");
    setClosedParking(data?.propertyProfile?.closedParking || 0);
    setOpenParking(data?.propertyProfile?.openParking || 0);
    setStatus(data?.availableStatus || "Ready to Move");
    setPossession(data?.possession || "");
    setAgeOfProperty(data?.ageOfProperty || "");
    setFlatNumber(data?.propertyProfile?.flatNumber || "");
    setUnits(data?.propertyProfile?.units || 0);
    setOfficeNumber(data?.propertyProfile?.officeNumber || "");
    setShopNumber(data?.propertyProfile?.shopNumber || "");

    setTotalFloors(data?.propertyProfile?.totalFloors || "");
    setPropertyOnFloor(data?.propertyProfile?.propertyOnFloor || "");

    setRoadWidth(data?.propertyProfile?.roadWidth || 0);
    setCornerShop(data?.propertyProfile?.cornerShop || false);
    setPantryAvailable(data?.propertyProfile?.pantryAvailable || false);
    setWashroomAvailable(data?.propertyProfile?.washroomAvailable || false);
    setLiftAvailable(data?.propertyProfile?.liftAvailable || false);
    setPowerBackup(data?.propertyProfile?.powerBackup || false);
    setAcAvailable(data?.propertyProfile?.acAvailable || false);
    setFurnishedStatus(data?.propertyProfile?.furnishedStatus || "unfurnished");
    setCabins(data?.propertyProfile?.cabins || null);
    setConferenceRooms(data?.propertyProfile?.conferenceRooms || null);
    setWorkstations(data?.propertyProfile?.workstations || "");
    setParkingSpaces(data?.propertyProfile?.parkingSpaces || null);
    setSecurityAvailable(data?.propertyProfile?.securityAvailable || false);
    setWaterSupply(data?.propertyProfile?.waterSupply || "");

    setShowBuiltArea(!!data?.propertyProfile?.builtArea);
    setShowSuperBuiltArea(!!data?.propertyProfile?.superBuiltArea);
    setShowCommercialAddons(canHaveCommercialAddons);
  }, [data, propertySubtype]);

  // --- Payload creation for Add/Edit ---
  const handleContinue = () => {

    const payload = { propertySubtype, price };

    // Fixed: Use property assignment instead of function call
    if (data?.marketType.toLowerCase() !== 'sale') {
      payload.advance = advance;
    }

    if (isPlotOrLand) {
      payload.propertyProfile = {
        plotArea,
        landArea,
        areaUnit: plotAreaUnit,
        length,
        breadth,
        price,
        ...(isLand ? { frontage: frontage ?? "" } : { facing }),
      };
    } else {
      payload.propertyProfile = {
        bedrooms,
        bathrooms,
        balconies,
        poojaRoom,
        carpetArea,
        buildArea: builtArea,
        superBuildArea: superBuiltArea,
        areaUnit,
        price,
        units,
        parkingType,
        closedParking,
        openParking,
        parkingSpaces,
        status,
        possession,
        ...(needsFloorDetails ? { totalFloors, propertyOnFloor } : {}),
        ...(isFlat ? { flatNumber } : {}),
        ...(isOfficeSpace ? { officeNumber, cabins, conferenceRooms, workstations } : {}),
        ...(isShopShowroom ? { shopNumber, parkingSpaces } : {}),
        ...(canHaveCommercialAddons ? {
          roadWidth,
          cornerShop,
          pantryAvailable,
          washroomAvailable,
          liftAvailable,
          powerBackup,
          acAvailable,
          furnishedStatus,
          securityAvailable,
          waterSupply,
        } : {}),
      };
    }
    payload.ageOfProperty = status === "Ready to Move" ? ageOfProperty : "";

    updateData(payload);
    onNext();
  };

  // --- Form validations ---
  // Plot/Land validation
  function validatePlotFields({
    price,
    plotAreaUnit,
    length,
    breadth,
    isLand,
    frontage,
    landArea,
    plotArea,
    facing
  }) {
    const missing = [];
  
    // 🏷️ Common required fields
    if (!price) missing.push("price");
    if (!plotAreaUnit) missing.push("plotAreaUnit");
  
    // 📏 Plot-only fields (not required for land)
    if (!isLand) {
      if (!length) missing.push("length");
      if (!breadth) missing.push("breadth");
    }
  
    // 🧱 Conditional validation
    if (isLand) {
      // Land: frontage & landArea required
      if (!frontage) missing.push("frontage");
      if (!landArea) missing.push("landArea");
    } else {
      // Plot: plotArea & facing required
      if (!plotArea) missing.push("plotArea");
      if (!facing) missing.push("facing");
    }
  
    return {
      isValid: missing.length === 0,
      missing,
    };
  }
    
  // Example usage:
  const { isValid: allPlotFieldsFilled, missing } = validatePlotFields({
    price,
    plotAreaUnit,
    length,
    breadth,
    isLand,
    frontage,
    landArea,
    plotArea,
    facing,
  });
  
  console.log("allPlotFieldsFilled:", allPlotFieldsFilled);
  console.log("Missing fields:", missing);
  
  // At least one area must be provided

  function validateBaseResidential({
    bedrooms,
    bathrooms,
    balconies,
    carpetArea,
    builtArea,
    totalFloors,
    superBuiltArea,
    areaUnit,
    status,
    ageOfProperty,
    possession
  }) {
    const missing = [];
  
    // 🏠 Required core fields
    if (!bedrooms) missing.push("bedrooms");
    if (!bathrooms) missing.push("bathrooms");
    if (!balconies) missing.push("balconies");
    if (!areaUnit) missing.push("areaUnit");
    if (!totalFloors) missing.push("totalFloors");
    if (!status) missing.push("status");
  
    // 📐 At least one area required
    const hasAtLeastOneArea = [carpetArea, builtArea, superBuiltArea].some(
      area => area != null && area !== ""
    );
    if (!hasAtLeastOneArea) missing.push("Area (carpet/built/superBuilt)");
  
    // 🧱 Conditional checks based on property status
    if (status === "Ready to Move" && !ageOfProperty) {
      missing.push("ageOfProperty (for Ready to Move)");
    }
    if (status === "Under Construction" && !possession) {
      missing.push("possession (for Under Construction)");
    }
  
    // ✅ Optional fields (balconies, poojaRoom) are skipped intentionally
  
    const isValid = missing.length === 0;
  
    return { isValid, missing };
  }
  const formValues = {
    bedrooms,
    bathrooms,
    balconies,
    carpetArea,
    builtArea,
    superBuiltArea,
    areaUnit,
    totalFloors,
    status,
    ageOfProperty,
    possession,
  };
  
  const allApartmentFieldsFilled = validateBaseResidential(formValues);
      
  // Final form validation
  const isFormComplete = isPlotOrLand
    ? (() => {
      console.log("allPlotFieldsFilled::", allPlotFieldsFilled);
      return allPlotFieldsFilled;
    })()
    : (() => {
      console.log("allApartmentFieldsFilled::", allApartmentFieldsFilled.isValid);
      return allApartmentFieldsFilled.isValid;
    })();

  // --- Unit field helpers ---
  const getUnitNumberLabel = () => isFlat ? "Total Units" : isOfficeSpace ? "Office Number" : isShopShowroom ? "Shop Number" : "Unit Number";
  const getUnitNumberPlaceholder = () => isFlat ? "Enter Units" : isOfficeSpace ? "Enter office number" : isShopShowroom ? "Enter shop number" : "Enter unit number";
  const getUnitNumberValue = () => isFlat ? units : isOfficeSpace ? officeNumber : isShopShowroom ? shopNumber : "";
  const handleUnitNumberChange = (value) => {
    if (isFlat) setUnits(value);
    if (isOfficeSpace) setOfficeNumber(value);
    if (isShopShowroom) setShopNumber(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold text-blue-900 mb-2">
          Property Profile
        </h2>
        <p className="font-roboto text-gray-600">
          Tell us more about your property specifications
        </p>
      </div>

      {isPlotOrLand ? (
        <div className="space-y-6">
          {/* {isPlot && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plot Number
              </label>
              <input
                type="text"
                value={plotNumber}
                onChange={(e) => setPlotNumber(e.target.value)}
                placeholder="Enter plot number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )} */}
          <div>
            <label className="block font-roboto text-sm font-medium text-gray-700 mt-8 mb-4">
              {data?.marketType?.toLowerCase() === 'sale' ? "Price" : "Rent"} (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter property price"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-roboto"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {
              isPlot ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={plotArea}
                    onChange={(e) => setPlotArea(e.target.value)}
                    placeholder="Enter area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    placeholder="Enter area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )
            }

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={plotAreaUnit}
                onChange={(e) => setPlotAreaUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select</option>
                <option value="sq yards">Sq Yards</option>
                <option value="sq ft">Sq Ft</option>
                <option value="sq meters">Sq Meters</option>
                <option value="acres">Acres</option>
                <option value="cents">Cents</option>
              </select>
            </div>
          </div>
          <p className="font-roboto mb-3 font-bold text-black-600">
            {isPlot
              ? `${Math.round(price / plotArea) ?? 0}  per ${plotAreaUnit}`
              : `${Math.round(price / landArea) ?? 0} per ${plotAreaUnit}`}
          </p>

          {!isLand ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (ft) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (ft) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={breadth}
                    onChange={(e) => setBreadth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Facing <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {facingOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setFacing(option)}
                      className={`px-5 py-2.5 rounded-full border-2 font-roboto transition-all ${facing === option
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-orange-300"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roadfacing (in ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {(isFlatOrVilla) && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Bedrooms <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBedrooms(num)}
                    className={`px-4 py-2 rounded-full border-2 ${bedrooms === num
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300"
                      }`}
                  >
                    {num} BHK
                  </button>
                ))}
              </div>
            </div>
          )}

          {(isFlatOrVilla) && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Bathrooms <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBathrooms(num)}
                    className={`px-4 py-2 rounded-full border-2 ${bathrooms === num
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(isFlatOrVilla) && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Balconies <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBalconies(num)}
                    className={`px-4 py-2 rounded-full border-2 ${balconies === num
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(isFlatOrVilla) && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Pooja Room <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setPoojaRoom(option)}
                    className={`px-5 py-2 rounded-full border-2 ${poojaRoom === option
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* 💵 Price Input */}
          <div>
            <label className="block font-roboto text-sm font-medium text-gray-700 mt-8 mb-4">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter property price"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-roboto"
            />
          </div>

          <div className="space-y-6 pt-4 border-t border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Area Details</h3>
              <p className="text-sm text-gray-600 mb-4">At least one area type is mandatory</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carpet Area <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value)}
                    placeholder="Enter area"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                  />
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="sqft">sq.ft.</option>
                    <option value="sqyd">sq.yd.</option>
                    <option value="sqm">sq.m.</option>
                  </select>
                </div>
              </div>

              <p className="font-roboto mb-3 bold text-black-600">
                {Math.round(price / carpetArea)} per {areaUnit}
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {!showBuiltArea && (
                  <button
                    onClick={() => setShowBuiltArea(true)}
                    className="px-4 py-2 border-2 border-dashed border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    + Add Built-up Area
                  </button>
                )}
                {!showSuperBuiltArea && (
                  <button
                    onClick={() => setShowSuperBuiltArea(true)}
                    className="px-4 py-2 border-2 border-dashed border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    + Add Super Built-up Area
                  </button>
                )}
                {isFlat && !showUDS_area && (
                  <button
                    onClick={() => setShowUDS_area(true)}
                    className="px-4 py-2 border-2 border-dashed border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    + Add UDS Area
                  </button>
                )}
                {isVilla && !showPlotSize && (
                  <button
                    onClick={() => setShowPlotSize(true)}
                    className="px-4 py-2 border-2 border-dashed border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    + Add Plot Size
                  </button>
                )}

              </div>

              {showBuiltArea && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Built-up Area
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={builtArea}
                      onChange={(e) => setBuiltArea(e.target.value)}
                      placeholder="Enter area"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex items-center">
                      <span className="text-gray-600">{areaUnit}</span>
                      <button
                        onClick={() => {
                          setShowBuiltArea(false);
                          setBuiltArea("");
                        }}
                        className="ml-4 text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showSuperBuiltArea && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Super Built-up Area
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={superBuiltArea}
                      onChange={(e) => setSuperBuiltArea(e.target.value)}
                      placeholder="Enter area"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex items-center">
                      <span className="text-gray-600">{areaUnit}</span>
                      <button
                        onClick={() => {
                          setShowSuperBuiltArea(false);
                          setSuperBuiltArea("");
                        }}
                        className="ml-4 text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showUDS_area && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UDS Area
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={UDS_area}
                      onChange={(e) => setUDS_area(e.target.value)}
                      placeholder="Enter UDS area"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex items-center">
                      <span className="text-gray-600">{areaUnit}</span>
                      <button
                        onClick={() => {
                          setShowUDS_area(false);
                          setUDS_area("");
                        }}
                        className="ml-4 text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showPlotSize && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Size
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={plotSize}
                      onChange={(e) => setPlotSize(e.target.value)}
                      placeholder="Enter Plot area"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex items-center">
                      <span className="text-gray-600">{areaUnit}</span>
                      <button
                        onClick={() => {
                          setShowPlotSize(false);
                          setPlotSize("");
                        }}
                        className="ml-4 text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Moved Parking and Units section here */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-6">
              {/* Closed Parking */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closed Parking <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleClosedParkingChange(Math.max(0, closedParking - 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={closedParking}
                    className="w-12 text-center border-x border-gray-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleClosedParkingChange(closedParking + 1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    +
                  </button>
                </div>
                {!validateClosedParking(closedParking) && (
                  <p className="text-red-500 text-xs mt-1">Maximum 10 allowed</p>
                )}
              </div>

              {/* Open Parking */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Parking <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleOpenParkingChange(Math.max(0, openParking - 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={openParking}
                    className="w-12 text-center border-x border-gray-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenParkingChange(openParking + 1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    +
                  </button>
                </div>
                {!validateOpenParking(openParking) && (
                  <p className="text-red-500 text-xs mt-1">Maximum 10 allowed</p>
                )}
              </div>

              {/* Total Units - Moved here beside parking */}
              {isFlat && (
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="Enter total units"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>
          </div>

          {needsUnitNumber && !isFlat && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getUnitNumberLabel()}
              </label>
              <input
                type="text"
                value={getUnitNumberValue()}
                onChange={(e) => handleUnitNumberChange(e.target.value)}
                placeholder={getUnitNumberPlaceholder()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
          {needsFloorDetails && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Floor Details</h3>
              <p className="text-sm text-gray-600">Total no of floors and your floor details</p>

              <div className="grid grid-cols-2 gap-4">

                {!isVilla && <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property on Floor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={propertyOnFloor}
                    onChange={(e) => handlePropertyOnFloorChange(e.target.value)}
                    placeholder="Enter floor number (0-99)"
                    min="0"
                    max="99"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                  />
                  {propertyOnFloor !== "" && !validatePropertyOnFloor(propertyOnFloor) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a value between 0 and 99</p>
                  )}
                </div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Floors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={totalFloors}
                    onChange={(e) => handleTotalFloorsChange(e.target.value)}
                    placeholder="Enter total floors (1-99)"
                    min="1"
                    max="99"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                  />
                  {totalFloors !== "" && !validateTotalFloors(totalFloors) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a value between 1 and 99</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parking Spaces
            </label>
            <input
              type="number"
              value={parkingSpaces}
              onChange={(e) => setParkingSpaces(e.target.value)}
              placeholder="Number of parking slots"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div> */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Availability Status <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {["Ready to Move", "Under Construction"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setStatus((opt))}
                  className={`px-5 py-2 rounded-full border-2 ${status === opt
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-300"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {status === "Ready to Move" && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Age of Property (in years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={ageOfProperty}
                onChange={(e) => setAgeOfProperty(e.target.value)}
                placeholder="Enter age in years"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          {status === "Under Construction" && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Possession (in months) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          {canHaveCommercialAddons && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowCommercialAddons(!showCommercialAddons)}
                className="w-full px-4 py-3 border-2 border-dashed border-blue-500 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                {showCommercialAddons ? "- Hide" : "+"} Add Commercial Features (Optional)
              </button>

              {showCommercialAddons && (
                <div className="mt-6 space-y-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Commercial Features</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Road Width (ft)
                      </label>
                      <input
                        type="number"
                        value={roadWidth}
                        onChange={(e) => setRoadWidth(e.target.value)}
                        placeholder="Enter road width"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {isShopShowroom && (
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cornerShop}
                            onChange={(e) => setCornerShop(e.target.checked)}
                            className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Corner Shop</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnished Status
                    </label>
                    <div className="flex gap-3">
                      {["Furnished", "Semi-Furnished", "Unfurnished"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setFurnishedStatus(opt)}
                          className={`px-4 py-2 rounded-full border-2 ${furnishedStatus === opt
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-gray-300"
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water Supply
                    </label>
                    <div className="flex gap-3">
                      {["24x7", "Limited", "Borewell"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setWaterSupply(opt)}
                          className={`px-4 py-2 rounded-full border-2 ${waterSupply === opt
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-gray-300"
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pantryAvailable}
                        onChange={(e) => setPantryAvailable(e.target.checked)}
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Pantry Available</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={washroomAvailable}
                        onChange={(e) => setWashroomAvailable(e.target.checked)}
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Washroom Available</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={liftAvailable}
                        onChange={(e) => setLiftAvailable(e.target.checked)}
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Lift Available</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={powerBackup}
                        onChange={(e) => setPowerBackup(e.target.checked)}
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Power Backup</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acAvailable}
                        onChange={(e) => setAcAvailable(e.target.checked)}
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">AC Available</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityAvailable}
                        onChange={(e) => setSecurityAvailable(e.target.checked)}
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Security Available</span>
                    </label>
                  </div>

                  {isOfficeSpace && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cabins
                          </label>
                          <input
                            type="number"
                            value={cabins}
                            onChange={(e) => setCabins(e.target.value)}
                            placeholder="No. of cabins"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conference Rooms
                          </label>
                          <input
                            type="number"
                            value={conferenceRooms}
                            onChange={(e) => setConferenceRooms(e.target.value)}
                            placeholder="No. of rooms"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Workstations
                          </label>
                          <input
                            type="number"
                            value={workstations}
                            onChange={(e) => setWorkstations(e.target.value)}
                            placeholder="No. of desks"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </>
                  )}


                </div>
              )}
            </div>
          )}
        </div>
      )}
<div className="m-3">
  <p className="text-green-500 text-xs font-semibold mb-2">
    ✓ Missing Fields
  </p>

  {/* Determine which list to show */}
  {(isPlotOrLand ? missing : allApartmentFieldsFilled?.missing)?.length ? (
    (isPlotOrLand ? missing : allApartmentFieldsFilled?.missing)?.map((item, index) => (
      <span
        key={index}
        className="text-white text-xs capitalize ml-2 border rounded bg-red-500 px-2 py-1 mb-1 inline-block"
      >
        ✕ {item}
      </span>
    ))
  ) : (
    <p className="text-gray-400 text-xs ml-2 italic">
      All required fields are filled ✔️
    </p>
  )}
</div>
      {<button
        onClick={handleContinue}
        disabled={!isFormComplete}
        className={`bg-blue-900 hover:bg-blue-800 text-white font-roboto font-medium
                     px-10 py-3 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Continue
      </button>}
    </div>
  );
};

export default PropertyProfile;