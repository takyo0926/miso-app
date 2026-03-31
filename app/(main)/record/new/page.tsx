import RecordForm from '@/components/RecordForm'
import Link from 'next/link'

type Props = {
  searchParams: { prefecture?: string }
}

export default function NewRecordPage({ searchParams }: Props) {
  // 都道府県ページから来た場合はそのコードをデフォルトに
  const defaultPrefecture = searchParams.prefecture ?? 'JP-13'

  return (
    <div className="max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-gray-900">お店を記録</h1>
        </div>
      </div>

      <RecordForm defaultPrefectureCode={defaultPrefecture} />
    </div>
  )
}
