import { PencilIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { createClient } from '../../../utils/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Input,
	DatePicker,
} from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react';
import { parseDate } from '@internationalized/date';
import LoadingPage from '@/components/LoadingPage';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { handleResetPassword } from '@/actions/user/updatePassword';

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
	const [editProfileData, setEditProfileData] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
	const [isResetLoading, setIsResetLoading] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const supabase = createClient();

	useEffect(() => {
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			if (data.session) {
				await getProfile(data.session.user.id);
			} else {
				alert('Login first to access this function!');
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
			alert('No profile data found.');
		}
		setLoading(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditProfileData((prevData) =>
			prevData ? { ...prevData, [name]: value } : prevData
		);
	};

	const handleSaveProfile = async () => {
		if (editProfileData) {
			const { id, firstname, lastname, address, cp_number, dob } =
				editProfileData;

			const { error: updateProfileError } = await supabase
				.from('account')
				.update({ firstname, lastname, address, cp_number, dob })
				.eq('id', id);

			if (!updateProfileError) {
				const { error: updateAuthError } = await supabase.auth.updateUser({
					data: { firstname, lastname },
				});

				if (!updateAuthError) {
					alert('Profile updated successfully!');
					setProfileData(editProfileData);
					onOpenChange(false);
				} else {
					alert(`Failed to update auth metadata: ${updateAuthError.message}`);
				}
			} else {
				alert(`Failed to update profile: ${updateProfileError.message}`);
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
					alert(`Failed to upload image: ${uploadError.message}`);
					return;
				}

				const { data: publicUrlData } = supabase.storage
					.from('unihomes image storage')
					.getPublicUrl(filePath);

				if (!publicUrlData?.publicUrl) {
					alert('Failed to get public URL for the uploaded image.');
					return;
				}

				const publicUrl = publicUrlData.publicUrl;

				const { error: updateError } = await supabase
					.from('account')
					.update({ profile_url: publicUrl })
					.eq('id', profileData.id);

				if (updateError) {
					alert(`Failed to update profile URL: ${updateError.message}`);
					return;
				}

				setProfileData((prevData) =>
					prevData ? { ...prevData, profile_url: publicUrl } : prevData
				);

				alert('Profile image updated successfully!');
			} catch (error) {
				alert('An unexpected error occurred during profile image upload.');
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
			alert(result.error);
		} else if (result.success) {
			setNewPassword('');
			setConfirmPassword('');
			alert(result.success);
			setNewPassword('');
			setConfirmPassword('');
			setIsResetPasswordOpen(false);
		}
		
		setIsResetLoading(false);
	};

	return (
		<>
			<section className='w-full p-2'>
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
							onChange={handleFileChange} />
					</div>
					<div className='flex items-center'>
						<div className='flex flex-col'>
							<h1 className='font-bold mb-1'>{`${profileData?.firstname} ${profileData?.lastname}`}</h1>
							<p>{profileData?.address}</p>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-5 p-4 mt-10'>
					<div className='flex justify-between items-center'>
						<h1 className='text-xl font-bold'>Personal Details</h1>
						<Button
							onPress={onOpen}
							className='text-blue-600 underline hover:text-blue-800 bg-transparent'
						>
							<PencilIcon className='w-4 h-4 mr-1' />
							Edit
						</Button>
					</div>

					<div>
						<p className='text-base font-medium text-default-400'>Full Name</p>
						<h4 className='text-lg font-medium'>{`${profileData?.firstname} ${profileData?.lastname}`}</h4>
					</div>
					<div>
						<p className='text-base font-medium text-default-400'>
							Contact Number
						</p>
						<h4 className='text-lg font-medium'>
							{profileData?.cp_number || '---'}
						</h4>
					</div>
					<div>
						<p className='text-base font-medium text-default-400'>Address</p>
						<h4 className='text-lg font-medium'>
							{profileData?.address || '---'}
						</h4>
					</div>
					<div>
						<p className='text-base font-medium text-default-400'>
							Date of Birth
						</p>
						<h4 className='text-lg font-medium'>
							{profileData?.dob
								? new Date(profileData.dob).toLocaleDateString()
								: '---'}
						</h4>
					</div>
					<div>
						<p className='text-base font-medium text-default-400'>Email</p>
						<h4 className='text-lg font-medium'>{profileData?.email}</h4>
					</div>
				</div>

				<div className='flex mt-4'>
					<Button className='text-blue-600 underline hover:text-blue-800 bg-transparent' onClick={() => setIsResetPasswordOpen(true)}>
						Reset Password
					</Button>
				</div>
				<div className='flex mt-4'>
					<Button className='text-red-600 underline hover:text-red-800 bg-transparent'>
						Delete Account
					</Button>
				</div>
			</section>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					<ModalHeader>Edit Profile</ModalHeader>
					<ModalBody>
						<Label htmlFor='firstname'>First Name</Label>
						<Input
							id='firstname'
							name='firstname'
							value={editProfileData?.firstname}
							onChange={handleInputChange}
						/>
						<Label htmlFor='lastname'>Last Name</Label>
						<Input
							id='lastname'
							name='lastname'
							value={editProfileData?.lastname}
							onChange={handleInputChange}
						/>
						<Label htmlFor='address'>Address</Label>
						<Input
							id='address'
							name='address'
							value={editProfileData?.address}
							onChange={handleInputChange}
						/>
						<Label htmlFor='cp_number'>Contact Number</Label>
						<Input
							id='cp_number'
							name='cp_number'
							value={editProfileData?.cp_number}
							onChange={handleInputChange}
						/>
						<Label htmlFor='dob'>Date of Birth</Label>
						<DatePicker
										label='Birth Date'
										showMonthAndYearPickers
										value={
											editProfileData?.dob
												? parseDate(editProfileData.dob)
												: null
										}
										onChange={(dateValue) =>
											setEditProfileData((prevData) =>
												prevData
													? { ...prevData, dob: dateValue?.toString() || '' }
													: prevData
											)
										}
									/>
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleSaveProfile}>Save Changes</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Reset Password Modal */}
			<Dialog  open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
			<DialogContent style={{ backgroundColor: '#309ec1' }}> 
					<DialogHeader >
						<DialogTitle>Reset Password</DialogTitle>
						<small>Current password can't be used as new password</small>
					</DialogHeader>
					<Input
						type='password'
						placeholder='New Password'
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					<Input
						type='password'
						placeholder='Confirm Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<DialogFooter>
					<Button
						disabled={isResetLoading}
						onClick={handleResetPasswordSubmit}
					>
						{isResetLoading ? 'Updating...' : 'Save Changes'}
					</Button>
				</DialogFooter>
				</DialogContent>

			</Dialog>
		</>
	);
};

export default ProfileSection;
