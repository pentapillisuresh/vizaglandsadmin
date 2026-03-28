import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../hooks/ApiService';

const PricingOthers = ({ data, updateData, isEditMode,isProject }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  const approvedOptions = ['VMRDA', 'VUDA', 'DTCP', 'RERA', 'GVMC', 'Bank Loan'];
  const amenitiesOptions = [
    'Security',
    'Maintenance Staff',
    'Clubhouse',
    'Park / Garden',
    'Gym / Rooms',
    'Swimming Pool',
    'Wi-Fi',
    'Lift',
    'Power Backup'
  ];

  // Populate state in edit mode
  useEffect(() => {
    if (isEditMode && data) {
      setProjectName(data.projectName || '');
      setDescription(data.description || '');
      setPrivateNotes(data.privateNotes || '');
      setApprovedBy(data.approvedBy || '');
      setAmenities(data.amenities || []);
    }
  }, [isEditMode, data]);

  const handleApprovedChange = (value) => {
    setApprovedBy(value);
  };

  const handleAmenitiesChange = (value) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!description || description.trim() === '') {
      errors.description = 'Description is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateScore = () => {
    let score = 0;
    if (data.catType) score += 10;
    if (data.marketType) score += 10;
    if (data.address) score += 10;
    if (data.amenities) score += 10;
    if (data.propertyProfile) score += 20;
    if (data.price) score += 10;
    if (data.propertySubtype) score += 20;
    if (description) score += 10;
    return score;
  };

  const handleSubmit = async (status) => {
    if (status === 'published' && !validateForm()) {
      setError('Please fill all mandatory fields');
      return;
    }
  const clientData=localStorage.getItem("adminClientData");
  const clientId=clientData?.id;
    setLoading(true);
    setError('');
    setValidationErrors({});
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
    
      const clientToken = localStorage.getItem('token');
      if (!clientToken) throw new Error("Unauthorized: No token found");
    
      const propertyDataToSave = {
        ...data,
        projectName: projectName || null,
        description: description || null,
        privateNotes: privateNotes || null,
        approvedBy: approvedBy || null,
        amenities: amenities || [],
        isProject
      };
    
      let response;
    
      if (isEditMode && data?.id) {
        // 🟢 Update existing property
        response = await ApiService.put(
          `/properties/${data.id}`,
          propertyDataToSave,
          {
            headers: {
              Authorization: `Bearer ${clientToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // 🟢 Add new property
        propertyDataToSave.clientId = clientId;
        response = await ApiService.post(
          '/properties/admin-property',
          propertyDataToSave,
          {
            headers: {
              Authorization: `Bearer ${clientToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    
      if (response || response.success) {
        console.log('✅ Property saved:', response);
        setSuccess(true);
        updateData(response.data || propertyDataToSave);
        navigate('./properties');
      } else {
        throw new Error(response?.message || 'Something went wrong while saving the property.');
      }
    } catch (err) {
      console.error('❌ Property save failed:', err);
      setError(err.message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }    
  };
  
  const isPublishDisabled = loading || !description;

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-blue-900 mb-2">
          Amenities and Other Details
        </h2>
        <p className="font-roboto text-gray-600">
          Set your amenities and add additional details
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-roboto text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-lg shadow-lg font-roboto z-50">
          🎉 Property saved successfully!
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Description */}
        <div>
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
          {!isProject?"Property":"Project"} Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your property..."
            rows="5"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-roboto resize-none ${
              validationErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.description && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
          )}
        </div>

        {/* Private Notes */}
        <div>
          <label className="block font-roboto text-sm font-medium text-gray-700 mb-2">
            Private Notes
          </label>
          <textarea
            value={privateNotes}
            onChange={(e) => setPrivateNotes(e.target.value)}
            placeholder="Enter private notes (visible only to owner)"
            rows="3"
            className="w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-roboto resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Private notes are only visible to owner. They won't appear on the frontend.
          </p>
        </div>
      </div>

      {/* Conditional: Approved By & Amenities */}
      {(data.propertySubtype === 'Flat/Apartment' || data.propertySubtype === 'Plot'|| data.propertySubtype==='Independent House / Villa') && (
        <div className="space-y-6 mt-8">
          {/* Approved By */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-blue-900 mb-3">Approved By</h3>
            <div className="flex flex-wrap gap-3">
              {approvedOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleApprovedChange(opt)}
                  className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                    approvedBy.includes(opt)
                      ? 'bg-blue-900 border-blue-900 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-blue-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesOptions.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenitiesChange(amenity)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Property Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-10">
        <h3 className="font-serif text-lg font-bold text-blue-900 mb-4">{!isProject?"Property":"Project"} Summary</h3>
        <div className="grid grid-cols-2 gap-4 font-roboto text-sm">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 font-medium text-gray-900">{data.propertySubtype}</span>
          </div>
          <div>
            <span className="text-gray-600">Location:</span>
            <span className="ml-2 font-medium text-gray-900">{data.city}</span>
          </div>

          {(data.propertySubtype === 'Plot' || data.propertySubtype === 'Flat/Apartment') && (
            <>
              <div>
                <span className="text-gray-600">Approved By:</span>
                <span className="ml-2 font-medium text-gray-900">{approvedBy || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Amenities:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {amenities.join(', ') || 'N/A'}
                </span>
              </div>
            </>
          )}

          <div>
            <span className="text-gray-600">Property Score:</span>
            <span className="ml-2 font-medium text-orange-500">{success ? 100 : calculateScore()}%</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => handleSubmit('published')}
          disabled={isPublishDisabled}
          className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-roboto font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publishing...' : isEditMode ? 'Update Property' : 'Publish Property'}
        </button>
      </div>

      {/* Mandatory fields note */}
      <div className="text-xs text-gray-500 text-center mt-4">
        <span className="text-red-500">*</span> indicates mandatory fields
      </div>
    </div>
  );
};

export default PricingOthers;
