"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { createPropertyTypeSchema } from "@/lib/schemas/createPropertySchema";
import ListingStepButton from "./ListingStepButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function PropertyTypeForm({ propertyId }: { propertyId: string }) {
    const createPropertyType = useForm<
        z.infer<typeof createPropertyTypeSchema>
    >({
        resolver: zodResolver(createPropertyTypeSchema),
    });

    function onSubmit(values: z.infer<typeof createPropertyTypeSchema>) {
        console.log(values);
    }
    return (
        <div>
            <Form {...createPropertyType}>
                <form
                    onSubmit={createPropertyType.handleSubmit(onSubmit)}
                    className="space-y-6"
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
                                <FormDescription>Which.</FormDescription>
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
                                <FormDescription>
                                    Which.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                    {/* <ListingStepButton
                        hrefTo={`/hosting/host-a-property/${propertyId}/property-details`}
                        hrefFrom={`/hosting/host-a-property/${propertyId}/property-type`}
                    /> */}
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
