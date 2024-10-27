"use client";

import React from "react";

import { redirect, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { companySchema, CompanySchemaTypes } from "@/lib/schemas/createCompanySchema";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";

import { addACompany } from "@/actions/company/addACompany";
import useGetUserId from "@/hooks/user/useGetUserId";


function AddCompanyForm() {
    const [loading, setLoading] = React.useState(false);

    const { data: user } = useGetUserId();

    const router = useRouter();

    // forms
    const createCompanyForm = useForm<CompanySchemaTypes>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            company_name: "",
            about: "",
        },
    });

    async function onSubmit(values: CompanySchemaTypes) {
        setLoading(true);
        if (!user) {
            toast.error("You must be logged in to add a company");
            setLoading(false);
            redirect("/");
        }
        toast.promise(addACompany(values, user?.id), {
            loading: "Adding company...",
            success: () => {
                setLoading(false);
                createCompanyForm.reset();
                return "Company added successfully";
            },

            error: () => {
                setLoading(false);
                return "Something went wrong. Failed to add company";
            },
        });
        router.push('/hosting/company')
    }

    return (
        <>
            <Form {...createCompanyForm}>
                <form
                    onSubmit={createCompanyForm.handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-6 airBnbDtablet:px-11"
                >
                    <FormField
                        control={createCompanyForm.control}
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
                        control={createCompanyForm.control}
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
                                    />
                                </FormControl>
                                <FormDescription>Tell us about your company.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-fit" disabled={loading}>
                        Submit
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default AddCompanyForm;
