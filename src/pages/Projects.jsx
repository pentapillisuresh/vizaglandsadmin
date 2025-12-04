import { useState, useEffect } from "react";
import { Search, Home, CheckCircle,Tag, XCircle, Clock, Eye, IndianRupee, MapPin, Plus, Edit, Trash2, Heart, HomeIcon, ArrowBigLeft } from "lucide-react";
import PropertyForm from "../components/PropertyForm";
import ApiService from "../hooks/ApiService";
import { useNavigate } from "react-router-dom";
import getPhotoSrc from "../hooks/getPhotos";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [wishlistedProjects, setWishlistedProjects] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();
  // ✅ Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await ApiService.get("/projects", {
        headers: {
          // Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json'"
        }
      }
      );
      setProjects(res.projects || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Local filtering logic
  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && project.status === "pending") ||
      (filter === "rejected" && project.status === "rejected") ||
      (filter === "verified" && project.status === "verified") ||
      (filter === "sold" && project.isSold === true)||
      (filter === "owner" && project?.client?.role === 'owner')||
      (filter === "agent" && project?.client?.role === 'agent')||
      (filter === "builder" && project?.client?.role === 'builder');
    return matchesSearch && matchesFilter;
  });

  const handleWishlistClick = async (projectId, projectStatus, isActive) => {
    if (projectStatus === "verified" || projectStatus === "approved") {
      // Toggle wishlist state locally
      setWishlistedProjects((prev) => ({
        ...prev,
        [projectId]: !prev[projectId],
      }));
    }

    try {
      const adminToken = localStorage.getItem("token");
      if (!adminToken) {
        alert("Admin token not found. Please log in again.");
        return;
      }

      // Make API request
      const response = await ApiService.put(
        `/projects/${projectId}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        // Show notification when project is made live
        if (!wishlistedProjects[projectId]) {
          setNotificationMessage("Project is Live");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
        fetchProjects()
        // Optional: reload or refetch data
        // window.location.reload(); // reloads the current page
        // OR ideally: refetch data instead of reloading
        // fetchProjects();

        console.log("Project updated successfully!");
      } else {
        console.error("Error updating project:", response?.message);
        alert("Failed to update project. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "An unexpected error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      const adminToken = localStorage.getItem("token");
      try {
        await ApiService.delete(`/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json'"
          }
        });
        setProjects((prev) => prev.filter((p) => p.id !== id));
        alert("Project deleted successfully!");
      } catch (err) {
        alert("Failed to delete project.");
      }
    }
  };

  const handleSold = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to make as SOLD this project? This action cannot be undone."
      )
    ) {
      const adminToken = localStorage.getItem('token');
      try {
        const res = await ApiService.put(`/projects/${id}`, { isSold: true }, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json'"
          }
        });
        if (res) {
          alert("Project update isSold successfully!");
        }
        fetchProjects()
      } catch (err) {
        alert("Failed to delete project.");
      }
    }
  };

  const handleAddProject = async (formData) => {
    const adminToken = localStorage.getItem("token");
    const adminClientData = localStorage.getItem("adminClientData");
    formData.clientId = adminClientData.id;
    try {
      const res = await ApiService.post("/projects/admin-project", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = res.project;

      if (!res || res.status !== 200) {
        throw new Error(data?.message || "Failed to add project");
      }

      setShowEditModal(false);
      window.location.reload()
      alert("Project added successfully!");
    } catch (err) {
      console.error("Error adding project:", err);
      alert(err.message || "An error occurred while adding the project.");
    }
  };

  const handleUpdateProject = async (formData) => {
    console.log("from::", formData)

    try {
      const adminToken = localStorage.getItem("token");

      const response = await ApiService.put(`/projects/${formData.id}`, formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        },
      )

      if (response) {
        setShowEditModal(false);
        navigate('./projects')
      } else {
        console.log("rrr::", response?.message)
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? response.project : p))
      );
      setShowEditModal(false);
      setEditingProject(null);
      alert("Project updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };
  const handleEdit = (listing) => {
    navigate(`/post-project?edit=${listing.id}`, {
      state: {
        listing, // or any other data you want to send
        mode: 'edit',
      },
    });    // setShowEditModal(true);
  };

  const handleStatus = async (id, status) => {
    try {
      const adminToken = localStorage.getItem("token");

      const response = await ApiService.put(`/projects/${id}`, { status },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        },
      )

      if (response) {
        navigate('./projects')
      } else {
        console.log("rrr::", response?.message)
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? data.project : p))
      );
      alert("Project updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 animate-pulse">Loading projects...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium py-10">{error}</div>
    );

  return (
    <div className="p-6">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-400">
            <div className="bg-white/20 rounded-full p-2">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <p className="font-bold text-lg">{notificationMessage}</p>
              <p className="text-sm text-green-50">Added to your wishlist</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center space-x-3">
          <ArrowBigLeft
            size={20}
            className="w-8 h-8 text-red-500 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Project Management
            </h1>
            <p className="text-sm text-gray-500">
              Review and manage project listings
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/post-project')}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
            {["owner", "agent", "builder"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${filter === status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}

          </div>
          <div className="relative w-full md:w-76">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or city..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {["all", "pending", "verified", "rejected", "sold"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${filter === status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}

          </div>
        </div>
      </div>

      {/* Project Cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative">
                <img
                  src={getPhotoSrc(project.photos)}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => handleWishlistClick(project.id, project.status, !project.isActive)}
                    disabled={project.status === "pending" || project.status === "rejected"}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 
    ${project.status === "pending" || project.status === "rejected"
                        ? "opacity-50 cursor-not-allowed"
                        : project.isActive
                          ? "bg-red-500 hover:bg-red-600 scale-110"
                          : "bg-white/80 hover:bg-white shadow-md hover:shadow-lg"
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 
      ${project.isActive
                          ? "fill-white text-white"
                          : "text-gray-700 hover:text-red-500"
                        }`}
                    />
                  </button>

                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusIcon(project.status)}
                    {project.status}
                  </span>

                </div>

              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {project.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.address.city}, {project.address.locality}
                {project?.isSold && (
                  <span className="px-2 py-1 ml-4 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                    SOLD
                  </span>)
                }
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-lg font-bold text-blue-700">
                    <IndianRupee className="w-5 h-5" />
                    {project.price?.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {project.viewCount}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
                  <span className="capitalize">{project.category.name}</span>
                  <span className="capitalize">{project.marketType}</span>
                  {/* <span className="capitalize">{project.createdAt}</span> */}
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <p>
                    Posted by:{" "}
                    <span className="font-medium text-gray-700 capitalize">
                      {project?.client?.role || "Admin"}
                    </span>
                  </p>
                  <p>
                    Owner:{" "}
                    <span className="font-medium text-gray-700 capitalize" >
                      {project?.client?.fullName || "Unknown"}
                    </span>
                  </p>
                  <p>
                    Created On:{" "}
                    <span className="font-medium text-gray-700">
                      {formatDate(project.createdAt)}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  {(project.status === "rejected" || project.status === "pending") && (
                    <>
                      <button
                        onClick={() => handleStatus(project.id, "verified")}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    </>
                  )}
                  {(project.status === "verified" || project.status === "pending") && (
                    <>
                      <button
                        onClick={() => handleStatus(project.id, "rejected")}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleEdit(project)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {(!project?.isSold && project?.status === "verified") && (
                          <button
                            onClick={() => handleSold(project?.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <Tag className="w-4 h-4" />
                            Sold
                          </button>
                        )}

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Home className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No projects found
          </h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Add/Edit Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Project
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <PropertyForm
                onSubmit={handleAddProject}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProject(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <PropertyForm
                initialData={editingProject}
                onSubmit={handleUpdateProject}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingProject(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
