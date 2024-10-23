import Hero from '../components/Hero.tsx';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import { TracingBeam } from '@/components/ui/tracing-beam';

const HomeScreen = () => {
	return (
		<>
			<section className='dark:bg-secondary pb-10'>
				{/* <section className='relative before:absolute before:inset-0 before:bg-primary/10 before:[mask-image:url(https://www.shadcnblocks.com/images/block/waves.svg)] before:[mask-repeat:repeat] before:[mask-size:_64px_32px]'> */}
				<TracingBeam>
					<section id='introduction' className='py-16'>
						<Hero />
					</section>
					<section id='features' className='py-16 px-32 xl:py-10 md:py-8'>
						<HowItWorks />
					</section>
					<section id='stats' className='py-16 px-32 xl:py-10 md:py-8'>
						<Stats />
					</section>
					<section
						id='reviewsandratings'
						className='py-16 px-32 xl:py-10 md:py-8'
					>
						<Testimonials />
					</section>
					<section className='py-10 px-32 xl:py-10 md:py-8'>
						<CTA />
					</section>
				</TracingBeam>
				{/* </section> */}
			</section>
		</>
	);
};

export default HomeScreen;
