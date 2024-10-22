"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { companySchema, CompanySchemaTypes } from "@/lib/schemas/createCompanySchema";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { getErrorMessage } from "@/lib/handle-error";
import { useUploadFile } from "@/hooks/use-upload-file";

import { FileUploader } from "@/components/file-uploader/file-uploader";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import PlacesAutoComplete from "./PlacesAutoComplete";

function AddCompanyForm() {
    // maps
    const [loading, setLoading] = React.useState(false);
    const [selectedPlace, setSelectedPlace] = React.useState<any>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    });

    // file upload
    const { onUpload, progresses, isUploading } = useUploadFile("imageUploader", { defaultUploadedFiles: [] });

    // forms
    const createCompanyForm = useForm<CompanySchemaTypes>({
        resolver: zodResolver(companySchema),
    });

    function onSubmit(values: CompanySchemaTypes) {
        setLoading(true);

        toast.promise(onUpload(values.business_permit), {
            loading: "Uploading images...",
            success: () => {
                createCompanyForm.reset();
                setLoading(false);
                return "Images uploaded";
            },
            error: (err) => {
                setLoading(false);
                return getErrorMessage(err);
            },
        });
    }

    return (
        <div className="bg-secondary py-20">
            <h1 className="text-center text-3xl font-bold mb-7">Add a Company</h1>
            <Form {...createCompanyForm}>
                <form onSubmit={createCompanyForm.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 max-w-xl mx-auto">
                    <FormField
                        control={createCompanyForm.control}
                        name="company_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>This is your company's public display name.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <div>
                            <PlacesAutoComplete setSelectedPlace={setSelectedPlace} />
                        </div>
                        <div className="mt-6">
                            {isLoaded && (
                                <GoogleMap zoom={13} center={{ lat: 16.4023, lng: 120.596 }} mapContainerClassName="w-full h-[300px] rounded-lg">
                                    {selectedPlace && <Marker position={selectedPlace} />}
                                </GoogleMap>
                            )}
                        </div>
                    </div>
                    <FormField
                        control={createCompanyForm.control}
                        name="business_permit"
                        render={({ field }) => (
                            <div className="space-y-6">
                                <FormItem className="w-full">
                                    <FormLabel>Business permit</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            maxFileCount={4}
                                            maxSize={4 * 1024 * 1024}
                                            progresses={progresses}
                                            // pass the onUpload function here for direct upload
                                            // onUpload={uploadFiles}
                                            disabled={isUploading}
                                        />
                                    </FormControl>
                                    <FormDescription>Upload your business permit here. Pdf, png, and jpg are accepted formats.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            </div>
                        )}
                    />
                    <Button className="w-fit" disabled={loading}>
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddCompanyForm;
