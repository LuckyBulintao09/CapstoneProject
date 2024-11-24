// hooks/usePlacesAutocomplete.ts
import { useEffect, useState } from "react";

export default function usePlacesAutocomplete(
  inputRef: React.RefObject<HTMLInputElement>,
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const loadAutocomplete = () => {
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.places &&
        inputRef.current
      ) {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["place_id", "geometry", "name", "formatted_address"],
          }
        );

        autocompleteInstance.addListener("place_changed", () => {
          const place = autocompleteInstance.getPlace();
          if (place) {
            onPlaceSelected(place);
          }
        });

        setAutocomplete(autocompleteInstance);
      } else {
        console.error("Google Maps API is not loaded.");
      }
    };

    if (typeof window !== "undefined" && window.google) {
      loadAutocomplete();
    }
  }, [inputRef, onPlaceSelected]);

  return autocomplete;
}
