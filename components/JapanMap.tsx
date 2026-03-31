'use client'

import { useRouter } from 'next/navigation'
import { JAPAN_MAP_PATHS } from '@/lib/japanMapPaths'
import { getColorByCount } from '@/lib/colorScale'

type Props = {
  // 都道府県コード → 記録件数のマップ
  countMap: Record<string, number>
}

export default function JapanMap({ countMap }: Props) {
  const router = useRouter()

  const handleClick = (code: string) => {
    router.push(`/prefecture/${code}`)
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="30 0 1080 1010"
        className="w-full max-w-lg mx-auto"
        style={{ minWidth: '320px' }}
      >
        {JAPAN_MAP_PATHS.map((pref) => {
          const count = countMap[pref.code] ?? 0
          const fill = getColorByCount(count)

          return (
            <g
              key={pref.code}
              transform={pref.transform}
              onClick={() => handleClick(pref.code)}
              className="cursor-pointer"
            >
              <path
                d={pref.d}
                fill={fill}
                stroke="#ffffff"
                strokeWidth="1"
                className="transition-opacity duration-150 hover:opacity-80 active:opacity-60"
              />
            </g>
          )
        })}

        {/* 凡例 */}
        <g transform="translate(35, 960)">
          <text fontSize="10" fill="#6B7280" fontFamily="sans-serif">記録件数</text>
          {[
            { label: '0件', color: '#E5E7EB' },
            { label: '1-2件', color: '#BAE6FD' },
            { label: '3-5件', color: '#34D399' },
            { label: '6-9件', color: '#FBBF24' },
            { label: '10-14件', color: '#F97316' },
            { label: '15件+', color: '#EF4444' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 170}, 14)`}>
              <rect width="12" height="12" fill={item.color} rx="2" />
              <text x="16" y="10" fontSize="10" fill="#374151" fontFamily="sans-serif">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
