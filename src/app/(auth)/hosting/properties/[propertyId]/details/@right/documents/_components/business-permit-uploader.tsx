'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

import { createClient } from '@/utils/supabase/client';

import { addPropertyBusinessPermit } from '@/actions/property/propertyDocuments';

import { useRouter } from 'next/navigation';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Upload } from 'lucide-react';

function BusinessPermitUploader({
	propertyId,
	userId,
}: {
	propertyId: string;
	userId: string;
}) {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [isFileUploadEmpty, setIsFileUploadEmpty] =
		React.useState<boolean>(true);

	const onBeforeRequest = async (req: any) => {
		const supabase = createClient();
		const { data } = await supabase.auth.getSession();
		req.setHeader('Authorization', `Bearer ${data.session?.access_token}`);
	};

	const [uppy] = React.useState(() =>
		new Uppy({
			restrictions: {
				maxNumberOfFiles: 1,
				allowedFileTypes: [
					'image/jpg',
					'image/jpeg',
					'image/png',
					'.pdf',
					'.doc',
					'.docx',
				],
				maxFileSize: 6 * 1024 * 1024,
			},
		}).use(Tus, {
			endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
			onBeforeRequest,
			retryDelays: [0, 3000, 5000, 10000, 20000],
			headers: {
				'x-upsert': 'true',
			},
			allowedMetaFields: [
				'bucketName',
				'objectName',
				'contentType',
				'cacheControl',
			],
			removeFingerprintOnSuccess: true,
			chunkSize: 6 * 1024 * 1024,
		})
	);

	uppy.on('file-added', (file) => {
		setIsFileUploadEmpty(false);
		file.meta = {
			...file.meta,
			bucketName: 'unihomes image storage',
			contentType: file.type,
			cacheControl: 3600,
		};
	});

	uppy.on('file-removed', () => {
		setIsFileUploadEmpty(true);
	});

	const handleUpload = async () => {
		if (uppy.getFiles().length > 0) {
			const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
			const bucketName = 'unihomes image storage';
			const objectName = `property/${userId}/${propertyId}/business_permit/${
				uppy.getFiles()[0].name
			}`;

			uppy.setFileMeta(uppy.getFiles()[0].id, {
				objectName,
			});

			uppy
				.upload()
				.then(async (result) => {
					if (result.failed.length > 0) {
						console.error('Upload failed', result.failed);
						return;
					}

					const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${objectName}`;

					await addPropertyBusinessPermit(fileUrl, propertyId, userId);

					setIsFileUploadEmpty(true);
					router.refresh();
				})

				.catch((err) => {
					console.error('Error during file upload', err);
				});
		}
	};
	return (
		<Dialog open={open} onOpenChange={setOpen} modal={true}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Upload
							className='h-4 w-4 hover:text-primary'
							onClick={() => {
								setOpen(!open);
							}}
						/>
					</TooltipTrigger>
					<TooltipContent>
						<p>Upload file</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DialogContent
				className='z-[999] transform translate-x-[-50%] translate-y-[-50%]'
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>Upload your file here</DialogTitle>
					<DialogDescription asChild>
						<div className='grow space-y-2'>
							<p className=''>Upload your business permit here.</p>
							<ul className='list-inside list-disc text-sm text-muted-foreground'>
								<li>Only one file allowed.</li>
								<li>
									Allowed file types: .jpg, .jpeg, .png, .pdf, .doc, .docx.
								</li>
								<li>Maximum file size of 6 mb.</li>
							</ul>
						</div>
					</DialogDescription>
				</DialogHeader>

				<div>
					<Dashboard uppy={uppy} hideUploadButton height={320}/>
					<Button
						className='mt-3'
						type='button'
						onClick={handleUpload}
						disabled={isFileUploadEmpty}
					>
						Upload file
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default BusinessPermitUploader;
