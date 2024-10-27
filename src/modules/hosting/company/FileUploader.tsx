"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { createClient } from "@/utils/supabase/client";
import useGetUser from "@/hooks/user/useGetUserId";
import { addCompanyBusinessPermit } from "@/actions/company/addCompanyBusinessPermit";
import { toast } from "sonner";

export function FileUploader({ companyId }: { companyId: string }) {

    const [open, setOpen] = React.useState(false);
    const [isFileUploadEmpty, setIsFileUploadEmpty] = React.useState<boolean>(true);

    const { data: user } = useGetUser();

    const onBeforeRequest = async (req: any) => {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
    };

    const [uppy] = React.useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: ["image/jpg", "image/jpeg", "image/png", ".pdf", ".doc", ".docx"],
                maxFileSize: 6 * 1024 * 1024,
            },
        }).use(Tus, {
            endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
            onBeforeRequest,
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
            bucketName: "company-logo-test",
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
            const bucketName = "company-logo-test";
            const objectName = `${user?.id}/business-permit/${uppy.getFiles()[0].name}`;
            const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;
            
            uppy.setFileMeta(uppy.getFiles()[0].id, {
                objectName: `${user?.id}/business-permit/${uppy.getFiles()[0].name}`,
            });

            uppy.upload();

            toast.promise(addCompanyBusinessPermit(fileUrl, user?.id, companyId), {
                loading: "Adding business permit...",
                success: () => {
                    return "Company updated successfully";
                },
                error: () => {
                    return "Something went wrong. Failed to update company";
                },
            });
            setIsFileUploadEmpty(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-fit"
                    type="button"
                    onClick={() => {
                        setOpen(!open);
                    }}
                >
                    Upload business permit
                </Button>
            </DialogTrigger>
            <DialogContent
                className=""
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle>Upload your file here</DialogTitle>
                    <DialogDescription>
                        Upload your business permit here.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Dashboard uppy={uppy} hideUploadButton />
                    <Button className="mt-3" type="button" onClick={handleUpload} disabled={isFileUploadEmpty}>
                        Upload file
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
