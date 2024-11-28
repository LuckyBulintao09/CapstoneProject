"use client";
import React from "react";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { createClient } from "@/utils/supabase/client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { addPropertyImages } from "@/actions/property/addPropertyImages";
import { Plus } from "lucide-react";

function PhotoUploader({ userId, propertyId }: { userId: string; propertyId: string }) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [isFileUploadEmpty, setIsFileUploadEmpty] = React.useState<boolean>(true);

    const onBeforeRequest = async (req: any) => {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
    };

    const [uppy] = React.useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: 5,
                allowedFileTypes: ["image/jpg", "image/jpeg", "image/png", "image/webp", ".webp"],
                maxFileSize: 6 * 1024 * 1024,
            },
        }).use(Tus, {
            endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
            onBeforeRequest, // set header authorization
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
                "x-upsert": "true",
            },
            allowedMetaFields: ["bucketName", "objectName", "contentType", "cacheControl"],
            removeFingerprintOnSuccess: true,
            chunkSize: 6 * 1024 * 1024,
        })
    );

    uppy.on("file-added", (file) => {
        setIsFileUploadEmpty(false);
        file.meta = {
            ...file.meta,
            bucketName: "unihomes image storage",
            contentType: file.type,
            cacheControl: 3600,
        };
    });

    uppy.on("file-removed", () => {
        setIsFileUploadEmpty(true);
    });

    const handleUpload = async () => {
        if (uppy.getFiles().length > 0) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const bucketName = "unihomes image storage";

            const uploadedFiles: string[] = [];

            const uploadFiles = uppy.getFiles().map(async (file, index) => {
                const objectName = `property/${userId}/${propertyId}/property_image/${file.name}`;
                const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;
                uppy.setFileMeta(file.id, {
                    objectName,
                });

                uploadedFiles.push(fileUrl);

                await uppy.upload();
            });

            await Promise.all(uploadFiles);

            toast.promise(addPropertyImages(uploadedFiles, propertyId), {
                loading: "Adding images...",
                success: () => {
                    return "Property updated successfully";
                },
                error: () => {
                    return "Something went wrong. Failed to update property";
                },
            });
            
            // console.log(files)
            setIsFileUploadEmpty(true);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-fit gap-2 rounded-full"
                    type="button"
                    onClick={() => {
                        setOpen(!open);
                    }}
                >
                    <span>Add photos</span>
                    <Plus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="mt-11"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle>Property photos upload</DialogTitle>
                    <DialogDescription>Upload your property photos here. Maximum of 5 images, 6MB per image</DialogDescription>
                </DialogHeader>

                <div>
                    <Dashboard uppy={uppy} hideUploadButton />
                    <Button className="mt-3" type="button" onClick={handleUpload} disabled={isFileUploadEmpty}>
                        Upload images
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default PhotoUploader;
