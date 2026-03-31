import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ログアウト処理
  const handleSignOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  // 統計情報を取得
  const { data: records } = await supabase
    .from('records')
    .select('prefecture_code, rating')
    .eq('user_id', user?.id ?? '')

  const totalCount = records?.length ?? 0
  const visitedPrefCount = new Set(records?.map((r) => r.prefecture_code)).size
  const avgRating = records && records.length > 0
    ? (records.reduce((sum, r) => sum + (r.rating ?? 0), 0) / records.length).toFixed(1)
    : '-'

  return (
    <div className="max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">プロフィール</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* ユーザー情報 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-0.5">みそマップユーザー</p>
            </div>
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

        {/* ログアウトボタン */}
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
