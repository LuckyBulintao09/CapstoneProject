'use server';

import { createClient } from '@/utils/supabase/server';

export const updateCompanyStatus = async (
	companyId: number,
	status: string
) => {
	const supabase = createClient();

	try {
		const { error } = await supabase
			.from('company')
			.update({ has_business_permit: status })
			.eq('id', companyId);

		if (error) {
			console.error('Error updating company status:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Unexpected error: ', error);
		return false;
	}
};
