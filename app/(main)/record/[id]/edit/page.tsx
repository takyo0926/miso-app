import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditForm from './EditForm'
import Link from 'next/link'

type Props = {
  params: { id: string }
}

export default async function EditRecordPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: record } = await supabase
    .from('records')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user?.id ?? '')
    .single()

  if (!record) notFound()

  return (
    <div className="max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href={`/record/${record.id}`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-gray-900">記録を編集</h1>
        </div>
      </div>
      <EditForm record={record} />
    </div>
  )
}
