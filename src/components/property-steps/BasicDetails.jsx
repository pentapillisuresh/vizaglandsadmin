import { useEffect, useState, useRef } from 'react';
import ApiService from '../../hooks/ApiService';

const BasicDetails = ({ data, updateData, onNext, isEditMode, isProject }) => {
  // 🧠 Use refs to prevent infinite loops
  const isInitialMount = useRef(true);
  const previousDataRef = useRef(data);

  // States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState(data?.marketType || '');
  const [propertyType, setPropertyType] = useState(data?.category?.catType || data?.propertyKind.trim().toLowerCase() || 'residential');
  const [propertySubtype, setPropertySubtype] = useState(data?.categoryName || data?.propertySubtype || '');
  const [title, setTitle] = useState(data?.title || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(data?.categoryId || '');
  const [catLabel, setCatLabel] = useState('');
  const [titleError, setTitleError] = useState('');
  
  // 👤 Get user profile from localStorage
  const [userProfile, setUserProfile] = useState({});

  // 🏷️ Update catLabel when propertySubtype changes
  useEffect(() => {
    switch (propertySubtype) {
      case "Flat/Apartment":
        setCatLabel("Apartment Name");
        break;
      case "IndependentHouse/Villa":
      case "Independent House / Villa":
        setCatLabel("Society / Villa Name");
        break;
      default:
        setCatLabel("Name");
        break;
    }
  }, [propertySubtype]);

  // 📦 Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const clientToken = localStorage.getItem('token');
      try {
        const response = await ApiService.get('/categories', {
          headers: {
            Authorization: `Bearer ${clientToken}`,
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

  // 📥 Prefill when editing – only when data actually changes
  useEffect(() => {
    if (!isEditMode || !data) return;

    const dataChanged = JSON.stringify(previousDataRef.current) !== JSON.stringify(data);
    if (dataChanged) {
      const catName = data.categoryName?.trim() || data.propertySubtype?.trim() || '';
      const catType = data.catType?.toLowerCase() || data.propertyKind?.toLowerCase() || 'residential';

      setListingType(data.marketType);
      setPropertyType(catType);
      setPropertySubtype(catName);
      setTitle(data.title || '');
      setSelectedCategoryId(data.categoryId || '');

      previousDataRef.current = data;
    }
  }, [isEditMode, data]);

  // 👤 Load user profile from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("adminDetails");
    if (userData) {
      try {
        setUserProfile(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user profile:", e);
      }
    }
  }, []);

  // ✅ Title validation
  const validateTitle = (value) => {
    if (!value.trim()) {
      setTitleError('Property title is required');
      return false;
    }
    if (value.trim().length < 5) {
      setTitleError('Property title must be at least 5 characters long');
      return false;
    }
    if (value.trim().length > 70) {
      setTitleError('Property title cannot exceed 70 characters');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    validateTitle(value);
  };

  // 🚀 Continue handler
  const handleContinue = () => {
    if (!validateTitle(title)) return;

    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId || cat.name === propertySubtype
    );

    updateData({
      categoryId: selectedCategory?.id || '',
      title: title.trim(),
      categoryName:selectedCategory.name,
      marketType: listingType,
      propertyKind: propertyType,
      propertySubtype,
      catType: selectedCategory?.catType || (propertyType === 'residential' ? 'Residential' : 'Commercial'),
    });

    onNext();
  };

  // 🏠 Filter categories by type
  const residentialTypes = categories.filter(
    (cat) => cat.catType?.toLowerCase() === 'residential'
  );
  const commercialTypes = categories.filter(
    (cat) => cat.catType?.toLowerCase() === 'commercial'
  );
  const subtypes = propertyType === 'residential' ? residentialTypes : commercialTypes;

  // 🧩 Sort subtypes based on listingType (Sale/Rent)
  const customOrder = listingType.toLowerCase() === 'sale'
    ? ["Plot", "Flat/Apartment", "IndependentHouse/Villa", "Land", "FarmHouse"]
    : ["Flat/Apartment", "IndependentHouse/Villa", "FarmHouse", "Plot", "Land"];

  const sortedSubtypes = [...subtypes].sort((a, b) => {
    const indexA = customOrder.indexOf(a.name);
    const indexB = customOrder.indexOf(b.name);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-blue-900 mb-2">
          {isEditMode ? 'Edit Property Details' : `Welcome back ${userProfile?.full_name || 'User'},`}
        </h2>
        <h3 className="font-serif text-2xl font-semibold text-blue-900 mb-4">
          {isEditMode ? 'Update your basic details' : 'Fill out basic details'}
        </h3>
      </div>

      {/* 💰 Listing Type */}
      <div>
        <label className="block font-roboto text-base font-medium text-gray-700 mb-3">
          I'm looking to
        </label>
        <div className="flex flex-wrap gap-3">
          {['Sale', 'Rent'].map((type) => (
            <button
              key={type}
              onClick={() => setListingType(type)}
              className={`px-6 py-2.5 rounded-full border-2 font-roboto capitalize transition-all ${
                listingType === type
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 🏗️ Property Kind */}
      <div>
        <label className="block font-roboto text-base font-medium text-gray-700 mb-3">
          What kind of property do you have?
        </label>
        <div className="flex gap-6 mb-4">
          {['residential', 'commercial'].map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                value={type}
                checked={propertyType === type}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setPropertySubtype('');
                  setSelectedCategoryId('');
                }}
                className="w-5 h-5 text-orange-500 focus:ring-orange-500"
              />
              <span className="font-roboto text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>

        {/* 🏘️ Property Subtypes */}
        {loading ? (
          <p className="text-gray-500">Loading property types...</p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {sortedSubtypes.map((subtype) => {
              const isActive =
                propertySubtype?.toLowerCase().trim() === subtype.name?.toLowerCase().trim();
              return (
                <button
                  key={subtype.id}
                  onClick={() => {
                    setPropertySubtype(subtype.name);
                    setSelectedCategoryId(subtype.id);
                  }}
                  className={`px-5 py-2.5 rounded-full border-2 font-roboto transition-all ${
                    isActive
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {subtype.name}
                </button>
              );
            })}
          </div>
        )}

        {/* 🏷️ Property Title */}
        <div className="mt-4">
          <label className="block font-roboto text-base font-medium text-gray-700 mb-3">
            {!isProject ? "Property Title" : "Project Title"}
          </label>
          <input
            type="text"
            placeholder={`Enter ${!isProject ? "Property Title" : "Project Title"} (${propertySubtype || 'Property'} for ${listingType.toLowerCase()})`}
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 text-gray-600 py-2 border border-gray-300 rounded-lg font-roboto focus:outline-none focus:ring-2 focus:ring-orange-400"
            maxLength={70}
          />
          <div className="flex justify-between mt-1">
            {titleError && <p className="text-red-500 text-sm font-roboto">{titleError}</p>}
            <p className={`text-sm font-roboto ml-auto ${title.length > 70 ? 'text-red-500' : 'text-gray-500'}`}>
              {title.length}/70
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!propertySubtype || !title || title.trim().length < 5 || title.trim().length > 70 || titleError}
        className="bg-blue-900 hover:bg-blue-800 text-white font-roboto font-medium px-10 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isEditMode ? 'Save & Continue' : 'Continue'}
      </button>
    </div>
  );
};

export default BasicDetails;