'use server';

import { createClient } from '@/utils/supabase/server';

export const updateProprietorStatus = async (
	proprietorId: string,
	status: boolean
) => {
	const supabase = createClient();

	try {
		const { error } = await supabase
			.from('account')
			.update({ approved_government: status })
			.eq('id', proprietorId);

		if (error) {
			console.error('Error updating pending proprietor:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Unexpected error:', error);
		return false;
	}
};
