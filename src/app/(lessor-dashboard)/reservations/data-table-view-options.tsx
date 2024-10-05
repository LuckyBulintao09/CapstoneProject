'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({
	table,
}: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='sm' className='ml-auto h-8 lg:flex'>
					<MixerHorizontalIcon className='mr-2 h-4 w-4' />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[150px]'>
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter(
						(column) =>
							typeof column.accessorFn !== 'undefined' && column.getCanHide()
					)
					.map((column) => {
						let columnHeader = '';

						if (column.id === 'room_number') {
							columnHeader = 'Room Number';
						} else if (column.id === 'room_name') {
							columnHeader = 'Room Name';
						} else if (column.id === 'service_option') {
							columnHeader = 'Service Options';
						} else if (column.id === 'appointment_date') {
							columnHeader = 'Date';
						} else if (column.id === 'lessor_name') {
							columnHeader = 'Lessor Name';
						} else if (column.id === 'transaction_status') {
							columnHeader = 'Transaction Status';
						}

						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className='capitalize'
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{columnHeader}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
