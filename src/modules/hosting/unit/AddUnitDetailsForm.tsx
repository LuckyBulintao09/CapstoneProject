"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button as NextUiButton } from "@nextui-org/button";
import { Input as NextUiInput } from "@nextui-org/input";
import { Form, FormField } from "@/components/ui/form";

import { buttonVariants, Button as ShadCnButton } from "@/components/ui/button";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUnitAddFormContext } from "./UnitAddFormProvider";
import { createUnitDetailSchema } from "@/lib/schemas/propertySchema";
import { cn } from "@/lib/utils";
import Link from "next/link";

function AddUnitDetailsForm({ unitId }: { unitId: string }) {
    const router = useRouter();
    const { formData, setFormData } = useUnitAddFormContext();

    const unitDetailForm = useForm<z.infer<typeof createUnitDetailSchema>>({
        resolver: zodResolver(createUnitDetailSchema),
        defaultValues: {
            unit_occupants: 1,
            unit_bedrooms: 1,
            unit_beds: 1,
        },
    });

    function onSubmit(values: z.infer<typeof createUnitDetailSchema>) {
        setFormData((prev) => ({
            ...prev,
            unit_occupants: values.unit_occupants,
            unit_bedrooms: values.unit_bedrooms,
            unit_beds: values.unit_beds,
        }));

        console.log(formData, "formdata");
        console.log(values);
        router.push(`/hosting/unit/add-a-unit/${unitId}/amenities`);
    }
    return (
        <div className="w-full max-w-2xl">
            <Form {...unitDetailForm}>
                <form onSubmit={unitDetailForm.handleSubmit(onSubmit)} className="space-y-7">

                    <FormField
                        control={unitDetailForm.control}
                        name="unit_occupants"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                type={field.value >= 10 ? "text" : "number"}
                                {...field}
                                value={field.value >= 10 ? "10+" : `${field.value}`}
                                onChange={(e) => {
                                    unitDetailForm.setValue("unit_occupants", parseInt(e.target.value) || 1);
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
                                            unitDetailForm.setValue("unit_occupants", Math.max(unitDetailForm.getValues("unit_occupants") - 1, 1));
                                        }}
                                        isDisabled={unitDetailForm.getValues("unit_occupants") <= 1}
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
                                            unitDetailForm.setValue("unit_occupants", unitDetailForm.getValues("unit_occupants") + 1);
                                        }}
                                        isDisabled={unitDetailForm.getValues("unit_occupants") >= 10}
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
                        control={unitDetailForm.control}
                        name="unit_bedrooms"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                type={field.value >= 10 ? "text" : "number"}
                                {...field}
                                value={field.value >= 10 ? "10+" : `${field.value}`}
                                onChange={(e) => {
                                    unitDetailForm.setValue("unit_bedrooms", parseInt(e.target.value) || 1);
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
                                            unitDetailForm.setValue("unit_bedrooms", Math.max(unitDetailForm.getValues("unit_bedrooms") - 1, 1));
                                        }}
                                        isDisabled={unitDetailForm.getValues("unit_bedrooms") <= 1}
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
                                            unitDetailForm.setValue("unit_bedrooms", unitDetailForm.getValues("unit_bedrooms") + 1);
                                        }}
                                        isDisabled={unitDetailForm.getValues("unit_bedrooms") >= 10}
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
                        control={unitDetailForm.control}
                        name="unit_beds"
                        render={({ field, fieldState }) => (
                            <NextUiInput
                                type={field.value >= 10 ? "text" : "number"}
                                {...field}
                                value={field.value >= 10 ? "10+" : `${field.value}`}
                                onChange={(e) => {
                                    unitDetailForm.setValue("unit_beds", parseInt(e.target.value) || 1);
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
                                            unitDetailForm.setValue("unit_beds", Math.max(unitDetailForm.getValues("unit_beds") - 1, 1));
                                        }}
                                        isDisabled={unitDetailForm.getValues("unit_beds") <= 1}
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
                                            unitDetailForm.setValue("unit_beds", unitDetailForm.getValues("unit_beds") + 1);
                                        }}
                                        isDisabled={unitDetailForm.getValues("unit_beds") >= 10}
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
                    <div className="flex justify-end gap-3">
                    <Link href={`/hosting/unit/add-a-unit/${unitId}/unit-type`} className={cn(buttonVariants({ variant: "outline" }))}>Back</Link>
                    <ShadCnButton type="submit">Next</ShadCnButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default AddUnitDetailsForm;
