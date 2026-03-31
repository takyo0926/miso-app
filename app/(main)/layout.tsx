import BottomNav from '@/components/BottomNav'

// BottomNavを含むメインレイアウト
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
