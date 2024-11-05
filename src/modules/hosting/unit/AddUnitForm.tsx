"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { createUnitPropertySchema } from "@/lib/schemas/propertySchema";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUnitAddFormContext } from "./UnitAddFormProvider";
import { removeUnitById } from "@/actions/unit/removeUnitById";

function AddUnitForm({ properties, unitId }: {properties: any, unitId: string}) {
    const router = useRouter();
    const { formData, setFormData } = useUnitAddFormContext();

    const createUnitPropertyForm = useForm<z.infer<typeof createUnitPropertySchema>>({
        resolver: zodResolver(createUnitPropertySchema),
        defaultValues: {
            property_id: "",
        },
    });
    function onSubmit(values: z.infer<typeof createUnitPropertySchema>) {
        setFormData((prev) => ({
            ...prev,
            property_id: values.property_id,
        }));

        console.log(formData, "formdata");
        console.log(values);
        router.push(`/hosting/unit/add-a-unit/${unitId}/unit-type`);
    }
    return (
        <Form {...createUnitPropertyForm}>
            <form onSubmit={createUnitPropertyForm.handleSubmit(onSubmit)} className="space-y-6 my-11 max-w-xl w-full mx-auto">
                <FormField
                    control={createUnitPropertyForm.control}
                    name="property_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="property_id">Property</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a property" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {properties?.map(({ id, title }) => (
                                        <SelectItem value={id.toString()} key={id} id={id}>
                                            {title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select a property you wish to create a unit for.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Link href={`/hosting/property`} className={cn(buttonVariants({ variant: "outline" }))} onClick={
                        async () => removeUnitById(unitId)
                    }>
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    >
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default AddUnitForm;
