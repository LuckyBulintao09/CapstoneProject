import {} from '@/components/ui/card';
import spiels from '@/lib/constants/spiels';
import { WobbleCard } from '@/components/ui/wobble-card';

const HowItWorks = () => {
	return (
		<section>
			<div className='container'>
				<div className='flex flex-col items-center text-center'>
					<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl dark:text-primary-foreground'>
						{spiels.HOW_IT_WORKS}
					</h1>
					<p className='max-w-2xl mt-2 text-muted-foreground lg:text-lg'>
						{spiels.HOW_IT_WORKS_DESCRIPTION}
					</p>
				</div>
				<div className='mt-5 grid grid-cols-1 place-items-center gap-4 lg:grid-cols-3 md:grid-cols-2'>
					{spiels.HOW_IT_WORKS_CARDS.map((item, index) => (
						<WobbleCard
							containerClassName={`col-span-1 ${
								index === 2 ? 'md:col-span-2' : ''
							} lg:col-span-1 h-full bg-primary min-h-[50px] lg:min-h-[50px]`}
							className='dark:bg-popover-foreground'
							key={index}
						>
							<div className='max-w-2xl'>
								<h3 className='text-left text-balance text-base md:text-xl lg:text-xl font-semibold tracking-[-0.015em] text-primary-foreground dark:text-secondary'>
									{item.label}
								</h3>
								<p className='mt-4 text-left text-md sm:text-sm lg:text-md 2xl:text-md xs:text-sm text-neutral-200 dark:text-muted-foreground'>
									{item.description}
								</p>
							</div>
						</WobbleCard>
					))}
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
