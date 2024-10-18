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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createPropertyCompanySchema } from "@/lib/schemas/createPropertyCompanySchema";

type CompanyData = {
    id: string;
    company_name: string;
}[];


function PropertyCompanyForm({ companies }: { companies: CompanyData }) {
    const createPropertyCompany = useForm<
        z.infer<typeof createPropertyCompanySchema>
    >({
        resolver: zodResolver(createPropertyCompanySchema),
    });

    function onSubmit(values: z.infer<typeof createPropertyCompanySchema>) {
        console.log(values);
    }

    return (
        <div>
            <Form {...createPropertyCompany}>
                <form
                    onSubmit={createPropertyCompany.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={createPropertyCompany.control}
                        name="company_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a company" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {companies?.map(({id, company_name}) => (
                                          <SelectItem value={company_name} key={id} id={id}>{company_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select a company you wish to create a
                                    listing for.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default PropertyCompanyForm;
