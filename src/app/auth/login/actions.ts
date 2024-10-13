'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, error: error.message }; 
  }

  revalidatePath('/client/listings', 'layout');
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstname') as string; 
  const lastName = formData.get('lastname') as string;  
  console.log("signup request= lastname", lastName)
  console.log("signup request= firstname", firstName)

  const { data: user, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstname: firstName,
        lastname: lastName,
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
  redirect('/auth/verify');
}


export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}