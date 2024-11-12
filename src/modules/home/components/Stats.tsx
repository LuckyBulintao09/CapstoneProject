'use client';

import { motion } from 'framer-motion';
import spiels from '@/lib/constants/spiels';
import { useEffect, useState } from 'react';
import { getTotalLessors, getTotalProperties, getTotalRatings, getTotalReservations } from '@/actions/landing/getDynamicData';

const Stats = () => {
	const itemVariants = {
		hidden: { opacity: 0, x: 50 },
		visible: { opacity: 1, x: 0 },
	};

	const [data, setData] = useState<any>({});

	useEffect(() => {
		const fetchData = async () => {
			setData({
				totalReservations: await getTotalReservations() || 0,
				totalProperties: await getTotalProperties() || 0,
				totalLessors: await getTotalLessors() || 0,
				totalRatings: await getTotalRatings() || 0,
			});
		};

		fetchData();
	}, []);

	return (
		<section className='border-y border-blue-500 border-opacity-15 py-20'>
			<div className='container'>
				<p className='mb-2 text-xs text-muted-foreground'>
					{spiels.STATS_LABEL}
				</p>
				<h2 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl dark:text-foreground'>
					{spiels.STATS_HEADER}
				</h2>
				<div className='mt-14 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-4'>
					{spiels.STATS_DATA.map((item, index) => (
						<motion.div
							className='relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5'
							key={index}
							initial='hidden'
							whileInView='visible'
							exit='hidden'
							viewport={{ once: false }}
							variants={itemVariants}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<span className='mb-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary md:size-12 text-white'>
								<item.avatar className='size-5 md:size-6 dark:text-primary-foreground' />
							</span>
							<div>
								<h3 className='font-bold md:mb-1 md:text-xl dark:text-accent-foreground'>
									{item.label}
								</h3>
								<p className='text-sm text-muted-foreground md:text-base'>
									+{index === 0 && data.totalReservations} 
									{index === 1 && data.totalProperties}
									{index === 2 && data.totalLessors}
									{index === 3 && data.totalRatings} since last hour
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Stats;
