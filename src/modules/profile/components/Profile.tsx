import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { createClient } from '../../../utils/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
	useDisclosure,
} from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react';
import LoadingPage from '@/components/LoadingPage';
import { Label } from '@/components/ui/label';
import { handleResetPassword } from '@/actions/user/updatePassword';
import { handleDeleteAccount } from '@/actions/user/deleteAccount';
import { logout } from '@/app/auth/login/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
	DialogClose
} from '@/components/ui/dialog'

interface ProfileData {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	address: string;
	cp_number: string;
	dob: string;
	profile_url: string;
}

const ProfileSection = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [editProfileData, setEditProfileData] = useState<ProfileData | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
	const [isResetLoading, setIsResetLoading] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const supabase = createClient();
    const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			if (data.session) {
				await getProfile(data.session.user.id);
			} else {
				toast.error('Login first to access this function!');
				window.location.href = '/';
			}
		};
		checkSession();
	}, []);

	const getProfile = async (id: string) => {
		const { data, error } = await supabase
			.from('account')
			.select('*')
			.eq('id', id);

		if (data && data.length > 0) {
			setProfileData(data[0]);
			setEditProfileData(data[0]);
		} else if (error) {
			toast.error('No profile data found.');
		}
		setLoading(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditProfileData((prevData) =>
			prevData ? { ...prevData, [name]: value } : prevData
		);
	};

	// const handleConfirmationInputChange = (
	// 	e: React.ChangeEvent<HTMLInputElement>
	// ) => {
	// 	setConfirmationInput(e.target.value);
	// };

	// const handleDeleteAccountConfirm = async () => {
	// 	if (
	// 		confirmationInput === `${profileData?.firstname} ${profileData?.lastname}`
	// 	) {
	// 		try {
	// 			await handleDeleteAccount(profileData?.id);
	// 			toast.success('Account deleted successfully!');
	// 			await logout();
	// 		} catch (error) {
	// 			toast.error('Failed to delete account: ' + error.message);
	// 		}
	// 	} else {
	// 		toast.error('Please enter the correct confirmation text.');
	// 	}
	// };

	const handleDeleteAccountDialog = async () => {
        setIsDeleting(true);
        try {
            
            await handleDeleteAccount(profileData?.id);
            toast.success('Account deleted successfully.');
            logout();
        } catch (error) {
            toast.error('Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

	const handleSaveProfile = async () => {
		if (editProfileData) {
			const { id, firstname, lastname, address, cp_number, dob } =
				editProfileData;

			
			if (firstname.trim() === '' && lastname.trim() === '') {
				toast.error('Firstname and Lastname cannot be empty');
				return;
			}

			if (firstname.trim() === '' || lastname.trim() === '') {
				toast.error('Firstname and Lastname cannot be empty');
				return;
			}

			if (cp_number.length !== 13) {
				toast.error('Contact number is Invalid.');
				return;
			}

			const { error: updateProfileError } = await supabase
				.from('account')
				.update({ firstname, lastname, address, cp_number, dob })
				.eq('id', id);

			if (!updateProfileError) {
				const { error: updateAuthError } = await supabase.auth.updateUser({
					data: { firstname, lastname },
				});

				if (!updateAuthError) {
					toast.success('Profile updated successfully!');
					setProfileData(editProfileData);
					onOpenChange(false);
				} else {
					toast.error(
						`Failed to update auth metadata: ${updateAuthError.message}`
					);
				}
			} else {
				toast.error(`Failed to update profile, Invalid Inputs.`);
			}
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && profileData) {
			try {
				const fileExt = file.name.split('.').pop();
				const fileName = `${profileData.id}-${Date.now()}.${fileExt}`;
				const filePath = `profile images/${fileName}`;

				const { error: uploadError } = await supabase.storage
					.from('unihomes image storage')
					.upload(filePath, file);

				if (uploadError) {
					toast.error(`Failed to upload image: ${uploadError.message}`);
					return;
				}

				const { data: publicUrlData } = supabase.storage
					.from('unihomes image storage')
					.getPublicUrl(filePath);

				if (!publicUrlData?.publicUrl) {
					toast.error('Failed to get public URL for the uploaded image.');
					return;
				}

				const publicUrl = publicUrlData.publicUrl;

				const { error: updateError } = await supabase
					.from('account')
					.update({ profile_url: publicUrl })
					.eq('id', profileData.id);

				if (updateError) {
					toast.error(`Failed to update profile URL: ${updateError.message}`);
					return;
				}

				setProfileData((prevData) =>
					prevData ? { ...prevData, profile_url: publicUrl } : prevData
				);

				toast.success('Profile image updated successfully!');
			} catch (error) {
				toast.error(
					'An unexpected error occurred during profile image upload.'
				);
			}
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingPage />
			</div>
		);
	}

	const handleResetPasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsResetLoading(true);

		const result = await handleResetPassword(newPassword, confirmPassword);

		if (result.error) {
			toast.error(result.error);
		} else if (result.success) {
			setNewPassword('');
			setConfirmPassword('');
			toast.success(result.success);
			setIsResetPasswordOpen(false);
		}

		setIsResetLoading(false);
	};

	return (
		<>
			<section className='w-full p-2 bg-white dark:bg-secondary shadow-md rounded-lg px-4 py-10 border border-gray-300'>
				<div className='flex p-2 gap-4 h-[20%]'>
					<div className='relative'>
						<Avatar className='w-32 h-32'>
							<AvatarImage src={profileData?.profile_url} />
							<AvatarFallback>
								{profileData?.firstname.charAt(0)}
								{profileData?.lastname.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<button
							onClick={() => fileInputRef.current?.click()}
							className='absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-200 transition w-7'
						>
							<PencilSquareIcon className='w-5 h-5 text-gray-600' />
						</button>
						<input
							type='file'
							ref={fileInputRef}
							className='hidden'
							accept='image/*'
							onChange={handleFileChange}
						/>
					</div>
					<div className='flex items-center'>
						<div className='flex flex-col'>
							<h1 className='text-xl font-bold'>
								{profileData?.firstname} {profileData?.lastname}
							</h1>
							<p>{profileData?.email}</p>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 px-6 border-y border-gray-300 py-6'>
					<div className=''>
						<div>
							<h1 className='flex text-lg font-semibold'>Personal Details</h1>
						</div>
						<div className='grid gap-1'>
							<div className='pt-0'>
								<Label
									htmlFor='login-email'
									className='font-semibold text-sm text-foreground'
								>
									Email
								</Label>
								<Input
									disabled
									id='login-email'
									name='email'
									placeholder={profileData?.email}
									className='mt-1 w-full rounded-lg border border-gray-300 max-w-xl'
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label
										htmlFor='firstname'
										className='font-semibold text-sm text-foreground'
									>
										First Name
									</Label>
									<Input
										id="firstname"
										name="firstname"
										className="mt-1 w-full rounded-lg border border-gray-300 max-w-xl"
										value={editProfileData?.firstname || ''}
										onChange={handleInputChange}
										maxLength={50}
										minLength={6}
										onInput={(e) => {
											e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
										}}
										pattern="^(?!\s*$)[a-zA-Z\s]+$"
										title="First name cannot be empty and should only contain letters and spaces."
									/>
								</div>
								<div>
									<Label
										htmlFor='lastname'
										className='font-semibold text-sm text-foreground'
									>
										Last Name
									</Label>
									<Input
										id='lastname'
										name='lastname'
										className='mt-1 w-full rounded-lg border border-gray-300 max-w-xl'
										value={editProfileData?.lastname || ''}
										onChange={handleInputChange}
										maxLength={50}
										minLength={6}
										onInput={(e) => {
											e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
										}}
										pattern="^(?!\s*$)[a-zA-Z\s]+$"
									/>
								</div>
							</div>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label
										htmlFor='cp_number'
										className='font-semibold text-sm text-foreground'
									>
										Contact Number
									</Label>
									<Input
										id='cp_number'
										name='cp_number'
										value={editProfileData?.cp_number || '+63'}
										onChange={(e) => {
											const input = e.target.value;
											if (input.startsWith('+63')) {
												handleInputChange(e);
											} else {
												setEditProfileData((prevData) =>
													prevData
														? { ...prevData, cp_number: '+63' }
														: { ...prevData, cp_number: '' }
												);
											}
										}}
										className='mt-1 w-full rounded-lg border border-gray-300 max-w-xl'
									/>
								</div>

								<div>
									<Label
										htmlFor='dob'
										className='font-semibold text-sm text-foreground'
									>
										Date of Birth
									</Label>
									<Input
										id='dob'
										name='dob'
										value={editProfileData?.dob || ''}
										placeholder='MM/DD/YYYY'
										onChange={handleInputChange}
										className='mt-1 w-full rounded-lg border border-gray-300 max-w-xl'
									/>
								</div>
							</div>
						</div>

						<div className='flex justify-end gap-2 mt-4'>
							<Button
								onClick={() => {
									setEditProfileData(profileData);
								}}
								className='bg-gray-200 text-black hover:bg-gray-300'
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveProfile}
								className='bg-primary text-white hover:bg-primary-dark'
							>
								Save Changes
							</Button>
						</div>
					</div>

					<div className=''>
						<div>
							<h1 className='text-lg font-semibold'>Password</h1>
						</div>
						<div className='grid gap-1'>
							<div className=''>
								<Label
									htmlFor='current_password'
									className='font-semibold text-sm text-foreground'
								>
									Current Password
								</Label>
								<Input
									type='password'
									placeholder='Current Password'
									className='mt-1 w-full rounded-lg border border-gray-300 max-w-xl'
								/>
							</div>
							<div className=''>
								<Label
									htmlFor='new_password'
									className='font-semibold text-sm text-foreground'
								>
									New Password
								</Label>
								<Input
									type='password'
									placeholder='New Password'
									value={newPassword}
									className='mt-1 w-full rounded-lg border border-gray-300 max-w-xl'
								/>
							</div>
							<div className=''>
								<Label
									htmlFor='confirm_new_password'
									className='font-semibold text-sm text-foreground'
								>
									Confirm New Password
								</Label>
								<Input
									type='password'
									placeholder='Confirm Password'
									value={confirmPassword}
									className='mt-1 w-full rounded-lg border border-gray-300 max-w-xl'
								/>
							</div>
						</div>
						<div className='flex justify-end gap-2 mt-4'>
							<Button
								onClick={() => {
									setEditProfileData(profileData);
								}}
								className='bg-gray-200 text-black hover:bg-gray-300'
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveProfile}
								className='bg-primary text-white hover:bg-primary-dark'
							>
								Update Password
							</Button>
						</div>
					</div>
				</div>

				{/* Account Deletion Section */}
				<div className='flex justify-end px-6 py-3'>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								className='bg-background border border-red-500 text-red-500 hover:border-red-600 hover:text-red-600'
							>
								Delete Account
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Confirm Account Deletion</DialogTitle>
								<DialogDescription>
									Are you sure you want to delete your account? This action is irreversible, and you will lose all your data.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className='flex justify-end'>
								<DialogClose asChild>
									<Button
										variant="outline"
									>
										Cancel
									</Button>
								</DialogClose>
								<Button
									color="red"
									onClick={handleDeleteAccountDialog}
									disabled={isDeleting}
								>
									{isDeleting ? 'Deleting...' : 'Delete'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>


				{/* Profile Edit Modal */}
				{/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent className='sm:max-w-[425px]'>
						<ModalHeader>
							<h1 className='font-bold'>Edit Profile</h1>
						</ModalHeader>
						<ModalBody>
							<div>
								<Input
									label='First Name'
									name='firstname'
									value={editProfileData?.firstname || ''}
									onChange={handleInputChange}
								/>
							</div>
							<div>
								<Input
									label='Last Name'
									name='lastname'
									value={editProfileData?.lastname || ''}
									onChange={handleInputChange}
								/>
							</div>
							<div>
								<Input
									label='Contact Number'
									name='cp_number'
									value={editProfileData?.cp_number || ''}
									onChange={handleInputChange}
								/>
							</div>
							<div>
								<Input
									label='Address'
									name='address'
									value={editProfileData?.address || ''}
									onChange={handleInputChange}
								/>
							</div>
							<div>
								<Input
									label='Date of Birth'
									name='dob'
									value={editProfileData?.dob || ''}
									onChange={handleInputChange}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button onClick={handleSaveProfile}>Save</Button>
						</ModalFooter>
					</ModalContent>
				</Modal> */}

				{/* Reset Password Modal */}
				{/* <Dialog
					open={isResetPasswordOpen}
					onOpenChange={setIsResetPasswordOpen}
				>
					<DialogTrigger asChild>
						<Button>Reset Password</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Reset Password</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleResetPasswordSubmit}>
							<div className='py-4'>
								<Input
									label='New Password'
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									type='password'
								/>
							</div>
							<div className='py-4'>
								<Input
									label='Confirm Password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									type='password'
								/>
							</div>
							<DialogFooter>
								<Button type='submit' isLoading={isResetLoading}>
									Reset Password
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog> */}

				{/* Delete Account Dialog */}
				{/* <Dialog>
					<DialogTrigger asChild>
						<Button>Delete Account</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Delete Account</DialogTitle>
							<DialogDescription>
								Be careful, this action cannot be undone. This will permanently
								delete your account and remove its data from our servers.
							</DialogDescription>
							<DialogDescription>
								Enter the words "{profileData?.firstname}{' '}
								{profileData?.lastname}" to proceed.
							</DialogDescription>
						</DialogHeader>
						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='confirmationInput' className='text-right'>
									Enter here:
								</Label>
								<Input
									id='confirmationInput'
									className='col-span-3'
									value={confirmationInput}
									onChange={handleConfirmationInputChange}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={handleDeleteAccountConfirm}>
								Delete Account
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog> */}
			</section>
		</>
	);
};

export default ProfileSection;
