'use client'

import { useState } from 'react'
import { deleteRecord } from '@/app/actions/record'

type Props = {
  id: string
  prefectureCode: string
}

export default function DeleteButton({ id, prefectureCode }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">本当に削除？</span>
        <button
          onClick={async () => {
            setLoading(true)
            await deleteRecord(id, prefectureCode)
          }}
          disabled={loading}
          className="px-3 py-1.5 text-sm text-white bg-red-500 rounded-xl disabled:opacity-50"
        >
          {loading ? '削除中...' : '削除'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-xl"
        >
          キャンセル
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 text-sm text-red-500 border border-red-300 rounded-xl"
    >
      削除
    </button>
  )
}
