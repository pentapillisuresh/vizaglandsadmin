const getPhotoSrc = (photos) => {
    try {
      if (typeof photos === "string" && photos.trim().startsWith("[")) {
        const arr = JSON.parse(photos);
        return arr[0] || "https://via.placeholder.com/100";
      }
      if (typeof photos === "string") return photos;
      if (Array.isArray(photos)) return photos[0] || "https://via.placeholder.com/100";
    } catch (e) {
      console.error("Invalid photo data:", photos);
    }
    return "https://via.placeholder.com/100";
  };
  
  export default getPhotoSrc;