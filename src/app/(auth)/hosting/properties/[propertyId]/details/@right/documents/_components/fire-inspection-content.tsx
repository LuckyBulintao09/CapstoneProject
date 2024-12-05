'use client';

import React from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Trash } from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { removeFireInspection } from '@/actions/property/propertyDocuments';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import FireInstpectionUploder from './fire-inspection-uploader';

function FireInspectionContent({
	fireInspection,
	userId,
	propertyId,
}: {
	fireInspection: string;
	userId: string;
	propertyId: string;
}) {
	const [isPending, startTransition] = React.useTransition();

	const router = useRouter();

	return (
		<>
			<p className='mb-2 font-semibold'>Fire Inspection Certificate</p>
			<Card className='bg-background flex items-center justify-between'>
				<CardHeader className='sr-only'>
					<CardTitle className='sr-only'>Manage business permit</CardTitle>
					<CardDescription className='sr-only'>
						You can remove, update or download your business permit here.
					</CardDescription>
				</CardHeader>
				<CardContent className='px-5 py-3'>
					<div className='flex items-center gap-2'>
						<Image
							src={
								fireInspection?.split('/').pop().split('.').pop() === 'jpg' ||
								fireInspection?.split('/').pop().split('.').pop() === 'jpeg' ||
								fireInspection?.split('/').pop().split('.').pop() === 'png'
									? '/documents/image-document-svgrepo-com.svg'
									: fireInspection?.split('/').pop().split('.').pop() ===
											'docx' ||
									  fireInspection?.split('/').pop().split('.').pop() === 'doc'
									? '/documents/word-document-svgrepo-com.svg'
									: fireInspection?.split('/').pop().split('.').pop() === 'pdf'
									? '/documents/pdf-document-svgrepo-com.svg'
									: '/documents/attachment-document-svgrepo-com.svg'
							}
							alt=''
							width={64}
							height={64}
							className='object-cover aspect-square w-11 h-auto'
						/>
						<div className='flex flex-col'>
							<p className='text-sm font-[500] truncate w-[300px]'>
								{fireInspection ? (
									<span>{fireInspection?.split('/').pop()}</span>
								) : (
									<span>No fire inspection certificate uploaded.</span>
								)}
							</p>
							{/* <p className="text-sm font-[500] truncate w-[300px] text-muted-foreground">1 kb</p> */}
						</div>
					</div>
				</CardContent>
				<CardFooter className='gap-2 px-5 py-3'>
					<>
						{isPending ? (
							<svg
								aria-hidden='true'
								className='h-3 w-3 fill-accent animate-spin-fade dark:text-accent-foreground text-primary'
								viewBox='0 0 100 101'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
									fill='currentColor'
								/>
								<path
									d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
									fill='currentFill'
								/>
							</svg>
						) : (
							<FireInstpectionUploder propertyId={propertyId} userId={userId} />
						)}
					</>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='ghost' size='icon' className='h-7 w-7'>
								{isPending ? (
									<svg
										aria-hidden='true'
										className='h-3 w-3 fill-accent animate-spin-fade dark:text-accent-foreground text-primary'
										viewBox='0 0 100 101'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
											fill='currentColor'
										/>
										<path
											d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
											fill='currentFill'
										/>
									</svg>
								) : (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Trash className='h-4 w-4' />
											</TooltipTrigger>
											<TooltipContent>
												<p>Remove uploaded file</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure you want to delete this file?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. It will permanently delete the
									file and remove the data from our server.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel
									disabled={isPending}
									className={cn(
										buttonVariants({ size: 'sm', variant: 'secondary' }),
										'border-none shadow-lg'
									)}
								>
									<div className='flex items-center'>
										{isPending && (
											<svg
												aria-hidden='true'
												className='h-3 w-3 mr-2 fill-accent animate-spin-fade dark:text-accent-foreground text-primary'
												viewBox='0 0 100 101'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
													fill='currentColor'
												/>
												<path
													d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
													fill='currentFill'
												/>
											</svg>
										)}
										<span>Cancel</span>
									</div>
								</AlertDialogCancel>
								<AlertDialogAction
									className={cn(
										buttonVariants({ variant: 'destructive', size: 'sm' })
									)}
									onClick={async () => {
										await startTransition(async () => {
											await removeFireInspection(
												propertyId,
												fireInspection,
												userId
											);
											router.refresh();
										});
									}}
									disabled={isPending || !fireInspection}
								>
									<div className='flex items-center'>
										{isPending && (
											<svg
												aria-hidden='true'
												className='h-3 w-3 mr-2 fill-accent animate-spin-fade dark:text-accent-foreground text-primary'
												viewBox='0 0 100 101'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
													fill='currentColor'
												/>
												<path
													d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
													fill='currentFill'
												/>
											</svg>
										)}
										<span>Continue</span>
									</div>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardFooter>
			</Card>
		</>
	);
}

export default FireInspectionContent;
