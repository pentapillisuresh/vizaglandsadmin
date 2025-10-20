import { useState, useEffect } from "react";
import { Plus, X, Video, MapPin, Upload, Edit } from "lucide-react";

const ContentManager = () => {
  const [videos, setVideos] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeModal, setActiveModal] = useState(""); // "video" | "city"
  const [activeTab, setActiveTab] = useState("video");
  const [editId, setEditId] = useState(null);

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoFileName: "",
    youtubeLink: "",
  });

  const [cityForm, setCityForm] = useState({
    city: "",
    village: "",
  });

  // Load data
  useEffect(() => {
    setVideos(JSON.parse(localStorage.getItem("videos")) || []);
    setLocations(JSON.parse(localStorage.getItem("locations")) || []);
  }, []);

  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Common
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

  // Video handlers
  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoForm({ ...videoForm, [name]: value });
  };

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setVideoForm({
        ...videoForm,
        videoUrl: fileURL,
        videoFileName: file.name,
        youtubeLink: "",
      });
    }
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    const newVideo = {
      id: editId || Date.now(),
      ...videoForm,
      date: new Date().toISOString().split("T")[0],
    };

    let updated;
    if (editId) {
      updated = videos.map((v) => (v.id === editId ? newVideo : v));
    } else {
      updated = [...videos, newVideo];
    }

    setVideos(updated);
    saveData("videos", updated);
    resetForms();
    setActiveModal("");
  };

  const deleteVideo = (id) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    saveData("videos", updated);
  };

  const editVideo = (id) => {
    const v = videos.find((v) => v.id === id);
    if (v) {
      setVideoForm(v);
      setEditId(v.id);
      setActiveModal("video");
    }
  };

  // City handlers
  const handleCityChange = (e) => {
    const { name, value } = e.target;
    setCityForm({ ...cityForm, [name]: value });
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    const newCity = { id: editId || Date.now(), ...cityForm };

    let updated;
    if (editId) {
      updated = locations.map((c) => (c.id === editId ? newCity : c));
    } else {
      updated = [...locations, newCity];
    }

    setLocations(updated);
    saveData("locations", updated);
    resetForms();
    setActiveModal("");
  };

  const deleteLocation = (id) => {
    const updated = locations.filter((l) => l.id !== id);
    setLocations(updated);
    saveData("locations", updated);
  };

  const editLocation = (id) => {
    const loc = locations.find((l) => l.id === id);
    if (loc) {
      setCityForm(loc);
      setEditId(loc.id);
      setActiveModal("city");
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
              Manage Post Videos and City Information
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("video")}
              className={`${
                activeTab === "video"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              } px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 font-medium`}
            >
              <Video className="w-5 h-5" /> Video
            </button>
            <button
              onClick={() => setActiveTab("city")}
              className={`${
                activeTab === "city"
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

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-slate-800 text-white px-6 py-4 text-lg font-semibold">
                Post Video List
              </div>
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
                    <th className="px-6 py-3 text-left">Source</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {videos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-slate-500">
                        No video posts found.
                      </td>
                    </tr>
                  ) : (
                    videos.map((v, i) => (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3">{i + 1}</td>
                        <td className="px-6 py-3 font-medium">{v.title}</td>
                        <td className="px-6 py-3 text-slate-600">
                          {v.description}
                        </td>
                        <td className="px-6 py-3 text-slate-500">
                          {v.youtubeLink
                            ? `YouTube: ${v.youtubeLink}`
                            : v.videoFileName || "N/A"}
                        </td>
                        <td className="px-6 py-3 text-slate-600">{v.date}</td>
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                    <th className="px-6 py-3 text-left">Village</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {locations.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-500">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    locations.map((l, i) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3">{i + 1}</td>
                        <td className="px-6 py-3">{l.city}</td>
                        <td className="px-6 py-3">{l.village}</td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            onClick={() => editLocation(l.id)}
                            className="text-green-600 hover:bg-green-50 p-2 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLocation(l.id)}
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
                  </div>
                </div>
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-lg"
                >
                  {editId ? "Update Video" : "Add Video"}
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
                {editId ? "Edit City Info" : "Add City Info"}
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
                  Village Name
                </label>
                <input
                  name="village"
                  value={cityForm.village}
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
                  {editId ? "Update City" : "Add City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
