'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/table/data-column-header';
import { useState } from 'react';

import ApproveCompanyModal from '../components/ApproveCompanyModal';
import RejectCompanyModal from '../components/RejectCompanyModal';
import { updateCompanyStatus } from '@/actions/admin/updateCompanyStatus';

export type NewCompanies = {
	id: number;
	proprietor_name: string;
	company_name: string;
	about: string;
	address: string;
	business_permit: string;
	owner_id: number;
	has_business_permit: string;
	account: {
		firstname: string;
		lastname: string;
	};
};

const NewCompaniesActionsCell = ({
	row,
	onCompanyUpdate,
}: {
	row: Row<NewCompanies>;
	onCompanyUpdate: (id: number) => void;
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
		const result = await updateCompanyStatus(row.original.id, 'approved');
		if (result) {
			alert('Company approved successfully!');
			onCompanyUpdate(row.original.id);
		} else {
			alert('Failed to approve company. Please try again.');
		}
		setIsApproveModalOpen(false);
	};

	const handleReject = async () => {
		const result = await updateCompanyStatus(row.original.id, 'missing');
		if (result) {
			alert('Company rejected successfully!');
			onCompanyUpdate(row.original.id);
		} else {
			alert('Failed to reject company. Please try again.');
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

			<ApproveCompanyModal
				isOpen={isApproveModalOpen}
				onClose={() => setIsApproveModalOpen(false)}
				handleApprove={handleApprove}
			/>

			<RejectCompanyModal
				isOpen={isRejectModalOpen}
				onClose={() => setIsRejectModalOpen(false)}
				handleReject={handleReject}
			/>
		</div>
	);
};

const BusinessPermitViewActionsCell = ({ row }: { row: Row<NewCompanies> }) => {
	const { business_permit } = row.original;

	const handleViewBusinessPermit = () => {
		if (business_permit) {
			window.open(business_permit, '_blank');
		} else {
			alert('Business permit not available.');
		}
	};

	return (
		<>
			<Button
				variant='link'
				className='dark:text-gray-400 underline'
				size='sm'
				onClick={handleViewBusinessPermit}
			>
				View Business Permit
			</Button>
		</>
	);
};

export const columns = (
	handleCompanyUpdate: (id: number) => void
): ColumnDef<NewCompanies>[] => [
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
		accessorKey: 'company_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Company Name' />
		),
	},
	{
		accessorKey: 'business_permit',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Business Permit' />
		),
		cell: BusinessPermitViewActionsCell,
	},
	{
		id: 'actions',
		cell: (info) => (
			<NewCompaniesActionsCell
				row={info.row}
				onCompanyUpdate={handleCompanyUpdate}
			/>
		),
	},
];
