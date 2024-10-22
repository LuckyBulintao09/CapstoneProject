"use client";

import { useUploadFile } from "@/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader/file-uploader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function BasicUploaderDemo() {
    const { onUpload, progresses, isUploading } = useUploadFile("company-logo-test", { defaultUploadedFiles: [] });

    return (
        <div className="space-y-6">
            <FileUploader maxFileCount={4} maxSize={4 * 1024 * 1024} progresses={progresses} onUpload={onUpload} disabled={isUploading} />
        </div>
    );
}
