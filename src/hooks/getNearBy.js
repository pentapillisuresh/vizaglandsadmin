const getAdvantages = (data) => {
    try {
      const nearBy = data?.address?.near_by;
  
      if (Array.isArray(nearBy)) {
        return nearBy.length > 0 ? nearBy : [{ info: "", distance: "250 m" }];
      }
  
      if (typeof nearBy === "string") {
        const trimmed = nearBy.trim();
        if (trimmed.startsWith("[")) {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {
      console.error("Invalid near_by data:", e);
    }
  
    return [{ info: "", distance: "250 m" }];
  };
  
  export default getAdvantages;
  