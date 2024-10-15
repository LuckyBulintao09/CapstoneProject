import React, { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
} from "@vis.gl/react-google-maps";

const PublicMap = () => {
  const position = { lat: 16.415, lng: 120.597 };
  const [selectedLocation, setSelectedLocation] = useState(null);


  const handleMapClick = async (event) => {
    if (event.detail.latLng) {
      setSelectedLocation(event.detail.latLng);
    };
  }

    return (
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultZoom={15}
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          onClick={handleMapClick}
        >
          {selectedLocation && (
            <AdvancedMarker
              position={selectedLocation}
            >
            </AdvancedMarker>
          )}
        </Map>
			</APIProvider>
    )
};

export default PublicMap;