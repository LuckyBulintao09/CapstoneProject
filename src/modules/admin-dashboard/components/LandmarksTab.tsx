"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { createClient } from "@/utils/supabase/client";
import LandmarkModal from "./LandmarkModal";
import SearchLocation from "./SearchLocation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const supabase = createClient();

const mapContainerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "8px",
};

const initialCenter = { lat: 14.5995, lng: 120.9842 };

const LandmarksTab = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [landmarks, setLandmarks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [center, setCenter] = useState(initialCenter);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchLandmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc("get_landmarks");
      if (error) {
        console.error("Supabase RPC error:", error);
        return;
      }

      const parsedLandmarks = data.map((landmark) => ({
        id: landmark.id,
        name: landmark.name,
        position: {
          lat: parseFloat(landmark.latitude),
          lng: parseFloat(landmark.longitude),
        },
      }));

      setLandmarks(parsedLandmarks);
    } catch (error) {
      console.error("Error fetching landmarks:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchLandmarks();
    const intervalId = setInterval(fetchLandmarks, 10000); // Refresh every 10 seconds
    return () => clearInterval(intervalId);
  }, [fetchLandmarks]);

  const handleMapDblClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(location);
    setCenter(location);
    setIsModalOpen(true);
  };

  const handleAddLandmark = (name, location) => {
    setLandmarks((prevLandmarks) => [
      ...prevLandmarks,
      { id: prevLandmarks.length + 1, name, position: location },
    ]);
  };

  if (!isLoaded) return <div>Loading Google Map...</div>;

  return (
    <Card className="h-full bg-white dark:bg-secondary">
      <CardHeader>
        <CardTitle>Landmarks</CardTitle>
        <CardDescription>
          Double-click on the map to add a new landmark.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[700px]">
        <SearchLocation
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCenter={setCenter}
        />
        <div className="overflow-hidden rounded-lg border border-gray-200 mt-4">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            options={{ disableDefaultUI: false, draggable: true }}
            onDblClick={handleMapDblClick}
          >
            {landmarks.map((landmark) => (
              <Marker
                key={landmark.id}
                position={landmark.position}
                title={landmark.name}
              />
            ))}
          </GoogleMap>
        </div>
      </CardContent>
      <LandmarkModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddLandmark={handleAddLandmark}
        selectedLocation={selectedLocation}
        isLoaded={isLoaded}
      />
    </Card>
  );
};

export default LandmarksTab;
