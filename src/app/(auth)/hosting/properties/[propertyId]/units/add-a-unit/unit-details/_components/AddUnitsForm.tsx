"use client";

import React, { startTransition, useRef, useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import { UnitData, unitSchema } from "@/lib/schemas/unitSchema";

import { Form as ShadForm, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { SelectNative } from "@/components/ui/select-native";

import { buttonVariants, Button } from "@/components/ui/button";

import { Button as AriaButton, Group, Input as AriaInput, Label as AriaLabel, NumberField } from "react-aria-components";

import { useSearchParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import Link from "next/link";

import { CircleX, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { removeUnitById } from "@/actions/unit/removeUnitById";
import { createDuplicateUnit, updateUnit } from "@/actions/unit/update-unit";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { createClient } from "@/utils/supabase/client";

import { Tag, TagInput } from "emblor";
import { addUnitImages } from "@/actions/unit/unitImage";

function AddUnitsForm({ amenities, unitId, propertyId, userId }: { amenities?: any; unitId: string; propertyId: string; userId: string }) {
    const [isFileUploadEmpty, setIsFileUploadEmpty] = React.useState<boolean>(true);

    const [tags, setTags] = React.useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const searchParams = useSearchParams();

    const numberOfUnits = searchParams.get("numberOfUnits");

    const inputRef = useRef<HTMLInputElement>(null);

    const unitForm = useForm<UnitData>({
        resolver: zodResolver(unitSchema),
        defaultValues: {
            price: 0,
            title: "",
            privacy_type: "",
            bedrooms: 1,
            occupants: 1,
            beds: 1,
            outside_view: false,
            room_size: 0,
            amenities: [],
            additional_amenities: [],
            image: [],
        },
        mode: "onBlur",
    });

    const handleClearInput = (fieldName: keyof UnitData) => {
        unitForm.setValue(fieldName, "");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

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
            // autoProceed: true,
        }).use(Tus, {
            endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
            onBeforeRequest, // set header authorization
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
        unitForm.setValue("image", [...unitForm.getValues("image"), file.name]);
    });

    uppy.on("file-removed", (file) => {
        const currentImages = unitForm.getValues("image");
        const updatedImages = currentImages.filter((imageName) => imageName !== file.name);
        unitForm.setValue("image", updatedImages);
    });

    async function onSubmit(values: UnitData) {
        const numberOfUnitsParsed = Number(numberOfUnits);
    
        if (isNaN(numberOfUnitsParsed) || numberOfUnitsParsed < 1 || numberOfUnitsParsed > 10 || /[^0-9]/.test(numberOfUnits)) {
            toast.error("Invalid number of units.");
            router.push(`/hosting/properties/${propertyId}/details/units`);
            return;
        }
    
        if (!isPending) {
            startTransition(async () => {
                toast.promise(createDuplicateUnit(propertyId, values, numberOfUnitsParsed), {
                    loading: "Adding unit...",
                    success: async (unitIds) => {
                        if (uppy.getFiles().length > 0) {
                            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                            const bucketName = "unihomes image storage";
                            const uploadedFiles: string[] = [];
                            const supabase = createClient();
    
                            try {
                                // Iterate over unit IDs and files
                                for (const unitId of unitIds) {
                                    for (const file of uppy.getFiles()) {
                                        const objectName = `property/${userId}/${propertyId}/unit/${unitId}/unit_image/${file.name}`;
    
                                        // Upload the file to Supabase storage
                                        const { data, error } = await supabase.storage
                                            .from(bucketName)
                                            .upload(objectName, file.data as Blob);
    
                                        if (error) {
                                            console.error("Error uploading file:", error.message);
                                            throw new Error(`Failed to upload ${file.name}`);
                                        }
    
                                        // Push the public file URL into uploadedFiles
                                        const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;
                                        uploadedFiles.push(fileUrl);
                                    }
                                }
    
                                // Add the uploaded file URLs to all units
                                await addUnitImages(uploadedFiles, unitIds);
    
                                // Redirect after success
                                router.replace(`/hosting/properties/${propertyId}/details/units`);
                            } catch (error) {
                                console.error("Error during file uploads:", error.message);
                                toast.error("Failed to upload images. Please try again.");
                            }
                        }
                        return "Unit added successfully";
                    },
                    error: (error) => {
                        console.error("Error creating units:", error.message);
                        return "Something went wrong. Failed to create units.";
                    },
                });
            });
        }
    }
    

    React.useEffect(() => {
        const initialTags = unitForm.getValues("additional_amenities").map(({ id, text }: { id: string; text: string }) => ({ id: id, text: text }));
        setTags(initialTags);
    }, [unitForm]);

    return (
        <ShadForm {...unitForm}>
            <form onSubmit={unitForm.handleSubmit(onSubmit)} className="space-y-8 pb-11 bg-background max-w-6xl mx-auto">
                <FormField
                    control={unitForm.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem className="col-span-12">
                            <FormLabel htmlFor="title">Images</FormLabel>
                            <FormControl>
                                <Dashboard uppy={uppy} hideUploadButton className="col-span-3" />
                            </FormControl>
                            {unitForm.formState.errors.image ? <FormMessage /> : <FormDescription>Add images.</FormDescription>}
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-16 gap-4">
                    <FormField
                        control={unitForm.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-12">
                                <FormLabel htmlFor="title">Title</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            id="title"
                                            ref={inputRef}
                                            className={cn("pe-9", {
                                                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                    unitForm.formState.errors.title,
                                            })}
                                            placeholder="Title..."
                                            type="text"
                                            value={field.value}
                                            onChange={field.onChange}
                                            {...field}
                                        />
                                        {field.value && (
                                            <button
                                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Clear input"
                                                onClick={() => handleClearInput("title")}
                                            >
                                                <CircleX size={16} strokeWidth={2} aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                </FormControl>
                                {unitForm.formState.errors.title ? <FormMessage /> : <FormDescription>Enter title.</FormDescription>}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={unitForm.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="col-span-4">
                                <FormLabel htmlFor="price">Price</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            id="price"
                                            className={cn("peer pe-12 ps-6", {
                                                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                    unitForm.formState.errors.price,
                                            })}
                                            placeholder="0.00"
                                            type="number"
                                            {...field}
                                            {...unitForm.register("price", { valueAsNumber: true })}
                                        />
                                        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                            ₱
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                            PHP
                                        </span>
                                    </div>
                                </FormControl>
                                {unitForm.formState.errors.price ? <FormMessage /> : <FormDescription>Enter price.</FormDescription>}
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-16 gap-4">
                    <FormField
                        control={unitForm.control}
                        name="occupants"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <AriaLabel htmlFor="occupants" className="text-sm font-medium text-foreground" id="occupants-label">
                                    Occupants
                                </AriaLabel>
                                <FormControl>
                                    <NumberField
                                        id="occupants"
                                        defaultValue={field.value}
                                        minValue={0}
                                        onChange={field.onChange}
                                        aria-label="Number of occupants"
                                        aria-labelledby="occupants-label"
                                    >
                                        <div className="space-y-2">
                                            <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                <AriaButton
                                                    aria-label="Decrease number of occupants"
                                                    slot="decrement"
                                                    className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                                <AriaInput
                                                    {...field}
                                                    id="occupants"
                                                    className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    {...unitForm.register("occupants", {
                                                        valueAsNumber: true,
                                                        setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                    })}
                                                />
                                                <AriaButton
                                                    aria-label="Increase number of occupants"
                                                    slot="increment"
                                                    className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                            </Group>
                                        </div>
                                    </NumberField>
                                </FormControl>
                                {unitForm.formState.errors.occupants ? <FormMessage /> : <FormDescription>Number of occupants.</FormDescription>}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={unitForm.control}
                        name="bedrooms"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <AriaLabel htmlFor="bedrooms" id="bedrooms-label" className="text-sm font-medium text-foreground">
                                    Bedrooms
                                </AriaLabel>
                                <FormControl>
                                    <NumberField
                                        id="bedrooms"
                                        defaultValue={field.value}
                                        minValue={0}
                                        onChange={field.onChange}
                                        aria-labelledby="bedrooms-label"
                                    >
                                        <div className="space-y-2">
                                            <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                <AriaButton
                                                    aria-label="Decrease number of bedrooms"
                                                    slot="decrement"
                                                    className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                                <AriaInput
                                                    {...field}
                                                    id="bedrooms"
                                                    className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    {...unitForm.register("bedrooms", {
                                                        valueAsNumber: true,
                                                        setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                    })}
                                                />
                                                <AriaButton
                                                    aria-label="Increase number of bedrooms"
                                                    slot="increment"
                                                    className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                            </Group>
                                        </div>
                                    </NumberField>
                                </FormControl>
                                {unitForm.formState.errors.bedrooms ? <FormMessage /> : <FormDescription>Number of bedrooms.</FormDescription>}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={unitForm.control}
                        name="beds"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <AriaLabel htmlFor="beds" id="beds-label" className="text-sm font-medium text-foreground">
                                    Beds
                                </AriaLabel>
                                <FormControl>
                                    <NumberField
                                        id="beds"
                                        defaultValue={field.value}
                                        minValue={0}
                                        onChange={field.onChange}
                                        aria-labelledby="beds-label"
                                    >
                                        <div className="space-y-2">
                                            <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                <AriaButton
                                                    aria-label="Decrease number of beds"
                                                    slot="decrement"
                                                    className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                                <Input
                                                    {...field}
                                                    id="beds"
                                                    className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    {...unitForm.register("beds", {
                                                        valueAsNumber: true,
                                                        setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                    })}
                                                />
                                                <AriaButton
                                                    airia-label="Increase number of beds"
                                                    slot="increment"
                                                    className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                            </Group>
                                        </div>
                                    </NumberField>
                                </FormControl>
                                {unitForm.formState.errors.beds ? <FormMessage /> : <FormDescription>Number of beds.</FormDescription>}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={unitForm.control}
                        name="privacy_type"
                        render={({ field }) => (
                            <FormItem className="col-span-7">
                                <FormLabel htmlFor="privacy_type">Property type</FormLabel>
                                <div className={cn({ "[&_svg]:text-destructive/80": unitForm.formState.errors.privacy_type })}>
                                    <SelectNative
                                        id="privacy_type"
                                        defaultValue=""
                                        className={cn({
                                            "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                unitForm.formState.errors.privacy_type,
                                        })}
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        <option value="" disabled>
                                            Property type
                                        </option>
                                        <option value="private room">Private room</option>
                                        <option value="shared room">Shared room</option>
                                        <option value="Whole place">Whole place</option>
                                    </SelectNative>
                                </div>
                                {unitForm.formState.errors.privacy_type ? (
                                    <FormMessage />
                                ) : (
                                    <FormDescription>What describes your unit best?</FormDescription>
                                )}
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={unitForm.control}
                        name="room_size"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="room_size">Room size (in square meters)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            id="room_size"
                                            className={cn("peer pe-12", {
                                                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                    unitForm.formState.errors.room_size,
                                            })}
                                            placeholder="0.00"
                                            type="number"
                                            {...field}
                                            {...unitForm.register("room_size", { valueAsNumber: true })}
                                        />
                                        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                            m<sup>2</sup>
                                        </span>
                                    </div>
                                </FormControl>
                                {unitForm.formState.errors.room_size ? <FormMessage /> : <FormDescription>Enter room size.</FormDescription>}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={unitForm.control}
                        name="outside_view"
                        render={({ field }) => (
                            <FormItem>
                                <div>
                                    <FormLabel htmlFor="outside_view">Outside view</FormLabel>
                                </div>
                                <FormControl>
                                    <div className="inline-flex items-center gap-2">
                                        <Switch id="outside_view" checked={field.value} onCheckedChange={field.onChange} aria-label="Toggle switch" />
                                        <Label htmlFor="outside_view" className="text-sm font-medium">
                                            {field.value ? "yes" : "no"}
                                        </Label>
                                    </div>
                                </FormControl>
                                {unitForm.formState.errors.outside_view ? (
                                    <FormMessage />
                                ) : (
                                    <FormDescription>Does unit have an outside view?</FormDescription>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={unitForm.control}
                        name="amenities"
                        render={({ field }) => (
                            <FormItem>
                                <div>
                                    <FormLabel htmlFor="amenities">Amenities</FormLabel>
                                </div>
                                <FormControl>
                                    <MultipleSelector
                                        {...field}
                                        defaultOptions={amenities.map(({ id, amenity_name }: { id: string; amenity_name: string }) => ({
                                            value: id.toString(),
                                            label: amenity_name,
                                        }))}
                                        placeholder="Select amenities"
                                        emptyIndicator={<p className="text-center text-sm">No results found</p>}
                                        onChange={(selectedOptions) => {
                                            field.onChange(selectedOptions.map((option) => ({ value: option.value, label: option.label })));
                                        }}
                                        creatable
                                        value={field.value as Option[]}
                                        onSearch={(searchTerm) => {
                                            // Add the search logic here (e.g., filtering or API call)
                                            const filteredAmenities = amenities.filter((amenity) =>
                                                amenity.amenity_name.toLowerCase().includes(searchTerm.toLowerCase())
                                            );
                                            return filteredAmenities.map(({ id, amenity_name }) => ({ value: id.toString(), label: amenity_name }));
                                        }}
                                        className={cn({
                                            "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                unitForm.formState.errors.amenities,
                                        })}
                                    />
                                </FormControl>
                                {unitForm.formState.errors.amenities ? (
                                    <FormMessage />
                                ) : (
                                    <FormDescription>Select any amenity/ amenities</FormDescription>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={unitForm.control}
                        name="additional_amenities"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel className="text-left">Additional Ameneties</FormLabel>
                                <FormControl className="w-full">
                                    <TagInput
                                        {...field}
                                        placeholder="Enter additional ameneties"
                                        tags={tags}
                                        setTags={(newTags) => {
                                            const normalizedTags = newTags.map(tag => ({
                                                ...tag,
                                                text: tag.text.toLowerCase(),
                                            }));
                    
                                            // Remove duplicates
                                            const uniqueTags = normalizedTags.filter(
                                                (tag, index, self) =>
                                                    self.findIndex(t => t.text === tag.text) === index
                                            );
                    
                                            setTags(uniqueTags);
                                            unitForm.setValue("additional_amenities", uniqueTags as [Tag, ...Tag[]]);
                                            // setTags(newTags);
                                            // unitForm.setValue("additional_amenities", newTags as [Tag, ...Tag[]]);
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
                                {unitForm.formState.errors.additional_amenities ? (
                                    <FormMessage />
                                ) : (
                                    <FormDescription>Enter amenity/ amenities</FormDescription>
                                )}
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex items-center justify-start gap-4">
                    <Link
                        href={(unitForm.formState.isSubmitting || isPending) ? `` : `/hosting/properties/${propertyId}/details/units`}
                        className={cn(buttonVariants({ variant: "outline", className: "w-fit" }))}
                    >
                        Back
                    </Link>
                    <Button type="submit" disabled={unitForm.formState.isSubmitting || isPending}>
                        Submit
                    </Button>
                </div>
            </form>
        </ShadForm>
    );
}

export default AddUnitsForm;