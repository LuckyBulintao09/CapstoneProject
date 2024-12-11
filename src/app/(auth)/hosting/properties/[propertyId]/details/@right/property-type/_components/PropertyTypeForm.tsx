"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { SelectNative } from "@/components/ui/select-native";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PropertyTypeData, propertyTypeSchema } from "@/lib/schemas/propertySchema";

import { updatePropertyType } from "@/actions/property/update-property";

import { useRouter } from "next/navigation";

import { Tag, TagInput } from "emblor";
import MultipleSelector from "@/components/ui/multiple-selector";
import { cn } from "@/lib/utils";

function PropertyTypeForm({propertyType, propertyId, propertyHouseRules, propertyAmenities, allAmenities} : {propertyType: any, propertyId: string, propertyHouseRules: any, propertyAmenities: any, allAmenities:any}) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

    const propertiesTypeForm = useForm<PropertyTypeData>({
        resolver: zodResolver(propertyTypeSchema),
        defaultValues: {
            property_type: propertyType,
            house_rules: propertyHouseRules.map(({ id, rule }: { id: number; rule: string }) => ({
                id: id.toString(),
                text: rule,
            })),
            property_amenities: propertyAmenities.map(({ amenity_id, amenity_name }: { amenity_id: number; amenity_name: string }) => ({
                value: amenity_id.toString(),
                label: amenity_name,
            })),
        },
        mode: "onChange",
    });

    async function onSubmit(values: PropertyTypeData) {
        if (!isPending) {
            startTransition(() => {
                toast.promise(updatePropertyType(propertyId, values), {
                    loading: "Saving changes...",
                    success: () => {
                        router.refresh();
                        return "Property type updated successfully";
                    },
                    error: (error) => {
                        return error.message;
                    },
                });
            });
        }
    }

    React.useEffect(() => {
        const initialTags = propertiesTypeForm.getValues("house_rules").map(({ id, text }: { id: string; text: string }) => ({
            id,
            text,
        }));
        setTags(initialTags);
    }, [propertiesTypeForm]);
    
    return (
        <Form {...propertiesTypeForm}>
            <form onSubmit={propertiesTypeForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                    control={propertiesTypeForm.control}
                    name="property_type"
                    render={({ field }) => (
                        <FormItem>
                            <div className="relative rounded-lg border border-input bg-background shadow-sm shadow-black/5 transition-shadow focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 has-[select:disabled]:cursor-not-allowed has-[select:disabled]:opacity-50 [&:has(select:is(:disabled))_*]:pointer-events-none">
                                <label
                                    htmlFor="property_type"
                                    className="block px-3 pt-2 text-xs font-medium text-foreground"
                                >
                                    Select what best describes your property
                                </label>
                                <SelectNative
                                    id="property_type"
                                    defaultValue=""
                                    className="border-none bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[1rem] leading-5 tracking-normal font-normal"
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={propertiesTypeForm.control}
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
                                        propertiesTypeForm.setValue("house_rules", newTags as [Tag, ...Tag[]]);
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
                            {propertiesTypeForm.formState.errors.house_rules ? (
                                <FormMessage />
                            ) : (
                                <FormDescription>
                                    Enter house rules here. Type a rule then press enter when you're done. You can do
                                    this any number of times.
                                </FormDescription>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={propertiesTypeForm.control}
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
                                    defaultOptions={allAmenities.map(
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
                                        const filteredAmenities = allAmenities.filter((amenity) =>
                                            amenity.amenity_name.toLowerCase().includes(searchTerm.toLowerCase())
                                        );
                                        return filteredAmenities.map(({ id, amenity_name }) => ({
                                            value: id.toString(),
                                            label: amenity_name,
                                        }));
                                    }}
                                    className={cn({
                                        "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                        propertiesTypeForm.formState.errors.property_amenities,
                                    })}
                                />
                            </FormControl>
                            {propertiesTypeForm.formState.errors.property_amenities ? (
                                <FormMessage />
                            ) : (
                                <FormDescription>Select an amenity or multiple amenities</FormDescription>
                            )}
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={
                        isPending ||
                        propertiesTypeForm.formState.isSubmitting ||
                        propertiesTypeForm.formState.errors.property_type !== undefined ||
                        propertiesTypeForm.formState.errors.house_rules !== undefined
                    }
                >
                    {(isPending || propertiesTypeForm.formState.isSubmitting) && (
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

export default PropertyTypeForm;
