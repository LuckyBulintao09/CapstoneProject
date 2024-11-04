'use client';
import { useContext } from 'react';
import { CardStack } from '../../../components/ui/card-stack';
import { cn } from '@/lib/utils';
import { HomeContext } from '../screens/HomeScreen';



export function TestimonialsCard() {
	const testimonials = useContext(HomeContext);

	return (
		<div className='h-[15rem] flex items-center justify-center'>
			<CardStack items={CARDS} />
		</div>
	);
}

export const Highlight = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<span
			className={cn(
				'font-bold bg-blue-100 text-blue-700 dark:bg-blue-700/[0.2] dark:text-blue-500 px-1 py-0.5',
				className
			)}
		>
			{children}
		</span>
	);
};

const CARDS = [
	{
		id: 0,
		name: 'Manu Arora',
		designation: 'Student',
		content: (
			<p>
				This site is <Highlight>so easy to navigate</Highlight>. I will be using
				this my entire life. 🙏
			</p>
		),
	},
	{
		id: 1,
		name: 'Anna Meily',
		designation: 'Student',
		content: (
			<p>
				UniHomes is a <Highlight>lifesaver!</Highlight> I was struggling to find
				a suitable dormitory close to my university, but this site made it so
				easy.
			</p>
		),
	},
	{
		id: 2,
		name: 'Tyler Durden',
		designation: 'Student',
		content: (
			<p>
				Finding an apartment can be overwhelming, but UniHomes made the process
				<Highlight>smooth and stress-free</Highlight>.
			</p>
		),
	},
];
