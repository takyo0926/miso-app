// 記録件数に応じた色を返す関数（寒色→暖色）
export function getColorByCount(count: number): string {
  if (count === 0) return '#E5E7EB'   // gray-200 （未訪問）
  if (count <= 2) return '#BAE6FD'    // sky-200
  if (count <= 5) return '#34D399'    // emerald-400
  if (count <= 9) return '#FBBF24'    // amber-400
  if (count <= 14) return '#F97316'   // orange-500
  return '#EF4444'                     // red-500 （15件以上）
}

// ツールチップ用ラベル
export function getColorLabel(count: number): string {
  if (count === 0) return '未訪問'
  if (count <= 2) return `${count}件`
  if (count <= 5) return `${count}件`
  if (count <= 9) return `${count}件`
  if (count <= 14) return `${count}件`
  return `${count}件`
}
