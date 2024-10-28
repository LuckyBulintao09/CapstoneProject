'use server';

import { createClient } from '@/utils/supabase/server';

export const getReportedReviews = async () => {
	const supabase = createClient();

	try {
		const { data, error } = await supabase
			.from('ratings_review')
			.select(
				`id, created_at, user_id, unit_id, comment, isReported, report_reason, account (firstname, lastname)`
			)
			.eq('isReported', true);
		if (error) {
			console.error('Error fetching reported reviews:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Unexpected error: ', error);
		return null;
	}
};
