import { createClient } from '@/lib/supabase/server'
import StarRating from '@/components/StarRating'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

type Props = {
  params: { id: string }
}

const TIME_LABELS: Record<string, string> = {
  morning: '朝食',
  brunch: 'ブランチ',
  lunch: 'ランチ',
  dinner: 'ディナー',
}

export default async function RecordDetailPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: record } = await supabase
    .from('records')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user?.id ?? '')
    .single()

  if (!record) notFound()

  return (
    <div className="max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href={`/prefecture/${record.prefecture_code}`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {record.restaurant_name}
          </h1>
        </div>
      </div>

      {/* 写真 */}
      {record.photo_url && (
        <div className="relative w-full h-64 bg-gray-100">
          <Image
            src={record.photo_url}
            alt={record.restaurant_name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 詳細情報 */}
      <div className="px-4 py-6 space-y-4">
        {/* 店名・評価 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {record.restaurant_name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {record.genre && (
                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                  {record.genre}
                </span>
              )}
              {record.time_of_day && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {TIME_LABELS[record.time_of_day] ?? record.time_of_day}
                </span>
              )}
            </div>
          </div>
          {record.rating && (
            <div className="text-amber-400 flex-shrink-0">
              <StarRating value={record.rating} size="md" />
            </div>
          )}
        </div>

        {/* 区切り線 */}
        <hr className="border-gray-100" />

        {/* 訪問情報 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-xs text-gray-500">訪問日</p>
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(record.visited_date), 'yyyy年M月d日(E)', { locale: ja })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-xs text-gray-500">場所</p>
              <Link
                href={`/prefecture/${record.prefecture_code}`}
                className="text-sm font-medium text-indigo-600"
              >
                {record.prefecture_name}
              </Link>
            </div>
          </div>
        </div>

        {/* メモ */}
        {record.notes && (
          <>
            <hr className="border-gray-100" />
            <div>
              <p className="text-xs text-gray-500 mb-2">メモ</p>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {record.notes}
              </p>
            </div>
          </>
        )}

        {/* 記録日 */}
        <p className="text-xs text-gray-400 text-right">
          記録: {format(new Date(record.created_at), 'yyyy/M/d HH:mm')}
        </p>
      </div>
    </div>
  )
}
