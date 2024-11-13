import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Info } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableFooter, TableRow, TableCell } from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface BookingCardProps {}

export const BookingCardModal: React.FC<
	BookingCardProps & { isOpen: boolean; onClose: () => void; unitID: number }
> = ({ isOpen, onClose, unitID }) => {
	const [date, setDate] = useState<Date | undefined>();
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<string>('');
	const [numGuests, setNumGuests] = useState<number>(1);
	const [hasReservation, setHasReservation] = useState<boolean>(false);
	const [isUnitReserved, setIsUnitReserved] = useState<boolean>(false);

	const today = new Date();

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className='bg-white dark:bg-secondary shadow-lg'>
					<DialogHeader>
						<DialogTitle>Book Now</DialogTitle>
						<DialogDescription className='border-b border-gray-300 dark:text-gray-200 pb-2'>
							Complete your booking details below.
						</DialogDescription>
					</DialogHeader>

					<div className='grid w-full items-center gap-5'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='service' className='font-semibold'>
								Service Option
							</Label>

							<RadioGroup
								value={selectedService}
								name='service'
								onValueChange={setSelectedService}
							>
								<div className='flex items-center space-x-2 '>
									<RadioGroupItem
										value='On-Site Visit'
										id='r1'
										className='dark:border-blue-300 dark:text-white'
									/>
									<Label
										htmlFor='r1'
										className='dark:text-gray-200 font-normal'
									>
										On-Site Visit
									</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem
										value='Room Reservation'
										id='r2'
										className='dark:border-blue-300 dark:text-white'
									/>
									<Label
										htmlFor='r2'
										className='dark:text-gray-200 font-normal'
									>
										Room Reservation
									</Label>
								</div>
							</RadioGroup>
						</div>

						{/* Appointment Date Section */}
						<div className='relative'>
							<Label htmlFor='date' className='font-semibold'>
								{selectedService === 'On-Site Visit'
									? 'Visit Date'
									: selectedService === 'Room Reservation'
									? 'Date of Move'
									: 'Appointment Date'}
							</Label>
							<p className='text-xs text-gray-500 mb-2 dark:text-gray-300'>
								{selectedService === 'On-Site Visit'
									? 'Select the date for your visit.'
									: selectedService === 'Room Reservation'
									? 'Select your move-in date.'
									: 'Select the date for your appointment.'}
							</p>
							<div className='flex items-center pb-1'>
								<Input
									id='date'
									type='text'
									value={date ? format(date, 'MM/dd/yyyy') : ''}
									onFocus={() => setIsCalendarOpen(true)}
									readOnly
									className='border-gray-400 pr-10'
								/>
								<button
									type='button'
									className='absolute right-3 top-1/2 transform -translate-y-1/2'
									onClick={() => setIsCalendarOpen((prev) => !prev)}
								>
									<CalendarIcon className='h-4 w-4 mt-10 text-gray-500 dark:text-gray-300' />
								</button>
							</div>
							{isCalendarOpen && (
								<div className='absolute z-10 mt-2 left-2/3 transform -translate-x-1/2'>
									<Calendar
										mode='single'
										selected={date}
										onSelect={(selectedDate) => {
											setDate(selectedDate);
											setIsCalendarOpen(false);
										}}
										disabled={(date) => date < today}
										className='rounded-md border shadow bg-white'
									/>
								</div>
							)}
						</div>

						{/* Number of Guests - shows when "Room Reservation" is selected  - nakadepende lang sa available slots yung limit */}
						{selectedService === 'Room Reservation' && (
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='guests' className='font-semibold'>
									How many guests will be accompanying you?
								</Label>
								<p className='text-xs text-gray-500 dark:text-gray-300'>
									Please enter the total number of guests, including yourself.
								</p>
								<Input
									id='guests'
									type='number'
									value={numGuests}
									onChange={(e) => setNumGuests(Number(e.target.value))}
									className='border-gray-400 mt-3'
									min={1}
								/>
							</div>
						)}

						{/* Payment Option Section - shows when "Room Reservation" is selected */}
						{selectedService === 'Room Reservation' && (
							<div className='flex flex-col space-y-2'>
								<Label
									htmlFor='payment'
									className='font-semibold flex items-center'
								>
									Payment Option
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className='ml-auto cursor-pointer'>
													<Info className='w-4 h-4 text-gray-500 dark:text-gray-300 mr-3' />
												</span>
											</TooltipTrigger>
											<TooltipContent className='w-[250px]'>
												<p className='font-normal text-xs'>
													Select your preferred payment method. After completing
													the payment, please send the proof to the owner
													through the
													<span className='font-bold'> Messages</span> tab.
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</Label>
								<RadioGroup defaultValue='comfortable'>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem
											value='online'
											id='r1'
											className='dark:border-blue-300 dark:text-white'
										/>
										<Label
											htmlFor='r1'
											className='dark:text-gray-200 font-normal'
										>
											Online Payment
										</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem
											value='cash'
											id='r2'
											className='dark:border-blue-300 dark:text-white'
										/>
										<Label
											htmlFor='r2'
											className='dark:text-gray-200 font-normal'
										>
											Cash (On-Site)
										</Label>
									</div>
								</RadioGroup>
							</div>
						)}
					</div>

					{/* Total Section - shows when "Room Reservation" is selected */}
					{selectedService === 'Room Reservation' && (
						<Table className='min-w-full'>
							<TableFooter>
								<TableRow className='bg-white dark:bg-accent '>
									<TableCell className='font-semibold p-0 '>
										Initial Total
									</TableCell>
									<TableCell className='text-right'>₱10500</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					)}

					{hasReservation ? (
						<Button disabled className='w-full'>
							Already Has a Reservation
						</Button>
					) : isUnitReserved ? (
						<Button disabled className='w-full'>
							Already Reserved
						</Button>
					) : (
						<Button className='w-full' disabled={!date || !selectedService}>
							Reserve
						</Button>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};
