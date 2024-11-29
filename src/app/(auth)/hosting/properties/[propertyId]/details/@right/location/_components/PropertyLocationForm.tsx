"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { Map, MapCameraChangedEvent, MapCameraProps, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

import { cn } from "@/lib/utils";

import { PropertyLocationData, propertyLocationSchema } from "@/lib/schemas/propertySchemaV2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePropertyLocation } from "@/actions/property/update-property";

function PropertyLocationForm({propertyId, location, address}: {propertyId: string, location: {latitude: number | any, longitude: number | any}, address: string}) {
    const [isPending, startTransition] = React.useTransition();
    const [enableMap, setEnableMap] = React.useState(false);
    const [placesAutocomplete, setPlacesAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

    const router = useRouter();
    const autocompleteRef = React.useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");

    const propertyLocationForm = useForm<PropertyLocationData>({
        resolver: zodResolver(propertyLocationSchema),
        defaultValues: {
            property_address: address,
            property_location: {
                lat: location.latitude,
                lng: location.longitude,
            },
        },
    });

    React.useEffect(() => {
        if (!places || !autocompleteRef.current) return;

        const options = {
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(117.17427453, 5.58100332277),
                new google.maps.LatLng(126.537423944, 18.5052273625)
            ),
            fields: ["geometry", "name", "formatted_address"],
            componentRestrictions: { country: "ph" },
        };
        autocompleteRef.current.setAttribute("placeholder", "");
        setPlacesAutocomplete(new places.Autocomplete(autocompleteRef.current, options));
    }, [places]);

    React.useEffect(() => {
        if (!placesAutocomplete) return;

        placesAutocomplete.addListener("place_changed", () => {
            const place = placesAutocomplete.getPlace();
            const location = place.geometry?.location;

            if (location) {
                propertyLocationForm.setValue("property_location", {
                    lat: location.lat(),
                    lng: location.lng(),
                });
                if (place.formatted_address && typeof place.formatted_address === "string") {
                    propertyLocationForm.setValue("property_address", place.formatted_address);
                } else {
                    propertyLocationForm.resetField("property_address");
                }
            }
        });
    }, [placesAutocomplete, propertyLocationForm]);

    async function onSubmit(values: PropertyLocationData) {
        if (!isPending) {
            startTransition(() => {
                toast.promise(updatePropertyLocation(propertyId, values.property_address, values.property_location), {
                    loading: "Saving changes...",
                    success: () => {
                        return "Description updated successfully";
                    },
                    error: (error) => {
                        return error.message;
                    },
                });
            });
        }
    }
    return (
        <Form {...propertyLocationForm}>
            <form onSubmit={propertyLocationForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={propertyLocationForm.control}
                    name="property_address"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="group relative">
                                    <label
                                        htmlFor="address"
                                        className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                                    >
                                        <span className="inline-flex bg-background px-2">Address</span>
                                    </label>
                                    <Input {...field} ref={autocompleteRef} id="address" autoCapitalize="none" autoCorrect="off" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={propertyLocationForm.control}
                    name="property_location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only" htmlFor="property_location">
                                Location
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <ControlledMap
                                        field={{
                                            value: { lat: field.value.lat, lng: field.value.lng },
                                            onChange: field.onChange,
                                        }}
                                        disabled={!enableMap}
                                    />
                                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-background px-3 py-2 rounded-lg">
                                        <span>Pinpoint location</span>
                                        <div className="inline-flex items-center gap-2">
                                            <Switch
                                                id="pinpoint location switch"
                                                checked={enableMap}
                                                onCheckedChange={setEnableMap}
                                                aria-label="Toggle switch"
                                            />
                                            <Label htmlFor="pinpoint location switch" className="text-sm font-medium">
                                                {enableMap ? "On" : "Off"}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </FormControl>
                            <FormDescription>Pinpoint your location here for more accuracy.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={
                        isPending ||
                        propertyLocationForm.formState.isSubmitting ||
                        propertyLocationForm.formState.errors.property_address !== undefined
                    }
                >
                    {(isPending || propertyLocationForm.formState.isSubmitting) && (
                        <svg
                            aria-hidden="true"
                            className="size-6 mr-2 fill-accent animate-spin-fade dark:text-accent-foreground text-primary"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    )}
                    Save
                </Button>
            </form>
        </Form>
    );
}

const ControlledMap = ({ field, disabled, className }: { field: any; disabled?: boolean; className?: string }) => {
    const [cameraProps, setCameraProps] = React.useState({
        center: field.value,
        zoom: 20,
    });

    const handleCameraChange = React.useCallback(
        (ev: MapCameraChangedEvent) => {
            const newCenter = ev.detail.center;
            const newZoom = ev.detail.zoom;

            // Update the camera properties
            setCameraProps({ center: newCenter, zoom: newZoom });

            // Update the location in the form
            field.onChange(newCenter);
        },
        [field]
    );

    React.useEffect(() => {
        // When field.value changes, update the center and keep the current zoom
        setCameraProps((prev) => ({
            center: field.value,
            zoom: prev.zoom, // Keep the previous zoom
        }));
    }, [field.value]);
    

    return (
        <Map
            {...cameraProps}
            onCameraChanged={!disabled ? handleCameraChange : undefined}
            gestureHandling={disabled ? "none" : "greedy"}
            disableDefaultUI={true}
            zoomControl={!disabled ? true : false}
            className={cn("w-full h-[300px]", className)}
        >
            <Marker position={cameraProps.center} />
        </Map>
    );
};
export default PropertyLocationForm;
