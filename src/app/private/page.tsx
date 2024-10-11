import { redirect } from 'next/navigation'

import { createClient } from '../../../utils/supabase/server'

export default async function PrivatePage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
    console.log(data.user.email)
  return <p>Hello {data.user.email}</p>
}

//for testing purposes, to be deleted soon(dont delete) -lucky