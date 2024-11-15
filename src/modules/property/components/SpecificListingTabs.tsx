import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import spiels from '@/lib/constants/spiels';
import React from 'react';

const scrollToSection = (sectionId) => {
	const section = document.getElementById(sectionId);
	if (section) {
		section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
};

const SpecificListingTabs = () => {
	return (
		<Card className='my-4 bg-white dark:bg-secondary border border-gray-300 p-4 pt-2 pb-0 shadow-sm'>
			<Tabs defaultValue='overview'>
				<TabsList className='gap-5 bg-white dark:bg-secondary'>
					{spiels.SPECIFIC_LISTING_TABS.map((item) => (
						<TabsTrigger
							key={item.value}
							value={item.value}
							onClick={() => scrollToSection(item.value)}
							className='hover:text-primary data-[state=active]:bg-white data-[state=active]:border-b-4 border-primary dark:data-[state=active]:border-blue-300 data-[state=active]:text-primary data-[state=active]:text-sm text-sm rounded-none pb-3 transition-all duration-300 ease-in-out'
						>
							{item.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</Card>
	);
};

export default SpecificListingTabs;
