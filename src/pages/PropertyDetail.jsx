import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Home, Compass, Share2, Bed, Bath, Maximize,
  Building, MapPin, CheckCircle, Phone, Mail, Calendar, ChevronDown, ChevronUp,
  Monitor, DoorClosed, Presentation, Heart,ChevronLeft, ChevronRight
} from "lucide-react";
import ApiService from "../hooks/ApiService";
import AOS from "aos";
import PropertyMap from "../components/PropertyMap";
import getPhotoSrc from "../hooks/getPhotos";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Social Media Icons
const SocialIcons = {
  whatsapp: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg",
  facebook: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg",
  twitter: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg",
  linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
  telegram: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg",
  email: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg",
  share: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/share-2.svg"
};

function PropertyDetail() {
  const swiperRef = useRef(null);
  const { title } = useParams(); // Changed from id to title
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [page, setPage] = useState(1);
  const fromUser = location.state?.from || null;
  const [similarProperties, setSimilarProperties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Favorites functionality
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const isFavorite = (id) => favorites.some(item => item.id === id);

  const toggleFavorite = (listing) => {
    let updatedFavs = [...favorites];

    const exists = updatedFavs.find(item => item.id === listing.id);

    if (exists) {
      updatedFavs = updatedFavs.filter(item => item.id !== listing.id);
    } else {
      updatedFavs.push(listing);
    }

    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  // Helper function to create URL-friendly title
  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // ✅ Swiper configuration
  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: false,
    pagination: {
      clickable: true,
      dynamicBullets: true
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
    },
  };

  // Share functionality
  const getShareUrl = () => {
    if (property?.title) {
      return `${window.location.origin}/property/${createSlug(property.title)}`;
    }
    return `${window.location.origin}/property/${title}`;
  };

  const getShareMessage = () => {
    return `Check out this amazing property: ${property?.title} - ${formatPrice(property?.price)}`;
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareMessage() + '\n' + getShareUrl())}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareMessage())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(getShareMessage())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = `Check out this property: ${property?.title}`;
    const body = `${getShareMessage()}\n\nView more details: ${getShareUrl()}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: getShareMessage(),
          url: getShareUrl(),
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const payload = {
      propertyId: property.id || null,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      message: formData.message,
      leadType: "callback",
    }
    try {
      const response = await ApiService.post("/leads", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response) {
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
        alert("Thank you for contacting us, our team will contact you very soon ")
        setTimeout(() => {
          setStatus("")
        }, 2000);
      } else {
        setStatus("❌ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // ✅ Get property from navigation state or fetch by title
  useEffect(() => {
    const prop = location.state?.property;
    if (prop) {
      setProperty(prop);
      window.scrollTo(0, 0);
      // Update URL to use title instead of ID if needed
      if (prop.title && window.location.pathname !== `/property/${createSlug(prop.title)}`) {
        navigate(`/property/${createSlug(prop.title)}`, { state: { property: prop, from: fromUser }, replace: true });
      }
    } else if (title) {
      fetchPropertyByTitle();
    }
  }, [location.state, title]);

  const fetchPropertyByTitle = async () => {
    try {
      setLoading(true);
      // Decode the title from URL
      const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ');
      
      // Fetch all properties and find by title
      const response = await ApiService.get(`/properties?limit=100`);
      
      if (response?.properties) {
        const foundProperty = response.properties.find(
          prop => createSlug(prop.title) === title || 
                   prop.title.toLowerCase() === decodedTitle.toLowerCase()
        );
        
        if (foundProperty) {
          setProperty(foundProperty);
          window.scrollTo(0, 0);
        } else {
          console.error("Property not found with title:", title);
          navigate('/properties-list');
        }
      }
    } catch (error) {
      console.error('Error fetching property by title:', error);
      navigate('/properties-list');
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyDetails = async () => {
    try {
      const response = await ApiService.get(`/properties/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Dashboard API Response:", response);

      if (response?.property) {
        const propertyDetails = response.property;
        setProperty(propertyDetails);
      } else {
        console.warn("Unexpected response format:", response);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getpropertyByCategory = async () => {
    const payload = {
      page: page,
      limit: 3,
      categoryId: property?.categoryId,
      marketType: property?.marketType,
    }
    try {
      const response = await ApiService.get('/properties', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Dashboard API Response:", response);

      if (response?.properties) {
        const data = response.properties;
        const rrr = data.filter((item) => item.id !== property?.id)
        setSimilarProperties(data || []);
      } else {
        console.warn("Unexpected response format:", response);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const addViewProperty = async () => {
    try {
      const clientToken = localStorage.getItem("token");
      const response = await ApiService.post(
        `/propertyView`,
        { propertyId: property?.id },
        {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Property view recorded:', response.data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const updateViewCount = async () => {
    try {
      const clientToken = localStorage.getItem("token");
      const response = await ApiService.put(`/properties/updateView/${property?.id}`,
        {
          headers: {
            Authorization: `Bearer ${clientToken}`,
            'Content-Type': 'application/json'
          }
        },
      )
      // if (response) {
      //   navigate('./')
      // } else {
      //   console.log("rrr::", response?.message)
      // }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const userDetails = localStorage.getItem("clientDetails");
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin && property?.id) {
      addViewProperty()
    }
    if (property?.id) {
      setTimeout(() => {
        updateViewCount()
      }, 5000);
    }
  }, [property?.id])

  useEffect(() => {
    if (property) {
      getpropertyByCategory()
    }
  }, [property])

  // ✅ Utility: Format price
  const formatPrice = (price) => {
    if (!price) return "-";
    const num = parseFloat(price);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString()}`;
  };

  // ✅ Description toggle functionality
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // ✅ Function to truncate description
  const getTruncatedDescription = (description, maxLength = 300) => {
    if (!description) return "";
    if (description.length <= maxLength || showFullDescription) {
      return description;
    }
    return description.substring(0, maxLength) + "...";
  };

  // ✅ Simplify access
  const profile = property?.profile || {};
  const address = property?.address || {};
  const category = property?.category || {};
  const client = property?.client || {};

  let galleryImages = [];

  try {
    if (Array.isArray(property?.photos)) {
      galleryImages = property.photos;
    } else if (typeof property?.photos === 'string' && property.photos.startsWith('[')) {
      galleryImages = JSON.parse(property.photos);
    } else if (property?.photos) {
      galleryImages = [property.photos];
    } else {
      galleryImages = [category?.photo];
    }
  } catch (err) {
    console.error('Error parsing photos:', err);
    galleryImages = [category?.photo];
  }

  const safeShow = (val) => val !== null && val !== undefined && val !== "" && val !== 0;

  // ✅ FIXED: Improved back navigation function - Always go to properties-list
  const handleBackToListings = () => {
    navigate(-1);
  };

  // ✅ Handle similar property click with title-based URL
  const handleSimilarPropertyClick = (property) => {
    const slug = createSlug(property.title);
    navigate(`/property/${slug}`, {
      state: {
        property,
        from: fromUser
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <button
            onClick={handleBackToListings}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-[#003366] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* ✅ FIXED: Back Button - Always goes to properties-list */}
          <button
            onClick={handleBackToListings}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Listings
          </button>
          <h2 className="font-semibold text-lg">{category.name || "Property Details"}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Section */}
          <div className="lg:col-span-3">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-900">
                <img
                  src={galleryImages[selectedImage]}
                  alt={property?.title}
                  className="w-full h-full object-cover"
                />
                {/* ❤️ Favorite Button - Added to image gallery */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property);
                  }}
                  className="absolute top-3 right-3 z-20"
                >
                  <Heart
                    className={`w-8 h-8 drop-shadow-md transition ${isFavorite(property?.id)
                      ? "text-red-600 fill-red-600"
                      : "text-white hover:text-red-400"
                    }`}
                  />
                </button>
                {selectedImage > 0 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
                  >
                    <ArrowLeft size={24} className="text-[#003366]" />
                  </button>
                )}
                {selectedImage < galleryImages.length - 1 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
                  >
                    <ArrowRight size={24} className="text-[#003366]" />
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                      ? "border-orange-600 ring-2 ring-orange-200"
                      : "border-gray-300 hover:border-orange-400"
                      }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#003366] mb-2">{property?.title}</h1>
                  <h3 className="text-sm font-bold text-[#003366] mb-2">{property?.propertyName}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} className="text-orange-500" />
                    <span className="text-lg">
                      {address?.locality && `${address?.locality}, `}
                      {address?.city && `${address?.city}`}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {property?.price ? (
                    <div className="text-3xl font-bold text-orange-600">{formatPrice(property?.price)}</div>
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-md transition-all"
                      onClick={() => alert("Contact us for price!")}
                    >
                      Contact Us for Price
                    </button>
                  )}
                </div>
              </div>

              {/* Share Section */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Share this project:</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Share Options */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                      title="Share on WhatsApp"
                    >
                      <img src={SocialIcons.whatsapp} alt="WhatsApp" className="w-5 h-5 filter invert" />
                    </button>

                    <button
                      onClick={shareOnFacebook}
                      className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                      title="Share on Facebook"
                    >
                      <img src={SocialIcons.facebook} alt="Facebook" className="w-5 h-5 filter invert" />
                    </button>

                    <button
                      onClick={shareOnTwitter}
                      className="w-10 h-10 flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full transition-colors"
                      title="Share on Twitter"
                    >
                      <img src={SocialIcons.twitter} alt="Twitter" className="w-5 h-5 filter invert" />
                    </button>

                    <button
                      onClick={shareOnLinkedIn}
                      className="w-10 h-10 flex items-center justify-center bg-blue-800 hover:bg-blue-900 rounded-full transition-colors"
                      title="Share on LinkedIn"
                    >
                      <img src={SocialIcons.linkedin} alt="LinkedIn" className="w-5 h-5 filter invert" />
                    </button>

                    <button
                      onClick={shareOnTelegram}
                      className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                      title="Share on Telegram"
                    >
                      <img src={SocialIcons.telegram} alt="Telegram" className="w-5 h-5 filter invert" />
                    </button>

                    <button
                      onClick={shareViaEmail}
                      className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                      title="Share via Email"
                    >
                      <img src={SocialIcons.email} alt="Email" className="w-5 h-5 filter invert" />
                    </button>

                    <button
                      onClick={shareViaNative}
                      className="w-10 h-10 flex items-center justify-center bg-gray-600 hover:bg-gray-700 rounded-full transition-colors"
                      title="Share"
                    >
                      <img src={SocialIcons.share} alt="Share" className="w-5 h-5 filter invert" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                {category.name === "Plot" || category.name === "Land" || category.name === "Commercial Land" ? (
                  <>
                    {category.name === "Plot" && (
                      safeShow(profile?.plotArea) && (
                        <>
                        <FeatureCard
                          icon={<Maximize size={22} />}
                          label="Plot Area"
                          value={`${profile?.plotArea} ${profile?.areaUnit || "sqft"}`}
                        />
                        <FeatureCard
                            icon={<Maximize size={22} />}
                            label={`Per ${profile?.areaUnit || "sqft"} `}
                            value={
                              profile?.landArea
                                ? Math.round(
                                    parseFloat(property?.price || 0) / parseFloat(profile?.plotArea)
                                  )
                                : 0
                            }                          />
                        </>
                      )
                    )}
                    {category.name === "Land" || category.name === "Commercial Land" && (
                      safeShow(profile?.landArea) && (
                        <>
                          <FeatureCard
                            icon={<Maximize size={22} />}
                            label="Land Area"
                            value={`${profile?.landArea} ${profile?.areaUnit || "sqft"}`}
                          />
                          <FeatureCard
                            icon={<Maximize size={22} />}
                            label={`Per ${profile?.areaUnit || "sqft"} `}
                            value={
                              profile?.landArea
                                ? Math.round(
                                    parseFloat(property?.price || 0) / parseFloat(profile?.landArea)
                                  )
                                : 0
                            }                          />
                        </>
                      )
                    )}
                    {category.name === "Plot" && (
                      safeShow(profile?.facing) && (
                        <FeatureCard
                          icon={<Compass size={22} />}
                          label="Facing"
                          value={profile?.facing}
                        />)
                    )}
                  </>
                ) : (
                  <>
                    {/* Non-plot property fields */}
                    {safeShow(profile?.bedrooms) && (
                      <FeatureCard icon={<Bed size={24} />} label="Bedrooms" value={profile?.bedrooms} />
                    )}

                    {safeShow(profile?.bathrooms) && (
                      <FeatureCard icon={<Bath size={24} />} label="Bathrooms" value={profile?.bathrooms} />
                    )}

                    {safeShow(profile?.carpetArea) && (
                      <FeatureCard
                        icon={<Maximize size={24} />}
                        label="Carpet Area"
                        value={`${profile?.carpetArea} ${profile?.areaUnit || "sqft"}`}
                      />
                    )}
                    {safeShow(profile?.workstations) && (
                      <FeatureCard
                        icon={<Monitor size={24} />}
                        label="Work Station"
                        value={`${profile?.workstations}`}
                      />
                    )}
                    {safeShow(profile?.cabins) && (
                      <FeatureCard
                        icon={<DoorClosed size={24} />}
                        label="Cabin"
                        value={`${profile?.cabins}`}
                      />
                    )}
                    {safeShow(profile?.conferenceRooms) && (
                      <FeatureCard
                        icon={<Presentation size={24} />}
                        label="Meeting Rooms"
                        value={`${profile?.conferenceRooms}`}
                      />
                    )}

                    {safeShow(profile?.status) && (
                      <FeatureCard icon={<Building size={24} />} label="Status" value={profile?.status} />
                    )}
                  </>
                )}
              </div>



              {/* Property Details - Updated Design */}
              <Section title="Property Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {safeShow(category.name) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500 mt-1">Property Type</span>
                        <span className="text-[#003366] font-medium">{category.name}</span>

                      </div>
                    </div>
                  )}
                  {safeShow(address?.locality) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500 mt-1">Locality</span>
                        <span className="text-[#003366] font-medium">{address.locality}</span>

                      </div>
                    </div>
                  )}
                  {safeShow(address?.city) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500 mt-1">City</span>
                        <span className="text-[#003366] font-medium">{address.city}</span>

                      </div>
                    </div>
                  )}
                  {safeShow(profile?.totalFloors) && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle size={20} className="text-orange-600" />
                      <div className="flex-1">
                        <span className="block text-sm text-gray-500 mt-1">Total Floors</span>
                        <span className="text-[#003366] font-medium">{profile.totalFloors}</span>

                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* Nearby Details - Updated Design */}
              {Array.isArray(address?.near_by) && address.near_by.length > 0 && (
                <Section title="Nearby Places">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {address.near_by.map((place, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle size={20} className="text-orange-600" />
                        <div className="flex-1">
                          <span className="text-[#003366] font-medium">{place.info}</span>
                          {place.distance && (
                            <span className="block text-sm text-gray-500 mt-1">{place.distance}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Amenities */}
              {Array.isArray(property?.amenities) && property?.amenities.length > 0 && (
                <Section title="Amenities & Features">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {property?.amenities.map((a, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle size={20} className="text-orange-600" />
                        <span className="text-[#003366] font-medium">{a}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}


              {/* Overview */}
              {safeShow(property?.description) && (
                <Section title="Overview">
                  <div className="text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">
                      {getTruncatedDescription(property?.description)}
                    </p>
                    {property?.description && property.description.length > 300 && (
                      <button
                        onClick={toggleDescription}
                        className="mt-3 flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                      >
                        {showFullDescription ? (
                          <>
                            <ChevronUp size={16} />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            Read More
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </Section>
              )}

              {/* Map Section */}
              <Section title="Location on Map">
                <PropertyMap lat={address?.lat} lon={address?.lon} />
              </Section>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}

/* 🧩 Small Reusable Components */
const FeatureCard = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="flex justify-center mb-2">
      <div className="bg-blue-50 p-3 rounded-full text-[#003366]">{icon}</div>
    </div>
    <div className="text-lg font-bold text-[#003366]">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold text-[#003366] mb-4">{title}</h2>
    {children}
  </div>
);
const Detail = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-[#003366]" style={{ textTransform: 'capitalize' }}>{value}</span>
  </div>
);

const ContactCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
    {icon}
    <div>
      <div className="text-xs text-gray-600">{label}</div>
      <div className="font-bold text-[#003366]">{value}</div>
    </div>
  </div>
);

export default PropertyDetail;