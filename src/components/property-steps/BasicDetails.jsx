import { useEffect, useState } from 'react';
import ApiService from '../../hooks/ApiService';

const BasicDetails = ({ data, updateData, onNext, isEditMode,isProject }) => {
  // 🧩 Local states (initialized with data)
  const [listingType, setListingType] = useState(data?.marketType || 'Sale');
  const [propertyType, setPropertyType] = useState(data?.category?.catType || 'residential');
  const [propertySubtype, setPropertySubtype] = useState(data?.category?.name || '');
  const [customSubtype, setCustomSubtype] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(data.title || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(data?.categoryId || '');
  const [userProfile, setUserProfile] = useState({})
  // Custom order for category sorting
  const customOrder = ["Plot", "Flat/Apartment", "IndependentHouse/Villa", "Land", "FarmHouse"];

// 🧩 Prefill once when data or categories change
useEffect(() => {
  if (!isEditMode || !data) return;
  const rrr = localStorage.getItem("adminDetails");
  setUserProfile(rrr)
  
  // Prefer nested category if available
  const catName = data.category?.name?.trim() || data.propertySubtype?.trim() || '';
  const catType = data.category?.catType?.toLowerCase() || data.propertyKind?.toLowerCase() || 'residential';

  setListingType(data.marketType || 'Sale');
  setPropertyType(catType);
  setPropertySubtype(catName);
  setTitle(data.title || '');
  setSelectedCategoryId(data.categoryId || '');
}, [isEditMode, data, categories]);
  // 🧭 Fetch categories
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

  // 🧩 Prefill fields when editing existing property
  useEffect(() => {
    if (isEditMode && data) {
      setListingType(data.marketType || 'sale');
      setPropertyType(data.propertyKind || 'residential');
      setPropertySubtype(data.propertySubtype || '');
      setTitle(data.title || '');
      setSelectedCategoryId(data.categoryId || '');
    }
  }, [isEditMode, data]);

  // 🏁 Handle Continue button
  const handleContinue = () => {
    // Find selected category from backend data
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId || cat.name === propertySubtype
    );

    updateData({
      categoryId: selectedCategory?.id || '',
      propertyName: title,
      title,
      marketType: listingType,
      propertyKind: propertyType,
      propertySubtype,
      catType:
        selectedCategory?.catType ||
        (propertyType === 'residential' ? 'Residential' : 'Commercial'),
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

  // 🧩 Sort subtypes in custom order
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
              className={`px-6 py-2.5 rounded-full border-2 font-roboto capitalize transition-all ${listingType === type
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  setCustomSubtype('');
                }}
                className="w-5 h-5 text-orange-500 focus:ring-orange-500"
              />
              <span className="font-roboto text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>

        {/* 🏘️ Property Subtypes */}
        {/* 🏘️ Property Subtypes */}
        {loading ? (
          <p className="text-gray-500">Loading property types...</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {sortedSubtypes.map((subtype) => {
              const isActive =
                propertySubtype?.toLowerCase().trim() === subtype.name?.toLowerCase().trim();

              console.log(propertySubtype?.toLowerCase().trim(), "===", subtype.name?.toLowerCase().trim())

              return (
                <button
                  key={subtype.id}
                  onClick={() => {
                    setPropertySubtype(subtype.name);
                    setSelectedCategoryId(subtype.id);
                  }}
                  className={`px-5 py-2.5 rounded-full border-2 font-roboto transition-all ${isActive
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


        {/* 🏠 Property Title */}
        <div className="mt-4">
          <label className="block font-roboto text-base font-medium text-gray-700 mb-3">
            {!isProject?"Property":"Project"} Title
          </label>
          <input
            type="text"
            placeholder={`Enter Property Title ( ${propertySubtype} For sale )`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-roboto focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={handleContinue}
        disabled={!propertySubtype || !title}
        className="bg-blue-900 hover:bg-blue-800 text-white font-roboto font-medium px-10 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isEditMode ? 'Save & Continue' : 'Continue'}
      </button>
    </div>
  );
};

export default BasicDetails;