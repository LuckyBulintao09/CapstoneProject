'use client';
import React from 'react';
import { DataTable } from '@/app/(auth)/(lessor-dashboard)/reservations/data-table';
import { columns, ReportedReviews } from './columns';
import { reported_reviews } from '@/lib/constants/reported_reviews';

function getData(): ReportedReviews[] {
	return reported_reviews;
}

const ReviewReportsDashboard = () => {
	const data = getData();

	return <DataTable columns={columns} data={data} />;
};

export default ReviewReportsDashboard;
