'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PREFECTURES } from '@/lib/prefecture'
import StarRating from '@/components/StarRating'
import { updateRecord } from '@/app/actions/record'

const GENRES = [
  'ラーメン', '寿司', '焼肉', '居酒屋', 'カフェ', 'イタリアン',
  'フレンチ', '中華', '和食', 'ファミレス', '洋食', 'カレー',
  'うどん・そば', '焼き鳥', '天ぷら', 'その他',
]

const TIME_OPTIONS = [
  { value: 'morning', label: '朝食' },
  { value: 'brunch', label: 'ブランチ' },
  { value: 'lunch', label: 'ランチ' },
  { value: 'dinner', label: 'ディナー' },
]

type Props = {
  record: {
    id: string
    restaurant_name: string
    genre: string | null
    visited_date: string
    time_of_day: string | null
    rating: number | null
    notes: string | null
    prefecture_code: string
    photo_url: string | null
  }
}

export default function EditForm({ record }: Props) {
  const router = useRouter()
  const [restaurantName, setRestaurantName] = useState(record.restaurant_name)
  const [genre, setGenre] = useState(record.genre ?? '')
  const [visitedDate, setVisitedDate] = useState(record.visited_date)
  const [timeOfDay, setTimeOfDay] = useState(record.time_of_day ?? 'lunch')
  const [rating, setRating] = useState(record.rating ?? 3)
  const [notes, setNotes] = useState(record.notes ?? '')
  const [prefectureCode, setPrefectureCode] = useState(record.prefecture_code)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await updateRecord(record.id, {
      restaurant_name: restaurantName,
      genre: genre || null,
      photo_url: record.photo_url,
      visited_date: visitedDate,
      time_of_day: timeOfDay,
      rating,
      notes: notes || null,
      prefecture_code: prefectureCode,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(`/record/${record.id}`)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pt-4 pb-8 space-y-5">
      {/* 店名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          店名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          required
        />
      </div>

      {/* ジャンル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ジャンル</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(genre === g ? '' : g)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                genre === g ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 都道府県 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">都道府県</label>
        <select
          value={prefectureCode}
          onChange={(e) => setPrefectureCode(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base bg-white"
        >
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* 日付・時間帯 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">訪問日</label>
          <input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">時間帯</label>
          <select
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base bg-white"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 評価 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">評価</label>
        <div className="text-amber-400">
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base resize-none"
          rows={3}
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-semibold text-base disabled:opacity-50"
      >
        {loading ? '保存中...' : '変更を保存'}
      </button>
    </form>
  )
}
