"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button as NextUiButton } from "@nextui-org/button";
import { Input as NextUiInput } from "@nextui-org/input";
import { Form, FormField } from "@/components/ui/form";

import { Button as ShadCnButton } from "@/components/ui/button";

import { createPropertyDetailSchema } from "@/lib/schemas/createPropertySchema";
import { Minus, Plus } from "lucide-react";
import ListingStepButton from "./ListingStepButton";

type PropertyDetailData = z.infer<typeof createPropertyDetailSchema>;

function PropertyDetailForm({ propertyId }: { propertyId: string }) {
    const propertyDetailForm = useForm<PropertyDetailData>({
        resolver: zodResolver(createPropertyDetailSchema),
        defaultValues: {
            occupants: 1,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            // unit_number: "",
        },
    });

    const onSubmit = (values: PropertyDetailData) => {
        console.log(values);
    };

    return (
        <div className="w-full max-w-2xl">
            <Form {...propertyDetailForm}>
                <form onSubmit={propertyDetailForm.handleSubmit(onSubmit)} className="space-y-7">
                    <FormField
                        control={propertyDetailForm.control}
                        name="occupants"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                type={field.value >= 10 ? "text" : "number"}
                                {...field}
                                value={field.value >= 10 ? "10+" : `${field.value}`}
                                onChange={(e) => {
                                    propertyDetailForm.setValue("occupants", parseInt(e.target.value) || 1);
                                }}
                                classNames={{
                                    input: "field-sizing max-w-[128px] text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    inputWrapper: "hover:bg-none dark:hover:bg-none border-none px-0",
                                    innerWrapper: "flex items-center justify-between w-max min-w-max gap-3",
                                    base: "flex flex-row items-center justify-between w-full",
                                    label: "ps-0 pe-0",
                                }}
                                variant="bordered"
                                label={<span className="text-xl">Occupants</span>}
                                labelPlacement="outside-left"
                                startContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        variant="bordered"
                                        size="lg"
                                        aria-label="Decrease Occupants"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("occupants", Math.max(propertyDetailForm.getValues("occupants") - 1, 1));
                                        }}
                                        isDisabled={propertyDetailForm.getValues("occupants") <= 1}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                endContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        aria-label="Increase Occupants"
                                        variant="bordered"
                                        size="lg"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("occupants", propertyDetailForm.getValues("occupants") + 1);
                                        }}
                                        isDisabled={propertyDetailForm.getValues("occupants") >= 10}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                isReadOnly
                                isInvalid={!!fieldState?.error?.message}
                                errorMessage={fieldState?.error?.message}
                            />
                        )}
                    />

                    <FormField
                        control={propertyDetailForm.control}
                        name="bedrooms"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                type={field.value >= 10 ? "text" : "number"}
                                {...field}
                                value={field.value >= 10 ? "10+" : `${field.value}`}
                                onChange={(e) => {
                                    propertyDetailForm.setValue("bedrooms", parseInt(e.target.value) || 1);
                                }}
                                classNames={{
                                    input: "field-sizing max-w-[128px] text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    inputWrapper: "hover:bg-none dark:hover:bg-none border-none px-0",
                                    innerWrapper: "flex items-center justify-between w-max min-w-max gap-3",
                                    base: "flex flex-row items-center justify-between w-full",
                                    label: "ps-0 pe-0",
                                }}
                                variant="bordered"
                                label={<span className="text-xl">Bedrooms</span>}
                                labelPlacement="outside-left"
                                startContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        variant="bordered"
                                        size="lg"
                                        aria-label="Decrease Bedrooms"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("bedrooms", Math.max(propertyDetailForm.getValues("bedrooms") - 1, 1));
                                        }}
                                        isDisabled={propertyDetailForm.getValues("bedrooms") <= 1}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                endContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        aria-label="Increase Bedrooms"
                                        variant="bordered"
                                        size="lg"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("bedrooms", propertyDetailForm.getValues("bedrooms") + 1);
                                        }}
                                        isDisabled={propertyDetailForm.getValues("bedrooms") >= 10}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                isReadOnly
                                isInvalid={!!fieldState?.error?.message}
                                errorMessage={fieldState?.error?.message}
                            />
                        )}
                    />

                    <FormField
                        control={propertyDetailForm.control}
                        name="beds"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                type={field.value >= 10 ? "text" : "number"}
                                {...field}
                                value={field.value >= 10 ? "10+" : `${field.value}`}
                                onChange={(e) => {
                                    propertyDetailForm.setValue("beds", parseInt(e.target.value) || 1);
                                }}
                                classNames={{
                                    input: "field-sizing max-w-[128px] text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    inputWrapper: "hover:bg-none dark:hover:bg-none border-none px-0",
                                    innerWrapper: "flex items-center justify-between w-max min-w-max gap-3",
                                    base: "flex flex-row items-center justify-between w-full",
                                    label: "ps-0 pe-0",
                                }}
                                variant="bordered"
                                label={<span className="text-xl">Beds</span>}
                                labelPlacement="outside-left"
                                startContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        variant="bordered"
                                        size="lg"
                                        aria-label="Decrease beds"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("beds", Math.max(propertyDetailForm.getValues("beds") - 1, 1));
                                        }}
                                        isDisabled={propertyDetailForm.getValues("beds") <= 1}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                endContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        aria-label="Increase beds"
                                        variant="bordered"
                                        size="lg"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("beds", propertyDetailForm.getValues("beds") + 1);
                                        }}
                                        isDisabled={propertyDetailForm.getValues("beds") >= 10}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                isReadOnly
                                isInvalid={!!fieldState?.error?.message}
                                errorMessage={fieldState?.error?.message}
                            />
                        )}
                    />

                    <FormField
                        control={propertyDetailForm.control}
                        name="bathrooms"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                type={field.value >= 10 ? "text" : "number"}
                                {...field}
                                value={field.value >= 10 ? "10+" : `${field.value}`}
                                onChange={(e) => {
                                    propertyDetailForm.setValue("bathrooms", parseInt(e.target.value) || 1);
                                }}
                                classNames={{
                                    input: "field-sizing max-w-[128px] text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    inputWrapper: "hover:bg-none dark:hover:bg-none border-none px-0",
                                    innerWrapper: "flex items-center justify-between w-max min-w-max gap-3",
                                    base: "flex flex-row items-center justify-between w-full",
                                    label: "ps-0 pe-0",
                                }}
                                variant="bordered"
                                label={<span className="text-xl">Bathrooms</span>}
                                labelPlacement="outside-left"
                                startContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        variant="bordered"
                                        size="lg"
                                        aria-label="Decrease Bathrooms"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("bathrooms", Math.max(propertyDetailForm.getValues("bathrooms") - 1, 1));
                                        }}
                                        isDisabled={propertyDetailForm.getValues("bathrooms") <= 1}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                endContent={
                                    <NextUiButton
                                        type="button"
                                        isIconOnly
                                        aria-label="Increase Bathrooms"
                                        variant="bordered"
                                        size="lg"
                                        className="rounded-full border"
                                        onClick={() => {
                                            propertyDetailForm.setValue("bathrooms", propertyDetailForm.getValues("bathrooms") + 1);
                                        }}
                                        isDisabled={propertyDetailForm.getValues("bathrooms") >= 10}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </NextUiButton>
                                }
                                isReadOnly
                                isInvalid={!!fieldState?.error?.message}
                                errorMessage={fieldState?.error?.message}
                            />
                        )}
                    />

                    <ShadCnButton type="submit">Submit</ShadCnButton>
                    <ListingStepButton hrefTo={`/hosting/host-a-property/${propertyId}/ameneties`} hrefFrom={`/hosting/host-a-property/${propertyId}/property-type`}/>
                </form>
            </Form>
        </div>
    );
}

export default PropertyDetailForm;
