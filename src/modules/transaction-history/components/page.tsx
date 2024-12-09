'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/data-table';
import { columns, Transaction } from './columns';
import { createClient } from '../../../utils/supabase/client';
import { BreadcrumbSection } from '@/components/breadcrumb/BreadrumbSection';
import { TransactionBreadcrumb } from '@/components/breadcrumb/TransactionBreadcrumb';
import CustomBreadcrumbs from '@/modules/hosting/components/CustomBreadcrumbs';

const supabase = createClient();

const getData = async (userId: string): Promise<Transaction[]> => {
	const { data, error } = await supabase
		.from('transaction')
		.select(
			`
    id,
		user_id,
		service_option,
		appointment_date,
		payment_option, 
		transaction_status,
		isPaid,  
		unit:unit_id(
			id,
			title,
			unit_code,
        	property:property_id(
				company:company_id(
					account:owner_id(
						firstname,
						lastname
					)
					)	
				)
			)
		)
	  `
		)
		.eq('user_id', userId);

	console.log('Fetched transactions data:', data);

	if (error) {
		console.error('Error fetching transactions:', error);
		return [];
	}

	return data as Transaction[];
};

const TransactionDashboard = () => {
	const [data, setData] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error) {
				console.error('Error fetching user:', error);
				setIsLoading(false);
				return;
			}

			if (user) {
				setUserId(user.id);
			}
		};

		fetchCurrentUser();
	}, []);

	useEffect(() => {
		const fetchTransactions = async () => {
			if (!userId) return;

			const transactionData = await getData(userId);
			setData(transactionData);
			setIsLoading(false);
		};

		fetchTransactions();
	}, [userId]);

	return (
		<div className='px-32 md:px-24 sm:px-20 xs:px-10 p-5 bg-background dark:bg-secondary h-screen'>
			{/* <TransactionBreadcrumb active="Transactions" /> */}
			<CustomBreadcrumbs />
			<div className='mt-1 mb-4'>
				<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white'>
					Transaction History
				</h1>
			</div>
			<div className='col-span-full'>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<DataTable columns={columns} data={data} />
				)}
			</div>
		</div>
	);
};

export default TransactionDashboard;
