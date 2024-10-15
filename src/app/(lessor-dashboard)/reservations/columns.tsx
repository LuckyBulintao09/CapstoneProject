'use client';

import { format, isWithinInterval, parseISO } from 'date-fns';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { CheckIcon, Trash } from 'lucide-react';
import { DataTableColumnHeader } from './data-column-header';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Reservation = {
	id: number;
	branch_id: number; // filter by brnch ??
	room_number: number;
	room_name: string;
	service_option: 'onsite visit' | 'room reservation';
	appointment_date: string;
};

export const columns: ColumnDef<Reservation>[] = [
	{
		accessorKey: 'room_number',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Room Number' />;
		},
	},
	{
		accessorKey: 'room_name',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Room Name' />;
		},
	},
	{
		accessorKey: 'service_option',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Service Option' />;
		},
		cell: ({ row }) => {
			const serviceOption = row.getValue('service_option') as string;
			const titleCaseServiceOption = serviceOption
				.split(' ')
				.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
				)
				.join(' ');
			return <span className='truncate'>{titleCaseServiceOption}</span>;
		},
	},
	{
		accessorKey: 'appointment_date',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Appointment Date' />;
		},
		cell: ({ row }) => {
			const date = row.getValue('appointment_date') as string | undefined;
			if (date) {
				return (
					<span className='truncate'>
						{format(parseISO(date), 'dd MMMM, yyyy')}
					</span>
				);
			} else {
				return <span className='truncate'>No date available</span>;
			}
		},
		filterFn: (row, id, value) => {
			const { from, to } = value;
			const theDate = parseISO(row.getValue(id));

			if ((from || to) && !theDate) {
				return false;
			} else if (from && !to) {
				return theDate.getTime() >= from.getTime();
			} else if (!from && to) {
				return theDate.getTime() <= to.getTime();
			} else if (from && to) {
				return isWithinInterval(theDate, { start: from, end: to });
			} else {
				return true;
			}
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			// to be used later
			// const id = row.original.id;

			return (
				<div className='flex flex-row gap-3'>
					<Button
						variant='ghost'
						className='h-8 w-8 p-0 bg-green-500 hover:bg-green-400'
					>
						<CheckIcon className='h-4 w-4' />
						<span className='sr-only'>Approve</span>
					</Button>
					<Button variant='destructive' className='h-8 w-8 p-0'>
						<Trash className='h-4 w-4' />
						<span className='sr-only'>Delete</span>
					</Button>
				</div>
				//     <DropdownMenu>
				//     <DropdownMenuTrigger asChild>
				//         <Button variant="ghost" className="h-8 w-8 p-0">
				//             <span className="sr-only">Open actions menu</span>
				//             <MoreHorizontal className="h-4 w-4" />
				//         </Button>
				//     </DropdownMenuTrigger>
				//     <DropdownMenuContent align="end">
				//         <DropdownMenuLabel>
				//             Actions
				//         </DropdownMenuLabel>

				//         <DropdownMenuItem asChild>
				// <Button variant="ghost" className="h-8 w-8 p-0">
				//     <CircleCheck className="h-4 w-4" />
				//     <span className="sr-only">Approve</span>
				// </Button>
				//         </DropdownMenuItem>
				//         <DropdownMenuItem asChild>
				// <Button variant="destructive" className="h-8 w-8 p-0">
				//     <Trash className="h-4 w-4" />
				//     <span className="sr-only">Delete</span>
				// </Button>
				//         </DropdownMenuItem>

				//     </DropdownMenuContent>
				// </DropdownMenu>
			);
		},
	},
];
