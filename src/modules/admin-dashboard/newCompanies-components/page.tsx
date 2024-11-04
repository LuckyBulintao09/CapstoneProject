'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/app/(auth)/(lessor-dashboard)/reservations/data-table';
import { columns, NewCompanies } from './columns';
import { getPendingCompanies } from '@/actions/admin/getPendingCompanies';

const NewCompaniesDashboard = ({ onCountUpdate }) => {
	const [data, setData] = useState<NewCompanies[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchPendingCompanies = async () => {
			setLoading(true);
			const pendingCompanies = await getPendingCompanies();

			const mappedData =
				pendingCompanies?.map((company) => ({
					...company,
					proprietor_name: `${company.account.firstname} ${company.account.lastname}`,
				})) || [];

			setData(mappedData);
			onCountUpdate(mappedData.length);
			setLoading(false);
		};
		fetchPendingCompanies();
	}, [onCountUpdate]);

	const handleCompanyUpdate = (companyId: number) => {
		setData((prevData) =>
			prevData.filter((company) => company.id !== companyId)
		);
		onCountUpdate(data.length - 1);
	};

	return (
		<DataTable
			columns={columns(handleCompanyUpdate)}
			data={data}
			loading={loading}
		/>
	);
};

export default NewCompaniesDashboard;
