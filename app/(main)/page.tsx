import { createClient } from '@/lib/supabase/server'
import JapanMap from '@/components/JapanMap'

// 日本地図ホームページ
export default async function HomePage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // 都道府県ごとの記録件数を取得
  const { data: records } = await supabase
    .from('records')
    .select('prefecture_code')
    .eq('user_id', user?.id ?? '')

  // 都道府県コード → 件数のマップを作成
  const countMap: Record<string, number> = {}
  for (const r of records ?? []) {
    countMap[r.prefecture_code] = (countMap[r.prefecture_code] ?? 0) + 1
  }

  const totalCount = records?.length ?? 0
  const visitedCount = Object.keys(countMap).length
  const displayName = (user?.user_metadata?.display_name as string) ?? ''
  const mapTitle = displayName ? `${displayName}マップ` : 'みそマップ'

  return (
    <div className="max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{mapTitle} 🗾</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {visitedCount}都道府県 / {totalCount}件の記録
            </p>
          </div>
        </div>
      </div>

      {/* 日本地図 */}
      <div className="px-2 pt-4">
        <JapanMap countMap={countMap} />
      </div>

      {/* 案内テキスト（記録がない場合） */}
      {totalCount === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-gray-400 text-sm">
            下の ➕ ボタンから最初の記録を追加しよう！
          </p>
        </div>
      )}
    </div>
  )
}
