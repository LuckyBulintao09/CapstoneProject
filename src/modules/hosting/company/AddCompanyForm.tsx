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
import { addACompany } from "@/actions/company/addACompany";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function AddCompanyForm() {
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const { data: user } = useGetUserId();
    const router = useRouter();
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Form handling
    const createCompanyForm = useForm<CompanySchemaTypes>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            company_name: "",
            about: "",
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file)); 

            // Upload the logo to Supabase storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `company-logos/${fileName}`;

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
                toast.error("Failed to get public URL for the uploaded image");
                return;
            }

            setLogoPreview(publicUrlData.publicUrl);
        }
    };

    // Handle form submission
    async function onSubmit(values: CompanySchemaTypes) {
        setLoading(true);
        if (!user) {
            toast.error("You must be logged in to add a company");
            setLoading(false);
            router.push('/');
            return;
        }
        
        toast.promise(addACompany(values, user?.id, logoPreview), {
            loading: "Adding company...",
            success: () => {
                setLoading(false);
                createCompanyForm.reset();
                router.push('/hosting/company');
                return "Company added successfully";
            },
            error: () => {
                setLoading(false);
                return "Something went wrong. Failed to add company";
            },
        });
    }

    return (
        <Form {...createCompanyForm}>
            <form onSubmit={createCompanyForm.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 airBnbDtablet:px-11">

                {/* Logo and Company Name Section */}
                <div className="flex items-center justify-start mb-6 gap-6">
                    {/* Logo Upload with Avatar */}
                    <div className="relative w-32 h-32">
                        <Avatar className="w-full h-full">
                            {/* Show profile logo or fallback */}
                            <AvatarImage src={logoPreview || '/default-logo.png'} />
                            <AvatarFallback>
                                {createCompanyForm.watch('company_name').charAt(0)} {/* Use company initials for fallback */}
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
                    </div>
                </div>

                {/* About Company Field */}
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

                {/* Submit Button */}
                <Button className="w-fit" disabled={loading}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}

export default AddCompanyForm;
