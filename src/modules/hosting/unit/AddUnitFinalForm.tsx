"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { buttonVariants, Button as ShadCnButton } from "@/components/ui/button";
import { Input as NextUiInput } from "@nextui-org/input";

import { useRouter } from "next/navigation";
import { MinimalTiptapEditor } from '@/components/minimal-tiptap'

import { useUnitAddFormContext } from "./UnitAddFormProvider";
import { createUnitTitleSchema } from "@/lib/schemas/propertySchema";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateUnit } from "@/actions/unit/update-unit";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/handle-error";

function AddUnitFinalForm({ unitId }: { unitId: string }) {
    const router = useRouter();
    const { formData, setFormData } = useUnitAddFormContext();

    const unitFinalForm = useForm<z.infer<typeof createUnitTitleSchema>>({
        resolver: zodResolver(createUnitTitleSchema),
        defaultValues: {
            unit_title: "",
            unit_description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof createUnitTitleSchema>) {
        setFormData((prev) => ({
            unit_title: values.unit_title,
            unit_description: values.unit_description,
            ...prev,
        }));

        console.log(formData, "formdata");
        console.log(values);
        router.push(`/hosting/unit`);
        
        toast.promise(updateUnit(unitId, formData), {
            loading: "Adding unit...",
            success: () => {
                router.push(`/hosting/unit`)
                return toast.success("Unit added successfully!");
            },
            error: (error) => {
                return showErrorToast(error)
            },
        })
    }
    return (
        <div>
            <Form {...unitFinalForm}>
                <form onSubmit={unitFinalForm.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
                    <FormField
                        control={unitFinalForm.control}
                        name="unit_title"
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
                                defaultValue={field.value}
                                {...field}
                            />
                        )}
                    />

                    <FormField
                        control={unitFinalForm.control}
                        name="unit_description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="unit_description">Description</FormLabel>
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
                                        immediatelyRender={false}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-3">
                        <Link href={`/hosting/unit/add-a-unit/${unitId}/amenities`} className={cn(buttonVariants({ variant: "outline" }))}>Back</Link>
                        <ShadCnButton type="submit">Submit</ShadCnButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default AddUnitFinalForm;
