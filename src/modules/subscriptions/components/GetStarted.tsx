import { Button } from '@/components/ui/button';
import pricing from '@/lib/constants/pricing';
import spiels from '@/lib/constants/spiels';
const GetStarted = () => {
	return (
		<section className='pt-4 pb-16'>
			<div className='flex flex-col mx-5 text-center'>
				<div className='flex justify-center text-center'>
					<div className='text-lg lg:text-2xl md:text-xl font-extrabold text-primary dark:text-sidebar-accent-foreground'>
						<h1 className=''>{pricing.GET_STARTED}</h1>
					</div>
				</div>
				<hr className='my-3 lg:my-2 md:my-4 border-gray-300 lg:border-none' />
				<div className='px-6'>
					<p className='text-base lg:text-base md:text-sm xs:text-sm text-neutral-700 dark:text-neutral-300'>
						{pricing.GET_STARTED_BODY}
					</p>
				</div>
				<div className='flex justify-center'>
					<Button className='mt-6 md:mt-12 w-[60%] '>
						{spiels.BUTTON_START_NOW}
					</Button>
				</div>
			</div>
		</section>
	);
};
export default GetStarted;
