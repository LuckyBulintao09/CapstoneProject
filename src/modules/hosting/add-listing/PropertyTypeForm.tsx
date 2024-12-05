"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { createPropertyTypeSchema } from "@/lib/schemas/propertySchema";
import ListingStepButton from "./ListingStepButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRouter } from "next/navigation";
import { usePropertyAddFormContext } from "../unit/UnitAddFormProvider";


function PropertyTypeForm({ propertyId }: { propertyId: string }) {

    const router = useRouter();
    const {formData, setFormData} = usePropertyAddFormContext();

    const createPropertyType = useForm<
        z.infer<typeof createPropertyTypeSchema>
    >({
        resolver: zodResolver(createPropertyTypeSchema),
    });

    function onSubmit(values: z.infer<typeof createPropertyTypeSchema>) {
        router.push(`/hosting/host-a-property/${propertyId}/property-details`);
        if (setFormData) {
            setFormData((prev) => ({
                ...prev,
                structure: values.structure,
                privacy_type: values.privacy_type,
            }));
            console.log(formData, "formdata")
        }
    }
    return (
        <div>
            <Form {...createPropertyType}>
                <form
                    onSubmit={createPropertyType.handleSubmit(onSubmit)}
                    className="flex flex-col gap-11"
                >
                    <FormField
                        control={createPropertyType.control}
                        name="structure"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Structure</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {propertyStructureOptions.map(
                                            ({
                                                value,
                                                label,
                                            }: {
                                                value: string;
                                                label: string;
                                            }) => (
                                                <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={value}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal" htmlFor={value}>
                                                        {label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        )}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={createPropertyType.control}
                        name="privacy_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Privacy type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {privacyTypeOptions.map(
                                            ({
                                                value,
                                                label,
                                            }: {
                                                value: string;
                                                label: string;
                                            }) => (
                                                <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={value}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal" htmlFor={value}>
                                                        {label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        )}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ListingStepButton
                        hrefFrom={`/hosting/host-a-property/${propertyId}/company`}
                        propertyId={propertyId}
                    />
                </form>
            </Form>
        </div>
    );
}

const propertyStructureOptions = [
    {
        value: "apartment",
        label: "Apartment",
    },
    {
        value: "condominium",
        label: "Condominium",
    },
    {
        value: "dormitory",
        label: "Dormitory",
    },
]

const privacyTypeOptions = [
    {
        value: "room",
        label: "Room",
    },
    {
        value: "shared room",
        label: "Shared room",
    },
    {
        value: "entire place",
        label: "Entire place",
    },
]

export default PropertyTypeForm;
