'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	LineElement,
	PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

ChartJS.register(
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	LineElement,
	PointElement
);
const ReservationsAnalytics = () => {
	const [selectedProperty, setSelectedProperty] = useState('default');
	const [date, setDate] = useState(null);

	const data = {
		labels: ['On-Site Reservations', 'Room Reservations'],
		datasets: [
			{
				label: 'Reservations',
				data: selectedProperty === 'property2' ? [35, 25] : [45, 30],
				backgroundColor: ['#4CAF50', '#2196F3'],
				borderWidth: 1,
			},
		],
	};

	const options = {
		indexAxis: 'y',
		responsive: true,
		scales: {
			x: {
				beginAtZero: true,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	const lineData = {
		labels: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		],
		datasets: [
			{
				label: 'Property 1',
				data: [200, 220, 230, 210, 250, 270, 300, 320, 310, 340, 360, 380],
				fill: false,
				borderColor: '#4CAF50',
				tension: 0.1,
				borderWidth: 2,
				yAxisID: 'y1',
			},
			{
				label: 'Property 2',
				data: [180, 210, 190, 240, 260, 280, 320, 300, 330, 340, 350, 380],
				fill: false,
				borderColor: '#2196F3',
				tension: 0.1,
				borderWidth: 2,
				yAxisID: 'y2',
			},
		],
	};

	const lineOptions = {
		responsive: true,
		scales: {
			x: {
				beginAtZero: true,
			},
			y1: {
				type: 'linear',
				position: 'left',
				ticks: {
					beginAtZero: true,
				},
			},
			y2: {
				type: 'linear',
				position: 'right',
				ticks: {
					beginAtZero: true,
				},
			},
		},
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
	return (
		<>
			<div className='mb-4 flex items-center space-x-4'>
				<Select value={selectedProperty} onValueChange={setSelectedProperty}>
					<SelectTrigger
						id='property-selector'
						className='border-gray-300 dark:text-gray-300 bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300'
					>
						<SelectValue placeholder='Select Property' />
					</SelectTrigger>
					<SelectContent
						position='popper'
						className='text-sm bg-white dark:bg-secondary border-gray-300'
					>
						<SelectItem value='default' className='text-sm'>
							Property 1
						</SelectItem>
						<SelectItem value='property2' className='text-sm'>
							Property 2
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Simple Date Dropdown */}
				<Select value={selectedProperty} onValueChange={setSelectedProperty}>
					<SelectTrigger
						id='property-selector'
						className='border-gray-300   dark:text-gray-300  bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300'
					>
						<SelectValue placeholder='Select Property' />
					</SelectTrigger>
					<SelectContent
						position='popper'
						className='text-sm bg-white dark:bg-secondary border-gray-300'
					>
						<SelectItem value='default' className='text-sm'>
							All Time
						</SelectItem>
						<SelectItem value='last24hrs' className='text-sm'>
							Last 24 hours
						</SelectItem>
						<SelectItem value='last7days' className='text-sm'>
							Last 7 days
						</SelectItem>
						<SelectItem value='last4weeks' className='text-sm'>
							Last 4 weeks
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Date Picker - if ever lang na gusto mo gamitin */}
				{/* <Popover>
					<PopoverTrigger asChild>
						<Button
							id='date'
							size={'sm'}
							className={`text-gray-700 border border-gray-300 bg-transparent rounded-md text-sm justify-start text-left font-normal py-[19px] hover:bg-transparent hover:font-semibold transition-all duration-300 ${
								!date ? 'text-gray-700' : ''
							}`}
						>
							<CalendarIcon className='mr-2 h-auto w-4' />
							{date?.from ? (
								date.to ? (
									<>
										{format(date.from, 'LLL dd, y')} -{' '}
										{format(date.to, 'LLL dd, y')}
									</>
								) : (
									format(date.from, 'LLL dd, y')
								)
							) : (
								<span>Pick a date</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0' align='start'>
						{/* Calendar component */}
				{/* <Calendar
							initialFocus
							mode='range'
							defaultMonth={date?.from}
							selected={date}
							onSelect={(date) => {
								setDate(date);
							}}
							numberOfMonths={2}
						/>
					</PopoverContent>
				</Popover> */}
			</div>

			<div className='grid grid-cols-1 xl:grid-cols-10 gap-0 xl:gap-4'>
				<div className='col-span-4 grid grid-rows-3 gap-4'>
					<div className='grid grid-cols-2 gap-4'>
						<Card className='bg-white dark:bg-secondary rounded-lg border-gray-300'>
							<p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
								Total Reservations
							</p>
							<CardHeader className='p-1 flex justify-center items-center text-center'>
								<CardTitle className='text-4xl font-bold'>45</CardTitle>
							</CardHeader>
							<CardContent className='flex justify-center items-center text-xs text-green-600'>
								<AiOutlineArrowUp className='text-sm' />
								5% increase from last month
							</CardContent>
						</Card>

						<Card className='bg-white dark:bg-secondary rounded-lg border-gray-300'>
							<p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
								Total Company Page Visits
							</p>
							<CardHeader className='p-1 flex justify-center items-center text-center'>
								<CardTitle className='text-4xl font-bold'>45</CardTitle>
							</CardHeader>
							<CardContent className='flex justify-center items-center text-xs text-green-600'>
								<AiOutlineArrowUp className='text-sm' />
								5% increase from last month
							</CardContent>
						</Card>
					</div>
					<div className='row-span-2 rounded-lg'>
						<Card className='bg-white dark:bg-secondary rounded-lg border-gray-300 row-span-2 mb-4 xl:mb-0'>
							<p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
								On-Site vs Room Reservations
							</p>
							<CardContent>
								<Bar
									data={data}
									// options={options}
								/>
							</CardContent>
						</Card>
					</div>
				</div>
				<div className='col-span-6 rounded-lg'>
					<Card className='bg-white dark:bg-secondary rounded-lg border-gray-300 h-[470px]'>
						<p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
							Total Reservations Across All Properties
						</p>

						<CardContent>
							<Line
								data={lineData}
								// options={lineOptions}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default ReservationsAnalytics;
