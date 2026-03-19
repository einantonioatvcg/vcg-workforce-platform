'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=InvalidCredentials')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=SignupFailed')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function adminCreateUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createAdminClient()
  
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    console.error('Admin create user error:', error)
    redirect('/dashboard/settings?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard/settings')
  redirect('/dashboard/settings?success=UserCreated')
}

export async function getAdminUsers() {
  const supabase = await createAdminClient()
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('Error listing users:', error)
    return []
  }
  
  return users
}

export async function adminDeleteUser(userId: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)
  
  if (error) {
    console.error('Error deleting user:', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/dashboard/settings`
  })

  if (error) {
    console.error('Forgot password error:', error)
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  redirect('/login?success=ResetEmailSent')
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error('Update password error:', error)
    redirect('/dashboard/settings?error=' + encodeURIComponent(error.message))
  }

  redirect('/dashboard/settings?success=PasswordUpdated')
}
