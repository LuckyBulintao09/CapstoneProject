// components/SearchLocation.tsx
import React, { useRef, useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface SearchLocationProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
}

const SearchLocation: React.FC<SearchLocationProps> = ({
  searchTerm,
  setSearchTerm,
  setCenter,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [placesAutocomplete, setPlacesAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places"); // Load the 'places' library using useMapsLibrary

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(117.17427453, 5.58100332277),
        new google.maps.LatLng(126.537423944, 18.5052273625)
      ),
      fields: ["geometry", "name", "formatted_address"],
      componentRestrictions: { country: "ph" },
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);
    setPlacesAutocomplete(autocomplete);

    // Event listener for place change
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;

      if (location) {
        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        setSearchTerm(place.formatted_address || place.name || "");
      }
    });
  }, [places, setCenter, setSearchTerm]);

  return (
    <div className="w-full mb-4">
      <Input
        ref={inputRef}
        clearable
        underlined
        fullWidth
        label="Search Location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a place"
      />
    </div>
  );
};

export default SearchLocation;
