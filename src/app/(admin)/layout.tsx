import '@/app/globals.css'
import Sidebar from '@/components/admin/Sidebar'

export const metadata = {
  title: 'Dashboard | Lumera Admin',
  description: 'Lumera Admin Dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-root antialiased min-h-screen bg-[#F6F1EB] text-[#1C1C1C]">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
