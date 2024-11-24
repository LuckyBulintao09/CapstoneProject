'use server';

import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '../email/updateProprietorMessage';

export const updateProprietorStatus = async (
  proprietorId: string,
  status: boolean
) => {
  const supabase = createClient();

  try {
    const { data: accountData, error: fetchError } = await supabase
      .from('account')
      .select('email, firstname, lastname')
      .eq('id', proprietorId)
      .single();

    if (fetchError || !accountData) {
      console.error('Error fetching proprietor data:', fetchError);
      return false;
    }

    const { error: updateError } = await supabase
      .from('account')
      .update({ approved_government: status })
      .eq('id', proprietorId);

    if (updateError) {
      console.error('Error updating pending proprietor:', updateError);
      return false;
    }

    const { email, firstname, lastname } = accountData;
    await sendEmail({ email, firstName: firstname, lastName: lastname, status: status ? 'approved' : 'rejected' });

    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};
