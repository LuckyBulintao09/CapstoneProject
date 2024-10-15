'use client';
import React, { useState } from 'react';
import AddReviewModal from './AddReviewModal';
import { DataTable } from '@/app/(lessor-dashboard)/reservations/data-table';
import { transactions } from '@/lib/constants/transactions';
import { columns, Transaction } from './columns';

function getData(): Transaction[] {
	return transactions;
}

const TransactionDashboard = () => {
	const data = getData();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className='p-5 bg-white dark:bg-secondary h-full'>
			<div className='mt-4'>
				<div className='mb-4'>
					<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-left dark:text-white'>
						Transaction History
					</h1>
				</div>
				<div className='col-span-full'>
					<DataTable columns={columns} data={data} />
				</div>
			</div>

			<AddReviewModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default TransactionDashboard;
