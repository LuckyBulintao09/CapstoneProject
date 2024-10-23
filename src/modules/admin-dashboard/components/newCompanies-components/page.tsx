'use client';
import React from 'react';
import { DataTable } from '@/app/(auth)/(lessor-dashboard)/reservations/data-table';
import { columns, NewCompanies } from './columns';
import { new_companies } from '@/lib/constants/new_companies';

function getData(): NewCompanies[] {
	return new_companies;
}

const NewCompaniesDashboard = () => {
	const data = getData();

	return <DataTable columns={columns} data={data} />;
};

export default NewCompaniesDashboard;
