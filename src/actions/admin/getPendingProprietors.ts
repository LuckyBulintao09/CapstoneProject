'use server';

import { createClient } from '@/utils/supabase/server';

export const getPendingProprietors = async () => {
	const supabase = createClient();

	try {
		const { data, error } = await supabase
			.from('account')
			.select(
				`id, firstname, lastname, email, cp_number, dob, government_ID_url, approved_government`
			)
			.eq('role', 'Client')
			.eq('approved_government', false)
			.not('government_ID_url', 'is', null);

		if (error) {
			console.error('Error fetching pending proprietors for approval:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Unexpected error: ', error);
		return null;
	}
};
