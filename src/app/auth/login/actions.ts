'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../../utils/supabase/server'


export async function login(formData: FormData) {
  const supabase = createClient();

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authResult, error: authError } = await supabase.auth.signInWithPassword(credentials);

  if (authError) {
    console.log('Error during login:', authError.message);
    return { success: false, error: authError.message };
  }

  if (authResult?.user) {
    const userId = authResult.user.id;

    const { data: accountData, error: accountError } = await supabase
      .from('account')
      .select('role')
      .eq('id', userId)
      .single();

    if (accountError) {
      console.log('Error fetching account details:', accountError.message);
      return { success: false, error: accountError.message };
    }
    console.log('User role:', accountData?.role);
    if (accountData?.role === "Client") { 
      revalidatePath('/client/listings', 'layout');
      return { success: true };
    } else if (accountData?.role === "Admin") {
      redirect('/administrator/dashboard');
    }
  }
  
  return { success: false, error: 'User not found or role not assigned.' };
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstname') as string; 
  const lastName = formData.get('lastname') as string;  
  console.log("signup request= lastname", lastName)
  console.log("signup request= firstname", firstName)

        const { data: existingUser } = await supabase
      .from('account') 
      .select('email')
      .eq('email', email)
      .single();
              


      if (existingUser && existingUser.email === email) {
      console.log('Email already exists:', email);
      return { success: false, error: 'Email already exists' };
      } else {
            console.log('Email is AVAILABLE:', email);
            console.log("signup request=============")
            const { data: user, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  firstname: firstName,
                  lastname: lastName,
                  user_role: 'Client',
                },
              }
            });

            if (signUpError) {
              console.log('Sign up error:', signUpError);
              redirect('/login?message=error signing up');
              return;
            }

          
            const { error: profileError } = await supabase
              .from('account')
              .insert({
                id: user.user.id,  
                email: email,
                firstname: firstName,
                lastname: lastName,
              });

            if (profileError) {
              console.log('Profile insertion error:', profileError);
              return;  
            }
            revalidatePath('/', 'layout');
            redirect(`${location.origin}/auth/verify`);
            return { success: true };
          }
      }
