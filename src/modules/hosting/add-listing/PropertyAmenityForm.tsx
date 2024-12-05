"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CheckboxGroup, Checkbox as NextUiCheckbox } from "@nextui-org/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import ListingStepButton from "./ListingStepButton";

import { Tag, TagInput } from "emblor";

import { createPropertyAmenitySchema } from "@/lib/schemas/propertySchema";

import { useRouter } from "next/navigation";
import { usePropertyAddFormContext } from "../unit/UnitAddFormProvider";

type PropertyAmenityData = z.infer<typeof createPropertyAmenitySchema>;

function PropertyAmenityForm({ propertyId, amenities }: { propertyId: string, amenities: {id: string, amenity_name: string}[] }) {

    const [tags, setTags] = React.useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

    const router = useRouter();
    const {formData, setFormData} = usePropertyAddFormContext();
    
    const propertyAmenityForm = useForm<PropertyAmenityData>({
        resolver: zodResolver(createPropertyAmenitySchema),
        defaultValues: {
            amenities: [],
            additional_amenities: [],
        },
    });

    const onSubmit = (values: PropertyAmenityData) => {
        router.push(`/hosting/host-a-property/${propertyId}/name-your-property`);
        if (setFormData) {
            setFormData((prev) => ({
                ...prev,
                amenities: values.amenities,
                additional_amenities: values.additional_amenities,
            }));
            console.log(formData, "formdata")
        }
    };

    return (
        <div>
            <Form {...propertyAmenityForm}>
                <form onSubmit={propertyAmenityForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={propertyAmenityForm.control}
                        name="amenities"
                        render={({ field, fieldState }) => (
                            <CheckboxGroup
                                label="Select Ameneties"
                                value={field.value?.map(({amenity_name}) => amenity_name)}
                                onValueChange={(values) => {
                                    field.onChange(
                                        values.map((value) => ({
                                            id: amenities?.find(({id, amenity_name}) => amenity_name === value)?.id,
                                            amenity_name: value,
                                        }))
                                    );
                                }}
                                isInvalid={!!fieldState?.error?.message}
                            >
                                {amenities?.map(({id, amenity_name}) => (
                                    <NextUiCheckbox key={id} value={amenity_name}>
                                        {amenity_name}
                                    </NextUiCheckbox>
                                ))}
                              
                            </CheckboxGroup>
                        )}
                    />
                    <p className="text-default-500 text-small">Selected: {propertyAmenityForm.getValues("amenities").length}</p>
                    <FormField
                        control={propertyAmenityForm.control}
                        name="additional_amenities"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel className="text-left">Additional Ameneties</FormLabel>
                                <FormControl className="w-full">
                                    <TagInput
                                        {...field}
                                        placeholder="Enter additional ameneties"
                                        tags={tags}
                                        className="sm:min-w-[450px]"
                                        setTags={(newTags) => {
                                            setTags(newTags);
                                            propertyAmenityForm.setValue("additional_amenities", newTags as [Tag, ...Tag[]]);
                                        }}
                                        setActiveTagIndex={setActiveTagIndex}
                                        activeTagIndex={activeTagIndex}
                                        styleClasses={{
                                            tag: {
                                                body: "pl-3",
                                            },
                                        }}
                                        inlineTags={false}
                                        inputFieldPosition="top"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ListingStepButton
                        hrefFrom={`/hosting/host-a-property/${propertyId}/property-details`}
                        propertyId={propertyId}
                    />
                </form>
            </Form>
        </div>
    );
}

export default PropertyAmenityForm;
