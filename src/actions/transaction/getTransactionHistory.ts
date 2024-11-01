'use server';

import { createClient } from '@/utils/supabase/server';

export const getTransactionHistory = async () => {
	const supabase = createClient();

	try {
		const { data, error } = await supabase.from('transaction').select(`
                id, 
                user_id, 
                service_option,     
                appointment_date, 
                transaction_status, 
                isPaid, 
                unit:unit_id (
                    id, title, unit_code
                ),
                account: user_id (
                    firstname, 
                    lastname
                )
            `);

		if (error) {
			console.error(
				'Error fetching transaction history for proprietor:',
				error
			);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Unexpected error:', error);
		return null;
	}
};
