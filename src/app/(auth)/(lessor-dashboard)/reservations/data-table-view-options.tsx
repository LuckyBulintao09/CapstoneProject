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
						} else if (column.id === 'id') {
							columnHeader = 'ID';
						} else if (column.id === 'name') {
							columnHeader = 'Name';
						} else if (column.id === 'message') {
							columnHeader = 'Mesage';
						} else if (column.id === 'property_name') {
							columnHeader = 'Property Name';
						} else if (column.id === 'email') {
							columnHeader = 'Email';
						} else if (column.id === 'birthdate') {
							columnHeader = 'Birthdate';
						} else if (column.id === 'contact') {
							columnHeader = 'Contact';
						} else if (column.id === 'address') {
							columnHeader = 'Address';
						} else if (column.id === 'govIdUrl') {
							columnHeader = 'Government ID';
						} else if (column.id === 'businessLicenseUrl') {
							columnHeader = 'Business License';
						} else if (column.id === 'name') {
							columnHeader = 'Name';
						} else if (column.id === 'user') {
							columnHeader = 'User';
						} else if (column.id === 'userEmail') {
							columnHeader = 'User Email';
						} else if (column.id === 'reviewId') {
							columnHeader = 'Review ID';
						} else if (column.id === 'reviewDate') {
							columnHeader = 'Review Date';
						} else if (column.id === 'reportedComment') {
							columnHeader = 'Reported Comment';
						} else if (column.id === 'reportedBy') {
							columnHeader = 'Reported By';
						} else if (column.id === 'reasonForReport') {
							columnHeader = 'Reason for Report';
						} else if (column.id === 'associatedProperty') {
							columnHeader = 'Associated Property';
						} else if (column.id === 'company_name') {
							columnHeader = 'Company Name';
						} else if (column.id === 'business_permit') {
							columnHeader = 'Business Permit';
						} else if (column.id === 'additional_info') {
							columnHeader = 'Additional Information';
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
