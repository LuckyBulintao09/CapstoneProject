'use client';

import { useState } from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/app/(auth)/(lessor-dashboard)/reservations/data-column-header';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import AddReviewModal from './AddReviewModal';

export type Transaction = {
	id: number;
	branch_id: number;
	room_number: number;
	room_name: string;
	service_option: 'onsite visit' | 'room reservation';
	appointment_date: string;
	transaction_status: 'Reserved' | 'Pending' | 'Cancelled' | 'Visited';
	lessor_name: string;
};

const TransactionActionsCell = ({ row }: { row: Row<Transaction> }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const transactionStatus = row.getValue('transaction_status') as string;

	return (
		<div className='flex flex-row gap-3'>
			{(transactionStatus === 'Reserved' ||
				transactionStatus === 'Visited') && (
				<>
					<Button
						variant='link'
						className='dark:text-amber-400'
						size='sm'
						onClick={() => setIsModalOpen(true)}
					>
						<Star className='h-4 w-4 mr-2' />
						Add Review
					</Button>
					<AddReviewModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>
				</>
			)}
		</div>
	);
};

export const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: 'room_number',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Room Number'
				className='font-bold'
			/>
		),
	},
	{
		accessorKey: 'room_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Room Name' />
		),
	},
	{
		accessorKey: 'service_option',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Service Option' />
		),
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
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Appointment Date' />
		),
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
		accessorKey: 'lessor_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Lessor Name' />
		),
	},
	{
		accessorKey: 'transaction_status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Transaction Status' />
		),
		cell: ({ row }) => {
			const transactionStatus = row.getValue('transaction_status') as string;
			let badgeColor = '';

			switch (transactionStatus) {
				case 'Reserved':
					badgeColor = 'bg-green-700 hover:bg-green-800';
					break;
				case 'Pending':
					badgeColor = 'bg-amber-600 hover:bg-amber-700';
					break;
				case 'Cancelled':
					badgeColor = 'bg-destructive hover:bg-red-800';
					break;
				case 'Visited':
					badgeColor = 'bg-primary hover:bg-blue-800';
					break;
			}

			return (
				<Badge
					className={`${badgeColor} ml-6`}
					style={{
						minWidth: '80px',
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{transactionStatus}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		cell: TransactionActionsCell,
	},
];
