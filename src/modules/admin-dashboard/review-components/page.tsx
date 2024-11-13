'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { columns, ReportedReviews } from './columns';
import { getReportedReviews } from '@/actions/admin/getReportedReviews';

const ReviewReportsDashboard = ({ onCountUpdate }) => {
	const [data, setData] = useState<ReportedReviews[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchReportedReviews = async () => {
			setLoading(true);
			const reportedReviews = await getReportedReviews();

			if (reportedReviews) {
				const mappedData = reportedReviews.map((review) => ({
					id: review.id,
					created_at: review.created_at,
					user_id: review.user_id,
					unit_id: review.unit_id,
					comment: review.comment,
					isReported: review.isReported,
					report_reason: review.report_reason,
					name: `${review.account.firstname} ${review.account.lastname}`,
				}));
				setData(mappedData);
				onCountUpdate(mappedData.length);
			}
			setLoading(false);
		};

		fetchReportedReviews();
	}, [onCountUpdate]);

	const handleReviewUpdate = (reviewId: number) => {
		setData((prevData) => prevData.filter((review) => review.id !== reviewId));
		onCountUpdate(data.length - 1);
	};
	return (
		<DataTable
			columns={columns(handleReviewUpdate)}
			data={data}
			loading={loading}
		/>
	);
};

export default ReviewReportsDashboard;
