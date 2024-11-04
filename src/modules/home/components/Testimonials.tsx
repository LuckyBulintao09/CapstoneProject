
import { TestimonialsCard } from './Testimonials-CardStack';
import spiels from '@/lib/constants/spiels';

const Testimonials = () => {
	

	return (
		<section className='py-12'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-col-reverse lg:flex-row lg:space-x-4'>
					<div className='lg:w-2/3 lg:order-1 md:pt-8 sm:pt-10 xs:pt-12'>
						<p className='mb-2 text-xs text-muted-foreground text-left lg:text-right'>
							{spiels.TESTIMONIALS_LABEL}
						</p>
						<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl my-3 text-left lg:text-right dark:text-primary-foreground'>
							{spiels.TESTIMONIALS_HEADER}
						</h1>
						<p className='mt-1 text-muted-foreground md:mt-3 text-left lg:text-right lg:text-lg'>
							{spiels.TESTIMONIALS_DESCRIPTION}
						</p>
					</div>

					{/* Testimonials Card Section */}
					<div className='lg:w-1/3 lg:order-2'>
						<TestimonialsCard />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
