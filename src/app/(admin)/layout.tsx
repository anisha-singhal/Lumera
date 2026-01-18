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
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <main className="ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
