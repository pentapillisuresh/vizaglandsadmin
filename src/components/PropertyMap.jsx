import React, { useState, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";

export default function PropertyMap({ lat, lon }) {
  const DEFAULT_COORDS = { lat: 17.6868, lng: 83.2185 }; // Visakhapatnam
  const [coords, setCoords] = useState(DEFAULT_COORDS);

  useEffect(() => {
    if (lat && lon) {
      setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      setCoords(DEFAULT_COORDS);
    }
  }, [lat, lon]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Map
        height={400}
        center={[coords.lat, coords.lng]}
        defaultZoom={14}
      >
        <Marker anchor={[coords.lat, coords.lng]} width={40} />
      </Map>
    </div>
  );
}
