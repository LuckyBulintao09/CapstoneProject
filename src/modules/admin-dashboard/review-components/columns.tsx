'use client';

import { format, isWithinInterval, parseISO } from 'date-fns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/table/data-column-header';
import { useState } from 'react';
import KeepConfirmationModal from '../components/KeepConfirmationModal';
import RemoveConfirmationModal from '../components/RemoveConfirmationModal';
import { updateReportedReviewStatus } from '@/actions/admin/updateReportedReviewStatus';

export type ReportedReviews = {
	id: number;
	created_at: string;
	user_id: string;
	unit_id: string;
	ratings: number;
	comment: string;
	isReported: boolean;
	report_reason: string;
	account: {
		firstname: string;
		lastname: string;
	};
};

const ReportedReviewsActionsCell = ({
	row,
	onReviewUpdate,
}: {
	row: Row<ReportedReviews>;
	onReviewUpdate: (id: number) => void;
}) => {
	const [isKeepModalOpen, setIsKeepModalOpen] = useState(false);
	const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
	const reviewId = row.getValue('id');

	const handleKeepClick = () => {
		setIsKeepModalOpen(true);
	};

	const handleRemoveClick = () => {
		setIsRemoveModalOpen(true);
	};

	const handleKeep = async () => {
		const result = await updateReportedReviewStatus(row.original.id, false);
		if (result) {
			alert('Review kept successfully!');
			onReviewUpdate(row.original.id);
		} else {
			alert('Failed to keep the review. Please try again.');
		}
		setIsKeepModalOpen(false);
	};

	const handleRemove = async () => {
		const result = await updateReportedReviewStatus(row.original.id, false);
		if (result) {
			alert('Review removed successfully!');
			onReviewUpdate(row.original.id);
		} else {
			alert('Failed to remove the review. Please try again.');
		}
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

export const columns = (
	handleReviewUpdate: (id: number) => void
): ColumnDef<ReportedReviews>[] => [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		),
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Date' />
		),
		cell: ({ row }) => {
			const date = row.getValue('created_at') as string | undefined;
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
	},
	{
		accessorKey: 'comment',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Reported Comment' />
		),
	},
	{
		accessorKey: 'report_reason',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Reason for Report' />
		),
	},
	{
		id: 'actions',
		cell: (info) => (
			<ReportedReviewsActionsCell
				row={info.row}
				onReviewUpdate={handleReviewUpdate}
			/>
		),
	},
];
