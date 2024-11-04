'use server';

import { createClient } from '@/utils/supabase/server';

export const updateReportedReviewStatus = async (
	reviewId: number,
	status: boolean
) => {
	const supabase = createClient();

	try {
		const { data, error } = await supabase
			.from('ratings_review')
			.update({ isReported: status })
			.eq('id', reviewId);
		if (error) {
			console.error('Error updating reported review:', error);
			return false;
		}
		return true;
	} catch (error) {
		console.error('Unexpected error:', error);
		return false;
	}
};
