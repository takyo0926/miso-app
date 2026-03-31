'use client'

import { useRouter } from 'next/navigation'

type Props = {
  code: string
  current: 'desc' | 'asc'
}

export default function SortToggle({ code, current }: Props) {
  const router = useRouter()

  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      <button
        onClick={() => router.push(`/prefecture/${code}?sort=desc`)}
        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          current === 'desc'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500'
        }`}
      >
        新しい順
      </button>
      <button
        onClick={() => router.push(`/prefecture/${code}?sort=asc`)}
        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          current === 'asc'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500'
        }`}
      >
        古い順
      </button>
    </div>
  )
}
