import * as React from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/handle-error";

import { createClient } from "@/utils/supabase/client";

interface UseUploadFileProps {
    defaultUploadedFiles?: string[];
}

export function useUploadFile(bucketName: string, { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {}) {
    const [uploadedFiles, setUploadedFiles] = React.useState<string[]>(defaultUploadedFiles);
    const [progresses, setProgresses] = React.useState<Record<string, number>>({});
    const [isUploading, setIsUploading] = React.useState(false);

    // Initialize Supabase client
    const supabase = createClient();

    async function onUpload(files: File[]) {
        setIsUploading(true);
        try {
            const uploadPromises = files.map(async (file) => {
                const filePath = `public/${file.name}`;

                const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);

                console.log("Supabase upload response:", { data, error });

                if (error) {
                    console.error("Error uploading file:", error);
                    throw error;
                }

                // Track progress (assuming Supabase returns progress in future updates)
                setProgresses((prev) => ({
                    ...prev,
                    [file.name]: 100, // Assuming upload is complete without progress API
                }));
                console.log("File uploaded successfully:", data?.path);

                const imgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucketName}/${data?.path}`;

                return imgUrl || "";
            });

            const res = await Promise.all(uploadPromises);
            setUploadedFiles((prev) => [...prev, ...res]);
            console.log("Uploaded files:", res);
            console.log("Current uploaded files:", uploadedFiles);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setProgresses({});
            setIsUploading(false);
        }
    }

    return {
        onUpload,
        uploadedFiles,
        progresses,
        isUploading,
    };
}
