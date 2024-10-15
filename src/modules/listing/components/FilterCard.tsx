import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/multi-select';

const householdAmenities = [
	{ value: 'wifi', label: 'WiFi' },
	{ value: 'air_conditioning', label: 'Air Conditioning' },
	{ value: 'heating', label: 'Heating' },
	{ value: 'washing_machine', label: 'Washing Machine' },
	{ value: 'dryer', label: 'Dryer' },
	{ value: 'dishwasher', label: 'Dishwasher' },
	{ value: 'refrigerator', label: 'Refrigerator' },
	{ value: 'microwave', label: 'Microwave' },
	{ value: 'oven', label: 'Oven' },
	{ value: 'stove', label: 'Stove' },
	{ value: 'television', label: 'Television' },
	{ value: 'iron', label: 'Iron' },
	{ value: 'vacuum_cleaner', label: 'Vacuum Cleaner' },
	{ value: 'coffee_maker', label: 'Coffee Maker' },
	{ value: 'kettle', label: 'Kettle' },
	{ value: 'toaster', label: 'Toaster' },
	{ value: 'blender', label: 'Blender' },
	{ value: 'hair_dryer', label: 'Hair Dryer' },
	{ value: 'bed_linen', label: 'Bed Linen' },
	{ value: 'towels', label: 'Towels' },
];

export function FilterCard() {
	const [selectedFilter, setSelectedFilter] = React.useState<string[]>([]);
	return (
		<Card className='w-full bg-white dark:bg-secondary shadow-md lg:mt-0 md:mt-4 sm:mt-4 xs:mt-4'>
			<CardHeader>
				<Card className='h-[370px] border-none'>
					<iframe
						src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.190906189018!2d120.59490157532025!3d16.415127984315635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a15d8cb0dc9b%3A0xe282b2015f6debba!2sUniversity%20of%20Baguio!5e0!3m2!1sen!2sph!4v1727501045306!5m2!1sen!2sph'
						className='rounded-md w-full h-full border-none'
						loading='lazy'
						referrerPolicy='no-referrer-when-downgrade'
					></iframe>
				</Card>
			</CardHeader>
			<CardContent>
				<form>
					<div>
						<Label htmlFor='amenities' className='font-semibold'>
							Filter Amenities
						</Label>
						<MultiSelect
							options={householdAmenities}
							onValueChange={setSelectedFilter}
							defaultValue={selectedFilter}
							placeholder='Select amenities'
							variant='inverted'
							maxCount={6}
						/>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
