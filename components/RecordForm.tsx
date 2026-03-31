'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { PREFECTURES } from '@/lib/prefecture'
import StarRating from './StarRating'
import { createRecord } from '@/app/actions/record'
import GenreSelector from './GenreSelector'

const TIME_OPTIONS = [
  { value: 'morning', label: '朝食' },
  { value: 'brunch', label: 'ブランチ' },
  { value: 'lunch', label: 'ランチ' },
  { value: 'dinner', label: 'ディナー' },
]

// 写真をCanvasでリサイズ（max 1200px）
async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const maxSize = 1200
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85)
    }
    img.src = url
  })
}

type Props = {
  defaultPrefectureCode?: string
}

export default function RecordForm({ defaultPrefectureCode = 'JP-13' }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [restaurantName, setRestaurantName] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [visitedDate, setVisitedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [timeOfDay, setTimeOfDay] = useState('lunch')
  const [rating, setRating] = useState(3)
  const [notes, setNotes] = useState('')
  const [prefectureCode, setPrefectureCode] = useState(defaultPrefectureCode)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // 写真を選択
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // GPSで現在地の都道府県を自動判定
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('このブラウザはGPSに対応していません')
      return
    }
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          // BigDataCloud 逆ジオコーディングAPIで都道府県を取得
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ja`
          )
          const data = await res.json()
          // 都道府県名から都道府県コードを特定
          const prefName = data.principalSubdivision as string
          const found = PREFECTURES.find((p) =>
            prefName?.includes(p.name.replace(/[都道府県]$/, ''))
          )
          if (found) {
            setPrefectureCode(found.code)
          }
        } catch {
          setError('現在地の取得に失敗しました')
        } finally {
          setIsGettingLocation(false)
        }
      },
      () => {
        setError('GPS許可が必要です')
        setIsGettingLocation(false)
      }
    )
  }

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let photoUrl: string | null = null

      // 写真をアップロード（ブラウザ側で実行）
      if (photoFile) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('ログインが必要です')

        const resized = await resizeImage(photoFile)
        const fileName = `${user.id}/${Date.now()}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('record-photos')
          .upload(fileName, resized, { contentType: 'image/jpeg' })
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('record-photos')
          .getPublicUrl(fileName)
        photoUrl = publicUrl
      }

      // サーバーアクション経由でレコードを保存
      const result = await createRecord({
        restaurant_name: restaurantName,
        genre: genres.length > 0 ? genres.join(',') : null,
        photo_url: photoUrl,
        visited_date: visitedDate,
        time_of_day: timeOfDay,
        rating,
        notes: notes || null,
        prefecture_code: prefectureCode,
      })

      if (result.error) throw new Error(result.error)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError((err as Error).message ?? '保存に失敗しました')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pt-4 pb-8 space-y-5">
      {/* 写真 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">写真</label>
        <div
          className="relative w-full h-48 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer active:opacity-80"
          onClick={() => fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <Image src={photoPreview} alt="プレビュー" fill className="object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm text-gray-500">タップして写真を追加</p>
            </div>
          )}
        </div>
        {/* iOS Safari: カメラとギャラリーを別々のinputで実装 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

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
          placeholder="例: 山田ラーメン"
          required
        />
      </div>

      {/* ジャンル（複数選択・カスタム追加可） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ジャンル</label>
        <GenreSelector value={genres} onChange={setGenres} />
      </div>

      {/* 都道府県 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">都道府県</label>
        <div className="flex gap-2">
          <select
            value={prefectureCode}
            onChange={(e) => setPrefectureCode(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base bg-white"
          >
            {PREFECTURES.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            className="px-3 py-3 bg-gray-100 rounded-xl text-sm text-gray-600 active:bg-gray-200 disabled:opacity-50"
          >
            {isGettingLocation ? '取得中...' : '📍 GPS'}
          </button>
        </div>
      </div>

      {/* 日付・時間帯 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            訪問日 <span className="text-red-500">*</span>
          </label>
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
          placeholder="感想や次回のポイントなど..."
          rows={3}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* 保存ボタン */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-semibold text-base disabled:opacity-50 active:opacity-80"
      >
        {loading ? '保存中...' : '記録を保存'}
      </button>
    </form>
  )
}
