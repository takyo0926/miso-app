'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 表示名を保存する
export async function updateDisplayName(name: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    data: { display_name: name },
  })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/profile')
  return { success: true }
}
