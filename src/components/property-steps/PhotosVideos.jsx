// admin/PhotosVideos.js

'use client';

import { useState, useEffect, useRef } from "react";
import { Upload, X, Image as ImageIcon, Video, CheckCircle, AlertCircle } from "lucide-react";
import ApiService from "../../hooks/ApiService";

const PhotosVideos = ({ data = {}, updateData, onNext,isProject }) => {
  const [dragActive, setDragActive] = useState(false);
  const existingPhotos = data.photos;
  const existingVideo = data.videos;
  
  const [formData, setFormData] = useState({
    photos: [],
    videos: null
  });

  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [progress, setProgress] = useState({
    photos: 0,
    videos: 0
  });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // ✅ Maximum photos limit
  const MAX_PHOTOS = 10;

  // --- Watermark function ---
  const applyWatermark = (imageUrl) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const watermarkText = "vmrdaplots.com";
        ctx.font = `bold ${Math.max(canvas.width * 0.04, 24)}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
        ctx.lineWidth = 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const x = canvas.width / 2;
        const y = canvas.height / 2;

        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);

        canvas.toBlob((blob) => {
          const watermarkedUrl = URL.createObjectURL(blob);
          resolve(watermarkedUrl);
        }, 'image/jpeg', 0.9);
      };

      img.src = imageUrl;
    });
  };

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

    // ✅ Limit existing photos to MAX_PHOTOS
    if (normalizedPhotos.length > MAX_PHOTOS) {
      normalizedPhotos = normalizedPhotos.slice(0, MAX_PHOTOS);
    }

    const photoObjects = normalizedPhotos.map((url) => ({ 
      url, 
      isNew: false,
      preview: url 
    }));
    
    const videosObj = existingVideo ? { url: existingVideo, isNew: false, preview: existingVideo } : null;

    setFormData({
      photos: photoObjects,
      videos: videosObj
    });
  }, [existingPhotos, existingVideo]);

  // --- DRAG HANDLERS ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      // ✅ Check if adding these files would exceed limit
      const currentCount = formData.photos.length;
      const filesToAdd = Array.from(e.dataTransfer.files);
      const remainingSlots = MAX_PHOTOS - currentCount;
      
      if (remainingSlots <= 0) {
        alert(`Maximum ${MAX_PHOTOS} photos allowed. Please remove some photos first.`);
        return;
      }
      
      if (filesToAdd.length > remainingSlots) {
        alert(`You can only add ${remainingSlots} more photo(s). Maximum ${MAX_PHOTOS} photos allowed.`);
        return;
      }
      
      await handlePhotoUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  // --- File Handlers ---
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // ✅ Check if adding these files would exceed limit
    const currentCount = formData.photos.length;
    const remainingSlots = MAX_PHOTOS - currentCount;
    
    if (remainingSlots <= 0) {
      alert(`Maximum ${MAX_PHOTOS} photos allowed. Please remove some photos first.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    if (files.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more photo(s). Maximum ${MAX_PHOTOS} photos allowed.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const newPhotos = [];

    for (const file of files) {
      const originalPreview = URL.createObjectURL(file);

      try {
        const watermarkedPreview = await applyWatermark(originalPreview);
        newPhotos.push({
          file,
          preview: watermarkedPreview,
          originalPreview: originalPreview,
          isNew: true,
        });
      } catch (error) {
        console.error("Error applying watermark:", error);
        newPhotos.push({
          file,
          preview: originalPreview,
          originalPreview: originalPreview,
          isNew: true,
        });
      }
    }

    setFormData((prev) => ({ 
      ...prev, 
      photos: [...prev.photos, ...newPhotos] 
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      videos: { file, preview: URL.createObjectURL(file), isNew: true },
    }));
  };

  const removePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const removeVideo = () => setFormData((prev) => ({ ...prev, videos: null }));

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

  const uploadimageWithProgress = async (images) => {
    const adminToken = localStorage.getItem("token");
  
    try {
      const uploadedImages = [];
  
      for (let i = 0; i < images.length; i++) {
        const form = new FormData();
        form.append("image", images[i]);

        const res = await ApiService.post("/images/upload", form, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const currentFileProgress = Math.round(
              (event.loaded * 100) / event.total
            );
  
            const overallProgress = Math.round(
              ((i + currentFileProgress / 100) / images.length) * 100
            );
  
            setProgress((prev) => ({
              ...prev,
              photos: overallProgress,
            }));
          },
        });
  
        if (res?.url) {
          uploadedImages.push({
            message: res.message,
            imagePath: res.imagePath,
            url: res.url,
          });
        }
      }
  
      return {
        images: uploadedImages,
      };
    } catch (err) {
      console.error("❌ Image upload error:", err);
      return null;
    }
  };

  // --- Process images with watermark before upload ---
  const processImagesForUpload = async (photoObjects) => {
    const processedFiles = [];

    for (const photoObj of photoObjects) {
      if (photoObj.isNew && photoObj.file) {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = photoObj.originalPreview || photoObj.preview;
          });

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const watermarkText = "vmrdaplots.com";
          ctx.font = `bold ${Math.max(canvas.width * 0.04, 24)}px Arial`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
          ctx.lineWidth = 2;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const x = canvas.width / 2;
          const y = canvas.height / 2;

          ctx.strokeText(watermarkText, x, y);
          ctx.fillText(watermarkText, x, y);

          const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, 'image/jpeg', 0.9)
          );

          const watermarkedFile = new File([blob], photoObj.file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          processedFiles.push(watermarkedFile);
        } catch (error) {
          console.error("Error processing image:", error);
          processedFiles.push(photoObj.file);
        }
      }
    }

    return processedFiles;
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadComplete(false);
    setUploadError(null);
    setProgress({ photos: 0, videos: 0 });

    let uploadedPhotoUrls = [];
    let uploadedVideoUrl = formData.videos?.url || null;

    try {
      const newPhotos = formData.photos.filter((p) => p.isNew && p.file);
      if (newPhotos.length > 0) {
        const processedFiles = await processImagesForUpload(newPhotos);
        const res = await uploadimageWithProgress(processedFiles);

        if (res?.images) {
          uploadedPhotoUrls = res.images.map((img) => img.url);
        }
      }
      
      const existingPhotos = formData.photos.filter((p) => !p.isNew).map((p) => p.url);
      const finalPhotoUrls = [...existingPhotos, ...uploadedPhotoUrls];

      if (formData.videos?.isNew && formData.videos?.file) {
        const form = new FormData();
        form.append("video", formData.videos.file);
        const res = await uploadWithProgress("/images/uploadVideo", form, "video");
        uploadedVideoUrl = res?.url;
      } else if (formData.videos?.url) {
        uploadedVideoUrl = formData.videos.url;
      }

      const finalData = {
        photos: finalPhotoUrls,
        videos: uploadedVideoUrl
      };

      console.log("✅ Final Uploaded Data:", finalData);
      updateData(finalData);
      setUploadComplete(true);
      
      setTimeout(() => {
        onNext();
      }, 1500);

    } catch (err) {
      console.error("❌ Upload failed:", err);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Check if can upload more photos
  const canUploadMore = formData.photos.length < MAX_PHOTOS;
  const remainingSlots = MAX_PHOTOS - formData.photos.length;

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Photos Section --- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-500" />
              Photos
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {formData.photos.length} / {MAX_PHOTOS} photos
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                remainingSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {remainingSlots > 0 ? `${remainingSlots} slots left` : 'Maximum reached'}
              </span>
            </div>
          </div>

          {/* Photos Grid - ABOVE the upload area */}
          {formData.photos.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Photos</h4>
                <span className="text-xs text-gray-500">
                  {formData.photos.filter(p => p.isNew).length} new • {formData.photos.filter(p => !p.isNew).length} existing
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {formData.photos.map((photo, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                    <img
                      src={photo.preview || photo.url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/logo.jpg';
                      }}
                    />
                    {/* Watermark overlay */}
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded">
                      vmrdaplots.com
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {/* Photo number */}
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      #{idx + 1}
                    </div>
                    {/* Status badge */}
                    {!photo.isNew && (
                      <div className="absolute bottom-1 right-1 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded">
                        Existing
                      </div>
                    )}
                    {photo.isNew && (
                      <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded">
                        New
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Area - BELOW the photos grid */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
              !canUploadMore ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              dragActive ? "border-orange-500 bg-orange-50 shadow-lg" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <input
              type="file"
              id="photo-upload"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={!canUploadMore}
              className="hidden"
            />
            <label htmlFor="photo-upload" className={`cursor-pointer flex flex-col items-center space-y-3 ${!canUploadMore ? 'cursor-not-allowed' : ''}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                dragActive ? "bg-orange-200" : "bg-orange-100"
              } ${!canUploadMore ? 'opacity-50' : ''}`}>
                <Upload className={`w-8 h-8 ${dragActive ? "text-orange-600" : "text-orange-500"} ${!canUploadMore ? 'opacity-50' : ''}`} />
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  {canUploadMore ? (
                    <>
                      <span className="text-orange-500 font-bold">Click</span> or drag to upload photos
                    </>
                  ) : (
                    <>
                      <span className="text-red-500 font-bold">Maximum</span> {MAX_PHOTOS} photos reached
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {canUploadMore ? (
                    `(Watermark will be applied automatically)`
                  ) : (
                    `Please remove some photos to add more`
                  )}
                </p>
                {canUploadMore && (
                  <p className="text-xs text-orange-500 mt-1">
                    {remainingSlots} of {MAX_PHOTOS} remaining
                  </p>
                )}
              </div>
            </label>
          </div>

          {uploading && progress.photos > 0 && progress.photos < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading photos...</span>
                <span>{progress.photos}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress.photos}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* --- Video Upload Section --- */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              Video
            </h3>
            {formData.videos && (
              <span className="text-sm text-green-600">✓ Video added</span>
            )}
          </div>

          {!formData.videos ? (
            <label className="cursor-pointer flex items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 bg-gray-50 hover:bg-gray-100 transition-all duration-300">
              <Upload className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 font-medium">Upload Video</span>
              <span className="text-xs text-gray-500">(MP4, WebM, Max 100MB)</span>
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
              <video 
                src={formData.videos.preview || formData.videos.url} 
                controls 
                className="w-full max-h-64 object-contain"
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors shadow-lg"
              >
                ✕ Remove Video
              </button>
              {!formData.videos.isNew && (
                <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Existing
                </div>
              )}
              {formData.videos.isNew && (
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  New
                </div>
              )}
            </div>
          )}

          {uploading && progress.videos > 0 && progress.videos < 100 && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading video...</span>
                <span>{progress.videos}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress.videos}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Photos</p>
                <p className="text-xl font-bold text-gray-900">{formData.photos.length} / {MAX_PHOTOS}</p>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="text-blue-600">New: {formData.photos.filter(p => p.isNew).length}</span>
                  <span className="text-green-600">Existing: {formData.photos.filter(p => !p.isNew).length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(formData.photos.length / MAX_PHOTOS) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Video</p>
                <p className={`text-xl font-bold ${formData.videos ? 'text-green-600' : 'text-gray-400'}`}>
                  {formData.videos ? '✓ Added' : 'Not added'}
                </p>
                {formData.videos && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.videos.isNew ? 'New video' : 'Existing video'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={uploading || formData.photos.length === 0}
            className={`flex-1 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 ${
              uploading || formData.photos.length === 0
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200 hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {progress.photos < 100 ? 'Uploading...' : 'Processing...'}
              </span>
            ) : uploadComplete ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Saved Successfully!
              </span>
            ) : (
              'Save & Continue'
            )}
          </button>
        </div>

        {uploadComplete && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-fadeIn">
            <CheckCircle className="w-5 h-5" />
            Photos and videos uploaded successfully! Redirecting...
          </div>
        )}
      </form>
    </>
  );
};

export default PhotosVideos;

