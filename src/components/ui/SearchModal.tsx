'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import { useSearch } from '@/context'
import { placeholderImages } from '@/lib/placeholders'

// Sample products for search - in production this would come from API
const allProducts = [
  {
    id: '1',
    name: 'Vanilla Dreams',
    slug: 'vanilla-dreams',
    price: 1299,
    image: placeholderImages.products.vanillaDreams,
    collection: 'Signature',
    tagline: 'A warm embrace of comfort',
  },
  {
    id: '2',
    name: 'Rose Garden',
    slug: 'rose-garden',
    price: 1499,
    image: placeholderImages.products.roseGarden,
    collection: 'Moments',
    tagline: 'Petals of pure elegance',
  },
  {
    id: '3',
    name: 'Midnight Oud',
    slug: 'midnight-oud',
    price: 2499,
    image: placeholderImages.products.midnightOud,
    collection: 'Signature',
    tagline: 'Mystery in every flame',
  },
  {
    id: '4',
    name: 'Citrus Burst',
    slug: 'citrus-burst',
    price: 999,
    image: placeholderImages.products.citrusBurst,
    collection: 'Ritual',
    tagline: 'Morning sunshine captured',
  },
  {
    id: '5',
    name: 'Lavender Fields',
    slug: 'lavender-fields',
    price: 1199,
    image: placeholderImages.products.lavenderFields,
    collection: 'Ritual',
    tagline: 'Peace in purple blooms',
  },
  {
    id: '6',
    name: 'Ocean Breeze',
    slug: 'ocean-breeze',
    price: 1099,
    image: placeholderImages.products.oceanBreeze,
    collection: 'Ritual',
    tagline: 'Waves of tranquility',
  },
  {
    id: '7',
    name: 'Warm Amber',
    slug: 'warm-amber',
    price: 1399,
    image: placeholderImages.products.warmAmber,
    collection: 'Moments',
    tagline: 'Golden warmth within',
  },
  {
    id: '8',
    name: 'Forest Pine',
    slug: 'forest-pine',
    price: 1299,
    image: placeholderImages.products.forestPine,
    collection: 'Moments',
    tagline: 'Nature\'s embrace',
  },
  {
    id: '9',
    name: 'Royal Jasmine',
    slug: 'royal-jasmine',
    price: 2999,
    image: placeholderImages.products.royalJasmine,
    collection: 'Signature',
    tagline: 'Elegance personified',
  },
]

const popularSearches = ['Vanilla', 'Rose', 'Lavender', 'Signature Collection', 'Gift Sets']

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useSearch()
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
        product.collection.toLowerCase().includes(query) ||
        product.tagline.toLowerCase().includes(query)
    )
    setResults(filtered)
  }, [searchQuery])

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
                {searchQuery.trim() === '' ? (
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

                    {/* Quick Links */}
                    <div className="mt-8">
                      <p className="text-xs font-sans tracking-wider uppercase text-burgundy-700/50 mb-4">
                        Collections
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['Signature', 'Moments', 'Ritual'].map((collection) => (
                          <Link
                            key={collection}
                            href={`/collections/${collection.toLowerCase()}`}
                            onClick={handleClose}
                            className="flex items-center justify-between p-4 bg-ivory-200/30 border border-burgundy-700/10 hover:border-burgundy-700/30 transition-colors group"
                          >
                            <span className="font-serif text-lg text-burgundy-700">
                              {collection}
                            </span>
                            <ArrowRight className="w-4 h-4 text-burgundy-700/40 group-hover:text-burgundy-700 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
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
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-sans text-burgundy-700/50 uppercase tracking-wider">
                              {product.collection}
                            </p>
                            <h3 className="font-serif text-lg text-burgundy-700 truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm font-sans text-burgundy-700/60 truncate">
                              {product.tagline}
                            </p>
                            <p className="font-sans font-medium text-burgundy-700 mt-1">
                              {formatPrice(product.price)}
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
