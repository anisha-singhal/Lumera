'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ArrowRight, Loader2 } from 'lucide-react'
import { useSearch, useProducts } from '@/context'

const popularSearches = ['Candle', 'Rose', 'Lavender', 'Vanilla', 'Gift']

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useSearch()
  const { products: allProducts, loading } = useProducts()
  const [results, setResults] = useState<typeof allProducts>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isSearchOpen])

  // Search logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.productCollection?.name || '').toLowerCase().includes(query) ||
        (product.tagline || '').toLowerCase().includes(query)
    )
    setResults(filtered)
  }, [searchQuery, allProducts])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isSearchOpen, setIsSearchOpen])

  const handleClose = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getProductImage = (product: typeof allProducts[0]) => {
    if (product.images && product.images.length > 0 && product.images[0].image) {
      return `/api/media/${product.images[0].image.id}/view`
    }
    return '/favicon.svg'
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-burgundy-700/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-ivory-100 shadow-luxury-xl max-h-[80vh] overflow-hidden"
          >
            <div className="section-container py-6">
              {/* Search Input */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-burgundy-700/40" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for candles, collections..."
                    className="w-full pl-12 pr-4 py-4 bg-ivory-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans text-lg focus:outline-none focus:border-burgundy-700/30"
                  />
                </div>
                <button
                  onClick={handleClose}
                  className="p-3 text-burgundy-700/60 hover:text-burgundy-700 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Results or Suggestions */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-burgundy-700 animate-spin" />
                    <span className="ml-2 text-burgundy-700/60">Loading products...</span>
                  </div>
                ) : searchQuery.trim() === '' ? (
                  // Popular Searches
                  <div>
                    <p className="text-xs font-sans tracking-wider uppercase text-burgundy-700/50 mb-4">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 bg-ivory-200/50 border border-burgundy-700/10 text-sm font-sans text-burgundy-700 hover:border-burgundy-700/30 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    {/* Show all products if available */}
                    {allProducts.length > 0 && (
                      <div className="mt-8">
                        <p className="text-xs font-sans tracking-wider uppercase text-burgundy-700/50 mb-4">
                          All Products ({allProducts.length})
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allProducts.slice(0, 6).map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={handleClose}
                              className="flex gap-4 p-3 bg-white/50 border border-burgundy-700/10 hover:border-burgundy-700/30 hover:shadow-luxury transition-all group"
                            >
                              <div className="relative w-20 h-20 flex-shrink-0 bg-ivory-200 overflow-hidden">
                                <Image
                                  src={getProductImage(product)}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-sans text-burgundy-700/50 uppercase tracking-wider">
                                  {product.productCollection?.name || 'Collection'}
                                </p>
                                <h3 className="font-serif text-lg text-burgundy-700 truncate">
                                  {product.name}
                                </h3>
                                {product.tagline && (
                                  <p className="text-sm font-sans text-burgundy-700/60 truncate">
                                    {product.tagline}
                                  </p>
                                )}
                                <p className="font-sans font-medium text-burgundy-700 mt-1">
                                  {formatPrice(product.pricing?.price || 0)}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {allProducts.length > 6 && (
                          <div className="mt-4 text-center">
                            <Link
                              href="/collections"
                              onClick={handleClose}
                              className="btn-ghost inline-flex items-center gap-2"
                            >
                              View all {allProducts.length} products
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : results.length > 0 ? (
                  // Search Results
                  <div>
                    <p className="text-xs font-sans tracking-wider uppercase text-burgundy-700/50 mb-4">
                      {results.length} Result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={handleClose}
                          className="flex gap-4 p-3 bg-white/50 border border-burgundy-700/10 hover:border-burgundy-700/30 hover:shadow-luxury transition-all group"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-ivory-200 overflow-hidden">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-sans text-burgundy-700/50 uppercase tracking-wider">
                              {product.productCollection?.name || 'Collection'}
                            </p>
                            <h3 className="font-serif text-lg text-burgundy-700 truncate">
                              {product.name}
                            </h3>
                            {product.tagline && (
                              <p className="text-sm font-sans text-burgundy-700/60 truncate">
                                {product.tagline}
                              </p>
                            )}
                            <p className="font-sans font-medium text-burgundy-700 mt-1">
                              {formatPrice(product.pricing?.price || 0)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* View All Results */}
                    <div className="mt-6 text-center">
                      <Link
                        href={`/collections?search=${encodeURIComponent(searchQuery)}`}
                        onClick={handleClose}
                        className="btn-ghost inline-flex items-center gap-2"
                      >
                        View all results
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  // No Results
                  <div className="text-center py-12">
                    <p className="text-burgundy-700/60 font-sans mb-4">
                      No products found for "{searchQuery}"
                    </p>
                    <p className="text-sm text-burgundy-700/40 font-sans">
                      Try searching for a different term or browse our collections
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
