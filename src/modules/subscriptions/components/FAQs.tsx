import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import pricing from '@/lib/constants/pricing';

export function FAQS() {
	return (
		<div className='py-8'>
			<Accordion type='single' collapsible className='w-full px-10'>
				{pricing.PRICING_ACCORDION.map((item) => (
					<AccordionItem value={item.value} key={item.value}>
						<AccordionTrigger className='text-sm lg:text-base md:text-md sm:text-sm'>
							{item.title}
						</AccordionTrigger>
						<AccordionContent className='text-md'>
							{Array.isArray(item.description) ? (
								<ul>
									{item.description.map((subItem, index) => (
										<li key={index}>
											<strong>{subItem.title}</strong>
											{subItem.description}
										</li>
									))}
								</ul>
							) : (
								<p>{item.description}</p>
							)}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
