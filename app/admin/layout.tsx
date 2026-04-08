import AdminNav from '@/components/admin/AdminNav'

// Admin-Seiten nie statisch vorrendern — brauchen immer Auth-Check
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base">
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
