import { useState, useEffect } from "react";
import { Plus, X, Video, MapPin, Upload, Edit, Trash2, Check, AlertCircle, Save } from "lucide-react";
import ApiService from "../hooks/ApiService";

const API_BASE = "http://localhost:3000/api";

const ContentManager = () => {
  const [videos, setVideos] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [isActivCityeModal, setIsActivCityeModal] = useState(false);
  const [isDeleteCityModel, setIsDeleteCityModel] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [editId, setEditId] = useState(null);
  const [commercialAds, setCommercialAds] = useState("");
  const [loading, setLoading] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [localityInput, setLocalityInput] = useState("");
  const [editLocalityInput, setEditLocalityInput] = useState("");
  const [editingLocalityIndex, setEditingLocalityIndex] = useState(null);
  const [editingLocalityValue, setEditingLocalityValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    youtubeLink: "",
    videoFile: null,
    videoFileName: "",
    photo: "",
    status: "inactive",
  });

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoForm({ ...videoForm, [name]: value });
  };

  // Handle file upload (optional)
  const handleVideoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const videoData = new FormData();
    videoData.append("video", file);

    const adminToken = localStorage.getItem("token");

    try {
      setUploading(true);
      setUploadProgress(0);

      const res = await ApiService.post("/images/uploadVideo", videoData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      if (res) {
        setVideoForm({
          ...videoForm,
          photo: res.url || res.data?.url || "",
          videoFileName: file.name,
        });
      }
    } catch (err) {
      console.error("Video upload error:", err);
      setErrorMessage("Failed to upload video.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle submit (Add / Edit)
  const handleVideoSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", videoForm.title);
      formData.append("description", videoForm.description);
      formData.append("photo", videoForm.youtubeLink || videoForm.videoFileName);
      formData.append("status", "inactive");

      const adminToken = localStorage.getItem('token');
      if (editId) {
        // Update existing ad
        await ApiService.put(`commercialAds/${editId}`, {
          name: videoForm.title,
          description: videoForm.description,
          photo: videoForm.youtubeLink || videoForm.photo,
        }, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });
        setSuccessMessage("Video updated successfully!");
      } else {
        // Create new ad
        await ApiService.post('/commercialAds', {
          name: videoForm.title,
          description: videoForm.description,
          photo: videoForm.youtubeLink || videoForm.photo,
          status: "inactive",
        }, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });
        setSuccessMessage("Video added successfully!");
      }

      setTimeout(() => setSuccessMessage(""), 3000);
      resetForms();
      setActiveModal("");
      fetchVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      setErrorMessage("Failed to save video. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Handle edit
  const editVideo = (id) => {
    const v = videos.find((item) => item.id === id);
    if (!v) return;
    setEditId(id);
    setVideoForm({
      title: v.name,
      description: v.description,
      youtubeLink: v.photo?.startsWith("http") ? v.photo : "",
      videoFileName: v.photo || "",
      status: v.status,
    });
    setActiveModal("video");
  };

  const [cityForm, setCityForm] = useState({
    city: "",
    locality: [], // Changed to array to support multiple localities
  });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await ApiService.get("/commercialAds");
      setVideos(res);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 🔹 Load all data from APIs on mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Delete ad
  const deleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await ApiService.delete(`/commercialAds/${id}`);
      setSuccessMessage("Video deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      setErrorMessage("Failed to delete video.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Activate ad (set status active)
  const activateVideo = async (id) => {
    try {
      await ApiService.put(`/commercialAds/${id}/status`, {
        status: "active",
      });
      setSuccessMessage("Video activated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchVideos();
    } catch (error) {
      console.error("Error activating video:", error);
      setErrorMessage("Failed to activate video.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // 🔹 Fetch all city data
  const fetchCities = async () => {
    try {
      const adminToken = localStorage.getItem('token');
      const res = await ApiService.get('/city', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      setLocations(res || []);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  // Reset all forms
  const resetForms = () => {
    setVideoForm({
      title: "",
      description: "",
      videoUrl: "",
      videoFileName: "",
      youtubeLink: "",
    });
    setCityForm({ city: "", locality: [] });
    setEditId(null);
    setLocalityInput("");
    setEditLocalityInput("");
    setEditingLocalityIndex(null);
    setEditingLocalityValue("");
  };

  // 🔹 Handle City form change
  const handleCityChange = (e) => {
    const { name, value } = e.target;
    setCityForm({ ...cityForm, [name]: value });
  };

  // 🔹 Add locality to the array (for add modal)
  const addLocality = () => {
    if (localityInput.trim()) {
      setCityForm({
        ...cityForm,
        locality: [...cityForm.locality, localityInput.trim()]
      });
      setLocalityInput("");
    }
  };

  // 🔹 Add locality to edit array
  const addEditLocality = () => {
    if (editLocalityInput.trim()) {
      setCityForm({
        ...cityForm,
        locality: [...cityForm.locality, editLocalityInput.trim()]
      });
      setEditLocalityInput("");
    }
  };

  // 🔹 Start editing a locality
  const startEditingLocality = (index) => {
    setEditingLocalityIndex(index);
    setEditingLocalityValue(cityForm.locality[index]);
  };

  // 🔹 Save edited locality
  const saveEditedLocality = (index) => {
    if (editingLocalityValue.trim()) {
      const updatedLocalities = [...cityForm.locality];
      updatedLocalities[index] = editingLocalityValue.trim();
      setCityForm({
        ...cityForm,
        locality: updatedLocalities
      });
      setEditingLocalityIndex(null);
      setEditingLocalityValue("");
    } else {
      setErrorMessage("Locality name cannot be empty");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // 🔹 Cancel editing
  const cancelEditing = () => {
    setEditingLocalityIndex(null);
    setEditingLocalityValue("");
  };

  // 🔹 Remove locality from array
  const removeLocality = (indexToRemove) => {
    setCityForm({
      ...cityForm,
      locality: cityForm.locality.filter((_, index) => index !== indexToRemove)
    });
  };

  // 🔹 Submit City form (POST)
  const handleCitySubmit = async (e) => {
    e.preventDefault();
    if (cityForm.locality.length === 0) {
      setErrorMessage("Please add at least one locality");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    try {
      const adminToken = localStorage.getItem('token');
      const payload = {
        city: cityForm.city,
        locality: cityForm.locality
      };
      
      await ApiService.post(`/city`, payload, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      
      setSuccessMessage("City added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchCities(); // refresh list
      resetForms();
      setActiveModal("");
    } catch (error) {
      console.error("Error saving city:", error);
      setErrorMessage("Failed to save city. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditCitySubmit = async (e) => {
    e.preventDefault();
    if (cityForm.locality.length === 0) {
      setErrorMessage("Please add at least one locality");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const payload = {
      city: cityForm.city,
      id: editId,
      locality: cityForm.locality
    };
    
    try {
      const adminToken = localStorage.getItem('token');
      await ApiService.put(`/city`, payload, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      
      setSuccessMessage("City updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsActivCityeModal(false);
      await fetchCities(); // refresh list
      resetForms();
      setActiveModal("");
    } catch (error) {
      console.error("Error saving city:", error);
      setErrorMessage("Failed to update city. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // 🔹 Delete location
  const deleteLocation = async (id) => {
    try {
      const adminToken = localStorage.getItem('token');
      await ApiService.delete(`/city/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
      
      setSuccessMessage("City deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchCities();
    } catch (error) {
      console.error("Error deleting city:", error);
      setErrorMessage("Failed to delete city. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // 🔹 Edit City (populate form)
  const editLocation = (id) => {
    const loc = locations.find((l) => l.id === id);
    if (loc) {
      // Handle both array and string locality formats
      const localityArray = Array.isArray(loc.locality) 
        ? loc.locality 
        : loc.locality ? [loc.locality] : [];
      
      setCityForm({ 
        city: loc.city, 
        locality: [...localityArray] 
      });
      setEditId(loc.id);
      setEditLocalityInput("");
      setEditingLocalityIndex(null);
      setIsActivCityeModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Video className="w-8 h-8 text-blue-600" />
              Content Manager
            </h1>
            <p className="text-slate-600 mt-1">
              Manage Commercial Videos and City Information
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("video")}
              className={`${activeTab === "video"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                } px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium transition-all duration-200`}
            >
              <Video className="w-5 h-5" /> Video
            </button>
            <button
              onClick={() => setActiveTab("city")}
              className={`${activeTab === "city"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
                } px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium transition-all duration-200`}
            >
              <MapPin className="w-5 h-5" /> City
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Video Section */}
        {activeTab === "video" && (
          <div className="space-y-6">
            {/* Add Video Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetForms();
                  setActiveModal("video");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium transition-all duration-200"
              >
                <Plus className="w-5 h-5" /> Add Video
              </button>
            </div>

            {/* Video List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-slate-800 text-white px-6 py-4 text-lg font-semibold">
                Post Video List
              </div>

              {loading ? (
                <div className="text-center py-6 text-slate-500">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {videos?.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-6 text-slate-500">
                            No ads found.
                          </td>
                        </tr>
                      ) : (
                        videos?.map((v, i) => (
                          <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3">{i + 1}</td>
                            <td className="px-6 py-3 font-medium">{v.name}</td>
                            <td className="px-6 py-3 text-slate-600">
                              {v.description || "—"}
                            </td>
                            <td className="px-6 py-3">
                              <span
                                className={`px-2 py-1 text-sm rounded-full ${v.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                {v.status}
                              </span>
                            </td>
                            <td className="px-6 py-3 flex gap-2">
                              <button
                                onClick={() => editVideo(v.id)}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteVideo(v.id)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <X className="w-4 h-4" />
                              </button>

                              {v.status !== "active" && (
                                <button
                                  onClick={() => activateVideo(v.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                                >
                                  Activate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* City Section */}
        {activeTab === "city" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetForms();
                  setActiveModal("city");
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium transition-all duration-200"
              >
                <Plus className="w-5 h-5" /> Add City
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-slate-800 text-white px-6 py-4 text-lg font-semibold">
                City List
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">#</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">City</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Localities</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {locations?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-slate-500">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      locations?.map((l, i) => (
                        <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3">{i + 1}</td>
                          <td className="px-6 py-3 font-semibold">{l.city}</td>
                          <td className="px-6 py-3 text-slate-700">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(l.locality) 
                                ? l.locality.map((loc, idx) => (
                                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                                      {loc}
                                    </span>
                                  ))
                                : <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">{l.locality}</span>
                              }
                            </div>
                          </td>
                          <td className="px-6 py-3 flex gap-2">
                            <button
                              onClick={() => editLocation(l.id)}
                              className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditId(l.id);
                                setIsDeleteCityModel(true);
                              }}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeModal === "video" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-800">
                {editId ? "Edit Video Post" : "Add Video Post"}
              </h2>
              <button
                onClick={() => setActiveModal("")}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleVideoSubmit} className="p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Title *
                </label>
                <input
                  name="title"
                  value={videoForm.title}
                  onChange={handleVideoChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter video title"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={videoForm.description}
                  onChange={handleVideoChange}
                  rows="3"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Enter video description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-slate-700">
                    YouTube Link (optional)
                  </label>
                  <input
                    name="youtubeLink"
                    value={videoForm.youtubeLink}
                    onChange={(e) =>
                      setVideoForm({
                        ...videoForm,
                        youtubeLink: e.target.value,
                        videoUrl: "",
                        videoFileName: "",
                      })
                    }
                    placeholder="https://youtube.com/..."
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-slate-700">
                    Or Upload Video File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      id="videoFile"
                      onChange={handleVideoFile}
                      className="hidden"
                    />
                    <label
                      htmlFor="videoFile"
                      className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Upload className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-600">
                        {videoForm.videoFileName
                          ? videoForm.videoFileName
                          : "Click to upload video"}
                      </span>
                    </label>
                    {uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal("")}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-medium transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-3 rounded-lg font-medium shadow-lg transition-all ${uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {uploading
                    ? `Uploading ${uploadProgress}%`
                    : editId
                      ? "Update Video"
                      : "Add Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* City Modal - Add New City */}
      {activeModal === "city" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-800">
                Add New City
              </h2>
              <button
                onClick={() => {
                  setActiveModal("");
                  resetForms();
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCitySubmit} className="p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  City Name *
                </label>
                <input
                  name="city"
                  value={cityForm.city}
                  onChange={handleCityChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="Enter city name"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Localities *
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={localityInput}
                    onChange={(e) => setLocalityInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocality();
                      }
                    }}
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Enter locality name and press Enter or click Add"
                  />
                  <button
                    type="button"
                    onClick={addLocality}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium"
                  >
                    <Plus className="w-5 h-5" /> Add
                  </button>
                </div>
                
                {/* Localities List */}
                {cityForm.locality.length > 0 && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <p className="text-sm text-slate-600 mb-3">Added Localities:</p>
                    <div className="flex flex-wrap gap-2">
                      {cityForm.locality.map((loc, index) => (
                        <div
                          key={index}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                          <span className="text-slate-700">{loc}</span>
                          <button
                            type="button"
                            onClick={() => removeLocality(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Remove locality"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cityForm.locality.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">Please add at least one locality</p>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal("");
                    resetForms();
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium shadow-lg transition-all"
                >
                  Add City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit City Modal - With Inline Editing for Localities */}
      {isActivCityeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Edit City & Localities
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Update city name and manage localities
                </p>
              </div>
              <button
                onClick={() => {
                  setIsActivCityeModal(false);
                  resetForms();
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditCitySubmit} className="p-6 space-y-6">
              {/* City Name Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="block font-semibold mb-2 text-slate-700">
                  City Name *
                </label>
                <input
                  name="city"
                  value={cityForm.city}
                  onChange={handleCityChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white"
                  placeholder="Enter city name"
                />
                <p className="text-xs text-slate-500 mt-1">This is the main city name</p>
              </div>
              
              {/* Localities Section */}
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Localities *
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  {/* Add New Locality Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={editLocalityInput}
                      onChange={(e) => setEditLocalityInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addEditLocality();
                        }
                      }}
                      className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white"
                      placeholder="Enter new locality name"
                    />
                    <button
                      type="button"
                      onClick={addEditLocality}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium"
                    >
                      <Plus className="w-5 h-5" /> Add Locality
                    </button>
                  </div>
                  
                  {/* Existing Localities List with Edit/Delete Options */}
                  {cityForm.locality.length > 0 ? (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Current Localities ({cityForm.locality.length}):
                      </p>
                      <div className="space-y-2">
                        {cityForm.locality.map((loc, index) => (
                          <div
                            key={index}
                            className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all"
                          >
                            {editingLocalityIndex === index ? (
                              // Edit Mode
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editingLocalityValue}
                                  onChange={(e) => setEditingLocalityValue(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      saveEditedLocality(index);
                                    }
                                  }}
                                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => saveEditedLocality(index)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                  title="Save"
                                >
                                  <Save className="w-4 h-4" /> Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditing}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" /> Cancel
                                </button>
                              </div>
                            ) : (
                              // View Mode
                              <div className="flex items-center justify-between">
                                <span className="text-slate-700 flex-1">{loc}</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditingLocality(index)}
                                    className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                                    title="Edit locality"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeLocality(index)}
                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                    title="Delete locality"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-slate-200">
                      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                      <p className="text-amber-600 font-medium">No localities added</p>
                      <p className="text-sm text-slate-500 mt-1">Please add at least one locality above</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsActivCityeModal(false);
                    resetForms();
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cityForm.locality.length === 0}
                  className={`flex-1 py-3 rounded-lg font-medium shadow-lg transition-all ${
                    cityForm.locality.length === 0
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Update City
                </button>
              </div>
              
              {/* Info Message */}
              {cityForm.locality.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    You have {cityForm.locality.length} locality(ies) for this city. Click the edit icon to modify or trash icon to delete.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteCityModel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setIsDeleteCityModel(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl transition-colors"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Delete City & Localities
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete this city and all its localities? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteCityModel(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteLocation(editId);
                  setIsDeleteCityModel(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;