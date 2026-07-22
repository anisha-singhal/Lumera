'use client'

import { useState } from 'react'
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
  Flame,
  Menu,
  X,
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
  const [open, setOpen] = useState(false)

  // The login screen is a standalone full-screen page — no admin shell.
  if (pathname === '/dashboard/login') return null

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/dashboard/login')
    router.refresh()
  }

  const NavLinks = () => (
    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href))

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#C9A24D]" />
            )}
            <item.icon
              className={`w-[18px] h-[18px] transition-colors ${
                isActive ? 'text-[#C9A24D]' : 'text-white/50 group-hover:text-[#C9A24D]'
              }`}
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )

  const SidebarBody = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#800020] to-[#5c0017]">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
        <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
            <Flame className="w-[18px] h-[18px] text-[#C9A24D]" />
          </div>
          <span className="font-serif text-xl font-medium text-white tracking-[0.2em]">
            LUMERA
          </span>
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-white/70 hover:text-white p-1"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <NavLinks />

      {/* User section */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-[#C9A24D] flex items-center justify-center text-[#5c0017] text-sm font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-white/50 truncate">Lumera Store Manager</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-gradient-to-r from-[#800020] to-[#5c0017] shadow-md">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#C9A24D]" />
          <span className="font-serif text-lg text-white tracking-[0.15em]">LUMERA</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="text-white p-2 -mr-2"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col shadow-xl z-30">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] shadow-2xl">
            <SidebarBody />
          </div>
        </div>
      )}
    </>
  )
}
