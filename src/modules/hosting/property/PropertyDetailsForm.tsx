"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { createPropertySchema, CreatePropertyTypes } from "@/lib/schemas/propertySchema";

import ListingStepButton from "../add-listing/ListingStepButton";

import { Map, MapCameraChangedEvent, MapCameraProps, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

import { showErrorToast } from "@/lib/handle-error";
import { updateProperty } from "@/actions/property/update-property";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CompanyData = {
    id: string;
    company_name: string;
}[];

function PropertyDetails({ companies, propertyId }: { companies: CompanyData; propertyId: string }) {
    const router = useRouter();
    const [enableMap, setEnableMap] = React.useState(false);
    const [placesAutocomplete, setPlacesAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

    const autocompleteRef = React.useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');

    const createPropertyForm = useForm<CreatePropertyTypes>({
        resolver: zodResolver(createPropertySchema),
        defaultValues: {
            title: "",
            company_id: "",
            address: "",
            location: {
                lat: 16.4023,
                lng: 120.596,
            },
        },
    });

    React.useEffect(() => {
        if (!places || !autocompleteRef.current) return;

        const options = {
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(117.17427453, 5.58100332277),
                new google.maps.LatLng(126.537423944, 18.5052273625),

            ),
            fields: ["geometry", "name", "formatted_address"],
            componentRestrictions: { country: "ph" },
        }
        setPlacesAutocomplete(new places.Autocomplete(autocompleteRef.current, options));
    }, [places])
    
    React.useEffect(() => {
        if (!placesAutocomplete) return;
    
        placesAutocomplete.addListener('place_changed', () => {
          const place = placesAutocomplete.getPlace();
          const location = place.geometry?.location;

          if (location) {
            createPropertyForm.setValue("location", {
                lat: location.lat(),
                lng: location.lng(),
            });
            if (place.formatted_address && typeof place.formatted_address === "string") {
                createPropertyForm.setValue("address", place.formatted_address);
            } else {
                createPropertyForm.resetField("address");
            }
          }
        });
    }, [placesAutocomplete, createPropertyForm]);

    async function onSubmit(values: CreatePropertyTypes) {
        toast.promise(updateProperty(propertyId, values), {
            loading: "Adding property...",
            success: () => {
                router.push(`/hosting/property`)
                return toast.success("Property added successfully!");
            },
            error: (error) => {
                return showErrorToast(error)
            },
        })
        console.log(values);
    }

    return (
        <Form {...createPropertyForm}>
            <form onSubmit={createPropertyForm.handleSubmit(onSubmit)} className="space-y-6 my-11 max-w-xl w-full">
                <FormField
                    control={createPropertyForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="title">Property name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Property name" />
                            </FormControl>
                            <FormDescription>Enter your address here.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={createPropertyForm.control}
                    name="company_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="company_id">Company</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a company" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {companies?.map(({ id, company_name }) => (
                                        <SelectItem value={id.toString()} key={id} id={id}>
                                            {company_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select a company you wish to create a listing for.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={createPropertyForm.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="address">Address</FormLabel>
                            <FormControl>
                                <Input {...field} ref={autocompleteRef} />
                            </FormControl>
                            <FormDescription>Enter your address here.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={createPropertyForm.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex justify-between items-center w-full" htmlFor="location">
                                Pinpooint location
                                <Switch checked={enableMap} onCheckedChange={setEnableMap} />
                            </FormLabel>
                            <FormControl>
                                <ControlledMap
                                    field={{
                                        value: { lat: field.value.lat, lng: field.value.lng },
                                        onChange: field.onChange,
                                    }}
                                    disabled={!enableMap}
                                />
                            </FormControl>
                            <FormDescription>Pinpoint your location here for more accuracy.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Link href={`/hosting/property`} className={cn(buttonVariants({ variant: "outline" }))}>
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}


const ControlledMap = ({ field, disabled }) => {
    const [cameraProps, setCameraProps] = React.useState({
        center: field.value,
        zoom: 15
    });

    const handleCameraChange = React.useCallback((ev: MapCameraChangedEvent) => {
        const newCenter = ev.detail.center;
        const newZoom = ev.detail.zoom;
        
        // Update the camera properties
        setCameraProps({ center: newCenter, zoom: newZoom });
        
        // Update the location in the form
        field.onChange(newCenter);
    }, [field]);

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
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            zoomControl={true}
            className="w-full h-[400px]"
        >
            <Marker position={cameraProps.center} />
        </Map>
    );
};

export default PropertyDetails;
