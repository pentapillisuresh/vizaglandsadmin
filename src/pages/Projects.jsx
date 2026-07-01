import { useState, useEffect, useCallback } from "react";
import {
  Search, Home, CheckCircle, XCircle, Clock, Eye,
  IndianRupee, MapPin, Plus, Edit, Trash2, Heart,
  ArrowBigLeft, ThumbsUpIcon, Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApiService from "../hooks/ApiService";
import getPhotoSrc from "../hooks/getPhotos";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState({ show: false, message: "" });

  const navigate = useNavigate();

  // ---------- Fetch ----------
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const adminToken = localStorage.getItem("token");
      const res = await ApiService.get("/properties/getAllProjects?limit=1000", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      let allProjects = [];
      if (res && Array.isArray(res)) allProjects = res;
      else if (res?.projects && Array.isArray(res.projects)) allProjects = res.projects;
      else if (res?.properties && Array.isArray(res.properties)) allProjects = res.properties;
      else if (res?.data && Array.isArray(res.data)) allProjects = res.data;
      else console.error("Unexpected response:", res);

      setProjects(allProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ---------- Helpers ----------
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "N/A" :
        `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    const map = {
      verified: "bg-green-100 text-green-700",
      approved: "bg-green-100 text-green-700",
      pending: "bg-amber-100 text-amber-700",
      rejected: "bg-red-100 text-red-700",
    };
    return map[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const map = {
      verified: <CheckCircle className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };
    return map[status?.toLowerCase()] || null;
  };

  // ---------- API update wrapper ----------
  const updateProject = async (id, payload, successMsg) => {
    const adminToken = localStorage.getItem("token");
    try {
      const res = await ApiService.put(`/properties/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      if (res) {
        await fetchProjects();
        alert(successMsg || "Project updated successfully.");
        return true;
      }
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update project.");
    }
    return false;
  };

  // ---------- Handlers ----------
  const handleToggleActive = async (projectId, currentActive) => {
    const success = await updateProject(
      projectId,
      { isActive: !currentActive },
      currentActive ? "Project deactivated." : "Project is now live."
    );
    if (success) {
      setNotification({
        show: true,
        message: currentActive ? "Project deactivated" : "Project is Live"
      });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateProject(id, { status: newStatus }, `Project status set to ${newStatus}.`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    const adminToken = localStorage.getItem("token");
    try {
      await ApiService.delete(`/properties/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      await fetchProjects();
      alert("Project deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  const handleSold = async (id) => {
    if (!window.confirm("Mark this project as SOLD?")) return;
    await updateProject(id, { isSold: true }, "Project marked as sold.");
  };

  // ---------- Add / Edit navigation ----------
  const handleAddProject = () => {
    navigate("/post-property", { state: { isProject: true } });
  };

  const handleEdit = (project) => {
    navigate(`/post-property?edit=${project.id}`, {
      state: { listing: project, mode: "edit", isProject: true }
    });
  };

  // ---------- Filtering ----------
  const filteredProjects = projects?.filter((p) => {
    if (!p) return false;
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address?.locality?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && p.status === "pending") ||
      (filter === "rejected" && p.status === "rejected") ||
      (filter === "verified" && p.status === "verified") ||
      (filter === "approved" && (p.status === "verified" || p.status === "approved")) ||
      (filter === "sold" && p.isSold === true) ||
      (filter === "owner" && p?.client?.role === "owner") ||
      (filter === "agent" && p?.client?.role === "agent") ||
      (filter === "builder" && p?.client?.role === "builder");

    return matchesSearch && matchesFilter;
  });

  // ---------- Loading & error ----------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchProjects}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-400">
            <div className="bg-white/20 rounded-full p-2">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <p className="font-bold text-lg">{notification.message}</p>
              <p className="text-sm text-green-50">Status updated</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center space-x-3">
          <ArrowBigLeft
            size={20}
            className="w-8 h-8 text-red-500 transition-all duration-300 cursor-pointer hover:scale-110"
            onClick={() => navigate("/")}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
            <p className="text-sm text-gray-500">Review and manage project listings</p>
            <p className="text-xs text-blue-600 mt-1">Total: {projects.length}</p>
          </div>
        </div>
        <button
          onClick={handleAddProject}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Role:</label>
          <div className="flex gap-2 flex-wrap">
            {["owner", "agent", "builder"].map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${
                  filter === role
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Search:</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or city…"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Status:</label>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "verified", "rejected", "sold"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${
                    filter === status
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      {filteredProjects.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            Showing {filteredProjects.length} of {projects.length}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const isPendingOrRejected = project.status === "pending" || project.status === "rejected";
              return (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="relative">
                    {/* ✅ Reliable image with inline SVG fallback */}
                    <img
                      src={getPhotoSrc(project.photos)}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;
                      }}
                    />

                    {/* Active Toggle */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(project.id, project.isActive)}
                        disabled={isPendingOrRejected}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 
                          ${isPendingOrRejected
                            ? "opacity-50 cursor-not-allowed"
                            : project.isActive
                              ? "bg-red-500 hover:bg-red-600 scale-110"
                              : "bg-white/80 hover:bg-white shadow-md hover:shadow-lg"
                          }`}
                      >
                        <ThumbsUpIcon
                          className={`w-6 h-6 transition-all duration-300 
                            ${project.isActive
                              ? "fill-white text-white"
                              : "text-gray-700 hover:text-red-500"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Status badge */}
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

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {project.address?.city}, {project.address?.locality}
                      </span>
                      {project.isSold && (
                        <span className="px-2 py-1 ml-2 text-xs font-semibold bg-red-100 text-red-700 rounded-full whitespace-nowrap">
                          SOLD
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-lg font-bold text-blue-700">
                        <IndianRupee className="w-5 h-5" />
                        {project.price?.toLocaleString("en-IN")}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {project.viewCount || 0}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
                      <span className="capitalize">{project.category?.name || "N/A"}</span>
                      <span className="capitalize">{project.marketType || "N/A"}</span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                      <p>
                        Posted by:{" "}
                        <span className="font-medium text-gray-700 capitalize">
                          {project?.client?.role || "Admin"}
                        </span>
                      </p>
                      <p>
                        Owner:{" "}
                        <span className="font-medium text-gray-700 capitalize">
                          {project?.client?.fullName || "Unknown"}
                        </span>
                      </p>
                      <p>
                        Created:{" "}
                        <span className="font-medium text-gray-700">
                          {formatDate(project.createdAt)}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-auto">
                      {(project.status === "rejected" || project.status === "pending") && (
                        <button
                          onClick={() => handleStatusChange(project.id, "verified")}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                      )}
                      {(project.status === "verified" || project.status === "pending") && (
                        <button
                          onClick={() => handleStatusChange(project.id, "rejected")}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                      {(!project.isSold && project.status === "verified") && (
                        <button
                          onClick={() => handleSold(project.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                        >
                          <Tag className="w-4 h-4" /> Mark Sold
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Home className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No projects found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm || filter !== "all"
              ? "Try adjusting your filters or search terms"
              : "Click 'Add Project' to create your first listing"}
          </p>
        </div>
      )}

      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}