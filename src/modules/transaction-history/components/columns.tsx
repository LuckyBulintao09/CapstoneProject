'use client';

import { useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO, set } from 'date-fns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/table/data-column-header';
import { Badge } from '@/components/ui/badge';
import { Star, XCircle } from 'lucide-react';
import AddReviewModal from './AddReviewModal';
import {
	fetchReviewData,
	deleteReview,
	cancelTransaction,
} from '@/actions/transaction/column';
import { cancel_onsiteNotification } from '@/actions/notification/notification';
import RejectionTransactionModal from '@/modules/hosting/transaction-history/components/cancellationModal';
import { toast } from 'sonner';

interface Review {
	id: number;
	created_at: string;
	user_id: string;
	ratings: number;
	comment: string;
	isReported: boolean;
	unit_id: number;
}

const capitalizeFirstLetter = (string: string): string => {
	if (!string) return '';
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const TransactionActionsCell = ({ row }: { row: Row<Transaction> }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [reviewData, setReviewData] = useState<Review | null>(null);
	const transactionStatus = row.getValue('transaction_status') as string;
	const unitId = row.original.unit?.id;

	useEffect(() => {
		const getReviewData = async () => {
			if (!unitId || !row.original.user_id) return;
			const review = await fetchReviewData(unitId, row.original.user_id, row.original.id || null);
			setReviewData(review);
		};

		getReviewData();
	}, [unitId, row.original.user_id]);

	const handleDeleteReview = async () => {
		if (!reviewData) return;

		const success = await deleteReview(reviewData.id);
		if (success) {
			setReviewData(null);
			toast.success('Review deleted successfully!');
		}
	};

	const handleCancel = async ( reason: string) => {
		const success = await cancelTransaction(row.original.id, unitId, reason);

		if (success) {
			await cancel_onsiteNotification(unitId, row.original.user_id, reason);
			toast.success('Transaction cancelled successfully!');
			window.location.reload();
		}
	};

	return (
		<div className='flex flex-row gap-3'>
			{(transactionStatus === 'reserved' ||
				transactionStatus === 'visited') && (
				<>
					{reviewData ? (
						<div className='flex gap-3 w-[150px]'>
							<Button
								className='flex-1 flex justify-center px-2 py-1 text-xs bg-gray-700 hover:bg-gray-800'
								size='sm'
								onClick={() => setIsModalOpen(true)}
							>
								Edit Review
							</Button>
						</div>
					) : (
						<Button
							className='w-[150px] flex justify-center text-xs'
							size='sm'
							onClick={() => setIsModalOpen(true)}
						>
							{/* <Star className='h-4 w-4 mr-2' /> */}
							Add Review
						</Button>
					)}
					<AddReviewModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						unit_id={unitId}
						reviewData={reviewData}
						onDelete={handleDeleteReview}
						transactionId={row.original.id}
					/>
				</>
			)}

			{transactionStatus === 'pending' && (
				<Button
					className='bg-destructive hover:bg-destructive text-white flex justify-center w-[150px] text-xs'
					size='sm'
					onClick={() => setIsCancelModalOpen(true)}
				>
					Cancel
				</Button>
			)}

			<RejectionTransactionModal
			isOpen={isCancelModalOpen}
			onClose={() => setIsCancelModalOpen(false)}
			onSubmit={handleCancel}
			/>
		</div>
	);
};

// Columns Configuration
export const columns: ColumnDef<Transaction>[] = [
	{
		id: 'unit_code',
		accessorFn: (row) => row.unit?.unit_code,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Unit Code' />
		),
	},
	{
		accessorKey: 'unit.title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Unit Name' />
		),
	},
	{
		accessorKey: 'service_option',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Service Option' />
		),
		cell: ({ row }) => {
			const serviceOption = row.getValue('service_option') as string;
			return (
				<span className='truncate'>
					{serviceOption
						.split(' ')
						.map(
							(word) =>
								word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
						)
						.join(' ')}
				</span>
			);
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
			const theDate = parseISO(row.getValue(id));
			if ((from || to) && !theDate) return false;
			if (from && !to) return theDate.getTime() >= from.getTime();
			if (!from && to) return theDate.getTime() <= to.getTime();
			if (from && to)
				return isWithinInterval(theDate, { start: from, end: to });
			return true;
		},
	},
	{
		id: 'payment_option',
		accessorFn: (row) => row?.payment_option,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Payment Option' />
		),
		cell: ({ row }) => {
			const paymentOption = row.getValue('payment_option') as string;
			return <span className='truncate'>{paymentOption || 'N/A'}</span>;
		},
	},
	{
		accessorKey: 'transaction_status',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Transaction Status'
				className='flex justify-center items-center'
			/>
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
					className={`${badgeColor} mx-8 lg:mx-12  w-[80px] text-center flex justify-center items-center bg-transparent`}
				>
					{capitalizedStatus}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		cell: TransactionActionsCell,
	},
];
