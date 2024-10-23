import React from 'react';
import ResponsiveLayout from '../ResponsiveLayout';

const ErrorPage = () => {
	return (
		<ResponsiveLayout>
			<div className='flex flex-col justify-center items-center h-screen text-center'>
				<h1 className='text-8xl font-bold mb-1'>404</h1>
				<p className='text-xl'>
					The property you are looking for does not exist.
				</p>
			</div>
		</ResponsiveLayout>
	);
};

export default ErrorPage;
