'use client';

import { useEffect, useState } from 'react';
import { LucideAlignJustify, X } from 'lucide-react';
import spiels from '@/lib/constants/spiels';
import Image from 'next/image';
import { ModeToggle } from '../mode-toggle';
import { NavbarMenu } from './NavbarMenu';
import { NavbarModalRegistration } from './NavbarModalRegistration';
import { NavbarModalLogin } from './NavbarModalLogin';
import { Button } from '../ui/button';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationPopover } from './NotificationPopover';
import { createClient } from '@/utils/supabase/client';
function NavBar() {
	const [menu, setMenu] = useState(false);
	const [modalType, setModalType] = useState<null | 'login' | 'register'>(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [profileData, setProfileData] = useState({
		firstname: '',
		lastname: '',
		initials: '',
	});
	const navChoice = spiels.NAVBAR_OVERALL_LIST;
	const supabase = createClient();
	const toggleMenu = () => setMenu((prev) => !prev);
	const openModal = (type: 'login' | 'register') => {
		setModalType(type);
		setMenu(false);
	};
	const closeModal = () => setModalType(null);
	useEffect(() => {
		const checkSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (data.session) {
				setLoggedIn(true);
				setProfileData({
					firstname: data.session.user.user_metadata.firstname,
					lastname: data.session.user.user_metadata.lastname,
					initials:
						data.session.user.user_metadata.firstname[0].toUpperCase() +
						data.session.user.user_metadata.lastname[0].toUpperCase(),
				});
			} else {
				console.log('No session found.');
			}
		};
		checkSession();
	}, []);

	//trial login
	const handleLoginSuccess = () => {
		setLoggedIn(true);
		closeModal();
	};

	//trial logout
	const handleLogout = () => {
		setLoggedIn(false);
	};

	return (
		<div className='md:sticky md:top-0 md:shadow-lg z-[50] bg-white bg-opacity-80 backdrop-blur-md dark:bg-card'>
			{/* DESKTOP */}
			<div className='hidden lg:block animate-in fade-in zoom-in p-4'>
				<div className='flex justify-between mx-2 md:mx-[30px] items-center'>
					<Image
						src='/Logo.png'
						alt='Logo'
						width={160}
						height={80}
						className='h-8 w-auto scale-[2]'
					/>
					<NavbarMenu session={loggedIn} />
					<div className='flex items-center gap-[2px]'>
						<NotificationPopover />
						<div className='pr-2'>
							<ModeToggle />
						</div>

						{!loggedIn ? (
							<Button size='sm' onClick={() => openModal('register')}>
								{spiels.BUTTON_SIGN_UP}
							</Button>
						) : (
							<ProfileDropdown
								profileData={profileData.initials}
								nameData={profileData.firstname + ' ' + profileData.lastname}
							/>
						)}
					</div>
				</div>
			</div>

			{/* MOBILE */}
			<div className='block lg:hidden shadow-sm fixed top-0 w-full z-[999] bg-white bg-opacity-80 backdrop-blur-md dark:bg-card h-[76px] p-0 m-0'>
				<div className='flex justify-between px-4 items-center h-full w-full'>
					<Image src='/logo.png' alt='logo' width={80} height={28} />
					<div className='flex items-center gap-[10px]'>
						{menu ? (
							<X
								className='cursor-pointer dark:text-white text-black'
								onClick={toggleMenu}
							/>
						) : (
							<LucideAlignJustify
								className='cursor-pointer'
								onClick={toggleMenu}
							/>
						)}
						<NotificationPopover />
						<div className='pr-2'>
							<ModeToggle />
						</div>
						{loggedIn && (
							<ProfileDropdown
								onLogout={handleLogout}
								profileData={profileData.initials}
								nameData={profileData.firstname + ' ' + profileData.lastname}
							/>
						)}
					</div>
				</div>

				{menu && (
					<div className='bg-white dark:bg-card bg-opacity-90 py-4 w-full'>
						<div className='flex flex-col gap-8 mt-8 mx-4'>
							{spiels.NAVBAR_OVERALL_LIST.map(
								(item, index) =>
									loggedIn || (item.label !== 'Favorites' && item.label !== 'Messages') ? (
										<a
											key={index}
											href={item.href}
											className='hover:text-card cursor-pointer flex items-center gap-2 font-[500] text-gray'
										>
											{item.label}
										</a>
									) : null
							)}
							{!loggedIn && (
								<a
									onClick={() => openModal('register')}
									className='cursor-pointer'
								>
									{spiels.BUTTON_SIGN_UP}
								</a>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			{modalType === 'register' && (
				<NavbarModalRegistration
					isOpen={modalType === 'register'}
					onClose={closeModal}
					openModal={openModal}
				/>
			)}
			{modalType === 'login' && (
				<NavbarModalLogin
					isOpen={modalType === 'login'}
					onClose={closeModal}
					openModal={openModal}
					onLoginSuccess={handleLoginSuccess}
				/>
			)}
		</div>
	);
}

export default NavBar;
