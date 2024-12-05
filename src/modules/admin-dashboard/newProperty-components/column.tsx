'use client';
import React, { useState, useEffect } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { DataTableColumnHeader } from '@/components/table/data-column-header';
import PropertyModal from '../components/PropertyModal';
import RejectionReasonModal from '../components/RejectionReasonModal';
import {
	approve_PropertyNotification,
	reject_PropertyNotification,
} from '@/actions/notification/notification';
import ApprovePropertyModal from '../components/ApprovePropertyModal';
import { CheckCircle, XCircle } from 'lucide-react';

const supabase = createClient();

export type PropertyListing = {
	id: string;
	company_name: string;
	proprietor_name: string;
	property_title: string;
	businessPermitUrl: string;
	fireInspectionUrl: string;
	propertyImageUrls?: string[];
	createdAt: string;
	isApproved: boolean;
	isRejected: boolean;
	dueDate?: string | null;
};

const BusinessPermitViewActionCell = ({
	row,
}: {
	row: Row<PropertyListing>;
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [propertyImageUrls, setPropertyImageUrls] = useState<string[]>([]);

	const { id, businessPermitUrl, fireInspectionUrl } = row.original;

	const handleOpenModal = () => {
		setIsModalOpen(true);
		fetchPropertyImages();
	};

	const handleCloseModal = () => setIsModalOpen(false);

	const fetchPropertyImages = async () => {
		try {
			const { data, error } = await supabase
				.from('property')
				.select('property_image')
				.eq('id', id);
			if (!error && data?.length > 0) {
				setPropertyImageUrls(data[0]?.property_image || []);
			}
		} catch (error) {
			console.error('Error fetching property images:', error);
		}
	};

	return (
		<>
			<button
				onClick={handleOpenModal}
				className='text-blue-600 underline dark:text-blue-400'
			>
				View Documents
			</button>
			<PropertyModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				propertyId={id}
				businessPermitUrl={businessPermitUrl}
				fireInspectionUrl={fireInspectionUrl}
				propertyImageUrls={propertyImageUrls}
			/>
		</>
	);
};

const PropertyListingActionsCell = ({
	row,
	onPropertyUpdate,
}: {
	row: any;
	onPropertyUpdate: (
		id: string,
		isApproved: boolean,
		isRejected?: boolean
	) => void;
}) => {
	const [loading, setLoading] = useState(false);
	const [isApproved, setIsApproved] = useState(row.original.isApproved);
	const [isRejected, setIsRejected] = useState(row.original.isRejected);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

	useEffect(() => {
		// Sync local state with row data
		setIsApproved(row.original.isApproved);
		setIsRejected(row.original.isRejected);
	}, [row.original.isApproved, row.original.isRejected]);

	const handleApproveClick = async () => {
		setLoading(true);

		try {
			const updates = {
				isApproved: true,
				isRejected: false,
				due_date: new Date().toISOString().slice(0, 10),
			};

			const { error } = await supabase
				.from('property')
				.update(updates)
				.eq('id', row.original.id);

			if (!error) {
				await approve_PropertyNotification(
					row.original.proprietor_id,
					row.original.id
				);
				setIsApproved(true);
				setIsRejected(false);
				onPropertyUpdate(row.original.id, true, false);
			}
		} catch (error) {
			console.error('Error updating approval:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRejectClick = async (reason: string) => {
		setLoading(true);

		try {
			const updates = {
				isApproved: false,
				isRejected: true,
				decline_reason: reason,
				due_date: null,
			};

			const { error } = await supabase
				.from('property')
				.update(updates)
				.eq('id', row.original.id);

			if (!error) {
				await reject_PropertyNotification(
					row.original.proprietor_id,
					row.original.id,
					reason
				);
				setIsApproved(false);
				setIsRejected(true);
				onPropertyUpdate(row.original.id, false, true);
			}
		} catch (error) {
			console.error('Error updating rejection:', error);
		} finally {
			setLoading(false);
		}
	};

	if (isApproved) {
		return (
			<span className='flex items-center gap-2 text-green-600 font-bold'>
				<CheckCircle className='w-5 h-5' />
				Approved
			</span>
		);
	}

	if (isRejected) {
		return (
			<span className='flex items-center gap-2 text-red-600 font-bold'>
				<XCircle className='w-5 h-5' />
				Rejected
			</span>
		);
	}

	return (
		<div className='flex gap-2'>
			<Button
				variant='default'
				size='sm'
				onClick={() => setIsApproveModalOpen(true)}
			>
				Approve
			</Button>
			<Button variant='outline' size='sm' onClick={() => setModalOpen(true)}>
				Reject
			</Button>

			<ApprovePropertyModal
				isOpen={isApproveModalOpen}
				onClose={() => setIsApproveModalOpen(false)}
				handleApprove={handleApproveClick}
			/>

			<RejectionReasonModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				onSubmit={(reason) => handleRejectClick(reason)}
			/>
		</div>
	);
};

export const columns = (
	handlePropertyUpdate: (
		id: string,
		isApproved: boolean,
		isRejected: boolean
	) => void
): ColumnDef<PropertyListing>[] => [
	{
		accessorKey: 'proprietor_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Proprietor Name' />
		),
		cell: ({ row }) => <div>{row.original.proprietor_name}</div>,
	},
	{
		accessorKey: 'company_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Company Name' />
		),
		cell: ({ row }) => <div>{row.original.company_name}</div>,
	},
	{
		accessorKey: 'property_title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Property Title' />
		),
		cell: ({ row }) => <div>{row.original.property_title}</div>,
	},
	{
		accessorKey: 'updatedAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Last Update' />
		),
		cell: ({ row }) => <div>{row.original.updatedAt}</div>,
	},
	{
		accessorKey: 'dueDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Due Date' />
		),
		cell: ({ row }) => <div>{row.original.dueDate || 'N/A'}</div>,
	},
	{
		accessorKey: 'businessPermitUrl',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Documents' />
		),
		cell: BusinessPermitViewActionCell,
	},
	{
		id: 'actions',
		cell: (info) => (
			<PropertyListingActionsCell
				row={info.row}
				onPropertyUpdate={handlePropertyUpdate}
			/>
		),
		// baka maayos niyo
		// {
		// id: 'approval_status',
		// header: 'Approval Status',
		// cell: (info) => (
		// 	<PropertyListingActionsCell
		// 		row={info.row}
		// 		onPropertyUpdate={handlePropertyUpdate}
		// 	/>
		// ),

		// filterFn: (row, columnId, value) => {
		// 	const isApproved = row.getValue('isApproved');
		// 	const isRejected = row.getValue('isRejected');

		// 	if (value === 'Approved') {
		// 		return isApproved === true;
		// 	}
		// 	if (value === 'Rejected') {
		// 		return isRejected === true;
		// 	}
		// 	return true;
		// },
	},
];
