import { useState, useEffect } from 'react';

const VIEWED_PROPERTIES_KEY = 'viewedProperties';

export const useViewedProperties = () => {
  const [viewedPropertyIds, setViewedPropertyIds] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(VIEWED_PROPERTIES_KEY);
    if (stored) {
      try {
        setViewedPropertyIds(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing viewed properties:', error);
        setViewedPropertyIds([]);
      }
    }
  }, []);

  const addViewedProperty = (propertyId) => {
    setViewedPropertyIds((prev) => {
      const updatedIds = [propertyId, ...prev.filter(id => id !== propertyId)].slice(0, 10);
      localStorage.setItem(VIEWED_PROPERTIES_KEY, JSON.stringify(updatedIds));
      return updatedIds;
    });
  };

  const clearViewedProperties = () => {
    setViewedPropertyIds([]);
    localStorage.removeItem(VIEWED_PROPERTIES_KEY);
  };

  return {
    viewedPropertyIds,
    addViewedProperty,
    clearViewedProperties
  };
};
