'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import type { CartItem } from './CartContext'

export interface OrderAddress {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

export interface OrderItem extends CartItem {}

export interface Order {
  id: string
  createdAt: string
  status: string
  total: number
  paymentMethod: string
  items: OrderItem[]
  shippingAddress: OrderAddress
}

interface AddOrderInput {
  id: string
  items: CartItem[]
  total: number
  paymentMethod: string
  shippingAddress: OrderAddress
  status?: string
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (input: AddOrderInput) => void
  clearOrders: () => void
  refreshOrders: () => Promise<void>
  isLoading: boolean
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const ORDERS_STORAGE_KEY = 'lumera-orders'

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetchedFromDB, setHasFetchedFromDB] = useState(false)

  // Fetch orders from database for logged-in users
  const fetchOrdersFromDB = useCallback(async () => {
    if (!session?.user?.email) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/orders')
      if (response.ok) {
        const data = await response.json()
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders)
          // Also save to localStorage as cache
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(data.orders))
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders from database:', error)
      // Fall back to localStorage if API fails
      try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
        if (saved) {
          const parsed: Order[] = JSON.parse(saved)
          setOrders(parsed)
        }
      } catch {
        // Ignore localStorage errors
      }
    } finally {
      setIsLoading(false)
      setHasFetchedFromDB(true)
    }
  }, [session?.user?.email])

  // Load orders - from DB if logged in, from localStorage as fallback
  useEffect(() => {
    // Wait for session to be determined
    if (status === 'loading') return

    if (status === 'authenticated' && session?.user?.email && !hasFetchedFromDB) {
      // User is logged in - fetch from database
      fetchOrdersFromDB()
    } else if (status === 'unauthenticated') {
      // Not logged in - load from localStorage only
      try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
        if (saved) {
          const parsed: Order[] = JSON.parse(saved)
          setOrders(parsed)
        }
      } catch (error) {
        console.error('Failed to load orders from localStorage', error)
      }
    }
  }, [status, session?.user?.email, hasFetchedFromDB, fetchOrdersFromDB])

  // Reset when user logs out
  useEffect(() => {
    if (status === 'unauthenticated') {
      setHasFetchedFromDB(false)
      // Clear orders when logged out
      setOrders([])
      localStorage.removeItem(ORDERS_STORAGE_KEY)
    }
  }, [status])

  // Re-fetch when user logs in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setHasFetchedFromDB(false)
    }
  }, [session?.user?.email, status])

  const addOrder = (input: AddOrderInput) => {
    setOrders(prev => {
      const newOrder: Order = {
        id: input.id,
        createdAt: new Date().toISOString(),
        status: input.status || 'Processing',
        total: input.total,
        paymentMethod: input.paymentMethod,
        items: input.items.map(item => ({ ...item })),
        shippingAddress: { ...input.shippingAddress },
      }

      const updated = [newOrder, ...prev]
      // Save to localStorage as cache
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Ignore localStorage errors
      }
      return updated
    })
  }

  const clearOrders = () => {
    setOrders([])
    localStorage.removeItem(ORDERS_STORAGE_KEY)
  }

  const refreshOrders = async () => {
    if (session?.user?.email) {
      setHasFetchedFromDB(false)
      await fetchOrdersFromDB()
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        clearOrders,
        refreshOrders,
        isLoading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
