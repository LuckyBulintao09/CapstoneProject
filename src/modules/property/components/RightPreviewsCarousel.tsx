import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import React from 'react';

const RightPreviewsCarousel = () => {
	return (
		<div>
			<Carousel orientation='vertical' className=''>
				<CarouselContent className='lg:h-[568px] md:h-[568px] sm:h-[320px] pt-4 pb-2 flex flex-col gap-2'>
					{Array.from({ length: 5 }).map((_, index) => (
						<CarouselItem
							key={index}
							className='lg:basis-1/2 md:basis-1/3 sm:basis-1/2 basis-1/2 pt-0'
						>
							<div className='h-full flex items-center justify-center'>
								<img
									src='https://picsum.photos/600/400'
									alt='property image'
									className='rounded-md object-cover h-full'
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

export default RightPreviewsCarousel;
