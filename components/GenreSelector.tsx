'use client'

import { useState } from 'react'

// デフォルトのジャンル一覧
const DEFAULT_GENRES = [
  'ラーメン', '寿司', '焼肉', '居酒屋', 'カフェ', 'イタリアン',
  'フレンチ', '中華', '和食', 'ファミレス', '洋食', 'カレー',
  'うどん・そば', '焼き鳥', '天ぷら', 'バーガー', '韓国料理',
  'タイ料理', 'インド料理', 'ピザ', '海鮮', 'とんかつ', 'その他',
]

type Props = {
  value: string[]              // 選択中のジャンル配列
  onChange: (genres: string[]) => void
}

export default function GenreSelector({ value, onChange }: Props) {
  const [customInput, setCustomInput] = useState('')
  // デフォルト以外のカスタムジャンルも表示
  const customGenres = value.filter((g) => !DEFAULT_GENRES.includes(g))
  const allGenres = [...DEFAULT_GENRES, ...customGenres]

  const toggle = (genre: string) => {
    if (value.includes(genre)) {
      onChange(value.filter((g) => g !== genre))
    } else {
      onChange([...value, genre])
    }
  }

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setCustomInput('')
  }

  return (
    <div className="space-y-3">
      {/* ジャンルボタン一覧 */}
      <div className="flex flex-wrap gap-2">
        {allGenres.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => toggle(g)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              value.includes(g)
                ? 'bg-indigo-500 text-white'
                : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            {value.includes(g) ? `✓ ${g}` : g}
          </button>
        ))}
      </div>

      {/* カスタムジャンル追加 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="自分でジャンルを追加..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium disabled:opacity-40"
        >
          追加
        </button>
      </div>

      {/* 選択中の表示 */}
      {value.length > 0 && (
        <p className="text-xs text-gray-500">
          選択中: {value.join('、')}
        </p>
      )}
    </div>
  )
}
