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

import { toast } from "sonner";
import { addPropertyBusinessPermit } from "@/actions/property/addPropertyDocuments";

function DocumentsPage({ params }: { params: { propertyId: string } }) {
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
  
          // Set file metadata for the uploaded file
          uppy.setFileMeta(uppy.getFiles()[0].id, {
              objectName: `${user?.id}/business-permit/${uppy.getFiles()[0].name}`,
          });
  
          // Start the upload
          uppy.upload().then(async (result) => {
              if (result.failed.length > 0) {
                  console.error('Upload failed', result.failed);
                  return;
              }
  
              // After successful upload, generate the file URL
              const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;
              console.log("File uploaded successfully, calling addPropertyBusinessPermit...");
  
              // Call the server function to update the database with the file URL
              await addPropertyBusinessPermit(fileUrl, params.propertyId);
  
              setIsFileUploadEmpty(true);
          }).catch((err) => {
              console.error('Error during file upload', err);
          });
      }
  };
  

    return (
        <div>
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
                    className="mt-10"
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Upload your file here</DialogTitle>
                        <DialogDescription>Upload your business permit here. Minimum file size of 6 mb.</DialogDescription>
                    </DialogHeader>

                    <div>
                        <Dashboard uppy={uppy} hideUploadButton />
                        <Button className="mt-3" type="button" onClick={handleUpload} disabled={isFileUploadEmpty}>
                            Upload file
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <div></div>
        </div>
    );
}

export default DocumentsPage;
