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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tag, TagInput } from "emblor";

import { createPropertySchema, CreatePropertyTypes } from "@/lib/schemas/propertySchema";

import ListingStepButton from "../add-listing/ListingStepButton";

import { Map, MapCameraChangedEvent, MapCameraProps, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

import { showErrorToast } from "@/lib/handle-error";
import { updateProperty } from "@/actions/property/update-property";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { createClient } from "@/utils/supabase/client";
import { addPropertyImages } from "@/actions/property/propertyImage";
import { SelectNative } from "@/components/ui/select-native";


function PropertyDetailsForm({ propertyId, userId, companyId }: { propertyId: string, userId: string, companyId: any }) {
    const router = useRouter();
    const [enableMap, setEnableMap] = React.useState(false);
    const [placesAutocomplete, setPlacesAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

    const [tags, setTags] = React.useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

    const autocompleteRef = React.useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");


    const createPropertyForm = useForm<CreatePropertyTypes>({
        resolver: zodResolver(createPropertySchema),
        defaultValues: {
            title: "",
            address: "",
            location: {
                lat: 16.4023,
                lng: 120.596,
            },
            description: "",
            image: [],
            house_rules: [],
            property_type: "dormitory"
        },
    });

    const onBeforeRequest = async (req: any) => {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
    };

    const [uppy] = React.useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: 5,
                allowedFileTypes: ["image/jpg", "image/jpeg", "image/png"],
                maxFileSize: 6 * 1024 * 1024,
            },
        }).use(Tus, {
            endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
            onBeforeRequest,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
                "x-upsert": "true",
            },
            allowedMetaFields: ["bucketName", "objectName", "contentType", "cacheControl"],
            removeFingerprintOnSuccess: true,
            chunkSize: 6 * 1024 * 1024,
        })
    );

    uppy.on("file-added", (file) => {
        file.meta = {
            ...file.meta,
            bucketName: "unihomes image storage",
            contentType: file.type,
            cacheControl: 3600,
        };
        createPropertyForm.setValue("image", [...createPropertyForm.getValues("image"), file.name]);
    });

    uppy.on("file-removed", (file) => {
        const currentImages = createPropertyForm.getValues("image");
        const updatedImages = currentImages.filter((imageName) => imageName !== file.name);
        createPropertyForm.setValue("image", updatedImages);
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
        setPlacesAutocomplete(new places.Autocomplete(autocompleteRef.current, options));
    }, [places]);

    React.useEffect(() => {
        if (!placesAutocomplete) return;

        placesAutocomplete.addListener("place_changed", () => {
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
        if (uppy.getFiles().length > 0) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const bucketName = "unihomes image storage";

            const uploadedFiles: string[] = [];

            const uploadFiles = uppy.getFiles().map(async (file, index) => {
                const objectName = `property/${userId}/${propertyId}/property_image/${file.name}`;
                const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;
                uppy.setFileMeta(file.id, {
                    objectName,
                });

                uploadedFiles.push(fileUrl);

                await uppy.upload();
            });

            await Promise.all(uploadedFiles);

            toast.promise(updateProperty(propertyId, values, uploadedFiles, companyId), {
                loading: "Adding property...",
                success: () => {
                    router.push(`/hosting/properties`);
                    return toast.success("Property added successfully!");
                },
                error: (error) => {
                    return showErrorToast(error);
                },
            });
        }
    }

    return (
        <Form {...createPropertyForm}>
            <form onSubmit={createPropertyForm.handleSubmit(onSubmit)} className="w-full mx-auto max-w-7xl">
                <div className="grid grid-cols-12 gap-7">
                    <div className="col-span-6 flex flex-col gap-7">
                        <FormField
                            control={createPropertyForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="title" className="">
                                        Property title
                                    </FormLabel>
                                    <div className="space-y-2">
                                        <div className="text-muted-foreground text-sm font-medium">
                                            {createPropertyForm.watch("title", "").length <= 52
                                                ? `${52 - createPropertyForm.watch("title", "").length} characters remaining`
                                                : `${createPropertyForm.watch("title", "").length - 52} characters over the limit`}
                                        </div>
                                        <FormControl>
                                            <div className="mt-2">
                                                <Input
                                                    id="title"
                                                    autoCapitalize="none"
                                                    autoCorrect="off"
                                                    // rows={4}
                                                    className=""
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        {createPropertyForm.formState.errors.title ? (
                                            <FormMessage className="" />
                                        ) : (
                                            <FormDescription>Enter your property name here.</FormDescription>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createPropertyForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <div className="space-y-2">
                                        <div className="text-muted-foreground text-sm font-medium">
                                            {(createPropertyForm.watch("description", "") || "").length <= 1000
                                                ? `${1000 - (createPropertyForm.watch("description", "") || "").length} characters remaining`
                                                : `${(createPropertyForm.watch("description", "") || "").length - 1000} characters over the limit`}
                                        </div>
                                        <FormControl>
                                            <div className="mt-2">
                                                <Textarea
                                                    id="description"
                                                    autoCapitalize="none"
                                                    autoCorrect="off"
                                                    rows={14}
                                                    className="w-full resize-none"
                                                    placeholder="Describe your place"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        {createPropertyForm.formState.errors.description ? (
                                            <FormMessage className="" />
                                        ) : (
                                            <FormDescription>Enter your property description here.</FormDescription>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">
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
                                    <FormLabel className="sr-only" htmlFor="location">
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
                    </div>

                    <div className="col-span-6">
                        <FormField
                            control={createPropertyForm.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="col-span-12">
                                    <FormLabel htmlFor="title">Images</FormLabel>
                                    <FormControl>
                                        <Dashboard uppy={uppy} hideUploadButton className="col-span-3" />
                                    </FormControl>
                                    {createPropertyForm.formState.errors.image ? <FormMessage /> : <FormDescription>Add images.</FormDescription>}
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6 flex flex-col gap-7">
                        <FormField
                            control={createPropertyForm.control}
                            name="property_type"
                            render={({ field }) => (
                                <FormItem className="col-span-7">
                                    <FormLabel htmlFor="property_type">Property type</FormLabel>
                                    <div className={cn({ "[&_svg]:text-destructive/80": createPropertyForm.formState.errors.property_type })}>
                                        <SelectNative
                                            id="property_type"
                                            defaultValue=""
                                            className={cn({
                                                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                    createPropertyForm.formState.errors.property_type,
                                            })}
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="" disabled>
                                                Property type
                                            </option>
                                            <option value="apartment">Apartment</option>
                                            <option value="condominium">Condominium</option>
                                            <option value="dormitory">Dormitory</option>
                                        </SelectNative>
                                    </div>
                                    {createPropertyForm.formState.errors.property_type ? (
                                        <FormMessage />
                                    ) : (
                                        <FormDescription>What describes your unit best?</FormDescription>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createPropertyForm.control}
                            name="house_rules"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel className="text-left" htmlFor="house_rules">
                                        House rules
                                    </FormLabel>
                                    <FormControl className="w-full">
                                        <TagInput
                                            id="house_rules"
                                            {...field}
                                            placeholder="Enter house rules"
                                            tags={tags}
                                            setTags={(newTags) => {
                                                setTags(newTags);
                                                createPropertyForm.setValue("house_rules", newTags as [Tag, ...Tag[]]);
                                            }}
                                            styleClasses={{
                                                tagList: {
                                                    container: "gap-1 max-h-[94px] overflow-y-auto rounded-md",
                                                },
                                                input: "rounded-lg transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
                                                tag: {
                                                    body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                                                    closeButton:
                                                        "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
                                                },
                                            }}
                                            clearAllButton
                                            setActiveTagIndex={setActiveTagIndex}
                                            activeTagIndex={activeTagIndex}
                                            inlineTags={false}
                                            inputFieldPosition="top"
                                        />
                                    </FormControl>
                                    {createPropertyForm.formState.errors.house_rules ? (
                                        <FormMessage />
                                    ) : (
                                        <FormDescription>Enter house rules here. Type a rule then press enter when you're done. You can do this any number of times.</FormDescription>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-7">
                    <Link href={`/hosting/properties`} className={cn(buttonVariants({ variant: "outline" }))}>
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
            className={cn("w-full h-[400px]", className)}
        >
            <Marker position={cameraProps.center} />
        </Map>
    );
};

export default PropertyDetailsForm;
