import { useState, useEffect } from 'react';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@nextui-org/react';
import spiels from '@/lib/constants/spiels';
import {
	getUserSession,
	fetchGovId,
	uploadGovernmentId,
} from '@/actions/hosting/hosting';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const HostingVerification: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const [govIdUrl, setGovIdUrl] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [isApproved, setIsApproved] = useState<boolean>(false);
	const [isRejected, setIsRejected] = useState<boolean>(false);
	const [declineReason, setDeclineReason] = useState<string | null>(null);
	const [fileWarning, setFileWarning] = useState<string | null>(null);

	const [prevState, setPrevState] = useState<{
		govIdUrl: string | null;
		isApproved: boolean;
		isRejected: boolean;
		declineReason: string | null;
	} | null>(null);

	const fetchVerificationData = async () => {
		const user = await getUserSession();
		if (!user) return;

		setUserId(user.id);

		const govIdData = await fetchGovId(user.id);
		if (!govIdData) return;

		const formattedData = {
			govIdUrl: govIdData.governmentIdUrl || null,
			isApproved: govIdData.isApproved || false,
			isRejected: govIdData.isRejected || false,
			declineReason: govIdData.declineReason || null,
		};

		const hasChanged =
			formattedData.govIdUrl !== prevState?.govIdUrl ||
			formattedData.isApproved !== prevState?.isApproved ||
			formattedData.isRejected !== prevState?.isRejected ||
			formattedData.declineReason !== prevState?.declineReason;

		if (hasChanged) {
			setGovIdUrl(formattedData.govIdUrl);
			setIsApproved(formattedData.isApproved);
			setIsRejected(formattedData.isRejected);
			setDeclineReason(formattedData.declineReason);
			setPrevState(formattedData);
		}
	};

	useEffect(() => {
		fetchVerificationData();

		const interval = setInterval(() => {
			fetchVerificationData();
		}, 10000);

		return () => clearInterval(interval);
	}, [prevState]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFile = event.target.files ? event.target.files[0] : null;
		setFile(newFile);
		setFileWarning(newFile ? null : 'Please upload a file to proceed.');
	};

	const handleSubmit = async () => {
		const supabase = createClient();
		if (!file || !userId) {
			setFileWarning('Please upload a file to proceed.');
			return;
		}

		const fileExt = file.name.split(".").pop();
		const fileName = `government-id-${Date.now()}.${fileExt}`;
		const filePath = `government ID/${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from("unihomes image storage")
			.upload(filePath, file);
		
		if (uploadError) {
			toast.error(`Failed to upload government ID: ${uploadError.message}`);
			return null;
		}

		const { data: publicUrlData } = supabase.storage
			.from("unihomes image storage")
			.getPublicUrl(filePath);

		if (!publicUrlData?.publicUrl) {
			toast.error("Failed to retrieve public URL for the uploaded file.");
			return null;
		}

		const publicUrl = await uploadGovernmentId(publicUrlData.publicUrl, userId);
		if (publicUrlData.publicUrl) {
			setGovIdUrl(publicUrlData.publicUrl);
			setIsRejected(false);
			setDeclineReason(null);
			toast.success("Government ID uploaded successfully.");
		}
	};

	// const handleCancelVerification = async () => {
	// 	if (!userId) return;

	// 	const success = await cancelVerification(userId, govIdUrl);
	// 	if (success) {
	// 		setGovIdUrl(null);
	// 		setIsApproved(false);
	// 		setIsRejected(false);
	// 		setDeclineReason(null);
	// 	}
	// };

	return (
		<>
			<Alert
				className={`bg-white dark:bg-secondary mb-2 ${
					isApproved
						? 'border-green-700'
						: isRejected
						? 'border-red-700 dark:border-red-300'
						: govIdUrl
						? 'border-yellow-700'
						: 'border-black dark:border-white'
				}`}
			>
				<Terminal className='h-4 w-4' />
				<AlertTitle
					className={`font-bold ${
						isApproved
							? 'text-green-700'
							: isRejected
							? 'text-red-700 dark:text-red-300'
							: govIdUrl
							? 'text-yellow-700'
							: 'text-black dark:text-white'
					}`}
				>
					{isApproved
						? 'Success'
						: isRejected
						? 'Rejected'
						: govIdUrl
						? 'Waiting for Verification'
						: 'Heads up!'}
				</AlertTitle>
				<AlertDescription>
					{isApproved ? (
						<>
							<p>
								Your government ID has been verified and approved. You can now
								proceed with your listings!
							</p>
						</>
					) : isRejected ? (
						<>
							<p>
								Your document has been rejected. Please upload a valid ID again.
							</p>
							{declineReason && (
								<p className='text-sm mt-2'>
									<strong>Reason:</strong> {declineReason}
								</p>
							)}
						</>
					) : govIdUrl ? (
						<>
							<p>
								Your document has been uploaded. We are verifying your identity.
							</p>
						</>
					) : (
						<>
							<p>
								You’ll need to upload an official government ID. This is
								required to publish your listing(s).
							</p>
						</>
					)}
				</AlertDescription>
			</Alert>

			<section className='w-full bg-white dark:bg-secondary shadow-md rounded-lg border border-gray-300 px-8 py-10'>
				<div className='flex flex-col gap-4'>
					<h1 className='font-bold text-xl'>Government ID Upload</h1>
					<p>
						Please upload necessary documents to verify yourself as a host.
						Ensure your photos aren’t blurry and the front of your Government ID
						clearly shows your face.{' '}
						<strong>
							Only one upload is allowed, so please upload the front of your ID.
						</strong>
					</p>
					<div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
						<div className='col-span-3'>
							<div>
								{isRejected && (
									<div className='text-red-700 rounded-md'>
										<label className='w-full'>
											<div className='w-full flex justify-between items-center bg-white border-dashed border-2 border-red-600 rounded-lg p-4 hover:bg-red-50 transition-all'>
												{file ? (
													<span className='text-sm text-gray-800 flex items-center'>
														{file.name}
														{/* X Icon to Remove File */}
														<button
															type='button'
															className='ml-2 text-red-600 hover:text-red-800'
															onClick={() => setFile(null)}
														>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'
																className='w-4 h-4'
															>
																<path
																	stroke-linecap='round'
																	stroke-linejoin='round'
																	stroke-width='2'
																	d='M6 18L18 6M6 6l12 12'
																/>
															</svg>
														</button>
													</span>
												) : (
													<span className='text-sm text-gray-500'>
														Choose a file
													</span>
												)}

												<input
													type='file'
													accept='image/*'
													onChange={handleFileChange}
													className='hidden'
												/>
											</div>
										</label>

										{fileWarning && (
											<p className='text-red-600 mt-2 text-sm font-semibold'>
												{fileWarning}
											</p>
										)}

										<Button
											className='w-full lg:w-[50%] bg-black text-white hover:bg-gray-800 mt-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
											onClick={handleSubmit}
										>
											{spiels.BUTTON_SEND_REQUEST}
										</Button>
									</div>
								)}

								{!govIdUrl && !isRejected && (
									<div className='flex flex-col justify-center md:w-1/2 lg:w-[205px] mt-6'>
										<input
											type='file'
											accept='image/*'
											onChange={handleFileChange}
											className='file-input-class'
										/>
										{fileWarning && (
											<p className='text-red-600 mt-2 text-sm'>{fileWarning}</p>
										)}
									</div>
								)}

								{!govIdUrl && !isRejected && (
									<Button
										className='w-full lg:w-[50%] bg-black text-white hover:bg-gray-800 mt-2'
										onClick={handleSubmit}
									>
										{spiels.BUTTON_SEND_REQUEST}
									</Button>
								)}
							</div>
						</div>
						{isRejected || (!govIdUrl && !isApproved && !isRejected) ? (
							<div className='col-span-2'>
								<Card className='border-none'>
									<CardHeader>
										<CardTitle>Your Privacy</CardTitle>
										<CardDescription>
											We prioritize keeping your data private, safe, and secure.
											Learn more in our Privacy Policy.
										</CardDescription>
									</CardHeader>
								</Card>
							</div>
						) : (
							<div className='col-span-5'>
								<Card className='border-none'>
									<CardHeader>
										<CardTitle className='text-xl'>Your Privacy</CardTitle>
										<CardDescription>
											We prioritize keeping your data private, safe, and secure.
											Learn more in our Privacy Policy.
										</CardDescription>
									</CardHeader>
								</Card>
							</div>
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default HostingVerification;
