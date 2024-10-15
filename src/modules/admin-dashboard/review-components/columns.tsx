'use client';

import { format, isWithinInterval, parseISO } from 'date-fns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/app/(lessor-dashboard)/reservations/data-column-header';
import { useState } from 'react';
import KeepConfirmationModal from '../components/KeepConfirmationModal';
import RemoveConfirmationModal from '../components/RemoveConfirmationModal';

export type ReportedReviews = {
	id: number;
	user: string;
	userEmail: string;
	reviewId: string;
	reviewDate: string;
	reportedComment: string;
	reportedBy: string;
	reasonForReport: string;
	associatedProperty: string;
	dateReported: string;
};
const ReportedReviewsActionsCell = ({ row }: { row: Row<ReportedReviews> }) => {
	const [isKeepModalOpen, setIsKeepModalOpen] = useState(false);
	const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

	const handleKeepClick = () => {
		setIsKeepModalOpen(true);
	};

	const handleRemoveClick = () => {
		setIsRemoveModalOpen(true);
	};

	const handleKeep = () => {
		setIsKeepModalOpen(false);
	};

	const handleRemove = () => {
		setIsRemoveModalOpen(false);
	};
	return (
		<div className='flex flex-row gap-2'>
			<>
				<Button
					variant='default'
					className=''
					size='sm'
					onClick={handleKeepClick}
				>
					Keep
				</Button>
				<Button
					variant='outline'
					className=''
					size='sm'
					onClick={handleRemoveClick}
				>
					Remove
				</Button>

				<KeepConfirmationModal
					isOpen={isKeepModalOpen}
					onClose={() => setIsKeepModalOpen(false)}
					handleKeep={handleKeep}
				/>
				<RemoveConfirmationModal
					isOpen={isRemoveModalOpen}
					onClose={() => setIsRemoveModalOpen(false)}
					handleRemove={handleRemove}
				/>
			</>
		</div>
	);
};

export const columns: ColumnDef<ReportedReviews>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' className='font-bold' />
		),
	},
	{
		accessorKey: 'user',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='User' />
		),
	},
	{
		accessorKey: 'reviewDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Review Date' />
		),
		cell: ({ row }) => {
			const date = row.getValue('reviewDate') as string | undefined;
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
		accessorKey: 'reportedComment',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Reported Comment' />
		),
	},
	{
		accessorKey: 'reportedBy',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Reported By' />
		),
	},
	{
		accessorKey: 'reasonForReport',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Reason for Report' />
		),
	},
	{
		accessorKey: 'associatedProperty',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Associated Property' />
		),
	},
	{
		id: 'actions',
		cell: ReportedReviewsActionsCell,
	},
];
