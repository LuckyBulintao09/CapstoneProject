"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button as ShadCnButton } from "@/components/ui/button";

import { Button as NextUiButton } from "@nextui-org/button";
import { Input as NextUiInput } from "@nextui-org/input";

import ListingStepButton from "./ListingStepButton";

import { Content } from '@tiptap/react'
import { MinimalTiptapEditor } from '@/components/minimal-tiptap'

import { createPropertyTitleSchema } from "@/lib/schemas/createPropertySchema";

type PropertyTitleData = z.infer<typeof createPropertyTitleSchema>;

function PropertyTitleForm({ propertyId }: { propertyId: string }) {
    const propertyTitleForm = useForm<PropertyTitleData>({
        resolver: zodResolver(createPropertyTitleSchema),
        defaultValues: {
        },
    });

    const onSubmit = (values: PropertyTitleData) => {
        console.log(values);
    };
    return (
        <div className="w-full">
            <Form {...propertyTitleForm}>
                <form onSubmit={propertyTitleForm.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
                    <FormField
                        control={propertyTitleForm.control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                label="Title"
                                isInvalid={!!fieldState?.error?.message}
                                isRequired
                                variant="bordered"
                                classNames={{
                                    inputWrapper: "hover:bg-none dark:hover:bg-none",
                                    errorMessage: "text-destructive",
                                    input: "text-xl",
                                }}
                                radius="sm"
                                size="lg"
                                autoComplete="on"
                                {...field}
                            />
                        )}
                    />

                    <FormField
                        control={propertyTitleForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <MinimalTiptapEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="w-full"
                                        editorContentClassName="p-5"
                                        output="html"
                                        placeholder="Type your description here..."
                                        autofocus={true}
                                        editable={true}
                                        editorClassName="focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ShadCnButton type="submit">Submit</ShadCnButton>

                    <ListingStepButton
                        hrefTo={`/hosting/host-a-property`}
                        hrefFrom={`/hosting/host-a-property/${propertyId}/property-details`}
                    />
                </form>
            </Form>
        </div>
    );
}

export default PropertyTitleForm;
