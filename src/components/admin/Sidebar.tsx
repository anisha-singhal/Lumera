'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Flame
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Collections', href: '/dashboard/collections', icon: FolderOpen },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/dashboard/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a5f] to-[#0c1f33] rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#C9A24D]" />
          </div>
          <span className="font-serif text-lg font-medium text-gray-900 tracking-wide">
            LUMERA
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#C9A24D]' : ''}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@lumera.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
