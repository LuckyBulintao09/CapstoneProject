import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import spiels from '@/lib/constants/spiels';
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableRow,
} from '@/components/ui/table';

export function BookingCard() {
	const [date, setDate] = React.useState<Date | undefined>(undefined);
	const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

	const handleCalendarToggle = () => {
		setIsCalendarOpen((prev) => !prev);
	};
	return (
		<Card className='w-[350px] bg-white dark:bg-secondary shadow-lg lg:mt-0 md:mt-4 sm:mt-4 xs:mt-4'>
			<CardHeader>
				<CardTitle>
					<span className='font-bold mr-1'>P2,500</span>
					<span className='font-light'>month</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='service' className='font-semibold'>
								Service Option
							</Label>
							<RadioGroup defaultValue='comfortable'>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='default' id='r1' />
									<Label htmlFor='r1'>On-Site Visit</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='comfortable' id='r2' />
									<Label htmlFor='r2'>Room Reservation</Label>
								</div>
							</RadioGroup>
						</div>
						<div className='mt-0 relative'>
							<Label htmlFor='date' className='font-semibold'>
								Appointment Date
							</Label>
							<p className='text-sm mb-1 italic'>
								Select the date for your visit.
							</p>
							<div className='flex items-center border-b pb-5'>
								<Input
									id='date'
									type='text'
									value={date ? date.toLocaleDateString() : ''}
									onFocus={handleCalendarToggle}
									readOnly
									className='border-gray-400 pr-10'
								/>
								<button
									type='button'
									className='absolute right-3 top-1/2 transform -translate-y-1/2'
									onClick={handleCalendarToggle}
								>
									<CalendarIcon className='h-4 w-4 mt-6' />
								</button>
							</div>
							{isCalendarOpen && (
								<div className='absolute z-10 mt-2 left-1/2 transform -translate-x-1/2'>
									<Calendar
										mode='single'
										selected={date}
										onSelect={(selectedDate) => {
											setDate(selectedDate);
											setIsCalendarOpen(false);
										}}
										className='rounded-md border shadow bg-white'
									/>
								</div>
							)}
						</div>
					</div>
					<Table className='min-w-full'>
						<TableBody>
							<TableRow className='border-b-0'>
								<TableCell className='font-semibold py-2'>
									Cleaning fee
								</TableCell>
								<TableCell className='text-right py-2'>₱850</TableCell>
							</TableRow>
							<TableRow className='border-b-0'>
								<TableCell className='font-semibold py-2'>
									Service Fee
								</TableCell>
								<TableCell className='text-right py-2'>₱1,666</TableCell>
							</TableRow>
						</TableBody>
						<TableFooter>
							<TableRow className='bg-white dark:bg-accent'>
								<TableCell className='font-semibold'>Inital Total</TableCell>
								<TableCell className='text-right'>₱2,516.00</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</form>
			</CardContent>
			<CardFooter className='flex justify-end'>
				<Button className='w-full'>{spiels.BUTTON_RESERVE}</Button>
			</CardFooter>
		</Card>
	);
}
