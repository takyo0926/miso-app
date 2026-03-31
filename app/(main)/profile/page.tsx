import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DisplayNameForm from '@/components/DisplayNameForm'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const handleSignOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const { data: records } = await supabase
    .from('records')
    .select('prefecture_code, rating')
    .eq('user_id', user?.id ?? '')

  const totalCount = records?.length ?? 0
  const visitedPrefCount = new Set(records?.map((r) => r.prefecture_code)).size
  const avgRating = records && records.length > 0
    ? (records.reduce((sum, r) => sum + (r.rating ?? 0), 0) / records.length).toFixed(1)
    : '-'

  const displayName = (user?.user_metadata?.display_name as string) ?? ''

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">プロフィール</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* ユーザー情報・名前編集 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          {/* 表示名の編集 */}
          <div>
            <p className="text-xs text-gray-500 mb-2">マップの名前</p>
            <DisplayNameForm currentName={displayName} />
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-indigo-600">{totalCount}</p>
            <p className="text-xs text-gray-500 mt-1">総記録数</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-indigo-600">{visitedPrefCount}</p>
            <p className="text-xs text-gray-500 mt-1">都道府県数</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-amber-500">★{avgRating}</p>
            <p className="text-xs text-gray-500 mt-1">平均評価</p>
          </div>
        </div>

        {/* ログアウト */}
        <form action={handleSignOut}>
          <button
            type="submit"
            className="w-full py-3 border border-gray-300 text-gray-600 rounded-xl font-medium text-base active:bg-gray-50"
          >
            ログアウト
          </button>
        </form>
      </div>
    </div>
  )
}
