'use client';

import { format, isWithinInterval, parseISO } from 'date-fns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/app/(auth)/(lessor-dashboard)/reservations/data-column-header';
import { useState } from 'react';
import ApproveConfirmationModal from '../components/ApproveConfirmationModal';
import RejectConfirmationModal from '../components/RejectConfirmationModal';
import { ProfileAlert } from '../components/ProfileAlert';

export type NewLessors = {
	id: number;
	name: string;
	message: string;
	property_name: string;
	email: string;
	birthdate: string;
	contact: string;
	address: string;
	govIdUrl: string;
	businessLicenseUrl: string;
	read: boolean;
};

const ReportedReviewsActionsCell = ({ row }: { row: Row<NewLessors> }) => {
	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

	const handleApproveClick = () => {
		setIsApproveModalOpen(true);
	};

	const handleRejectClick = () => {
		setIsRejectModalOpen(true);
	};

	const handleApprove = () => {
		setIsApproveModalOpen(false);
	};

	const handleReject = () => {
		setIsRejectModalOpen(false);
	};

	return (
		<div className='flex flex-row gap-2'>
			<Button variant='default' size='sm' onClick={handleApproveClick}>
				Approve
			</Button>
			<Button
				variant='outline'
				className=''
				size='sm'
				onClick={handleRejectClick}
			>
				Reject
			</Button>

			<ApproveConfirmationModal
				isOpen={isApproveModalOpen}
				onClose={() => setIsApproveModalOpen(false)}
				handleApprove={handleApprove}
			/>

			<RejectConfirmationModal
				isOpen={isRejectModalOpen}
				onClose={() => setIsRejectModalOpen(false)}
				handleReject={handleReject}
			/>
		</div>
	);
};

const ReportedReviewsViewActionsCell = ({ row }: { row: Row<NewLessors> }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const lessor: NewLessors = row.original;

	return (
		<>
			<Button
				variant='link'
				className='dark:text-gray-400 underline'
				size='sm'
				onClick={() => setIsModalOpen(true)}
			>
				View More
			</Button>
			<ProfileAlert
				lessor={lessor}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export const columns: ColumnDef<NewLessors>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' className='font-bold' />
		),
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Lessor Name' />
		),
	},
	{
		accessorKey: 'property_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Property Name' />
		),
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
	},
	{
		id: 'actions',
		cell: ReportedReviewsActionsCell,
	},
	{
		id: 'view',
		cell: ReportedReviewsViewActionsCell,
	},
];
