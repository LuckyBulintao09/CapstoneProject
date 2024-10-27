"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { companySchema, CompanySchemaTypes } from "@/lib/schemas/createCompanySchema";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import useGetUserId from "@/hooks/user/useGetUserId";
import { editCompanyById } from "@/actions/company/editCompanyById";

function EditCompanyForm({companyId, company}: {companyId: string, company: any}) {

    const { data: user } = useGetUserId();

    const editCompnayForm = useForm<CompanySchemaTypes>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            company_name: company?.company_name || "",
            about: company?.about || "",
        },
    });

    async function onSubmit(values: CompanySchemaTypes) {
        toast.promise(editCompanyById( user?.id, companyId, values), {
            loading: "Updating company...",
            success: () => {
                return "Company updated successfully";
            },
            error: () => {
                return "Something went wrong. Failed to update company";
            },
        });
    }

    return (
        <Form {...editCompnayForm}>
            <form onSubmit={editCompnayForm.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 airBnbDtablet:px-11">
                <FormField
                    control={editCompnayForm.control}
                    name="company_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company name</FormLabel>
                            <FormControl>
                                <Input placeholder="Type your company name here" {...field} />
                            </FormControl>
                            <FormDescription>This is your company's public display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={editCompnayForm.control}
                    name="about"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About the company</FormLabel>
                            <FormControl>
                                <MinimalTiptapEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="w-full text-base"
                                    editorContentClassName="p-5"
                                    output="html"
                                    placeholder="Type your description here..."
                                    autofocus={false}
                                    editable={true}
                                    editorClassName="focus:outline-none"
                                    immediatelyRender={false}
                                    previewContent={{ html: field.value, title: "About the company", description: "Preview of company description" }}
                                />
                            </FormControl>
                            <FormDescription>Tell us about your company.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-fit">Save</Button>
            </form>
        </Form>
    );
}

export default EditCompanyForm;
