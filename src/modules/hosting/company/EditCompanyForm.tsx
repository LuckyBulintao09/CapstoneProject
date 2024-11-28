"use client";

import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { companySchema, CompanySchemaTypes } from "@/lib/schemas/createCompanySchema";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import useGetUserId from "@/hooks/user/useGetUserId";
import { editCompanyById } from "@/actions/company/editCompanyById";
import { createClient } from "@/utils/supabase/client";


function EditCompanyForm({ companyId, company }: { companyId: string, company: any }) {
    
    const supabase = createClient();
    const { data: user } = useGetUserId();
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo || null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const editCompnayForm = useForm<CompanySchemaTypes>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            company_name: company?.company_name || "",
            about: company?.about || "",
        },
    });

    const removeHtmlTags = (html: string) => {
        return html.replace(/<[^>]*>/g, ''); // This regex removes all HTML tags
    };

    // Handle form submission
    async function onSubmit(values: CompanySchemaTypes) {
        const formData = new FormData();
        formData.append("company_name", values.company_name);
        formData.append("about", removeHtmlTags(values.about));

        if (logo) {
            formData.append("logo", logo);
        }

        // toast.promise(editCompanyById(user?.id, companyId, formData), {
        //     loading: "Updating company...",
        //     success: () => {
        //         return "Company updated successfully";
        //     },
        //     error: () => {
        //         return "Something went wrong. Failed to update company";
        //     },
        // });

        const {error} = await supabase
            .from('company')
            .update({
                company_name: values.company_name,
                about: removeHtmlTags(values.about),
            })
            .eq('id', companyId)
            .eq('owner_id', user?.id)
        if (error) {
            toast.error(error.message);
            return;
        }
        toast.success("Company updated successfully");

    }

    // Handle file change for logo
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file)); // Preview the uploaded logo

            // Upload the logo to Supabase storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${companyId}-${Date.now()}.${fileExt}`;
            const filePath = `company-logos/${fileName}`;

            try {
                // Upload image to Supabase storage
                const { error: uploadError } = await supabase.storage
                    .from("unihomes image storage")
                    .upload(filePath, file);

                if (uploadError) {
                    toast.error(`Failed to upload image: ${uploadError.message}`);
                    return;
                }

                // Get public URL for the uploaded image
                const { data: publicUrlData } = supabase.storage
                    .from("unihomes image storage")
                    .getPublicUrl(filePath);

                if (!publicUrlData?.publicUrl) {
                    toast.error("Failed to get public URL for the uploaded image.");
                    return;
                }

                const publicUrl = publicUrlData.publicUrl;

                const { error: updateError } = await supabase
                    .from("company")
                    .update({ logo: publicUrl })
                    .eq("id", companyId);

                setLogoPreview(publicUrl); // Update preview with public URL
            } catch (error) {
                toast.error("An unexpected error occurred during image upload.");
            }
        }
    };

    return (
        <Form {...editCompnayForm}>
            <form onSubmit={editCompnayForm.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 airBnbDtablet:px-11">

                {/* Logo and Company Name Section */}
                <div className="flex items-center justify-start mb-6 gap-6">
                    {/* Logo Upload with Avatar */}
                    <div className="relative w-32 h-32">
                        <Avatar className="w-full h-full">
                            {/* Show profile logo or fallback */}
                            <AvatarImage src={logoPreview || company?.logo} />
                            <AvatarFallback>
                                {company?.company_name.charAt(0)} {/* Use company initials for fallback */}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-200 transition w-7"
                        >
                            <Pencil size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Company Name */}
                    <div className="flex flex-col justify-center">
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
                    </div>
                </div>

                {/* About Company Field */}
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

                {/* Save Button */}
                <Button className="w-fit" type="submit">Save</Button>
            </form>
        </Form>
    );
}

export default EditCompanyForm;
