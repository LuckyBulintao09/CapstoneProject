import React from 'react';
import ResponsiveLayout from './ResponsiveLayout';

const LoadingPage = () => {
	return (
		<ResponsiveLayout>
			<div className='flex flex-col justify-center items-center h-screen text-center'>
				<h1 className='text-xl font-bold mb-4'>Loading . . .</h1>
				{/* Loader Implementation */}
				<div className='loader'></div>

				{/* Styles for Loader */}
				<style jsx>{`
					.loader {
						width: 60px;
						aspect-ratio: 1; /* Maintains a square aspect ratio */
						display: grid;
					}
					.loader:before,
					.loader:after {
						content: '';
						grid-area: 1/1;
						color: hsl(216, 83%, 34%); /* Blue color using HSL */
						animation: l19 1.5s infinite linear;
					}
					.loader:before {
						margin: 5px 20px;
						background: currentColor;
					}
					.loader:after {
						border: solid;
						border-width: 5px 20px;
						--s: 0;
					}
					@keyframes l19 {
						0% {
							transform: perspective(100px) rotate3d(1, var(--s, 1), 0, 0);
						}
						25% {
							transform: perspective(100px) rotate3d(1, var(--s, 1), 0, 90deg);
						}
						25.01% {
							transform: perspective(100px) rotate3d(1, var(--s, 1), 0, 90deg);
						}
						40%,
						60% {
							transform: perspective(100px) rotate3d(1, var(--s, 1), 0, 180deg);
						}
						75% {
							transform: perspective(100px) rotate3d(1, var(--s, 1), 0, 270deg);
						}
						75.01% {
							transform: perspective(100px) rotate3d(1, var(--s, 1), 0, 270deg);
						}
						90%,
						100% {
							transform: perspective(100px) rotate3d(1, var(--s, 1), 0, 360deg);
						}
					}
				`}</style>
			</div>
		</ResponsiveLayout>
	);
};

export default LoadingPage;
