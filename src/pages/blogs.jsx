import { useState, useEffect,useRef} from "react";
import {
  Eye,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import axios from "axios";
import ApiService from "../hooks/ApiService";

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
  const fileInputRef = useRef(null);
  // Fetch Blogs
  const fetchBlogs = async () => {
    try {
      const adminToken = localStorage.getItem('token');
      setLoading(true);
      const res = await ApiService.get("/blogs",{headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },});
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
        const res = await ApiService.put(`/blogs/${selectedBlog.id}`, formData,{headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },});
        alert(res.message);
      } else {
        // Create blog
        const res = await ApiService.post("/blogs", formData,{headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },});
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
        const res = await ApiService.delete(`/blogs/${id}`,{headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },});
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
      return res.url; // Assuming your backend returns { imageUrl: "..." }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed");
      return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500">
            Create, view, and manage your blog posts
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition-all font-medium text-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Blog
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b">
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
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  Loading blogs...
                </td>
              </tr>
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="hover:bg-blue-50 transition-colors border-b"
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {blog.name}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{blog.slug}</td>
                  <td className="px-5 py-3 capitalize text-gray-700">
                    {blog.status}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
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
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Blog Modal */}
      {showView && selectedBlog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {selectedBlog.name}
            </h2>
            {selectedBlog.photo && (
              <img
                src={selectedBlog.photo}
                alt={selectedBlog.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-sm text-gray-600 mb-2">
              <strong>Slug:</strong> {selectedBlog.slug}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Status:</strong> {selectedBlog.status}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Description:</strong> {selectedBlog.description}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Content:</strong> {selectedBlog.content}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => openForm(selectedBlog)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(selectedBlog.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => setShowView(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg relative space-y-4"
          >
            <h2 className="text-xl font-semibold mb-2">
              {selectedBlog ? "Edit Blog" : "Add Blog"}
            </h2>

            <input
              type="text"
              placeholder="Blog Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg text-sm"
              required
            />

            <input
              type="text"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg text-sm"
              required
            />
<input
  type="text"
  placeholder="Click to upload image"
  value={formData.photo}
  readOnly
  onClick={triggerFileInput}
  className="w-full border px-3 py-2 rounded-lg text-sm cursor-pointer bg-gray-50"
/>
{formData.photo && (
  <img
    src={formData.photo}
    alt="Preview"
    className="w-full h-40 object-cover rounded-lg mt-2"
  />
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

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg text-sm"
            />

            <textarea
              placeholder="Content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg text-sm"
            />

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                {selectedBlog ? "Update Blog" : "Create Blog"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedBlog(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
