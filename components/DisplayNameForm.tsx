'use client'

import { useState } from 'react'
import { updateDisplayName } from '@/app/actions/profile'

type Props = {
  currentName: string
}

export default function DisplayNameForm({ currentName }: Props) {
  const [name, setName] = useState(currentName)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await updateDisplayName(name.trim())
    setEditing(false)
    setLoading(false)
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">
            {currentName || '名前未設定'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentName ? `${currentName}マップ` : 'みそマップ'}として表示
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-indigo-600 font-medium px-3 py-1.5 border border-indigo-300 rounded-xl"
        >
          変更
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: たかし"
        maxLength={20}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading || !name.trim()}
          className="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存'}
        </button>
        <button
          onClick={() => { setName(currentName); setEditing(false) }}
          className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}
