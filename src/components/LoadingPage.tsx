import React from 'react';
import ResponsiveLayout from './ResponsiveLayout';
import { cn } from '@/lib/utils';

const LoadingPage = ({className}: {className?: string}) => {
	return (
		<ResponsiveLayout>
			<div className={cn('flex flex-col justify-center items-center h-screen text-center', className)}>
				<h1 className='text-xl font-bold mb-4'>Loading . . .</h1>
				<div className='loader'></div>
				<style jsx>{`
					/* CSS for the loader */
					.loader {
						width: 65px;
						aspect-ratio: 1;
						position: relative;
					}
					.loader:before,
					.loader:after {
						content: '';
						position: absolute;
						border-radius: 50px;
						box-shadow: 0 0 0 3px inset hsl(216, 83%, 34%); /* Set the blue color using HSL */
						animation: l5 2.5s infinite;
					}
					.loader:after {
						animation-delay: -1.25s;
						border-radius: 0;
					}
					@keyframes l5 {
						0% {
							inset: 0 35px 35px 0;
						}
						12.5% {
							inset: 0 35px 0 0;
						}
						25% {
							inset: 35px 35px 0 0;
						}
						37.5% {
							inset: 35px 0 0 0;
						}
						50% {
							inset: 35px 0 0 35px;
						}
						62.5% {
							inset: 0 0 0 35px;
						}
						75% {
							inset: 0 0 35px 35px;
						}
						87.5% {
							inset: 0 0 35px 0;
						}
						100% {
							inset: 0 35px 35px 0;
						}
					}
				`}</style>
			</div>
		</ResponsiveLayout>
	);
};

export default LoadingPage;
