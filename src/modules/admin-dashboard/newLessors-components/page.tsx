'use client';
import React from 'react';
import { DataTable } from '@/app/(auth)/(lessor-dashboard)/reservations/data-table';
import { columns, NewLessors } from './columns';
import { new_lessors } from '@/lib/constants/new_lessors';

function getData(): NewLessors[] {
	return new_lessors;
}

const NewLessorsDashboard = () => {
	const data = getData();

	return <DataTable columns={columns} data={data} />;
};

export default NewLessorsDashboard;
