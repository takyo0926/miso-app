'use server'

import { createClient } from '@/lib/supabase/server'
import { PREFECTURES } from '@/lib/prefecture'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type CreateRecordInput = {
  restaurant_name: string
  genre: string | null
  photo_url: string | null
  visited_date: string
  time_of_day: string
  rating: number
  notes: string | null
  prefecture_code: string
}

// サーバー側でレコードを保存する（RLS対応）
export async function createRecord(input: CreateRecordInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です' }
  }

  const pref = PREFECTURES.find((p) => p.code === input.prefecture_code)
  if (!pref) {
    return { error: '都道府県が不正です' }
  }

  const { error } = await supabase.from('records').insert({
    user_id: user.id,
    restaurant_name: input.restaurant_name,
    genre: input.genre,
    photo_url: input.photo_url,
    visited_date: input.visited_date,
    time_of_day: input.time_of_day,
    rating: input.rating,
    notes: input.notes,
    prefecture_code: input.prefecture_code,
    prefecture_name: pref.name,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

// レコードを削除する
export async function deleteRecord(id: string, prefectureCode: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/')
  redirect(`/prefecture/${prefectureCode}`)
}

// レコードを更新する
export async function updateRecord(id: string, input: CreateRecordInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'ログインが必要です' }

  const pref = PREFECTURES.find((p) => p.code === input.prefecture_code)
  if (!pref) return { error: '都道府県が不正です' }

  const { error } = await supabase
    .from('records')
    .update({
      restaurant_name: input.restaurant_name,
      genre: input.genre,
      photo_url: input.photo_url,
      visited_date: input.visited_date,
      time_of_day: input.time_of_day,
      rating: input.rating,
      notes: input.notes,
      prefecture_code: input.prefecture_code,
      prefecture_name: pref.name,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}
