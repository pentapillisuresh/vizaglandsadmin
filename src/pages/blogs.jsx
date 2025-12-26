import { useState, useEffect, useRef } from "react";
import {
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  X,
} from "lucide-react";
import ApiService from "../hooks/ApiService";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    photo: "",
    description: "",
    content: "",
    status: "draft",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef(null);
  
  // Persistent dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fetch Blogs
  const fetchBlogs = async () => {
    try {
      const adminToken = localStorage.getItem('token');
      setLoading(true);
      const res = await ApiService.get("/blogs", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });
      setBlogs(res.blogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Add or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('token');
      if (selectedBlog) {
        // Edit blog
        const res = await ApiService.put(`/blogs/${selectedBlog.id}`, formData, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });
        alert(res.message);
      } else {
        // Create blog
        const res = await ApiService.post("/blogs", formData, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });
        alert(res.message);
      }
      setShowForm(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Error saving blog");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const adminToken = localStorage.getItem('token');
        const res = await ApiService.delete(`/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });
        alert(res.message);
        setShowView(false);
        fetchBlogs();
      } catch (err) {
        console.error(err);
        alert("Error deleting blog");
      }
    }
  };

  // Open Form for Add/Edit
  const openForm = (blog = null) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        name: blog.name,
        slug: blog.slug,
        photo: blog.photo,
        description: blog.description,
        content: blog.content,
        status: blog.status,
      });
    } else {
      setSelectedBlog(null);
      setFormData({
        name: "",
        slug: "",
        photo: "",
        description: "",
        content: "",
        status: "draft",
      });
    }
    setShowForm(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const adminToken = localStorage.getItem('token');

    try {
      const res = await ApiService.post("/images/upload", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return res.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed");
      return null;
    }
  };

  // ReactQuill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "color",
    "background",
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gradient-to-b from-gray-50 to-gray-100"} transition-colors duration-500 font-poppins`}>
      {/* Header with Dark Mode Toggle */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Blog Management</h1>
            <p className="text-sm text-blue-100">
              Create, view, and manage your blog posts
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        {/* Table Header with Add Button */}
        <div className="mb-6">
          <button
            onClick={() => openForm()}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition-all font-medium text-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Blog
          </button>
        </div>

        {/* Table */}
        <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} border ${isDarkMode ? "border-gray-700" : "border-gray-200"} rounded-xl shadow-sm overflow-x-auto transition-colors duration-500`}>
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"} ${isDarkMode ? "text-gray-300" : "text-gray-600"} uppercase text-xs font-semibold border-b ${isDarkMode ? "border-gray-700" : ""}`}>
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className={`text-center py-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Loading blogs...
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className={`hover:${isDarkMode ? "bg-gray-800" : "bg-blue-50"} transition-colors border-b ${isDarkMode ? "border-gray-700" : ""}`}
                  >
                    <td className={`px-5 py-3 font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {blog.name}
                    </td>
                    <td className={`px-5 py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{blog.slug}</td>
                    <td className="px-5 py-3 capitalize">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : blog.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className={`px-5 py-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedBlog(blog);
                            setShowView(true);
                          }}
                          title="View Details"
                          className={`p-2 rounded-md border ${isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"} transition`}
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => openForm(blog)}
                          title="Edit Blog"
                          className={`p-2 rounded-md border ${isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"} transition`}
                        >
                          <Edit className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={`text-center py-10 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    No blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Blog Modal */}
        {showView && selectedBlog && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-colors duration-500`}>
              {/* Modal Header */}
              <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : ""} flex justify-between items-center`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{selectedBlog.name}</h2>
                <button
                  onClick={() => setShowView(false)}
                  className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} rounded-full transition`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Blog Image */}
                {selectedBlog.photo && (
                  <div className="mb-6">
                    <img
                      src={selectedBlog.photo}
                      alt={selectedBlog.name}
                      className="w-full h-64 md:h-72 object-cover rounded-lg shadow"
                    />
                  </div>
                )}

                {/* Blog Details */}
                <div className="space-y-6">
                  {/* Meta Information */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} rounded-lg`}>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Slug</p>
                      <p className={`font-mono text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedBlog.slug}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        selectedBlog.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : selectedBlog.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedBlog.status}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Created</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>Description</h3>
                    <div className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} rounded-lg`}>
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>Content</h3>
                    <div className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} rounded-lg max-h-[200px] overflow-y-auto`}>
                      <div className="prose prose-sm max-w-none">
                        {selectedBlog.content || "No content available"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`p-6 border-t ${isDarkMode ? "border-gray-700 bg-gray-900" : "bg-white"} flex justify-end gap-3`}>
                <button
                  onClick={() => {
                    setShowView(false);
                    openForm(selectedBlog);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition text-sm"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedBlog.id)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => setShowView(false)}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Blog Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleSubmit}
              className={`${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col transition-colors duration-500`}
            >
              {/* Modal Header */}
              <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : ""} flex justify-between items-center`}>
                <h2 className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                  {selectedBlog ? "Edit Blog" : "Add Blog"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedBlog(null);
                  }}
                  className={`p-2 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} rounded-full transition`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
                    Blog Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter blog name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} border ${isDarkMode ? "border-gray-700" : "border-gray-300"} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
                    Slug *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter slug (e.g., my-awesome-blog)"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className={`w-full ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} border ${isDarkMode ? "border-gray-700" : "border-gray-300"} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
                    Featured Image
                  </label>
                  <input
                    type="text"
                    placeholder="Click to upload image or enter URL"
                    value={formData.photo}
                    readOnly
                    onClick={triggerFileInput}
                    className={`w-full ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"} border ${isDarkMode ? "border-gray-700" : "border-gray-300"} px-4 py-3 rounded-lg cursor-pointer focus:outline-none transition-colors`}
                  />
                  {formData.photo && (
                    <div className="mt-3">
                      <img
                        src={formData.photo}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, photo: "" })}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const imageUrl = await uploadImage(file);
                      if (imageUrl) {
                        setFormData((prev) => ({
                          ...prev,
                          photo: imageUrl,
                        }));
                      }
                    }}
                  />
                </div>

                {/* Description with ReactQuill Editor - Increased Height */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Description
                    </label>
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Rich text editor with formatting options
                    </span>
                  </div>
                  <div className={`border ${isDarkMode ? "border-gray-700" : "border-gray-300"} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300`}>
                    <ReactQuill
                      value={formData.description}
                      onChange={(value) => setFormData({ ...formData, description: value })}
                      placeholder="Write your blog description here... You can use bold, italics, lists, colors, and more!"
                      className={`${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                      modules={{
                        ...quillModules,
                        toolbar: {
                          container: quillModules.toolbar,
                          handlers: {
                            // You can add custom handlers here if needed
                          }
                        }
                      }}
                      formats={quillFormats}
                      theme="snow"
                      style={{
                        height: '300px', // Increased height
                        minHeight: '300px',
                        maxHeight: '400px',
                        overflowY: 'auto'
                      }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Use the toolbar above to format your text
                    </p>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      HTML supported
                    </p>
                  </div>
                </div>

                {/* Content Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Content (Plain Text)
                    </label>
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Optional plain text content
                    </span>
                  </div>
                  <textarea
                    placeholder="Enter additional blog content (plain text)..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className={`w-full ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} border ${isDarkMode ? "border-gray-700" : "border-gray-300"} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y`}
                    rows="8"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
                    Status
                  </label>
                  <div className="flex space-x-4">
                    <label className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <input
                        type="radio"
                        value="draft"
                        checked={formData.status === "draft"}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className={`mr-2 ${isDarkMode ? "text-blue-500" : "text-blue-600"}`}
                      />
                      <span className="text-sm">Draft</span>
                    </label>
                    <label className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <input
                        type="radio"
                        value="published"
                        checked={formData.status === "published"}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className={`mr-2 ${isDarkMode ? "text-blue-500" : "text-blue-600"}`}
                      />
                      <span className="text-sm">Published</span>
                    </label>
                    <label className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <input
                        type="radio"
                        value="archived"
                        checked={formData.status === "archived"}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className={`mr-2 ${isDarkMode ? "text-blue-500" : "text-blue-600"}`}
                      />
                      <span className="text-sm">Archived</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`p-6 border-t ${isDarkMode ? "border-gray-700 bg-gray-900" : "bg-white"} flex justify-between items-center`}>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {selectedBlog ? `Last updated: ${new Date().toLocaleDateString()}` : "Create a new blog post"}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedBlog(null);
                    }}
                    className={`px-5 py-2.5 border ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"} rounded-lg font-medium transition text-sm`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm flex items-center gap-2"
                  >
                    {selectedBlog ? (
                      <>
                        <Edit className="w-4 h-4" />
                        Update Blog
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        Create Blog
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}