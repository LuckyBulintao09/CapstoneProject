"use client";

import React, { startTransition, useRef, useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UnitData, unitSchema } from "@/lib/schemas/unitSchema";

import { Form as ShadForm, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { buttonVariants, Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button as AriaButton, Group, Input as AriaInput, Label as AriaLabel, NumberField } from "react-aria-components";
import { SelectNative } from "@/components/ui/select-native";
import { toast } from "sonner";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import Link from "next/link";

import { CircleX, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { removeUnitById } from "@/actions/unit/removeUnitById";
import { updateUnit } from "@/actions/unit/update-unit";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import Form from "@uppy/form";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { createClient } from "@/utils/supabase/client";

function AddUnitsForm({ amenities, unitId, propertyId, userId }: { amenities?: any; unitId: string; propertyId: string; userId: string }) {
    const [isFileUploadEmpty, setIsFileUploadEmpty] = React.useState<boolean>(true);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

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
        },
        mode: "onBlur",
    });

    // set user authentication headers for image upload
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
            autoProceed: true,
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
            objectName: `property/${userId}/${propertyId}/${unitId}/unit_image/${file.name}`,
            contentType: file.type,
            cacheControl: 3600,
        };
    });

    uppy.on("upload-success", (file, response) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const bucketName = file.meta.bucketName;
        const objectName = file.meta.objectName;

        const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;

        console.log("Upload successful:", response, "File URL:", fileUrl);

        setUploadedFiles((prevImages) => {
            const alreadyUploaded = prevImages.some((url) => url === fileUrl);

            if (alreadyUploaded) {
                return prevImages;
            }

            return [...prevImages, fileUrl];
        });
    });
    

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClearInput = (fieldName: keyof UnitData) => {
        unitForm.setValue(fieldName, "");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    async function onSubmit(values: UnitData) {
        if (!isPending) {
            startTransition(() => {
                toast.promise(updateUnit(unitId, propertyId, values, uploadedFiles), {
                    loading: "Adding unit in...",
                    success: () => {
                        return "Unit added successfully";
                    },
                    error: (error) => {
                        console.log(error.message);
                        return error.message;
                    },
                });
            });
        }
        console.log(uploadedFiles, "uploaded files onclick");
    }

    return (
        <ShadForm {...unitForm}>
            <form onSubmit={unitForm.handleSubmit(onSubmit)} className="space-y-8 pb-11 bg-background max-w-6xl mx-auto">
                
                <Dashboard uppy={uppy} hideUploadButton className="col-span-3" />

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
                                <AriaLabel htmlFor="occupants" className="text-sm font-medium text-foreground">
                                    Occupants
                                </AriaLabel>
                                <FormControl>
                                    <NumberField defaultValue={field.value} minValue={0} onChange={field.onChange}>
                                        <div className="space-y-2">
                                            <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                <AriaButton
                                                    slot="decrement"
                                                    className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                                <Input
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
                                <AriaLabel htmlFor="bedrooms" className="text-sm font-medium text-foreground">
                                    Bedrooms
                                </AriaLabel>
                                <FormControl>
                                    <NumberField defaultValue={field.value} minValue={0} onChange={field.onChange}>
                                        <div className="space-y-2">
                                            <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                <AriaButton
                                                    slot="decrement"
                                                    className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                </AriaButton>
                                                <Input
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
                                <AriaLabel htmlFor="beds" className="text-sm font-medium text-foreground">
                                    Beds
                                </AriaLabel>
                                <FormControl>
                                    <NumberField defaultValue={field.value} minValue={0} onChange={field.onChange}>
                                        <div className="space-y-2">
                                            <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                <AriaButton
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
                                    <FormLabel htmlFor="outside_view">Amenities</FormLabel>
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
                                        value={field.value as Option[]}
                                        onSearch={(searchTerm) => {
                                            // Add the search logic here (e.g., filtering or API call)
                                            const filteredAmenities = amenities.filter((amenity) =>
                                                amenity.amenity_name.toLowerCase().includes(searchTerm.toLowerCase())
                                            );
                                            return filteredAmenities.map(({ id, amenity_name }) => ({ value: id.toString(), label: amenity_name }));
                                        }}
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
                </div>
                <div className="flex items-center justify-start gap-4">
                    <Link
                        href={`/hosting/properties/${propertyId}/details/units`}
                        onClick={async () => await removeUnitById(unitId, propertyId)}
                        // disabled={unitForm.formState.isSubmitting || isPending}
                        className={cn(buttonVariants({ variant: "outline", className: "w-fit" }))}
                    >
                        Back
                    </Link>
                    <Button type="submit" disabled={unitForm.formState.isSubmitting || isPending}>
                        Submit
                    </Button>
                    <Button onClick={() => console.log(uploadedFiles, "uploadedFiles")} type="button">
                        Test uploads
                    </Button>
                </div>
            </form>
        </ShadForm>
    );
}

export default AddUnitsForm;
