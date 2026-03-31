import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import StarRating from './StarRating'

type RestaurantRecord = {
  id: string
  restaurant_name: string
  genre: string | null
  photo_url: string | null
  visited_date: string
  time_of_day: string | null
  rating: number | null
  notes: string | null
  prefecture_name: string
}

const TIME_LABELS: { [key: string]: string } = {
  morning: '朝食',
  brunch: 'ブランチ',
  lunch: 'ランチ',
  dinner: 'ディナー',
}

type Props = {
  record: RestaurantRecord
}

export default function RecordCard({ record }: Props) {
  return (
    <Link href={`/record/${record.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:bg-gray-50 transition-colors">
        <div className="flex">
          {/* 写真サムネイル */}
          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 relative">
            {record.photo_url ? (
              <Image
                src={record.photo_url}
                alt={record.restaurant_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🍽️
              </div>
            )}
          </div>

          {/* 店舗情報 */}
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
                {record.restaurant_name}
              </h3>
              {record.rating && (
                <div className="flex-shrink-0">
                  <StarRating value={record.rating} size="sm" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-1.5">
              {record.genre && record.genre.split(',').map((g: string) => (
                <span key={g} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                  {g}
                </span>
              ))}
              {record.time_of_day && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {TIME_LABELS[record.time_of_day] ?? record.time_of_day}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">
                {format(new Date(record.visited_date), 'M月d日(E)', { locale: ja })}
              </span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{record.prefecture_name}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
