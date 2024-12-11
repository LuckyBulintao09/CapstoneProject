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

import { Map, MapCameraChangedEvent, MapCameraProps, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

import { showErrorToast } from "@/lib/handle-error";
import { updateProperty } from "@/actions/property/update-property";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import FileInput from '@uppy/file-input';
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { createClient } from "@/utils/supabase/client";
import { addPropertyImages } from "@/actions/property/propertyImage";
import { SelectNative } from "@/components/ui/select-native";
import MultipleSelector from "@/components/ui/multiple-selector";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";
import { addPropertyBusinessPermit, addPropertyFireInspection } from "@/actions/property/propertyDocuments";

function PropertyDetailsForm({
    propertyId,
    userId,
    companyId,
    amenities,
}: {
    propertyId: string;
    userId: string;
    companyId: any;
    amenities: any;
}) {
    // console.log(amenities);

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
            description: "",
            property_type: "dormitory",
            location: {
                lat: 16.4023,
                lng: 120.596,
            },
            image: [],
            house_rules: [],
            property_amenities: [],
            business_permit: "",
            fire_inspection: "",
        },
        mode: "onChange",
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

    const [businessPermitUppy] = React.useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: ["image/jpg", "image/jpeg", "image/png", ".pdf", ".doc", ".docx"],
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

    const [fireInspectionUppy] = React.useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: ["image/jpg", "image/jpeg", "image/png", ".pdf", ".doc", ".docx"],
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

        const currentImages = createPropertyForm.getValues("image");

        if (!currentImages.includes(file.name)) {
            createPropertyForm.setValue("image", [...currentImages, file.name]);
        }

        console.log(createPropertyForm.getValues("image"))
    });

    uppy.on("file-removed", (file) => {
        const currentImages = createPropertyForm.getValues("image");
        const updatedImages = currentImages.filter((imageName) => imageName !== file.name);
        createPropertyForm.setValue("image", updatedImages);
        console.log(createPropertyForm.getValues("image"))
    });

    businessPermitUppy.on("file-added", (file) => {
        file.meta = {
            ...file.meta,
            bucketName: "unihomes image storage",
            contentType: file.type,
            cacheControl: 3600,
        };

        createPropertyForm.setValue("business_permit", file.name);
    });

    businessPermitUppy.on("file-removed", () => {
        createPropertyForm.setValue("business_permit", "");
    });

    fireInspectionUppy.on("file-added", (file) => {
        file.meta = {
            ...file.meta,
            bucketName: "unihomes image storage",
            contentType: file.type,
            cacheControl: 3600,
        };

        createPropertyForm.setValue("fire_inspection", file.name);
    });

    fireInspectionUppy.on("file-removed", () => {
        createPropertyForm.setValue("fire_inspection", "");
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

            const uploadPromises = uppy.getFiles().map(async (file) => {
                const objectName = `property/${userId}/${propertyId}/property_image/${file.name}`;
                const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;
                uppy.setFileMeta(file.id, {
                    objectName,
                });
    
                await uppy.upload();
    
                uploadedFiles.push(fileUrl);
            });

            await Promise.all(uploadPromises);

            if (businessPermitUppy.getFiles().length > 0) {
                // Business permit file upload
                const businessPermitObjectName = `property/${userId}/${propertyId}/business_permit/${businessPermitUppy.getFiles()[0].name}`;
                businessPermitUppy.setFileMeta(businessPermitUppy.getFiles()[0].id, {
                    objectName: businessPermitObjectName,
                });

                businessPermitUppy.upload().then(async (result) => {
                    if (result.failed.length > 0) {
                        console.error("Business permit upload failed", result.failed);
                        throw new Error("Business permit upload failed");
                    }

                    const BPfileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${businessPermitObjectName}`;
                    await addPropertyBusinessPermit(BPfileUrl, propertyId, userId);
                });
            }

           if (fireInspectionUppy.getFiles().length > 0) {
               // Fire inspection file upload
                const fireInspectionObjectName = `property/${userId}/${propertyId}/fire_inspection/${fireInspectionUppy.getFiles()[0].name}`;
                fireInspectionUppy.setFileMeta(fireInspectionUppy.getFiles()[0].id, {
                    objectName: fireInspectionObjectName,
                });

                fireInspectionUppy.upload().then(async (result) => {
                    if (result.failed.length > 0) {
                        console.error("Fire inspection upload failed", result.failed);
                        throw new Error("Fire inspection upload failed");
                    }

                    const FIfileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fireInspectionObjectName}`;
                    await addPropertyFireInspection(FIfileUrl, propertyId, userId);
                });
           }

            toast.promise(updateProperty(propertyId, values, uploadedFiles, companyId, userId), {
                loading: "Adding property...",
                success: () => {
                    router.replace(`/hosting/properties`);
                    return "Property added successfully!";
                },
                error: (error) => {
                    return showErrorToast(error);
                },
            });
        }
    }


    return (
        <Form {...createPropertyForm}>
            <form onSubmit={createPropertyForm.handleSubmit(onSubmit)} className="w-full mx-auto max-w-7xl px-3">
                <div className="grid airBnbTablet:grid-cols-16 grid-cols-1 gap-5">
                    <div className="airBnbTablet:col-span-10 col-span-full flex flex-col gap-5">
                        <FormField
                            control={createPropertyForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="title" className="">
                                        Property title <span className="text-destructive text-lg">*</span>
                                    </FormLabel>
                                    <div className="space-y-2">
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    id="title"
                                                    autoCapitalize="none"
                                                    autoCorrect="off"
                                                    // rows={4}
                                                    className={cn("peer pe-52", {
                                                        "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                            !!createPropertyForm.formState.errors.title ||
                                                            createPropertyForm.watch("title", "").length > 52,
                                                    })}
                                                    placeholder="Your property title"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    {...field}
                                                />
                                                <div className="text-muted-foreground text-sm font-medium pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 tabular-nums peer-disabled:opacity-50">
                                                    {createPropertyForm.watch("title", "").length <= 52
                                                        ? `${
                                                              52 - createPropertyForm.watch("title", "").length
                                                          } characters remaining`
                                                        : `${
                                                              createPropertyForm.watch("title", "").length - 52
                                                          } characters over the limit`}
                                                </div>
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
                                    <FormLabel>
                                        Description <span className="text-destructive text-lg">*</span>
                                    </FormLabel>
                                    <div className="space-y-2">
                                        <FormControl>
                                            <div className="flex flex-col items-center w-full">
                                                <Textarea
                                                    id="description"
                                                    autoCapitalize="none"
                                                    autoCorrect="off"
                                                    rows={10}
                                                    className={cn("w-full resize-none", {
                                                        "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                            createPropertyForm.formState.errors.description,
                                                    })}
                                                    placeholder="Describe your place"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    {...field}
                                                />
                                                <div className="inline-flex justify-end w-full mt-1 text-muted-foreground text-sm font-medium">
                                                    {(createPropertyForm.watch("description", "") || "").length <= 1000
                                                        ? `${
                                                              1000 -
                                                              (createPropertyForm.watch("description", "") || "").length
                                                          } characters remaining`
                                                        : `${
                                                              (createPropertyForm.watch("description", "") || "")
                                                                  .length - 1000
                                                          } characters over the limit`}
                                                </div>
                                            </div>
                                        </FormControl>
                                        {createPropertyForm.formState.errors.description ? (
                                            <FormMessage />
                                        ) : (
                                            <FormDescription>Enter your property description here.</FormDescription>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createPropertyForm.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="address">
                                        Address <span className="text-destructive text-lg">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            ref={autocompleteRef}
                                            id="address"
                                            className={cn("w-full resize-none", {
                                                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                    createPropertyForm.formState.errors.address,
                                            })}
                                        />
                                    </FormControl>
                                    {createPropertyForm.formState.errors.address ? (
                                        <FormMessage className="" />
                                    ) : (
                                        <FormDescription>Enter your property address here.</FormDescription>
                                    )}
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
                                                    <Label
                                                        htmlFor="pinpoint location switch"
                                                        className="text-sm font-medium"
                                                    >
                                                        {enableMap ? "On" : "Off"}
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </FormControl>
                                    {createPropertyForm.formState.errors.location ? (
                                        <FormMessage className="" />
                                    ) : (
                                        <FormDescription>
                                            For more accuracy, you can also pinpoint your property location here.
                                            Optional
                                        </FormDescription>
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
                                        House rules <span className="text-destructive text-lg">*</span>
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
                                                input: cn(
                                                    {
                                                        "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                            createPropertyForm.formState.errors.house_rules,
                                                    },
                                                    "rounded-lg transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
                                                ),
                                                tag: {
                                                    body: "hidden",
                                                    closeButton: "block",
                                                },
                                            }}
                                            clearAllButton={true}
                                            setActiveTagIndex={setActiveTagIndex}
                                            activeTagIndex={activeTagIndex}
                                            inlineTags={false}
                                            inputFieldPosition="top"
                                        />
                                    </FormControl>
                                    {/* Error Messages */}
                                    {createPropertyForm.formState.errors.house_rules?.message && (
                                        <FormMessage>
                                            {createPropertyForm.formState.errors.house_rules.message}
                                        </FormMessage>
                                    )}

                                    {Array.isArray(createPropertyForm.formState.errors.house_rules) &&
                                        createPropertyForm.formState.errors.house_rules.map((error, index) => (
                                            <FormMessage key={index}>
                                                Rule {index + 1}: {error?.text?.message}
                                            </FormMessage>
                                        ))}

                                    {/* Description */}
                                    {!createPropertyForm.formState.errors.house_rules && (
                                        <FormDescription>
                                            Enter house rules here. Type a rule then press enter when you're done. You
                                            can do this any number of times.
                                        </FormDescription>
                                    )}
                                </FormItem>
                            )}
                        />
                        {/* Render Bulleted List of Tags */}
                        {tags.length > 0 && (
                            <div className="w-full border rounded-xl px-3 py-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Preview</span>
                                    <Button
                                        onClick={() => {
                                            setTags([]);
                                            createPropertyForm.setValue("house_rules", []);
                                        }}
                                        size="sm"
                                        variant="destructive"
                                        className="text-xs"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                                <ul className="list-inside text-sm text-foreground h-[200px] overflow-y-auto max-h-[200px]">
                                    {tags.map((tag, index) => (
                                        <li key={tag.id} className="leading-6 flex items-center gap-2">
                                            <Button
                                                onClick={() => {
                                                    const updatedTags = tags.filter((_, i) => i !== index);
                                                    setTags(updatedTags);
                                                    createPropertyForm.setValue(
                                                        "house_rules",
                                                        updatedTags as [Tag, ...Tag[]] | []
                                                    );
                                                }}
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs rounded-full h-8 w-8 p-0"
                                                aria-label={`Remove rule: ${tag.text}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <div className="flex items-center gap-2">
                                                <ExclamationTriangleIcon className="w-4 h-4 text-warning" />
                                                {tag.text}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="airBnbTablet:col-span-6 col-span-full flex flex-col gap-5">
                        <FormField
                            control={createPropertyForm.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel htmlFor="image">
                                        Property images <span className="text-destructive text-lg">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Dashboard uppy={uppy} hideUploadButton height={300} id="image" />
                                    </FormControl>
                                    {createPropertyForm.formState.errors.image ? (
                                        <FormMessage />
                                    ) : (
                                        <FormDescription>Add images.</FormDescription>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createPropertyForm.control}
                            name="property_type"
                            render={({ field }) => (
                                <FormItem className="col-span-7">
                                    <FormLabel htmlFor="property_type">
                                        Property type <span className="text-destructive text-lg">*</span>
                                    </FormLabel>
                                    <div
                                        className={cn({
                                            "[&_svg]:text-destructive/80":
                                                createPropertyForm.formState.errors.property_type,
                                        })}
                                    >
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
                            name="property_amenities"
                            render={({ field }) => (
                                <FormItem>
                                    <div>
                                        <FormLabel htmlFor="property_amenities">
                                            Amenities <span className="text-destructive text-lg">*</span>
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <MultipleSelector
                                            {...field}
                                            defaultOptions={amenities.map(
                                                ({ id, amenity_name }: { id: string; amenity_name: string }) => ({
                                                    value: id.toString(),
                                                    label: amenity_name,
                                                })
                                            )}
                                            placeholder="Select amenities"
                                            emptyIndicator={<p className="text-center text-sm">No results found</p>}
                                            onChange={(selectedOptions) => {
                                                field.onChange(
                                                    selectedOptions.map((option) => ({
                                                        value: option.value,
                                                        label: option.label,
                                                    }))
                                                );
                                            }}
                                            creatable
                                            value={field.value as Option[]}
                                            onSearch={(searchTerm) => {
                                                // Add the search logic here (e.g., filtering or API call)
                                                const filteredAmenities = amenities.filter((amenity) =>
                                                    amenity.amenity_name
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase())
                                                );
                                                return filteredAmenities.map(({ id, amenity_name }) => ({
                                                    value: id.toString(),
                                                    label: amenity_name,
                                                }));
                                            }}
                                            className={cn({
                                                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                    createPropertyForm.formState.errors.property_amenities,
                                            })}
                                        />
                                    </FormControl>
                                    {createPropertyForm.formState.errors.property_amenities ? (
                                        <FormMessage />
                                    ) : (
                                        <FormDescription>Select an amenity or multiple amenities</FormDescription>
                                    )}
                                </FormItem>
                            )}
                        />

                        <div className="border border-warning rounded-md px-3 py-2 flex flex-col gap-5">
                            <div>
                                {" "}
                                <Label>Documents</Label>
                                <p className="text-sm text-foreground">
                                    These files necessary for your property to be listed on the platform. You may add
                                    them later on when you go to the property after creation.
                                </p>
                            </div>
                            <FormField
                                control={createPropertyForm.control}
                                name="business_permit"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel htmlFor="fire_inspection">Business permit</FormLabel>
                                        <FormControl>
                                            <Dashboard
                                                uppy={businessPermitUppy}
                                                hideUploadButton
                                                height={150}
                                                id="business_permit"
                                            />
                                        </FormControl>
                                        {createPropertyForm.formState.errors.image ? (
                                            <FormMessage />
                                        ) : (
                                            <FormDescription>Add business permit.</FormDescription>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={createPropertyForm.control}
                                name="fire_inspection"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel htmlFor="fire_inspection">Fire inspection permit</FormLabel>
                                        <FormControl>
                                            <Dashboard
                                                uppy={fireInspectionUppy}
                                                hideUploadButton
                                                height={150}
                                                id="fire_inspection"
                                            />
                                        </FormControl>
                                        {createPropertyForm.formState.errors.image ? (
                                            <FormMessage />
                                        ) : (
                                            <FormDescription>Add file inspection.</FormDescription>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
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
            className={cn("w-full h-[250px]", className)}
        >
            <Marker position={cameraProps.center} />
        </Map>
    );
};

export default PropertyDetailsForm;
