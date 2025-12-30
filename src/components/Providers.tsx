'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider, WishlistProvider, SearchProvider, AuthProvider, OrdersProvider } from '@/context'
import CartDrawer from '@/components/ui/CartDrawer'
import SearchModal from '@/components/ui/SearchModal'
import AuthModal from '@/components/ui/AuthModal'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <OrdersProvider>
                {children}
                <CartDrawer />
                <SearchModal />
                <AuthModal />
              </OrdersProvider>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
