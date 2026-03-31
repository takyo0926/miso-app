'use client'

type Props = {
  value: number           // 現在の評価（1-5）
  onChange?: (value: number) => void  // 変更ハンドラ（省略時は読み取り専用）
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value, onChange, size = 'md' }: Props) {
  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size]

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={`${sizeClass} ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
          aria-label={`${star}星`}
        >
          {star <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}
