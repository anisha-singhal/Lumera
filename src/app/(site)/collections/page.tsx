'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Header, Footer } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import CustomSelect from '@/components/ui/CustomSelect'
import { useProducts, Product } from '@/context'

interface Collection {
  id: string
  name: string
  slug: string
}

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

const filterOptions = {
  fragranceFamily: {
    label: 'By Fragrance Family',
    options: [
      { label: 'Floral', value: 'floral' },
      { label: 'Fruity', value: 'fruity' },
      { label: 'Woody', value: 'woody' },
      { label: 'Fresh', value: 'fresh' },
      { label: 'Oriental', value: 'oriental' },
      { label: 'Citrus', value: 'citrus' },
      { label: 'Gourmand', value: 'gourmand' },
    ],
  },
  price: {
    label: 'By Price',
    options: [
      { label: '₹499–₹999', value: '499-999' },
      { label: '₹999–₹1,499', value: '999-1499' },
      { label: '₹1,499+', value: '1499+' },
    ],
  },
}

// Filter section component
function FilterSection({
  title,
  options,
  selected,
  onChange,
  isOpen,
  onToggle,
}: {
  title: string
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (value: string) => void
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-burgundy-700/10 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-sm font-sans font-medium tracking-wide uppercase text-burgundy-700">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-burgundy-700/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-burgundy-700/60" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => onChange(option.value)}
                    className="w-4 h-4 rounded border-burgundy-700/30 text-burgundy-700 focus:ring-burgundy-700 focus:ring-offset-0"
                  />
                  <span className="text-sm font-sans text-burgundy-700/70 group-hover:text-burgundy-700 transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Product Card component
function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const [imgSrc, setImgSrc] = useState(
    primaryImage?.image?.id 
      ? `/api/media/${primaryImage.image.id}/view` 
      : (primaryImage?.image?.url || '/placeholder-candle.jpg')
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-200 mb-4">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            onError={() => setImgSrc('/favicon.svg')}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.promoTag && (
              <span className="px-2 py-1 text-[10px] tracking-wider uppercase bg-[#1e3a5f] text-white font-bold animate-pulse">
                {product.promoTag}
              </span>
            )}
            {product.newArrival && (
              <span className="px-2 py-1 text-[10px] tracking-wider uppercase bg-[#C9A24D] text-[#800020]">
                New
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="text-center">
          {(product.productCollection || product.collection) && (
            <p className="text-[10px] tracking-widest uppercase text-[#C9A24D] mb-1">
              {product.productCollection?.name || product.collection?.name}
            </p>
          )}
          <h3 className="font-serif text-lg text-[#800020] mb-1 group-hover:text-[#C9A24D] transition-colors">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-sm text-[#800020]/60 mb-2 italic">
              {product.tagline}
            </p>
          )}
          <div className="flex items-center justify-center gap-2">
            <span className="font-medium text-[#800020]">
              ₹{product.pricing.price.toLocaleString('en-IN')}
            </span>
            {product.pricing.compareAtPrice && product.pricing.compareAtPrice > product.pricing.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.pricing.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function CollectionsContent() {
  const searchParams = useSearchParams()
  const collectionParam = searchParams.get('collection')

  // Fallback collections if API fails - MUST match homepage collection names exactly
  const fallbackCollections: Collection[] = [
    { id: 'prestige', name: 'The Prestige Collection', slug: 'prestige' },
    { id: 'state-of-being', name: 'The State of Being Series', slug: 'state-of-being' },
    { id: 'mineral-texture', name: 'The Mineral & Texture Edit', slug: 'mineral-texture' },
    { id: 'valentines', name: 'Valentine\'s Collection', slug: 'valentines' },
  ]

  // Use cached products from context
  const { products, loading } = useProducts()
  const [collections, setCollections] = useState<Collection[]>(fallbackCollections)
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [activeCollection, setActiveCollection] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(['fragranceFamily', 'price'])
  const [selectedFilters, setSelectedFilters] = useState({
    fragranceFamily: [] as string[],
    price: [] as string[],
  })

  // Map slugs to correct names (to ensure names match homepage even if API returns different names)
  // Also map old collection names to new ones
  const collectionNameMap: Record<string, string> = {
    'prestige': 'The Prestige Collection',
    'state-of-being': 'The State of Being Series',
    'state-of-being-series': 'The State of Being Series',
    'mineral-texture': 'The Mineral & Texture Edit',
    'mineral-and-texture': 'The Mineral & Texture Edit',
    'valentines': 'Valentine\'s Collection',
    'valentines-collection': 'Valentine\'s Collection',
    // Map old collection names
    'ritual': 'The State of Being Series',
    'signature': 'The Mineral & Texture Edit',
    'moments': 'The Prestige Collection',
  }

  // Map collection names to slugs (for reverse lookup)
  const collectionSlugMap: Record<string, string> = {
    'The Prestige Collection': 'prestige',
    'Prestige': 'prestige',
    'Moments': 'prestige',
    'The State of Being Series': 'state-of-being',
    'State of Being': 'state-of-being',
    'Ritual': 'state-of-being',
    'The Mineral & Texture Edit': 'mineral-texture',
    'Mineral & Texture': 'mineral-texture',
    'Signature': 'mineral-texture',
    'Valentine\'s Collection': 'valentines',
    'Valentines': 'valentines',
  }

  // Fetch collections from API
  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch('/api/collections')
        if (response.ok) {
          const data = await response.json()
          const apiCollections = data.docs || []
          
          // Always use fallback collections to ensure names match homepage exactly
          // But merge with API data to get correct IDs for filtering
          const mergedCollections = fallbackCollections.map(fallback => {
            // Try to find matching collection by slug
            let apiCollection = apiCollections.find((c: any) => {
              const apiSlug = c.slug?.toLowerCase().trim() || ''
              return apiSlug === fallback.slug
            })
            
            // If not found by slug, try to find by old name mappings
            if (!apiCollection) {
              const oldNameMappings: Record<string, string> = {
                'ritual': 'state-of-being',
                'signature': 'mineral-texture',
                'moments': 'prestige',
              }
              
              apiCollection = apiCollections.find((c: any) => {
                const apiName = c.name?.toLowerCase() || ''
                const mappedSlug = oldNameMappings[apiName]
                return mappedSlug === fallback.slug
              })
            }
            
            // Use API collection ID if found, otherwise use fallback
            return apiCollection 
              ? { ...fallback, id: apiCollection.id }
              : fallback
          })
          
          console.log('Using homepage collection names:', mergedCollections)
          setCollections(mergedCollections)
        } else {
          console.error('Failed to fetch collections:', response.status)
          // Use fallback if API fails
          setCollections(fallbackCollections)
        }
      } catch (err) {
        console.error('Failed to fetch collections:', err)
        // Use fallback if API fails
        setCollections(fallbackCollections)
      } finally {
        setCollectionsLoading(false)
      }
    }
    fetchCollections()
  }, [])

  // Set active collection from URL parameter
  useEffect(() => {
    if (collectionParam) {
      // Normalize the slug for comparison
      const normalizedParam = collectionParam.toLowerCase().trim()
      // Check if this slug exists in our collections (or fallback)
      const allCollections = collections.length > 0 ? collections : fallbackCollections
      const matchingCollection = allCollections.find(
        c => c.slug.toLowerCase().trim() === normalizedParam
      )
      if (matchingCollection) {
        setActiveCollection(matchingCollection.slug)
      } else {
        // If no match found, set it anyway (might be a valid slug from URL)
        setActiveCollection(normalizedParam)
      }
    } else if (!collectionParam && activeCollection !== 'all') {
      // Reset to 'all' if no collection param and not already 'all'
      setActiveCollection('all')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionParam, collections])

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category as keyof typeof prev]
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [category]: currentFilters.filter((f) => f !== value),
        }
      } else {
        return {
          ...prev,
          [category]: [...currentFilters, value],
        }
      }
    })
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const clearFilters = () => {
    setSelectedFilters({
      fragranceFamily: [],
      price: [],
    })
  }

  const hasActiveFilters = Object.values(selectedFilters).some((arr) => arr.length > 0)
  const activeFilterCount = Object.values(selectedFilters).flat().length

  // Debug: Log all products and their collections
  useEffect(() => {
    if (products.length > 0) {
      console.log('All products and their collections:')
      products.forEach((product) => {
        const productCollection = product.productCollection || product.collection
        console.log({
          productName: product.name,
          productCollection: productCollection,
          collectionId: typeof productCollection === 'object' ? productCollection?.id : productCollection,
          collectionName: typeof productCollection === 'object' ? productCollection?.name : 'N/A',
          collectionSlug: typeof productCollection === 'object' ? productCollection?.slug : 'N/A',
        })
      })
      console.log('Available collections:', collections)
    }
  }, [products, collections])

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Collection filter - use productCollection (the actual field name)
    // Handle both populated objects and ID strings
    const productCollection = product.productCollection || product.collection
    const collectionSlug = typeof productCollection === 'object' 
      ? (productCollection?.slug || '')
      : ''
    const collectionId = typeof productCollection === 'object'
      ? (productCollection?.id || '')
      : (typeof productCollection === 'string' ? productCollection : '')
    const collectionName = typeof productCollection === 'object'
      ? (productCollection?.name || '')
      : ''
    
    if (activeCollection !== 'all') {
      // Get the active collection from our collections list
      const activeCollectionData = collections.find(c => c.slug === activeCollection) || 
                                    fallbackCollections.find(c => c.slug === activeCollection)
      
      if (!activeCollectionData) {
        console.warn('Active collection not found:', activeCollection)
        return false
      }
      
      // Normalize slugs for comparison
      const normalizedProductSlug = collectionSlug?.toLowerCase().trim() || ''
      const normalizedActiveSlug = activeCollection.toLowerCase().trim()
      
      // Map old collection names to new slugs
      const oldNameMappings: Record<string, string> = {
        'ritual': 'state-of-being',
        'signature': 'mineral-texture',
        'moments': 'prestige',
      }
      
      // Map old collection slugs to new slugs
      const oldSlugMappings: Record<string, string> = {
        'ritual': 'state-of-being',
        'signature': 'mineral-texture',
        'moments': 'prestige',
      }
      
      // Check if product collection name matches old name and map it
      const normalizedCollectionName = collectionName?.toLowerCase() || ''
      const mappedSlugFromName = oldNameMappings[normalizedCollectionName]
      const mappedSlugFromSlug = oldSlugMappings[normalizedProductSlug]
      
      // Match by:
      // 1. Collection ID (most reliable) - handle both string and object IDs
      const activeId = typeof activeCollectionData.id === 'string' 
        ? activeCollectionData.id 
        : String(activeCollectionData.id)
      const productId = typeof collectionId === 'string'
        ? collectionId
        : String(collectionId)
      const matchesById = productId && activeId && productId === activeId
      
      // 2. Collection slug (normalized)
      const matchesBySlug = normalizedProductSlug === normalizedActiveSlug
      
      // 3. Old name mapping
      const matchesByOldName = mappedSlugFromName === normalizedActiveSlug
      
      // 4. Old slug mapping
      const matchesByOldSlug = mappedSlugFromSlug === normalizedActiveSlug
      
      // Debug logging - always log in development
      console.log('Filtering product:', {
        productName: product.name,
        productCollection: productCollection,
        collectionSlug: normalizedProductSlug,
        collectionId: productId,
        collectionName: collectionName,
        activeCollection: normalizedActiveSlug,
        activeCollectionId: activeId,
        matchesById,
        matchesBySlug,
        matchesByOldName,
        matchesByOldSlug,
        matches: matchesById || matchesBySlug || matchesByOldName || matchesByOldSlug
      })
      
      if (!matchesById && !matchesBySlug && !matchesByOldName && !matchesByOldSlug) {
        return false
      }
    }

    // Fragrance Family filter
    if (selectedFilters.fragranceFamily.length > 0) {
      if (!product.fragrance?.fragranceFamily || !selectedFilters.fragranceFamily.includes(product.fragrance.fragranceFamily)) {
        return false
      }
    }

    // Price filter
    if (selectedFilters.price.length > 0) {
      const matchesPrice = selectedFilters.price.some((range) => {
        if (range === '499-999') return product.pricing.price >= 499 && product.pricing.price <= 999
        if (range === '999-1499') return product.pricing.price >= 999 && product.pricing.price <= 1499
        if (range === '1499+') return product.pricing.price >= 1499
        return false
      })
      if (!matchesPrice) return false
    }

    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.pricing.price - b.pricing.price
      case 'price-desc':
        return b.pricing.price - a.pricing.price
      case 'newest':
        return a.newArrival ? -1 : 1
      default:
        return a.bestSeller ? -1 : 1
    }
  })

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative w-full bg-cream-200">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full"
          >
            <Image
              src="/images/collections-header.png"
              alt="Lumera Collections"
              width={1920}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>
        </section>

        {/* Filters & Products */}
        <section className="section-spacing">
          <div className="section-container">
            {/* Filter Bar */}
            <div className="flex flex-col gap-4 mb-8 md:mb-10 pb-6 border-b border-burgundy-700/10">
              {/* Collection Tabs - Scrollable on mobile */}
              <div className="-mx-6 px-6 overflow-x-auto scrollbar-hide md:mx-0 md:px-0">
                <div className="flex gap-2 min-w-max md:flex-wrap">
                  {/* All button */}
                  <button
                    onClick={() => {
                      setActiveCollection('all')
                      // Update URL without page reload
                      const url = new URL(window.location.href)
                      url.searchParams.delete('collection')
                      window.history.pushState({}, '', url.toString())
                    }}
                    className={`px-4 py-3 min-h-[48px] text-sm font-sans tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                      activeCollection === 'all'
                        ? 'bg-burgundy-700 border border-burgundy-700 text-white'
                        : 'bg-transparent text-burgundy-700 border border-burgundy-700/20 hover:border-burgundy-700'
                    }`}
                  >
                    All
                  </button>
                  {/* Dynamic collections from database - use fallback if API collections are empty */}
                  {collectionsLoading ? (
                    <div className="px-4 py-3 text-sm text-burgundy-700/60">Loading collections...</div>
                  ) : (
                    (collections.length > 0 ? collections : fallbackCollections).map((collection) => (
                      <button
                        key={collection.id || collection.slug}
                        onClick={() => {
                          setActiveCollection(collection.slug)
                          // Update URL without page reload
                          const url = new URL(window.location.href)
                          url.searchParams.set('collection', collection.slug)
                          window.history.pushState({}, '', url.toString())
                        }}
                        className={`px-4 py-3 min-h-[48px] text-sm font-sans tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                          activeCollection === collection.slug
                            ? 'bg-burgundy-700 border border-burgundy-700 text-white'
                            : 'bg-transparent text-burgundy-700 border border-burgundy-700/20 hover:border-burgundy-700'
                        }`}
                      >
                        {collection.name || 'Unnamed Collection'}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Sort & Filter Options */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 md:justify-end">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 min-h-[48px] border transition-all duration-300 ${
                    showFilters || hasActiveFilters
                      ? 'bg-burgundy-700 border-burgundy-700'
                      : 'bg-transparent text-burgundy-700 border-burgundy-700/20 hover:border-burgundy-700'
                  }`}
                  style={showFilters || hasActiveFilters ? { color: '#FFFFFF' } : undefined}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-sans tracking-wider uppercase">
                    Filters
                    {activeFilterCount > 0 && ` (${activeFilterCount})`}
                  </span>
                </button>

                <CustomSelect
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="min-w-[180px]"
                />

                <span className="text-sm text-burgundy-700/60 ml-auto md:ml-0">
                  {sortedProducts.length} products
                </span>
              </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="bg-cream-100 border border-burgundy-700/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl text-burgundy-700">Filter By</h3>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm font-sans text-burgundy-700/60 hover:text-burgundy-700 underline transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Fragrance Family Filter */}
                      <FilterSection
                        title={filterOptions.fragranceFamily.label}
                        options={filterOptions.fragranceFamily.options}
                        selected={selectedFilters.fragranceFamily}
                        onChange={(value) => handleFilterChange('fragranceFamily', value)}
                        isOpen={openSections.includes('fragranceFamily')}
                        onToggle={() => toggleSection('fragranceFamily')}
                      />

                      {/* Price Filter */}
                      <FilterSection
                        title={filterOptions.price.label}
                        options={filterOptions.price.options}
                        selected={selectedFilters.price}
                        onChange={(value) => handleFilterChange('price', value)}
                        isOpen={openSections.includes('price')}
                        onToggle={() => toggleSection('price')}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(selectedFilters).map(([category, values]) =>
                  values.map((value) => {
                    const filterGroup = filterOptions[category as keyof typeof filterOptions]
                    const option = filterGroup.options.find((o) => o.value === value)
                    return (
                      <button
                        key={`${category}-${value}`}
                        onClick={() => handleFilterChange(category, value)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-700/10 text-burgundy-700 text-sm font-sans rounded-full hover:bg-burgundy-700/20 transition-colors"
                      >
                        <span>{option?.label}</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )
                  })
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && sortedProducts.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8"
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-burgundy-700/60 font-sans mb-4">
                  {products.length === 0
                    ? 'No products available yet. Check back soon!'
                    : 'No products found matching your filters.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-sans text-burgundy-700 underline hover:no-underline transition-all"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-100" />}>
      <CollectionsContent />
    </Suspense>
  )
}
