import { ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { Globe } from './Globe';
import { useRouter } from 'next/navigation';

const Hero = () => {
	const router = useRouter();
	const words = [
		{
			text: 'Welcome',
		},
		{
			text: 'to',
		},
		{
			text: 'UniHomes',
			className: 'text-primary dark:text-foreground',
		},
	];
	return (
		<section className='lg:pl-32 lg:pr-26 md:pr-8 sm:pl-20 sm:pr-28 xs:pr-6 xs:pl-16'>
			<div className='grid items-center gap-6 lg:grid-cols-9'>
				<div className='col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left '>
					<Badge
						variant='outline'
						className='bg-primary text-primary-foreground'
					>
						{spiels.HERO_BADGE}
						<ArrowDownRight className='ml-1 size-4' />
					</Badge>

					<TypewriterEffectSmooth words={words} />

					<p className='mb-8 max-w-xl lg:text-xl text-muted-foreground dark:text-muted-foreground'>
						{spiels.HERO_DESCRIPTION}
					</p>
					<div className='flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start'>
						<Button
							className='w-full sm:w-auto dark:text-foreground'
							onClick={() => {
								router.push('client/listings');
							}}
						>
							{spiels.BUTTON_EXPLORE_NOW}
						</Button>
						<Button
							variant='outline'
							className='w-full sm:w-auto dark:bg-accent-foreground dark:text-secondary hover:bg-accent'
							onClick={() => {
								const element = document.getElementById('features');
								if (element) {
									element.scrollIntoView({ behavior: 'smooth' });
								}
							}}
						>
							{spiels.BUTTON_LEARN_MORE}
							<ArrowDownRight className='ml-2 size-4' />
						</Button>
					</div>
				</div>
				<div className='col-span-5'>
					<Globe />
				</div>
			</div>
		</section>
	);
};

export default Hero;
