'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import BasicDetails from '../components/property-steps/BasicDetails';
import LocationDetails from '../components/property-steps/LocationDetails';
import PropertyProfile from '../components/property-steps/PropertyProfile';
import PhotosVideos from '../components/property-steps/PhotosVideos';
import PricingOthers from '../components/property-steps/PricingOthers';
import ApiService from '../hooks/ApiService';

export default function PostProperty() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  // Get listing data from URL query params (for edit mode)
  const searchParams = new URLSearchParams(location.search);
  const listingParam = searchParams.get('edit');
  const { listing, mode, isProject = false } = location.state || {};
  
  const isEditMode = Boolean(listingParam);

  // State to track visited steps
  const [visitedSteps, setVisitedSteps] = useState([1]);

  const steps = [
    { number: 1, title: 'Basic Details', subtitle: 'Step 1' },
    { number: 2, title: 'Location Details', subtitle: 'Step 2' },
    { number: 3, title: 'Property Profile', subtitle: 'Step 3' },
    { number: 4, title: 'Photos, Videos & Voice-over', subtitle: 'Step 4' },
    { number: 5, title: 'Amenities', subtitle: 'Step 5' },
  ];

  const [propertyData, setPropertyData] = useState({
    categoryId: '',
    categoryName:'',
    propertyName: '',
    title: '',
    description: '', 
    propertySubtype: '',
    marketType: 'sale',
    propertyKind: 'residential',
    catType: 'Residential',
    price: '',
    photos: [],
    videos: "",
    audio: "",
    availableStatus: 'Ready to Move',
    ageOfProperty: '',
    youtubeUrl: '',
    approvedBy: '',
    amenities: [],
    privateNotes: '',
    projectName: '',
    metaTitle:'',
    metaDescription:'',
    metaKeywords:'',
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
    propertyProfile: {
      type: "",
      bedrooms: 0,
      units: 0,
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
      carpetArea: 0,
      closedParking: 0,
      openParking: 0,
      parkingType: "",
      status: "",
      areaUnit: "sqft",
      buildArea: 0,
      superBuildArea: 0,
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

  const fetchPropertyById = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get(`/properties/${listingParam}`);
      if (response?.property) {
        const property = response.property;

        setPropertyData((prev) => ({
          ...prev,
          // Main Property Details
          categoryId: property.categoryId || "",
          id:listingParam,
          categoryName: property.category.name || "",
          propertySubtype: property.category?.name || "",
          catType: property.category.catType || "",
          propertyKind: property.category?.catType || "",
          propertyName: property.propertyName || "",
          title: property.title || "",
          description: property.description || "",
          marketType: property.marketType || "sale",
          price: property.price || "",
          approvedBy: property.approvedBy || "",
          availableStatus: property.availableStatus || "Ready to Move",
          ageOfProperty: property.ageOfProperty || "",
          youtubeUrl: property.youtubeUrl || "",
          amenities: property.amenities || [],
          metaTitle:property.metaTitle,
          metaDescription:property.metaDescription,
          metaKeywords:property.metaKeywords,
          privateNotes:property.privateNote,
                // Media
          photos: property.photos
            ? property.photos
            : [],
          videos: property.videos || "",
          audio: property.audio || "",
  
          // Address
          address: {
            ...prev.address,
            city: property.address?.city || "",
            locality: property.address?.locality || "",
            subLocality: property.address?.subLocality || "",
            apartmentDoorNo:
              property.address?.apartmentDoorNo || "",
            near_by: property.address?.near_by || [],
            road_facing:
              property.address?.road_facing || "",
            lat: property.address?.lat || "",
            lon: property.address?.lon || "",
          },
  
          // Property Profile
          propertyProfile: {
            ...prev.propertyProfile,
            ...property.profile,
  
            type: property.profile?.type || "",
            bedrooms: property.profile?.bedrooms || 0,
            units: property.profile?.units || 0,
            landArea: Number(property.profile?.landArea) || 0,
            plotArea: Number(property.profile?.plotArea) || 0,
            bathrooms: property.profile?.bathrooms || 0,
            length: Number(property.profile?.length) || 0,
            breath: Number(property.profile?.breath) || 0,
            balconies: property.profile?.balconies || 0,
            roadFacing:
              Number(property.profile?.roadFacing) || 0,
            plotAvailable:
              property.profile?.plotAvailable || 0,
            facing: property.profile?.facing || "East",
            carpetArea:
              Number(property.profile?.carpetArea) || 0,
            closedParking:
              property.profile?.closedParking || 0,
            openParking:
              property.profile?.openParking || 0,
            parkingType:
              property.profile?.parkingType || "",
            areaUnit:
              property.profile?.areaUnit || "sqft",
            buildArea:
              Number(property.profile?.buildArea) || 0,
            superBuildArea:
              Number(property.profile?.superBuildArea) || 0,
            shopNumber:
              property.profile?.shopNumber || "",
            frontage:
              property.profile?.frontage || "",
            roadWidth:
              property.profile?.roadWidth || "",
            pantryAvailable:
              property.profile?.pantryAvailable || false,
            washroomAvailable:
              property.profile?.washroomAvailable || false,
            cornerShop:
              property.profile?.cornerShop || false,
            powerBackup:
              property.profile?.powerBackup || false,
            waterSupply:
              property.profile?.waterSupply || "24x7",
            officeNumber:
              property.profile?.officeNumber || "",
            floorNumber:
              property.profile?.floorNumber || "",
            totalFloors:
              property.profile?.totalFloors || "",
            workstations:
              property.profile?.workstations || 0,
            cabins:
              property.profile?.cabins || 0,
            conferenceRooms:
              property.profile?.conferenceRooms || 0,
            furnishedStatus:
              property.profile?.furnishedStatus ||
              "furnished",
            acAvailable:
              property.profile?.acAvailable || false,
            liftAvailable:
              property.profile?.liftAvailable || false,
            parkingSpaces:
              property.profile?.parkingSpaces || 0,
            securityAvailable:
              property.profile?.securityAvailable || false,
          },
        }));

        setVisitedSteps([1, 2, 3, 4, 5]);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        console.error("Property not found:", listingParam);
        navigate("/properties-list");
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      navigate("/properties-list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchPropertyById();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode && !visitedSteps.includes(currentStep)) {
      setVisitedSteps([...visitedSteps, currentStep]);
    }
  }, [currentStep, isEditMode]);

  const handleStepClick = (stepNumber) => {
    let isStepClickable = false;

    if (isEditMode) {
      isStepClickable = true;
    } else {
      isStepClickable = (
        stepNumber <= currentStep ||
        visitedSteps.includes(stepNumber) ||
        stepNumber === currentStep + 1
      );
    }

    if (isStepClickable) {
      setCurrentStep(stepNumber);
      if (!isEditMode && !visitedSteps.includes(stepNumber)) {
        setVisitedSteps([...visitedSteps, stepNumber]);
      }
    }
  };

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
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (!isEditMode && !visitedSteps.includes(nextStep)) {
        setVisitedSteps([...visitedSteps, nextStep]);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const calculateScore = () => {
    const p = propertyData;
    let score = 0;
    if (p.propertyName) score += 10;
    if (p.title) score += 10;
    if (p.description) score += 20;
    if (p.marketType) score += 10;
    if (p.price) score += 30;
    if (p.address.city) score += 10;
    if (p.metaTitle) score += 3;
    if (p.metaDescription) score += 3;
    if (p.metaKeywords) score += 4;
    return Math.min(score, 100);
  };

  useEffect(() => {
    if (!isEditMode && propertyData.description && propertyData.description.trim().length >= 10) {
      if (!visitedSteps.includes(5)) {
        setVisitedSteps(prev => [...prev, 5]);
      }
    }
  }, [propertyData.description, isEditMode, visitedSteps]);

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
            <StepIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              visitedSteps={visitedSteps}
              isEditMode={isEditMode}
            />

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
                      strokeDasharray={`${(calculateScore() / 100) * 250} 250`}
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
              <BasicDetails
                data={propertyData}
                updateData={updatePropertyData}
                onNext={handleNext}
                isEditMode={isEditMode}
                isProject={isProject}
              />
            )}
            {currentStep === 2 && (
              <LocationDetails
                data={propertyData}
                updateData={updatePropertyData}
                onNext={handleNext}
                isEditMode={isEditMode}
                isProject={isProject}
              />
            )}
            {currentStep === 3 && (
              <PropertyProfile
                data={propertyData}
                updateData={updatePropertyData}
                onNext={handleNext}
                isProject={isProject}
              />
            )}
            {currentStep === 4 && (
              <PhotosVideos
                data={propertyData}
                updateData={updatePropertyData}
                onNext={handleNext}
                isEditMode={isEditMode}
                isProject={isProject}
              />
            )}
            {currentStep === 5 && (
              <PricingOthers
                data={propertyData}
                updateData={updatePropertyData}
                isEditMode={isEditMode}
                isProject={isProject}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}