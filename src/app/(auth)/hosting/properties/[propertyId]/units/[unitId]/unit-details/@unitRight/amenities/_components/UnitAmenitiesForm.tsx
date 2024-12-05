"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { UnitAmenityData, unitAmenitySchema } from "@/lib/schemas/editUnitSchema";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { buttonVariants, Button } from "@/components/ui/button";

import { toast } from "sonner";

import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { updateUnitAmenities } from "@/actions/unit/update-unit";

import { Tag, TagInput } from "emblor";

function UnitAmenitiesForm({ unitId, amenities, allAmenities, additionalAmenities }: { unitId: string; amenities: any; allAmenities: any, additionalAmenities: any }) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    const [tags, setTags] = React.useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

    const unitAmenitiesForm = useForm<UnitAmenityData>({
        resolver: zodResolver(unitAmenitySchema),
        defaultValues: {
            amenities: amenities.map(({ amenity_id, amenity_name }: { amenity_id: number; amenity_name: string }) => ({
                value: amenity_id.toString(),
                label: amenity_name,
            })),
            additional_amenities: additionalAmenities.map(({ id, text }: { id: number; text: string }) => ({
                id: id.toString(),
                text: text,
            })),
        },
        mode: "onBlur",
    });

    React.useEffect(() => {
        const initialTags = unitAmenitiesForm.getValues("additional_amenities").map(({ id, text }: { id: string; text: string }) => ({ id: id, text: text }));
        setTags(initialTags);
    }, [unitAmenitiesForm]);

    function onSubmit(values: UnitAmenityData) {
        if (!isPending) {
            startTransition(() => {
                toast.promise(updateUnitAmenities(unitId, values), {
                    loading: "Saving changes...",
                    success: () => {
                        router.refresh();
                        return "Unit updated successfully";
                    },
                    error: (error) => {
                        return "Error! Something went wrong.";
                    },
                });
            });
        }
        console.log(tags, "tags");
    }

    return (
        <Form {...unitAmenitiesForm}>
            <form onSubmit={unitAmenitiesForm.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField
                    control={unitAmenitiesForm.control}
                    name="amenities"
                    render={({ field }) => (
                        <FormItem>
                            <div>
                                <FormLabel htmlFor="outside_view">Amenities</FormLabel>
                            </div>
                            <FormControl>
                                <MultipleSelector
                                    {...field}
                                    defaultOptions={allAmenities.map(({ id, amenity_name }: { id: number; amenity_name: string }) => ({
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
                                        return filteredAmenities.map(({ amenity_id, amenity_name }) => ({
                                            value: amenity_id.toString(),
                                            label: amenity_name,
                                        }));
                                    }}
                                    className={cn({
                                        "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                            unitAmenitiesForm.formState.errors.amenities,
                                    })}
                                />
                            </FormControl>
                            {unitAmenitiesForm.formState.errors.amenities ? (
                                <FormMessage />
                            ) : (
                                <FormDescription>Select any amenity/ amenities</FormDescription>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={unitAmenitiesForm.control}
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
                                        setTags(newTags);
                                        unitAmenitiesForm.setValue("additional_amenities", newTags as [Tag, ...Tag[]]);
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
                            {unitAmenitiesForm.formState.errors.additional_amenities ? (
                                <FormMessage />
                            ) : (
                                <FormDescription>Enter amenity/ amenities</FormDescription>
                            )}
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isPending || unitAmenitiesForm.formState.isSubmitting}>
                    {(isPending || unitAmenitiesForm.formState.isSubmitting) && (
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
                    )}{" "}
                    Save
                </Button>
            </form>
        </Form>
    );
}

export default UnitAmenitiesForm;