import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";

const householdAmenities = [
  { value: "wifi", label: "WiFi" },
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "heating", label: "Heating" },
  { value: "washing_machine", label: "Washing Machine" },
  { value: "dryer", label: "Dryer" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "microwave", label: "Microwave" },
  { value: "oven", label: "Oven" },
  { value: "stove", label: "Stove" },
  { value: "television", label: "Television" },
  { value: "iron", label: "Iron" },
  { value: "vacuum_cleaner", label: "Vacuum Cleaner" },
  { value: "coffee_maker", label: "Coffee Maker" },
  { value: "kettle", label: "Kettle" },
  { value: "toaster", label: "Toaster" },
  { value: "blender", label: "Blender" },
  { value: "hair_dryer", label: "Hair Dryer" },
  { value: "bed_linen", label: "Bed Linen" },
  { value: "towels", label: "Towels" },
];

function loadGoogleMapsScript(callback) {
  const existingScript = document.getElementById("googleMapsScript");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.id = "googleMapsScript";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  } else if (callback) {
    callback();
  }
}

export function FilterCard() {
  const mapRef = React.useRef(null);
  const position = { lat: 16.415, lng: 120.597 };

  const [selectedFilter, setSelectedFilter] = React.useState<string[]>([]);
  const [pins, setPins] = React.useState<{ lat: number; lng: number }[]>([]);
  const mapInstance = React.useRef(null);

  React.useEffect(() => {
    loadGoogleMapsScript(() => {
      if (mapRef.current && window.google) {
        const { Map, Marker } = window.google.maps;

        const myLatlng = { lat: 16.415, lng: 120.597 };

        const map = new Map(mapRef.current, {
          zoom: 15,
          center: myLatlng,
          mapId: process.env.NEXT_PUBLIC_MAP_ID,
        });
        mapInstance.current = map;

        map.addListener("click", (event) => {
          if (event.latLng) {
            const newPin = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            setPins((prevPins) => [...prevPins, newPin]);
            console.log("Pinned Location:", newPin);



            
          } else {
            console.error(
              "Click event did not have latLng. Please ensure you are clicking directly on the map area."
            );
          }
        });
      } else {
        console.error("Google Maps API is not available.");
      }
    });
  }, [position, pins]);

  return (
    <Card className="w-full bg-white dark:bg-secondary shadow-md lg:mt-0 md:mt-4 sm:mt-4 xs:mt-4">
      <CardHeader>
        <Card className="h-[370px] border-none">
          <div ref={mapRef} className="rounded-md w-full h-full border-none" />
        </Card>
      </CardHeader>
      <CardContent>
        <form>
          <div>
            <Label htmlFor="amenities" className="font-semibold">
              Filter Amenities
            </Label>
            <MultiSelect
              options={householdAmenities}
              onValueChange={setSelectedFilter}
              defaultValue={selectedFilter}
              placeholder="Select amenities"
              variant="inverted"
              maxCount={6}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

