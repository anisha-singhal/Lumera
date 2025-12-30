'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  collection?: string
  tagline?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  toggleWishlist: (item: WishlistItem) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'lumera-wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage')
      }
    }
    setIsLoaded(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToWishlist = (item: WishlistItem) => {
    setItems((prevItems) => {
      if (prevItems.find((i) => i.id === item.id)) {
        return prevItems
      }
      return [...prevItems, item]
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }

  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
