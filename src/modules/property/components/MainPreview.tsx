import { Card } from '@/components/ui/card';
import React from 'react';

interface MainPreviewProps {
	openModal: () => void;
}

const MainPreview: React.FC<MainPreviewProps> = ({ openModal }) => {
	return (
		<>
			<div className='col-span-4 pr-0 mr-0'>
				<Card className='lg:h-[550px] md:h-full sm:h-[300px] xs:h-[365px] border-none'>
					<img
						src='https://picsum.photos/600/400'
						alt='property image'
						className='rounded-md w-full h-full cursor-pointer'
						onClick={openModal}
					/>
				</Card>
			</div>
		</>
	);
};

export default MainPreview;
