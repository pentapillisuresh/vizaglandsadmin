import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import ApiService from "../../hooks/ApiService";

const PhotosVideos = ({ data = {}, updateData, onNext }) => {
  const [dragActive, setDragActive] = useState(false);
  const existingPhotos = data.photos;
  const existingVideo = data.videos;
  const existingVoiceOver = data.audio;

  const [formData, setFormData] = useState({
    photos: [],
    videos: null,
    voiceOver: null,
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({
    photos: 0,
    videos: 0,
    voice: 0,
  });

  // --- Load existing media ---
  useEffect(() => {
    let normalizedPhotos = [];
    if (Array.isArray(existingPhotos)) normalizedPhotos = existingPhotos;
    else if (typeof existingPhotos === "string" && existingPhotos.startsWith("[")) {
      try {
        normalizedPhotos = JSON.parse(existingPhotos);
      } catch {
        normalizedPhotos = [];
      }
    } else if (typeof existingPhotos === "string" && existingPhotos.length > 0) {
      normalizedPhotos = [existingPhotos];
    }

    const photoObjects = normalizedPhotos.map((url) => ({ url, isNew: false }));
    const videosObj = existingVideo ? { url: existingVideo, isNew: false } : null;
    const voiceObj = existingVoiceOver ? { url: existingVoiceOver, isNew: false } : null;

    setFormData({
      photos: photoObjects,
      videos: videosObj,
      voiceOver: voiceObj,
    });
  }, [existingPhotos, existingVideo, existingVoiceOver]);

  // --- DRAG HANDLERS ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handlePhotoUpload({ target: { files: e.dataTransfer.files } });
  };

  // --- File Handlers ---
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      videos: { file, preview: URL.createObjectURL(file), isNew: true },
    }));
  };

  const handleVoiceOverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      voiceOver: { file, preview: URL.createObjectURL(file), isNew: true },
    }));
  };

  const removePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const removeVideo = () => setFormData((prev) => ({ ...prev, videos: null }));
  const removeVoiceOver = () => setFormData((prev) => ({ ...prev, voiceOver: null }));

  // --- Upload with Progress ---
  const uploadWithProgress = async (url, formData, type) => {
    const adminToken = localStorage.getItem("token");
    try {
      const res = await ApiService.post(url, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress((prev) => ({ ...prev, [type]: percent }));
        },
      });
      return res;
    } catch (err) {
      console.error(`❌ ${type} upload error:`, err);
      return null;
    }
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setProgress({ photos: 0, videos: 0, voice: 0 });

    const adminToken = localStorage.getItem("token");
    let uploadedPhotoUrls = [];
    let uploadedVideoUrl = formData.videos?.url || null;
    let uploadedVoiceUrl = formData.voiceOver?.url || null;

    try {
      // --- Upload photos ---
      const newPhotos = formData.photos.filter((p) => p.isNew && p.file);
      if (newPhotos.length > 0) {
        const form = new FormData();
        newPhotos.forEach((fileObj) => form.append("images", fileObj.file));
        const res = await uploadWithProgress("/images/upload-multiple", form, "photos");
        if (res?.images) uploadedPhotoUrls = res.images.map((img) => img.url);
      }
      const existingPhotos = formData.photos.filter((p) => !p.isNew).map((p) => p.url);
      const finalPhotoUrls = [...existingPhotos, ...uploadedPhotoUrls];

      // --- Upload videos ---
      if (formData.videos?.isNew) {
        const form = new FormData();
        form.append("video", formData.videos.file);
        const res = await uploadWithProgress("/images/uploadVideo", form, "video");
        uploadedVideoUrl = res?.url;
      }

      // --- Upload voice-over ---
      if (formData.voiceOver?.isNew) {
        const form = new FormData();
        form.append("document", formData.voiceOver.file);
        const res = await uploadWithProgress("/images/upload-document", form, "voice");
        uploadedVoiceUrl = res?.url;
      }

      const finalData = {
        photos: finalPhotoUrls,
        videos: uploadedVideoUrl,
        audio: uploadedVoiceUrl,
      };

      console.log("✅ Final Uploaded Data:", finalData);
      updateData(finalData);
      onNext();

    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Photos --- */}
      <div>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 w-60 h-60 flex flex-col justify-center items-center text-center transition-colors ${dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50"
            }`}
        >
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center space-y-3">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <Upload className="w-7 h-7 text-orange-500" />
            </div>
            <p className="text-sm text-gray-700">
              <span className="text-orange-500 font-medium">Click</span> or drag to upload
            </p>
          </label>
        </div>

        <div className="flex flex-wrap gap-4 mt-3">
          {formData.photos.map((photo, idx) => (
            <div key={idx} className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100">
              <img src={photo.preview || photo.url} alt="photo" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {uploading && progress.photos > 0 && progress.photos < 100 && (
          <div className="w-full max-w-md mt-3 bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${progress.photos}%` }}
            ></div>
          </div>
        )}
      </div>
    

      {/* --- Video --- */}
      <div>
        <label className="cursor-pointer flex items-center gap-3 border-2 border-dashed rounded-lg px-5 py-4 bg-gray-50 hover:bg-gray-100">
          <Upload className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700 font-medium">Upload Video</span>
          <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
        </label>
        {formData.videos && (
          <div className="relative mt-3">
            <video src={formData.videos.preview || formData.videos.url} controls className="w-full max-w-md h-60 object-cover" />
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}
        {uploading && progress.videos > 0 && progress.videos < 100 && (
          <div className="w-full max-w-md mt-3 bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full"
              style={{ width: `${progress.videos}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* --- Voice-over --- */}
      <div>
        <label className="cursor-pointer flex items-center gap-3 border-2 border-dashed rounded-lg px-5 py-4 bg-gray-50 hover:bg-gray-100">
          <Upload className="w-5 h-5 text-green-500" />
          <span className="text-gray-700 font-medium">Upload Voice-over</span>
          <input type="file" accept="audio/*" className="hidden" onChange={handleVoiceOverUpload} />
        </label>
        {formData.voiceOver && (
          <div className="flex items-center justify-between mt-3 bg-blue-50 px-4 py-3 rounded-lg max-w-md">
            <audio controls src={formData.voiceOver.preview || formData.voiceOver.url} className="w-64" />
            <button type="button" onClick={removeVoiceOver} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {uploading && progress.voice > 0 && progress.voice < 100 && (
          <div className="w-full max-w-md mt-3 bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full"
              style={{ width: `${progress.voice}%` }}
            ></div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
          }`}
      >
        {uploading ? "Uploading..." : "Save"}
      </button>
    </form>
  );
};

export default PhotosVideos;
