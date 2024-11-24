import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const LandmarkModal = ({
  isOpen,
  onOpenChange,
  onAddLandmark,
  selectedLocation,
  isLoaded,
}) => {
  const [landmarkName, setLandmarkName] = useState("");
  const [mapCenter, setMapCenter] = useState(
    selectedLocation || { lat: 14.5995, lng: 120.9842 }
  );
  const [selectedMarker, setSelectedMarker] = useState(selectedLocation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter(selectedLocation);
      setSelectedMarker(selectedLocation);
    }
  }, [selectedLocation]);

  const insertLandmarkToDB = async (name, location) => {
    try {
      const { data, error } = await supabase.from("landmarks").insert([
        {
          name,
          location: `SRID=4326;POINT(${location.lng} ${location.lat})`,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error.message);
        alert("Failed to add landmark. Please try again.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected error:", error.message);
      alert("An unexpected error occurred. Please try again.");
      return false;
    }
  };

  const handleAddLandmark = async () => {
    if (landmarkName && selectedMarker) {
      setIsSubmitting(true);
      const success = await insertLandmarkToDB(landmarkName, selectedMarker);
      setIsSubmitting(false);

      if (success) {
        onAddLandmark(landmarkName, selectedMarker);
        setLandmarkName("");
        setSelectedMarker(null);
        onOpenChange(false);
      }
    } else {
      alert("Please provide a name and select a location on the map.");
    }
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Add New Landmark</ModalHeader>
        <ModalBody>
          <Input
            label="Landmark Name"
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
            placeholder="Enter the name of the landmark"
            fullWidth
          />
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "300px" }}
            center={mapCenter}
            zoom={13}
            onClick={(e) => {
              const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
              setSelectedMarker(location);
              setMapCenter(location);
            }}
          >
            {selectedMarker && <Marker position={selectedMarker} />}
          </GoogleMap>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleAddLandmark}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Landmark"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LandmarkModal;
