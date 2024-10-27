import {
	IconHome,
	IconTrendingUp,
	IconCalendarEvent,
} from '@tabler/icons-react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

const items = [
	{
		icon: <IconHome size={32} className='mb-2' />,
		title: 'List Your Property',
		description: 'Sign up and create a property listing for free.',
		className: ' border border-black',
	},
	{
		icon: <IconTrendingUp size={32} className='mb-2' />,
		title: 'Boost for Visibility',
		description:
			'Choose to boost your listing for just ₱100 to reach more potential guests.',
		className: ' border border-black',
	},
	{
		icon: <IconCalendarEvent size={32} className='mb-2' />,
		title: 'Receive Bookings',
		description:
			'When guests book through our platform, only a 3% fee applies.',
		className: 'col-span-2 border border-black',
	},
];
const Boost1 = () => {
	return (
		<BentoGrid className='grid grid-cols-2 grid-rows-2 gap-4 pt-4'>
			{items.map((item) => (
				<BentoGridItem key={item.title} {...item} className={item.className} />
			))}
		</BentoGrid>
	);
};
export default Boost1;
