import { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import BasicDetails from '../components/property-steps/BasicDetails';
import LocationDetails from '../components/property-steps/LocationDetails';
import PropertyProfile from '../components/property-steps/PropertyProfile';
import PhotosVideos from '../components/property-steps/PhotosVideos';
import PricingOthers from '../components/property-steps/PricingOthers';

const PostProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Detect edit mode and get listing data
  const listing = location.state?.listing || null;
  const isEditMode = Boolean(listing);
  // ✅ Updated structure to match backend model
  const [propertyData, setPropertyData] = useState({
    categoryId: '',
    propertyName: '',
    title: '',
    description: '',
    marketType: 'sale', // sale, rent, lease
    propertyKind: 'residential', // residential or commercial
    catType: 'Residential',
    price: '',
    photos: [],
    videos: "",
    audio: "",
    availableStatus:'Ready to Move',
    ageOfProperty:'',
    youtubeUrl: '',
    approvedBy:'',
    amenities: [],
    // ✅ Address nested object
    address: {
      city: '',
      locality: '',
      subLocality: '',
      apartmentDoorNo: '',
      near_by: [],
      road_facing: '',
      lat: '',
      lon: '',
    },
    // ✅ Property profile nested object
    propertyProfile: {
      type: "",
      bedrooms: 0,
      units:0,
      landArea: 0,
      plotArea: 0,
      poojaRooms: 0,
      bathrooms: 0,
      length: 0,
      breath: 0,
      balconies: 0,
      roadFacing: 0,
      plotAvailable: 0,
      facing: "East",
      carpetArea: "",
      isParkingAvailable: false,
      parkingType: "",
      status: "",
      areaUnit: "sqft",
      buildArea: "",
      superBuildArea: "",
      shopNumber: "",
      frontage: "",
      roadWidth: "",
      pantryAvailable: false,
      washroomAvailable: false,
      cornerShop: false,
      powerBackup: false,
      waterSupply: "24x7",
      officeNumber: "",
      floorNumber: "",
      totalFloors: "",
      workstations: 0,
      cabins: 0,
      conferenceRooms: 0,
      furnishedStatus: "furnished",
      acAvailable: false,
      liftAvailable: false,
      parkingSpaces: 0,
      securityAvailable: false
  },
  });
  // ✅ If editing, prefill property data
  useEffect(() => {
    if (isEditMode && listing) {
      setPropertyData((prev) => ({
        ...prev,
        ...listing,
        address: {
          ...prev.address,
          ...listing.address,
        },
        propertyProfile: {
          ...prev.propertyProfile,
          ...listing.profile,
        },
      }));
    }
  }, [isEditMode, listing]);

  const steps = [
    { number: 1, title: 'Basic Details', subtitle: 'Step 1' },
    { number: 2, title: 'Location Details', subtitle: 'Step 2' },
    { number: 3, title: 'Property Profile', subtitle: 'Step 3' },
    { number: 4, title: 'Photos, Videos & Voice-over', subtitle: 'Step 4' },
    { number: 5, title: 'Amenities', subtitle: 'Step 5' },
  ];

  // ✅ Update function to merge step data
  // const updatePropertyData = (data) => {
  //   setPropertyData((prev) => {
  //     const updated = { ...prev, ...data };
  //     return updated;
  //   });
  //   console.log('Updated propertyData:', { ...propertyData, ...data });
  // };

  // ✅ Merge partial updates from child components
  const updatePropertyData = (data) => {
    setPropertyData((prev) => ({
      ...prev,
      ...data,
      address: {
        ...prev.address,
        ...(data.address || {}),
      },
      propertyProfile: {
        ...prev.propertyProfile,
        ...(data.propertyProfile || {}),
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  // ✅ Property completeness score
  const calculateScore = () => {
    const p = propertyData;
    let score = 0;
    if (p.propertyName) score += 10;
    if (p.title) score += 10;
    if (p.description) score += 8;
    if (p.marketType) score += 8;
    if (p.propertyKind) score += 8;
    if (p.price) score += 10;
    if (p.address.city) score += 10;
    if (p.address.locality) score += 10;
    if (p.propertyProfile.type) score += 8;
    if (p.photos) score += 8;
    return Math.min(score, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <StepIndicator steps={steps} currentStep={currentStep} />

            {/* Property Score */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#f97316"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(calculateScore() / 100) * 226} 226`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-lg text-blue-900">{calculateScore()}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-blue-900">Property Score</h3>
                  <p className="font-roboto text-sm text-gray-600">
                    Better your property score, greater your visibility
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-900 mb-6 font-roboto"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {currentStep === 1 && (
              <BasicDetails data={propertyData} updateData={updatePropertyData} onNext={handleNext} isEditMode={isEditMode} />
            )}
            {currentStep === 2 && (
              <LocationDetails data={propertyData} updateData={updatePropertyData} onNext={handleNext} isEditMode={isEditMode} />
            )}
            {currentStep === 3 && (
              <PropertyProfile data={propertyData} updateData={updatePropertyData} onNext={handleNext} isEditMode={isEditMode} />
            )}
            {currentStep === 4 && (
              <PhotosVideos data={propertyData} updateData={updatePropertyData} onNext={handleNext} isEditMode={isEditMode}/>
            )}
            {currentStep === 5 && <PricingOthers data={propertyData} updateData={updatePropertyData} isEditMode={isEditMode} />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostProperty;
