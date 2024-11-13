"use client"
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import { TracingBeam } from '@/components/ui/tracing-beam';
import React from 'react';
import { getTopReviews } from '@/actions/landing/getDynamicData';
import test from 'node:test';

export const HomeContext = React.createContext<any>(null);

const HomeScreen = () => {
	const [testimonials, setTestimonials] = React.useState<any>(null);

	React.useEffect(() => {
		getTopReviews().then((res) => {
			console.log("Fetched testimonials data:", res);
			setTestimonials(res);
		});
	}, []);

	// React.useEffect(() => {
	// 	if (testimonials !== null) {
	// 		console.log("Fetched testimonials:", testimonials);
	// 	}
	// }, [testimonials]);

	return (
		<HomeContext.Provider value={{testimonials}}>
			<section className='dark:bg-background pb-10'>
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
		</HomeContext.Provider>
	);
};

export default HomeScreen;
