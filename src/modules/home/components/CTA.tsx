import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import spiels from '@/lib/constants/spiels';
import { Separator } from '@radix-ui/react-dropdown-menu';

const CTA = () => {
	return (
		<section>
			<Separator className='w-full h-px bg-blue-500 opacity-30 mb-20' />
			<div className='container mx-auto'>
				<div className='flex flex-col items-center text-center'>
					<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl my-3 text-left lg:text-right dark:text-primary-foreground'>
						{spiels.CTA_LABEL}
					</h1>
					<p className='mb-8 max-w-3xl text-muted-foreground lg:text-lg'>
						{spiels.CTA_DESCRIPTION.map((line, index) => (
							<span key={index}>
								{line}
								{index < spiels.CTA_DESCRIPTION.length - 1 && <br />}
							</span>
						))}
					</p>
					<div className='w-full md:max-w-lg'>
						<div className='flex flex-col justify-center gap-4 sm:flex-row'>
							<Input
								placeholder='Enter your email'
								aria-label='Email Address'
								className='flex-1'
							/>
							<Button className='flex-shrink-0'>
								{spiels.BUTTON_SUBSCRIBE}
							</Button>
						</div>
						<p className='mt-4 text-left text-xs text-muted-foreground'>
							View our{' '}
							<a href='#' className='underline hover:text-foreground'>
								privacy policy
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTA;
