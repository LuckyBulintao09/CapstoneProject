"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { CheckboxGroup, Checkbox as NextUiCheckbox } from "@nextui-org/checkbox";

import { Tag, TagInput } from "emblor";

import { useRouter } from "next/navigation";

import { useUnitAddFormContext } from "./UnitAddFormProvider";
import { createUnitAmenitySchema } from "@/lib/schemas/propertySchema";
import Link from "next/link";
import { cn } from "@/lib/utils";

function AddUnitAmenities({ unitId, amenities }: { unitId: string; amenities: any }) {
    const router = useRouter();
    const { formData, setFormData } = useUnitAddFormContext();
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

    const unitAmenitiesForm = useForm<z.infer<typeof createUnitAmenitySchema>>({
        resolver: zodResolver(createUnitAmenitySchema),
        defaultValues: {
            amenities: [],
            additional_amenities: [],
        },
    });

    function onSubmit(values: z.infer<typeof createUnitAmenitySchema>) {
        setFormData((prev) => ({
            ...prev,
            amenities: values.amenities,
            additional_amenities: values.additional_amenities,
        }));

        console.log(formData, "formdata");
        console.log(values);
        router.push(`/hosting/unit/add-a-unit/${unitId}/finalize-your-unit`);
    }
    return (
        <div>
            <Form {...unitAmenitiesForm}>
                <form onSubmit={unitAmenitiesForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={unitAmenitiesForm.control}
                        name="amenities"
                        render={({ field, fieldState }) => (
                            <CheckboxGroup
                                label="Select Amenities"
                                value={field.value?.map(({ amenity_name }) => amenity_name)}
                                onValueChange={(values) => {
                                    field.onChange(
                                        values.map((value) => ({
                                            id: amenities?.find(({ id, amenity_name }) => amenity_name === value)?.id,
                                            amenity_name: value,
                                        }))
                                    );
                                }}
                                isInvalid={!!fieldState?.error?.message}
                            >
                                {amenities?.map(({ id, amenity_name }) => (
                                    <NextUiCheckbox key={id} value={amenity_name}>
                                        {amenity_name}
                                    </NextUiCheckbox>
                                ))}
                            </CheckboxGroup>
                        )}
                    />
                    <p className="text-default-500 text-small">Selected: {unitAmenitiesForm.getValues("amenities").length}</p>
                    <FormField
                        control={unitAmenitiesForm.control}
                        name="additional_amenities"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel className="text-left">Additional Amenities</FormLabel>
                                <FormControl className="w-full">
                                    <TagInput
                                        {...field}
                                        placeholder="Enter additional amenities"
                                        tags={tags}
                                        className="sm:min-w-[450px]"
                                        setTags={(newTags) => {
                                            setTags(newTags);
                                            unitAmenitiesForm.setValue("additional_amenities", newTags as [Tag, ...Tag[]]);
                                        }}
                                        setActiveTagIndex={setActiveTagIndex}
                                        activeTagIndex={activeTagIndex}
                                        styleClasses={{
                                            tag: {
                                                body: "pl-3",
                                            },
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-3">
                        <Link href={`/hosting/unit/add-a-unit/${unitId}/details`} className={cn(buttonVariants({ variant: "outline" }))}>Back</Link>
                        <Button type="submit">Next</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default AddUnitAmenities;
