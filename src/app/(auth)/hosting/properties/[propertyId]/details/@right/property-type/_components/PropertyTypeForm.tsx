"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { SelectNative } from "@/components/ui/select-native";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyTypeData, propertyTypeSchema } from "@/lib/schemas/propertySchemaV2";
import { updatePropertyType } from "@/actions/property/update-property";
import { useRouter } from "next/navigation";

function PropertyTypeForm({propertyType, propertyId} : {propertyType: any, propertyId: string}) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    const propertiesTypeForm = useForm<PropertyTypeData>({
        resolver: zodResolver(propertyTypeSchema),
        defaultValues: {
            property_type: propertyType,
        },
        mode: "onChange",
    });

    async function onSubmit(values: PropertyTypeData) {
        if (!isPending) {
            startTransition(() => {
                toast.promise(updatePropertyType(propertyId, values.property_type), {
                    loading: "Saving changes...",
                    success: () => {
                        router.refresh();
                        return "Property type updated successfully";
                    },
                    error: (error) => {
                        return error.message;
                    },
                });
            });
        }
    }
    return (
        <Form {...propertiesTypeForm}>
            <form onSubmit={propertiesTypeForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={propertiesTypeForm.control}
                    name="property_type"
                    render={({ field }) => (
                        <FormItem>
                            <div className="relative rounded-lg border border-input bg-background shadow-sm shadow-black/5 transition-shadow focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 has-[select:disabled]:cursor-not-allowed has-[select:disabled]:opacity-50 [&:has(select:is(:disabled))_*]:pointer-events-none">
                                <label htmlFor="property_type" className="block px-3 pt-2 text-xs font-medium text-foreground">
                                    Select what best describes your property
                                </label>
                                <SelectNative
                                    id="property_type"
                                    defaultValue=""
                                    className="border-none bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[1rem] leading-5 tracking-normal font-normal"
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <option value="" disabled>
                                        Property type
                                    </option>
                                    <option value="apartment">Apartment</option>
                                    <option value="condominium">Condominium</option>
                                    <option value="dormitory">Dormitory</option>
                                </SelectNative>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={
                        isPending || propertiesTypeForm.formState.isSubmitting || propertiesTypeForm.formState.errors.property_type !== undefined
                    }
                >
                    {(isPending || propertiesTypeForm.formState.isSubmitting) && (
                        <svg
                            aria-hidden="true"
                            className="size-6 mr-2 fill-accent animate-spin-fade dark:text-accent-foreground text-primary"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    )}
                    Save
                </Button>
            </form>
        </Form>
    );
}

export default PropertyTypeForm;
