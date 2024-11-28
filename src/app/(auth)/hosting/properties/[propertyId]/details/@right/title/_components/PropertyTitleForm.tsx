"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyTitleData, propertyTitleSchema } from "@/lib/schemas/propertySchemaV2";
import { toast } from "sonner";

function PropertyTitleForm({ title, propertyId }: { title: string, propertyId: string}) {

    const [isPending, startTransition] = React.useTransition();

    const propertiesTitleForm = useForm<PropertyTitleData>({
        resolver: zodResolver(propertyTitleSchema),
        defaultValues: {
            property_title: title,
        },
        mode: "onChange",
    });

    function onSubmit(values: PropertyTitleData) {

        console.log(title, "title");
    }

    return (
        <Form {...propertiesTitleForm}>
            <form onSubmit={propertiesTitleForm.handleSubmit(onSubmit)} className="">
                {" "}
                <FormField
                    control={propertiesTitleForm.control}
                    name="property_title"
                    render={({ field }) => (
                        <FormItem className="space-y-0 w-full">
                            <FormLabel htmlFor="property_title" className="sr-only">
                                Property title
                            </FormLabel>
                            <div className="flex flex-col items-center justify-center">
                                <FormMessage />
                                <div className="text-muted-foreground text-sm font-medium">
                                    {propertiesTitleForm.watch("property_title", "").length <= 52
                                        ? `${52 - propertiesTitleForm.watch("property_title", "").length} characters remaining`
                                        : `${propertiesTitleForm.watch("property_title", "").length - 52} characters over the limit`}
                                </div>
                                <FormControl>
                                    <div className="mt-2">
                                        <textarea
                                            id="property_title"
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            rows={4}
                                            className="text-center text-[48px] leading-[54px] font-[500] resize-none border-none bg-transparent p-0 outline-none focus:ring-0 focus:outline-none active:ring-0 active:outline-none max-w-md"
                                            value={field.value}
                                            onChange={field.onChange}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={
                        isPending || propertiesTitleForm.formState.isSubmitting || propertiesTitleForm.formState.errors.property_title !== undefined
                    }
                >
                    {(isPending || propertiesTitleForm.formState.isSubmitting) && (
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
                    )}{" "}
                    Save
                </Button>
            </form>
        </Form>
    );
}

export default PropertyTitleForm;
