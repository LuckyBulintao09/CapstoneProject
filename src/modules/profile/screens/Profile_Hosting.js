'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Title from '../components/Title';
import Profile from '../components/Profile';
import Hosting_Verification from '../components/Hosting_Verification';
import { ProfileBreadcrumbSection } from '@/components/breadcrumb/ProfileBreadcrumbSection';

const Profile_Hosting = () => {
	const [activeItem, setActiveItem] = useState('account');

	const handleItemClick = (item) => {
		setActiveItem(item);
	};

	return (
		<div className='px-32 md:px-24 sm:px-20 xs:px-10 h-full relative pb-8 bg-background dark:bg-secondary flex flex-col min-h-screen'>
			<ProfileBreadcrumbSection />
			<div className='h-full relative mb-8 bg-background dark:bg-secondary flex flex-col'>
				<div className='flex justify-between items-center mt-4'>
					<div>
						{activeItem === 'account' ? (
							<h1 className='font-semibold text-3xl dark:text-white'>
								Account{' '}
							</h1>
						) : (
							<h1 className='font-semibold text-3xl dark:text-white'>
								Hosting Verification{' '}
							</h1>
						)}

						{activeItem === 'account' ? (
							<p>Update and manage your account details.</p>
						) : (
							<p>Handle and manage your hosting verification.</p>
						)}
					</div>
				</div>
			</div>

			<div className='md:flex lg:flex '>
				<div className='md:w-1/4 lg:w-1/6 border-r border-gray-200 dark:border-gray-800 mr-3'>
					<Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
				</div>
				<div className='md:w-3/4 lg:w-5/6'>
					{activeItem === 'account' ? <Profile /> : <Hosting_Verification />}
				</div>
			</div>
		</div>
	);
};

export default Profile_Hosting;
