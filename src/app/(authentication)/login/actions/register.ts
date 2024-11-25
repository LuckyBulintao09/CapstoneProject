import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstname') as string; 
  const lastName = formData.get('lastname') as string;

  if (!email || !password || !firstName || !lastName) {
    return { success: false, error: 'All fields are required.' };
  }

  const { data: existingUser, error: existingUserError } = await supabase
    .from('account')
    .select('email')
    .eq('email', email)
    .limit(1)  
    .single(); 

  if (existingUserError) {
    if (existingUserError.code === 'PGRST116') {
      console.log('No existing user found');
    } else {
      console.error('Error checking existing email:', existingUserError);
      return { success: false, error: 'Error checking email. Please try again.' };
    }
  }

  if (existingUser) {
    console.log('Email already exists:', email);
    return { success: false, error: 'Email already exists.' };
  }

  const { data: user, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstname: firstName,
        lastname: lastName,
        user_role: 'Client',
      },
    },
  });

  if (signUpError) {
    console.error('Sign up error:', signUpError);
    return { success: false, error: 'Error signing up. Please try again.' };
  }

  const { error: profileError } = await supabase
    .from('account')
    .insert({
      id: user?.user?.id,  
      email,
      firstname: firstName,
      lastname: lastName,
    });

  if (profileError) {
    console.error('Profile insertion error:', profileError);
    return { success: false, error: 'Error creating user profile.' };
  }

  return { success: true, redirectTo: '/auth/verify' }; 
}
