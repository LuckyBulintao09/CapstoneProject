"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRouter } from "next/navigation";

import { useUnitAddFormContext } from "./UnitAddFormProvider";
import { createUnitTypeSchema } from "@/lib/schemas/propertySchema";
import Link from "next/link";
import { cn } from "@/lib/utils";

function AddUnitTypeForm({ unitId }: { unitId: string }) {
    const router = useRouter();
    const { formData, setFormData } = useUnitAddFormContext();

    const unitTypeForm = useForm<z.infer<typeof createUnitTypeSchema>>({
        resolver: zodResolver(createUnitTypeSchema),
        defaultValues: {
            unit_structure: "apartment",
            unit_type: "room",
        },
    });

    function onSubmit(values: z.infer<typeof createUnitTypeSchema>) {
        setFormData((prev) => ({
            ...prev,
            unit_structure: values.unit_structure,
            unit_type: values.unit_type,
        }));

        console.log(formData, "formdata");
        console.log(values);
        router.push(`/hosting/unit/add-a-unit/${unitId}/details`);
    }
    return (
        <div>
            <Form {...unitTypeForm}>
                <form onSubmit={unitTypeForm.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={unitTypeForm.control}
                        name="unit_structure"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="unit_structure">Structure</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                        {propertyStructureOptions.map(({ value, label }: { value: string; label: string }) => (
                                            <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={value} />
                                                </FormControl>
                                                <FormLabel className="font-normal" htmlFor={value}>
                                                    {label}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={unitTypeForm.control}
                        name="unit_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="unit_type">Privacy type</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                        {privacyTypeOptions.map(({ value, label }: { value: string; label: string }) => (
                                            <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={value} />
                                                </FormControl>
                                                <FormLabel className="font-normal" htmlFor={value}>
                                                    {label}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-3">
                        <Link href={`/hosting/unit/add-a-unit/${unitId}/select-a-property`} className={cn(buttonVariants({ variant: "outline" }))}>Back</Link>
                        <Button type="submit">Next</Button>
                    </div>
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

export default AddUnitTypeForm;
