import React, { useState, useEffect } from "react";
import axios from "axios";
import ApiService from "../hooks/ApiService";

function EditPhotosForm({ existingPhotos = [],setPropertyURLs }) {
  const [formData, setFormData] = useState({
    photos: [],
  });

  // Load existing photos when component mounts or updates
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photos: existingPhotos.map((url) => ({ url, isNew: false })),
    }));
  }, [existingPhotos]);

  // Handle new image uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  // Remove image (either existing or new)
  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updated = [...prev.photos];
      const removed = updated[index];
      // Clean up URL object if it’s a new photo
      if (removed.isNew && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      updated.splice(index, 1);
      return { ...prev, photos: updated };
    });
  };

  // ✅ Submit handler — uploads new images and merges URLs
  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem('token');
    try {
      // Separate existing and new photos
      const existingUrls = formData.photos
        .filter((p) => !p.isNew)
        .map((p) => p.url);

      const newFiles = formData.photos
        .filter((p) => p.isNew && p.file)
        .map((p) => p.file);

      let uploadedUrls = [];

      // Upload new files if there are any
      if (newFiles.length > 0) {
        const uploadForm = new FormData();
        newFiles.forEach((file) => uploadForm.append("images", file));

        const res = await ApiService.post("/images/upload-multiple",
          uploadForm,
          {
            headers: { 
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "multipart/form-data" },
          }
        );

        uploadedUrls = res.images.map((img) => img.url);
      }

      // Merge existing + newly uploaded image URLs
      const finalUrls = [...existingUrls, ...uploadedUrls];

      // Update formData state (optional)
      setFormData({
        photos: finalUrls.map((url) => ({ url, isNew: false })),
      });

      console.log("✅ Final URLs to save:", finalUrls);
      setPropertyURLs(finalUrls);
      // 👉 Here you can send `finalUrls` to your backend (e.g. PUT /update-product)
      // await axios.put("/api/update-photos", { photos: finalUrls });

    } catch (error) {
      console.error("❌ Error uploading images:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-5">
      {/* File Input */}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="border rounded-lg px-3 py-2 text-sm"
      />

      {/* Preview all photos */}
      <div className="flex flex-wrap gap-3 mt-3">
        {formData.photos.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={photo.isNew ? photo.preview : photo.url}
              alt={`photo-${index}`}
              className="w-24 h-24 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Save Changes
      </button>
    </form>
  );
}

export default EditPhotosForm;
