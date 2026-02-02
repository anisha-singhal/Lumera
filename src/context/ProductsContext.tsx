'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export interface Product {
  id: string
  name: string
  slug: string
  tagline?: string
  pricing: {
    price: number
    compareAtPrice?: number
  }
  images: Array<{
    image: {
      id: string
      url?: string
      alt?: string
    }
    isPrimary?: boolean
  }>
  productCollection?: {
    name: string
    slug?: string
  }
  collection?: {
    name: string
    slug: string
  }
  bestSeller?: boolean
  newArrival?: boolean
  featured?: boolean
  fragrance?: {
    fragranceFamily?: string
  }
  inventory?: {
    quantity: number
  }
  promoTag?: string
}

interface ProductsContextType {
  products: Product[]
  featuredProducts: Product[]
  loading: boolean
  error: string | null
  refreshProducts: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

// Cache products in memory to persist across component remounts
let cachedProducts: Product[] | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(cachedProducts || [])
  const [loading, setLoading] = useState(!cachedProducts)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (force = false) => {
    // Use cached data if available and not expired
    if (
      !force &&
      cachedProducts &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      setProducts(cachedProducts)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/products?limit=100')
      if (response.ok) {
        const data = await response.json()
        const fetchedProducts = data.docs || []

        // Update cache
        cachedProducts = fetchedProducts
        cacheTimestamp = Date.now()

        setProducts(fetchedProducts)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products')
      // Use cached data as fallback if available
      if (cachedProducts) {
        setProducts(cachedProducts)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Get featured products from cache
  const featuredProducts = products.filter(p => p.featured || p.bestSeller).slice(0, 4)

  const refreshProducts = useCallback(async () => {
    await fetchProducts(true)
  }, [fetchProducts])

  return (
    <ProductsContext.Provider
      value={{
        products,
        featuredProducts,
        loading,
        error,
        refreshProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
