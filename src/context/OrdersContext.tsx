'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const ORDERS_STORAGE_KEY = 'lumera-orders'

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (saved) {
        const parsed: Order[] = JSON.parse(saved)
        setOrders(parsed)
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage', error)
    }
    setIsLoaded(true)
  }, [])

  // Persist orders whenever they change
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch (error) {
      console.error('Failed to save orders to localStorage', error)
    }
  }, [orders, isLoaded])

  const addOrder = (input: AddOrderInput) => {
    setOrders(prev => {
      const newOrder: Order = {
        id: input.id,
        createdAt: new Date().toISOString(),
        status: input.status || (input.paymentMethod === 'cod' ? 'Pending COD' : 'Processing'),
        total: input.total,
        paymentMethod: input.paymentMethod,
        items: input.items.map(item => ({ ...item })),
        shippingAddress: { ...input.shippingAddress },
      }

      // Newest orders first
      return [newOrder, ...prev]
    })
  }

  const clearOrders = () => {
    setOrders([])
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        clearOrders,
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
