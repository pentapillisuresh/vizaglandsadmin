import { useState, useEffect } from "react";
import { Plus, X, Video, MapPin, Upload, Edit } from "lucide-react";
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
      alert("Failed to upload video.");
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

      // If you have a backend route for file upload, include videoForm.videoFile here
      // formData.append("file", videoForm.videoFile);
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

      }

      resetForms();
      setActiveModal("");
      fetchVideos();
    } catch (error) {
      console.error("Error saving video:", error);
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
    locality: "",
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
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  // Activate ad (set status active)
  const activateVideo = async (id) => {
    try {
      await ApiService.put(`/commercialAds/${id}/status`, {
        status: "active",
      });
      fetchVideos();
    } catch (error) {
      console.error("Error activating video:", error);
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
    setCityForm({ city: "", village: "" });
    setEditId(null);
  };

  // 🔹 Handle City form change
  const handleCityChange = (e) => {
    const { name, value } = e.target;
    setCityForm({ ...cityForm, [name]: value });
  };

  // 🔹 Submit City form (POST)
  const handleCitySubmit = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('token');
      const res = await ApiService.post(`/city`, cityForm, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      await fetchCities(); // refresh list
      resetForms();
      setActiveModal("");
    } catch (error) {
      console.error("Error saving city:", error);
      alert("Failed to save city. Check console for details.");
    }
  };

  const handleEditCitySubmit = async (e) => {
    const payload = {
      city: cityForm.city,
      id: editId,
      locality: cityForm.locality
    }
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('token');
      const res = await ApiService.put(`/city`, payload, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      setIsActivCityeModal(false)
      await fetchCities(); // refresh list
      resetForms();
      setActiveModal("");
    } catch (error) {
      console.error("Error saving city:", error);
      alert("Failed to save city. Check console for details.");
    }
  };

  // 🔹 Delete location (just UI-level since no DELETE API provided)
  const deleteLocation = async (id) => {
    console.log("Deleting city with ID:", id);

    try {
      const adminToken = localStorage.getItem('token');

      const res = await ApiService.delete(`/city/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response:", res);

      // Refresh the city list after successful deletion
      await fetchCities();

      // Optionally close modal or show a success message
      // setIsDeleteCityModel(false);

    } catch (error) {
      console.error("Error deleting city:", error);
      alert("Failed to delete city. Check console for details.");
    }
  };

  // 🔹 Edit City (populate form)
  const editLocation = (id) => {
    const loc = locations.find((l) => l.id === id);
    if (loc) {
      setCityForm({ city: loc.city, locality: loc.locality });
      setEditId(loc.id);
      setIsActivCityeModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
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
                } px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium`}
            >
              <Video className="w-5 h-5" /> Video
            </button>
            <button
              onClick={() => setActiveTab("city")}
              className={`${activeTab === "city"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
                } px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium`}
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium"
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
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {videos?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-slate-500">
                          No ads found.
                        </td>
                      </tr>
                    ) : (
                      videos?.map((v, i) => (
                        <tr key={v.id} className="hover:bg-slate-50">
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
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteVideo(v.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            {v.status !== "active" && (
                              <button
                                onClick={() => activateVideo(v.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
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
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" /> Add City
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-slate-800 text-white px-6 py-4 text-lg font-semibold">
                City List
              </div>
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">City</th>
                    <th className="px-6 py-3 text-left">Localities</th>
                    <th className="px-6 py-3 text-left">Action</th>
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
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3">{i + 1}</td>
                        <td className="px-6 py-3 font-semibold">{l.city}</td>
                        <td className="px-6 py-3 text-slate-700">
                          {Array.isArray(l.locality)
                            ? l.locality.join(", ")
                            : l.locality}
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            onClick={() => editLocation(l.id)}
                            className="text-green-600 hover:bg-green-50 p-2 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditId(l.id)
                              setIsDeleteCityModel(true)
                            }}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
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
        )}
      </div>

      {/* Video Modal */}
      {activeModal === "video" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editId ? "Edit Video Post" : "Add Video Post"}
              </h2>
              <button
                onClick={() => setActiveModal("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleVideoSubmit} className="p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Title
                </label>
                <input
                  name="title"
                  value={videoForm.title}
                  onChange={handleVideoChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={videoForm.description}
                  onChange={handleVideoChange}
                  rows="3"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
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
                      className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50"
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
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-medium"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-3 rounded-lg font-medium shadow-lg ${uploading
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

      {/* City Modal */}
      {activeModal === "city" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editId ? "Add Locality to City" : "Add City"}
              </h2>
              <button
                onClick={() => setActiveModal("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCitySubmit} className="p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  City Name
                </label>
                <input
                  name="city"
                  value={cityForm.city}
                  onChange={handleCityChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Locality
                </label>
                <input
                  name="locality"
                  value={cityForm.locality}
                  onChange={handleCityChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal("")}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium shadow-lg"
                >
                  {editId ? "Add Locality" : "Add City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isActivCityeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-bold text-slate-800">
                Edit City or Locality
              </h2>
              <button
                onClick={() => setIsActivCityeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditCitySubmit} className="p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  City Name
                </label>
                <input
                  name="city"
                  value={cityForm.city}
                  onChange={handleCityChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-slate-700">
                  Locality
                </label>
                <input
                  name="locality"
                  value={cityForm.locality}
                  onChange={handleCityChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsActivCityeModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium shadow-lg"
                >
                  Edit City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteCityModel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
            {/* Close button (top-right corner) */}
            <button
              onClick={() => setIsDeleteCityModel(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete City & Localities
            </h2>

            {/* Message */}
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this city and its localities?
            </p>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteCityModel(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteLocation(editId);
                  setIsDeleteCityModel(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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
