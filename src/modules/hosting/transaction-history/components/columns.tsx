'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/app/(auth)/(lessor-dashboard)/reservations/data-column-header';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export type Transaction =
	| {
			id: number;
			client_name: string;
			user_id: string;
			service_option: string;
			appointment_date: string;
			transaction_status: string;
			isPaid: boolean;
			unit: {
				id: number;
				title: string;
				unit_code: string;
			}[];
			account: {
				firstname: string;
				lastname: string;
			};
	  }[]
	| null;

const capitalizeFirstLetter = (string: string): string => {
	if (!string) return '';
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const columns = (): ColumnDef<Transaction>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' />
		),
	},
	{
		accessorKey: 'unit.title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Room Title' />
		),
	},
	{
		accessorKey: 'client_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Client Name' />
		),
	},
	{
		accessorKey: 'service_option',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Service Option' />
		),
		cell: ({ row }) => {
			const serviceOption = row.getValue('service_option') as string;
			return <span className='truncate'>{serviceOption}</span>;
		},
	},
	{
		accessorKey: 'appointment_date',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Appointment Date' />
		),
		cell: ({ row }) => {
			const date = row.getValue('appointment_date') as string;
			return (
				<span className='truncate'>
					{date ? format(parseISO(date), 'dd MMMM, yyyy') : 'No date available'}
				</span>
			);
		},
		filterFn: (row, id, value) => {
			const { from, to } = value;
			const dateValue = row.getValue(id) as string;
			const theDate = parseISO(dateValue);
			return (!from || theDate >= from) && (!to || theDate <= to);
		},
	},
	{
		accessorKey: 'transaction_status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Transaction Status' />
		),
		cell: ({ row }) => {
			const transactionStatus = row.getValue('transaction_status') as string;
			const capitalizedStatus = capitalizeFirstLetter(transactionStatus);
			const badgeColor =
				{
					reserved: 'bg-green-700 hover:bg-green-800',
					pending: 'bg-amber-600 hover:bg-amber-700 px-4',
					cancelled: 'bg-red-700 hover:bg-red-800',
					visited: 'bg-blue-700 hover:bg-blue-800 px-5',
				}[transactionStatus] || 'bg-gray-500';

			return (
				<Badge className={`${badgeColor} text-white mx-8`}>
					{capitalizedStatus}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'isPaid',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Payment Status' />
		),
		cell: ({ row }) => {
			const isPaid = row.getValue('isPaid') as boolean;
			return (
				<span className='truncate'>
					<Badge
						className={`mx-8 border ${
							isPaid
								? 'border-green-700 text-green-700 bg-white hover:bg-white px-5'
								: 'border-neutral-700 text-neutral-700 hover:bg-white bg-white'
						}`}
					>
						{isPaid ? 'Paid' : 'Not Paid'}
					</Badge>
				</span>
			);
		},
	},
];
