import { useState, useEffect, useRef } from "react";
import {
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  X,
  Image as ImageIcon,
  Upload,
  Save,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import ApiService from "../hooks/ApiService";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import "react-quill-new/dist/quill.snow.css";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const fileInputRef = useRef(null);
  const imageUploadRef = useRef(null);

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
      setBlogs(res.blogs || []);
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
        alert(res.message || "Blog updated successfully!");
      } else {
        // Create blog
        const res = await ApiService.post("/blogs", formData, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });
        alert(res.message || "Blog created successfully!");
      }
      setShowForm(false);
      setSelectedBlog(null);
      resetForm();
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
        alert(res.message || "Blog deleted successfully!");
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
        name: blog.name || "",
        slug: blog.slug || "",
        photo: blog.photo || "",
        description: blog.description || "",
        content: blog.content || "",
        status: blog.status || "draft",
      });
    } else {
      setSelectedBlog(null);
      resetForm();
    }
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      photo: "",
      description: "",
      content: "",
      status: "draft",
    });
  };

  const triggerImageUpload = () => {
    imageUploadRef.current?.click();
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

  // Calculate read time
  const calculateReadTime = (content) => {
    if (!content) return "0 min";
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.description && blog.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || blog.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // ReactQuill modules configuration for Description Editor
  const descriptionModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  // ReactQuill modules configuration for Content Editor
  const contentModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const descriptionFormats = [
    'bold', 'italic', 'underline', 'list', 'bullet', 'link'
  ];

  const contentFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background', 'align', 'direction',
    'code-block', 'script', 'sup', 'sub'
  ];

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .slice(0, 50);
  };

  // Handle name change and auto-generate slug
  const handleNameChange = (name) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-600">Create and manage your blog posts</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search blogs by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <button
                onClick={() => openForm()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow hover:shadow-lg transition-all font-medium text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" /> New Blog
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Blog</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading blogs...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-blue-50 transition-colors border-b border-gray-200 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {blog.photo && (
                            <img
                              src={blog.photo}
                              alt={blog.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {blog.name}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {blog.description ? blog.description.replace(/<[^>]*>/g, '').substring(0, 100) : "No description"}
                              {blog.description && blog.description.length > 100 ? "..." : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="font-mono text-sm">{blog.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize flex items-center gap-1 w-fit ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : blog.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.status === 'published' && <CheckCircle className="w-3 h-3" />}
                          {blog.status === 'draft' && <Clock className="w-3 h-3" />}
                          {blog.status === 'archived' && <AlertCircle className="w-3 h-3" />}
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBlog(blog);
                              setShowView(true);
                            }}
                            title="View Details"
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition hover:scale-105"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => openForm(blog)}
                            title="Edit Blog"
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition hover:scale-105"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            title="Delete Blog"
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium">No blogs found</p>
                        <p className="text-sm">Try changing your search or filter criteria</p>
                        <button
                          onClick={() => openForm()}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Create Your First Blog
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Info */}
        {filteredBlogs.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
            <p>Showing {filteredBlogs.length} of {blogs.length} blogs</p>
          </div>
        )}

        {/* View Blog Modal */}
        {showView && selectedBlog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedBlog.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      selectedBlog.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : selectedBlog.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBlog.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      <Clock className="inline w-4 h-4 mr-1" />
                      {calculateReadTime(selectedBlog.content)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowView(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
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
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  </div>
                )}

                {/* Blog Details */}
                <div className="space-y-6">
                  {/* Meta Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Slug</p>
                      <p className="font-mono text-sm text-gray-800 bg-gray-100 px-3 py-2 rounded">
                        {selectedBlog.slug}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                      <p className="text-sm text-gray-800">
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                    <div className="p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedBlog.description || "<p>No description available</p>" }} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Content</h3>
                    <div className="p-4 bg-gray-50 rounded-lg prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedBlog.content || "<p>No content available</p>" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedBlog ? "Edit Blog" : "Create New Blog"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedBlog ? "Update your blog post" : "Create a new blog post"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedBlog(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Blog Name and Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blog Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter blog title"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full bg-white text-gray-900 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          /blog/
                        </div>
                        <input
                          type="text"
                          placeholder="blog-slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full bg-white text-gray-900 border border-gray-300 pl-16 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Featured Image
                    </label>
                    <div className={`border-2 border-gray-300 hover:border-blue-500 border-dashed rounded-xl p-6 transition-all ${formData.photo ? 'border-solid' : ''}`}>
                      {formData.photo ? (
                        <div className="relative">
                          <img
                            src={formData.photo}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={triggerImageUpload}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2"
                            >
                              <Upload className="w-4 h-4" /> Change Image
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, photo: "" })}
                              className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg font-medium text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-blue-600" />
                          </div>
                          <p className="mb-2 text-gray-600">
                            Click to upload featured image
                          </p>
                          <p className="text-xs mb-4 text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          <button
                            type="button"
                            onClick={triggerImageUpload}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 mx-auto"
                          >
                            <Upload className="w-4 h-4" /> Upload Image
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageUploadRef}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const imageUrl = await uploadImage(file);
                          if (imageUrl) {
                            setFormData(prev => ({
                              ...prev,
                              photo: imageUrl,
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Description - ReactQuill Editor */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <span className="text-xs text-gray-500">
                        Short summary that appears in listings
                      </span>
                    </div>
                    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                      <ReactQuill
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                        placeholder="Write a compelling description for your blog..."
                        modules={descriptionModules}
                        formats={descriptionFormats}
                        theme="snow"
                        className="bg-white text-gray-900 min-h-[150px] max-h-[200px] overflow-y-auto"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Keep it concise (150-300 characters recommended)
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.description.replace(/<[^>]*>/g, '').length} characters
                      </p>
                    </div>
                  </div>

                  {/* Content - ReactQuill Editor */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Content *
                      </label>
                      <span className="text-xs text-gray-500">
                        Full blog content with rich formatting
                      </span>
                    </div>
                    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                      <ReactQuill
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        placeholder="Start writing your amazing blog post here..."
                        modules={contentModules}
                        formats={contentFormats}
                        theme="snow"
                        className="bg-white text-gray-900 min-h-[300px] max-h-[400px] overflow-y-auto"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-gray-500">
                          Read time: {calculateReadTime(formData.content)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length} words
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use toolbar for formatting, images, videos, and more
                      </p>
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          value="draft"
                          checked={formData.status === "draft"}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-sm">Draft</span>
                      </label>
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          value="published"
                          checked={formData.status === "published"}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-sm">Published</span>
                      </label>
                      <label className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          value="archived"
                          checked={formData.status === "archived"}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-sm">Archived</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedBlog(null);
                    resetForm();
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm flex items-center gap-2"
                >
                  {selectedBlog ? (
                    <>
                      <Save className="w-4 h-4" />
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
}