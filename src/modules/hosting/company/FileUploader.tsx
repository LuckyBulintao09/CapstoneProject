"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { createClient } from "@/utils/supabase/client";
import useGetUser from "@/hooks/user/useGetUser";

export function FileUploader() {
    const [open, setOpen] = React.useState(false);
    const [isFileUploadEmpty, setIsFileUploadEmpty] = React.useState<boolean>(true)
    const isDesktop = useMediaQuery("(min-width: 742px)");
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
        setIsFileUploadEmpty(false)
        file.meta = {
            ...file.meta,
            bucketName: "company-logo-test",
            contentType: file.type,
            cacheControl: 3600,
        };
    });

    uppy.on("file-removed", (file) => {
        setIsFileUploadEmpty(true)
    })

    const handleUpload = () => {
        if (uppy.getFiles().length > 0) {
            uppy.setFileMeta(uppy.getFiles()[0].id, {
                objectName: `${user?.id}/business-permit/${uppy.getFiles()[0].name}`,
            });
            uppy.upload();
            uppy.clear();
            setIsFileUploadEmpty(true)
        }
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={() => {
                setOpen
                setIsFileUploadEmpty
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-fit">
                        Upload business permit
                    </Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Upload your file here</DialogTitle>
                    </DialogHeader>

                    <div>
                        <Dashboard uppy={uppy} hideUploadButton />
                        <Button className="mt-3" onClick={handleUpload} disabled={isFileUploadEmpty}>Upload file</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">File upload</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Upload your file here</DrawerTitle>
                </DrawerHeader>

                <div>
                    <Dashboard uppy={uppy} hideUploadButton />
                </div>

                <DrawerFooter className="pt-2">
                    <Button className="mt-3 w-full" onClick={handleUpload} disabled={isFileUploadEmpty}>
                        Upload file
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={() => uppy.clear()}>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
