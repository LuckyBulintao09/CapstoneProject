"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { buttonVariants, Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

const amenitiesSchema = z.object({
    amenities: z
        .array(
            z.object({
                value: z.string(),
                label: z.string(),
            }, {message:"Object err"}),
        {message: "Array err"})
        .nonempty("At least one amenity must be selected."),
});

function TestAmenitiesForm({ amenities }: { amenities?: { id: string; amenity_name: string }[] }) {
    const unitForm = useForm<z.infer<typeof amenitiesSchema>>({
        resolver: zodResolver(amenitiesSchema),
        defaultValues: {
            amenities: [{
                value: "",
                label: ""
            }],
        },
    });

    function onSubmit(values: z.infer<typeof amenitiesSchema>) {
        console.log(values)
    }

    const amenitiesOptions = amenities.map(({ id, amenity_name }: { id: string; amenity_name: string }) => {
        return { value: id.toString(), label: amenity_name } as Option;
    })

    return (
        <Form {...unitForm}>
            <form onSubmit={unitForm.handleSubmit(onSubmit)} className="space-y-8 pb-11 bg-background max-w-6xl mx-auto">
                <FormField
                    control={unitForm.control}
                    name="amenities"
                    render={({ field }) => (
                        <FormItem>
                            <div>
                                <FormLabel htmlFor="outside_view">Amenities</FormLabel>
                            </div>
                            <FormControl>
                                <MultipleSelector
                                    {...field}
                                    defaultOptions={amenitiesOptions}
                                    placeholder="Select amenities"
                                    emptyIndicator={<p className="text-center text-sm">No results found</p>}
                                    onChange={field.onChange}
                                    value={field.value as Option[]}
                                />
                            </FormControl>
                            {unitForm.formState.errors.amenities ? <FormMessage /> : <FormDescription>Select any amenity/ amenities</FormDescription>}
                        </FormItem>
                    )}
                />
                <Button onClick={
                    () => {
                        console.log("Form Values:", unitForm.getValues());
                        console.log("Errors:", unitForm.formState.errors);
                    }
                } className={buttonVariants({ variant: "default" })} type="button">Test</Button>

                <Button type="submit" className={buttonVariants({ variant: "default" })}>Save</Button>
            </form>
        </Form>
    );
}

export default TestAmenitiesForm;
