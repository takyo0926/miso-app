import { createClient } from '@/lib/supabase/server'
import { getPrefectureByCode } from '@/lib/prefecture'
import RecordCard from '@/components/RecordCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SortToggle from './SortToggle'

type Props = {
  params: { code: string }
  searchParams: { sort?: string }
}

export default async function PrefecturePage({ params, searchParams }: Props) {
  const { code } = params
  const prefecture = getPrefectureByCode(code)
  if (!prefecture) notFound()

  // sort=asc のとき古い順、それ以外は新しい順
  const sortOrder = searchParams.sort === 'asc' ? 'asc' : 'desc'

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: records } = await supabase
    .from('records')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .eq('prefecture_code', code)
    .order('visited_date', { ascending: sortOrder === 'asc' })

  return (
    <div className="max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            ←
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{prefecture.name}</h1>
            <p className="text-xs text-gray-500">{records?.length ?? 0}件の記録</p>
          </div>
          {/* 並び替えトグル */}
          {records && records.length > 1 && (
            <div className="w-36">
              <SortToggle code={code} current={sortOrder} />
            </div>
          )}
        </div>
      </div>

      {/* 記録リスト */}
      <div className="px-4 pt-4 space-y-3">
        {records && records.length > 0 ? (
          records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🗾</div>
            <p className="text-gray-400 text-sm">まだ記録がありません</p>
            <Link
              href={`/record/new?prefecture=${code}`}
              className="inline-block mt-4 px-6 py-2.5 bg-orange-500 text-white rounded-full text-sm font-medium"
            >
              記録を追加する
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
