interface PricingTextAreaProps {
	title: string;
	description: string;
}

const PricingTextArea = ({ title, description }: PricingTextAreaProps) => {
	return (
		<section className='py-2'>
			<div className='flex flex-col mx-5 text-center'>
				<div className='flex justify-center text-center'>
					<div className='text-lg lg:text-2xl md:text-xl font-extrabold text-primary dark:text-sidebar-accent-foreground'>
						<h1 className=''>{title}</h1>
					</div>
				</div>
				<hr className='my-3 lg:my-2 md:my-4 border-gray-300 lg:border-none' />
				<div className='px-6'>
					<p className='text-base lg:text-base md:text-sm xs:text-sm text-neutral-700 dark:text-neutral-200'>
						{description}
					</p>
				</div>
			</div>
		</section>
	);
};
export default PricingTextArea;
