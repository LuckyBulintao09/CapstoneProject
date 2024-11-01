'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/app/(auth)/(lessor-dashboard)/reservations/data-table';
import { columns, Transaction } from './columns';
import { getTransactionHistory } from '@/actions/transaction/getTransactionHistory';

const TransactionDashboard = () => {
	const [data, setData] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchTransactionHistory = async () => {
			setLoading(true);
			const transactionHistory = await getTransactionHistory();

			const mappedData =
				transactionHistory?.map((transaction) => ({
					...transaction,
					client_name: `${transaction.account.firstname} ${transaction.account.lastname}`,
				})) || [];

			setData(mappedData);
			setLoading(false);
		};
		fetchTransactionHistory();
	}, []);

	return (
		<div className='p-5 bg-white dark:bg-secondary h-full'>
			<div className='mt-4 mb-4'>
				<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white'>
					Transaction History
				</h1>
			</div>
			<div className='col-span-full'>
				<DataTable columns={columns()} data={data} loading={loading} />
			</div>
		</div>
	);
};

export default TransactionDashboard;
