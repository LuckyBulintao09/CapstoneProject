'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/table/data-column-header';
import { useState } from 'react';
import ApproveConfirmationModal from '../components/ApproveConfirmationModal';
import RejectConfirmationModal from '../components/RejectConfirmationModal';
import { ProfileAlert } from '../components/ProfileAlert';
import { updateProprietorStatus } from '@/actions/admin/updateProprietorStatus';
import { toast } from 'sonner';

export type NewProprietors = {
	id: string;
	proprietor_name: string;
	email: string;
	cp_number: string;
	birthdate: string;
	govIdUrl: string;
};

const NewProprietorsActionsCell = ({
	row,
	onProprietorUpdate,
}: {
	row: Row<NewProprietors>;
	onProprietorUpdate: (id: string) => void;
}) => {
	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

	const handleApproveClick = () => {
		setIsApproveModalOpen(true);
	};

	const handleRejectClick = () => {
		setIsRejectModalOpen(true);
	};

	const handleApprove = async () => {
		const result = await updateProprietorStatus(row.original.id, true);
		if (result) {
			toast.success('Client approved successfully!');
			onProprietorUpdate(row.original.id);
		} else {
			toast.error('Failed to approve the client. Please try again.');
		}
		setIsApproveModalOpen(false);
	};

	const handleReject = async () => {
		const result = await updateProprietorStatus(row.original.id, false);
		if (result) {
			toast.success('Client rejected successfully!')
			onProprietorUpdate(row.original.id);
		} else {
			toast.error('Failed to reject client. Please try again.');
		}
		setIsRejectModalOpen(false);
	};

	return (
		<div className='flex flex-row gap-2'>
			<Button variant='default' size='sm' onClick={handleApproveClick}>
				Approve
			</Button>
			<Button variant='outline' size='sm' onClick={handleRejectClick}>
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

const GovernmentIDViewActionCell = ({ row }: { row: Row<NewProprietors> }) => {
	const { govIdUrl }: NewProprietors = row.original;

	const handleViewGovId = () => {
		if (govIdUrl) {
			window.open(govIdUrl, '_blank');
		} else {
			alert('Government ID not available.');
		}
	};

	return (
		<>
			<Button
				variant='link'
				className='dark:text-gray-400 underline'
				size='sm'
				onClick={handleViewGovId}
			>
				View Government ID
			</Button>
		</>
	);
};

export const columns = (
	handleProprietorUpdate: (id: string) => void
): ColumnDef<NewProprietors>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' className='font-bold' />
		),
	},
	{
		accessorKey: 'proprietor_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Proprietor Name' />
		),
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
	},
	{
		accessorKey: 'cp_number',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Phone Number' />
		),
	},
	{
		accessorKey: 'dob',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Date of Birth' />
		),
	},
	{
		accessorKey: 'govIdUrl',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Government ID' />
		),
		cell: GovernmentIDViewActionCell,
	},
	{
		id: 'actions',
		cell: (info) => (
			<NewProprietorsActionsCell
				row={info.row}
				onProprietorUpdate={handleProprietorUpdate}
			/>
		),
	},
];
