import { useState, useEffect } from "react";

const ContentManager = () => {
  const [contents, setContents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "" });

  // Fetch existing content
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("siteContent")) || [];
    setContents(saved);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...contents, form];
    setContents(updated);
    localStorage.setItem("siteContent", JSON.stringify(updated));
    setForm({ title: "", description: "", videoUrl: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Post Video & Text</h1>

      {/* Add New Content */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-3"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="videoUrl"
          value={form.videoUrl}
          onChange={handleChange}
          placeholder="YouTube or Video URL"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Post Content
        </button>
      </form>

      {/* Show Posted Content */}
      <div className="grid md:grid-cols-2 gap-4">
        {contents.map((item, i) => (
          <div
            key={i}
            className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-900">
              {item.title}
            </h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
            {item.videoUrl && (
              <iframe
                src={item.videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-48 rounded"
                allowFullScreen
              ></iframe>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;
