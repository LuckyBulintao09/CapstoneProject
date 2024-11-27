import { createClient } from '@supabase/supabase-js';
import { createClient as cq } from '@/utils/supabase/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleSecret = process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleSecret) {
  throw new Error('Supabase environment variables are not set!');
}

const supabase = createClient(supabaseUrl, serviceRoleSecret);
const sb = cq();

export const handleDeleteAccount = async (id: string) => {
  console.log('handleDeleteAccount called with id:', id);

  try {
    const [deleteUserResult, deleteAccountResult] = await Promise.all([
      supabase.auth.admin.deleteUser(id), 
      sb.from('account').delete().eq('id', id) 
    ]);

    if (deleteUserResult.error) {
      console.error('Error deleting user:', deleteUserResult.error);
      return { error: deleteUserResult.error.message };
    }
    console.log('User deleted successfully:', deleteUserResult.data);

    if (deleteAccountResult.error) {
      console.error('Error deleting user from "account" table:', deleteAccountResult.error);
      return { error: deleteAccountResult.error.message };
    }
    console.log('User deleted from "account" table successfully.');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error during account deletion:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
};
