'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/app/(auth)/(lessor-dashboard)/reservations/data-column-header';
import { useState } from 'react';

import ApproveCompanyModal from '../ApproveCompanyModal';
import RejectCompanyModal from '../RejectCompanyModal';

export type NewCompanies = {
	id: number;
	name: string;
	message: string;
	company_name: string;
	email: string;
	birthdate: string;
	contact: string;
	address: string;
	govIdUrl: string;
	businessLicenseUrl: string;
	read: boolean;
};

const NewCompaniesActionsCell = ({}: { row: Row<NewCompanies> }) => {
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

const BusinessPermitViewActionsCell = ({}: { row: Row<NewCompanies> }) => {
	return (
		<>
			<Button variant='link' className='dark:text-gray-400 underline' size='sm'>
				View Business Permit
			</Button>
		</>
	);
};

export const columns: ColumnDef<NewCompanies>[] = [
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
		cell: NewCompaniesActionsCell,
	},
];
