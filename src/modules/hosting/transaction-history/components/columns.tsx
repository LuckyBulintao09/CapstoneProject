'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/app/(auth)/(lessor-dashboard)/reservations/data-column-header';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import ToggleSwitch from './toggleSwitch'; // Adjust path as necessary
import { createClient } from '@/utils/supabase/client';
import { CheckCircle2, XCircleIcon } from 'lucide-react';

const supabase = createClient();

export type Transaction = {
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
	unit_title: string;
	account: {
		firstname: string;
		lastname: string;
	};
};

const capitalizeFirstLetter = (string: string): string => {
	if (!string) return '';
	return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to update transaction status in the database using Supabase
const updateTransactionStatusInDB = async (id: number, newStatus: string) => {
	const { error: updateError } = await supabase
		.from('transaction')
		.update({ transaction_status: newStatus })
		.eq('id', id);

	if (updateError) {
		console.error(
			`Error updating transaction status for transaction ID ${id}:`,
			updateError
		);
		throw updateError;
	}

	console.log(`Transaction status for ID ${id} updated to ${newStatus}`);
};

export const columns = (
	updateTransactionStatus: (id: number, newStatus: string) => void
): ColumnDef<Transaction>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' />
		),
	},
	{
		accessorKey: 'unit_title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Unit Title' />
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
					reserved:
						'border-blue-700 bg-foreground dark:border-blue-500 hover:bg-transparent text-blue-800 dark:text-blue-400',
					pending:
						'border-amber-600 bg-foreground dark:border-amber-500 hover:bg-transparent text-amber-700 dark:text-amber-600',
					cancelled:
						'border-red-700 bg-foreground dark:border-red-500 hover:bg-transparent text-red-800 dark:text-red-600',
					visited:
						'border-green-700 bg-foreground dark:border-green-500 hover:bg-transparent text-green-800 dark:text-green-600',
				}[transactionStatus] || 'bg-gray-500';

			return (
				<Badge
					className={`${badgeColor} mx-8 w-[80px] text-center items-center justify-center`}
				>
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
					{isPaid ? (
						<CheckCircle2 className='bg-green-800 dark:bg-green-700  text-white dark:text-secondary mx-8 rounded-full p-0' />
					) : (
						<XCircleIcon className='bg-red-800 dark:bg-red-700 text-white dark:text-secondary mx-8 rounded-full p-0' />
					)}
				</span>
			);
		},
	},
	{
		accessorKey: 'action',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Action' />
		),
		cell: ({ row }) => {
			const transactionStatus = row.getValue('transaction_status') as string;

			const handleStatusChange = async (newStatus: string) => {
				// Update the transaction status in the database
				await updateTransactionStatusInDB(row.original.id, newStatus);

				// Update the local state
				updateTransactionStatus(row.original.id, newStatus);
			};

			return transactionStatus === 'pending' ? (
				<ToggleSwitch onStatusChange={handleStatusChange} />
			) : (
				<span></span> // Empty element for non-pending statuses
			);
		},
	},
];
