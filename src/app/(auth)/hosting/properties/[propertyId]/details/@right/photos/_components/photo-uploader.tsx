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

import { addPropertyImages } from "@/actions/property/propertyImage";
import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function PhotoUploader({ userId, propertyId, photoBucketFileCount }: { userId: string; propertyId: string, photoBucketFileCount: number }) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [isFileUploadEmpty, setIsFileUploadEmpty] = React.useState<boolean>(true);

    const router = useRouter();

    const onBeforeRequest = async (req: any) => {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
    };

    const [uppy] = React.useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: 5,
                allowedFileTypes: ["image/jpg", "image/jpeg", "image/png"],
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
        setIsFileUploadEmpty(photoBucketFileCount >= 5 ? true : false);
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
                    router.refresh();
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

    uppy.on("upload-success", (file) => {
        uppy.removeFile(file.id);
    })



    return (
			<Dialog open={open} onOpenChange={setOpen} modal={true}>
				<DialogTrigger asChild>
					<Button
						variant='link'
						className='w-fit gap-1 hover:bg-transparent'
						type='button'
						onClick={() => {
							setOpen(!open);
						}}
					>
						<span className='hover:underline dark:text-blue-300'>
							Add photos
						</span>
						<Plus className='h-4 w-4 hover:underline dark:text-blue-300' />
					</Button>
				</DialogTrigger>
				<DialogContent
					className='z-[999] transform translate-x-[-50%] translate-y-[-50%]'
					onInteractOutside={(e) => {
						e.preventDefault();
					}}
				>
					<DialogHeader>
						<DialogTitle>Property photos upload</DialogTitle>
						<DialogDescription asChild>
							<>
								{photoBucketFileCount >= 5 ? (
									<p className='text-danger'>
										Unable to upload more images. You have reached the maximum
										number of images, please remove some to be able to upload
										more.
									</p>
								) : (
									<div className='grow space-y-2'>
										<p className=''>Upload your business permit here.</p>
										<ul className='list-inside list-disc text-sm text-muted-foreground'>
											<li>Up to 5 images allowed.</li>
											<li>Allowed image types: .jpg, .jpeg, .png.</li>
											<li>Minimum file size of 6 mb per image.</li>
										</ul>
									</div>
								)}
							</>
						</DialogDescription>
					</DialogHeader>

					<div>
						<Dashboard
							uppy={uppy}
							hideUploadButton
							className={cn({ hidden: photoBucketFileCount >= 5 })}
						/>
						<Button
							className='mt-3'
							type='button'
							onClick={handleUpload}
							disabled={
								isFileUploadEmpty &&
								(photoBucketFileCount >= 5 ? true : isFileUploadEmpty)
							}
							size='sm'
						>
							Upload images
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
}

export default PhotoUploader;
