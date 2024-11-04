import { useState } from 'react';
import { CheckIcon, XMarkIcon, HomeIcon } from '@heroicons/react/24/solid';

interface ToggleSwitchProps {
	onStatusChange: (newStatus: string) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onStatusChange }) => {
	const [dragPosition, setDragPosition] = useState(50); // Start centered
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = () => {
		setIsDragging(true);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;

		const slider = e.currentTarget.getBoundingClientRect();
		let newPosition = ((e.clientX - slider.left) / slider.width) * 100;

		// Clamp position to stay within bounds
		if (newPosition < 0) newPosition = 0;
		if (newPosition > 100) newPosition = 100;

		setDragPosition(newPosition);
	};

	const handleMouseUp = () => {
		setIsDragging(false);

		// Determine the action based on final position
		if (dragPosition < 25) {
			onStatusChange('visited'); // Change status to "Visited" for left drag
			setDragPosition(50); // Reset to center
		} else if (dragPosition > 75) {
			onStatusChange('cancelled'); // Change status to "Cancelled" for right drag
			setDragPosition(50); // Reset to center
		} else {
			setDragPosition(50); // Center if not dragged far enough
		}
	};

	return (
		<div
			className='relative flex items-center justify-between w-24 p-1 bg-gray-100 dark:bg-gray-900 rounded-full cursor-pointer'
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={() => isDragging && handleMouseUp()}
		>
			<div className='flex items-center justify-center w-6 h-6 text-green-500'>
				<CheckIcon className='w-4 h-4' />
			</div>

			<div
				className={`absolute z-10 flex items-center justify-center w-8 h-8 bg-black rounded-full text-white transition-transform duration-300 ease-out`}
				style={{
					left: `${dragPosition}%`,
					transform: 'translateX(-50%)',
				}}
				onMouseDown={handleMouseDown}
			>
				<HomeIcon className='w-4 h-4' />
			</div>

			<div className='flex items-center justify-center w-6 h-6 text-red-500'>
				<XMarkIcon className='w-4 h-4' />
			</div>
		</div>
	);
};

export default ToggleSwitch;
