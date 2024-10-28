'use server';

import { createClient } from '@/utils/supabase/server';

export const getPendingCompanies = async () => {
	const supabase = createClient();

	try {
		const { data, error } = await supabase
			.from('company')
			.select(
				`id, company_name, about, address, business_permit, owner_id, has_business_permit, account:owner_id (firstname, lastname)`
			)
			.eq('has_business_permit', 'pending');

		if (error) {
			console.error('Error fetching pending companies to be approved:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Unexpected error: ', error);
		return null;
	}
};
