'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import ProductCard, { ProductCardProps } from '@/components/ui/ProductCard'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { placeholderImages } from '@/lib/placeholders'

// Collection data
const collectionsData: Record<string, {
  name: string
  tagline: string
  description: string
  longDescription: string
  image: string
  mood: string
  priceRange: string
}> = {
  signature: {
    name: 'The Signature Collection',
    tagline: 'Luxury Redefined',
    description: 'Our most exquisite creations for those who demand excellence.',
    longDescription: 'The Signature Collection represents the pinnacle of Lumera craftsmanship. Complex, sophisticated fragrances crafted with rare ingredients and meticulous attention to detail. Each candle is a statement piece, designed for those who appreciate the finer things in life. These are our hero products — timeless, elegant, and unforgettable.',
    image: placeholderImages.collections.signature,
    mood: 'Bold & Luxurious',
    priceRange: '₹1,499 - ₹4,999',
  },
  moments: {
    name: 'Moments Collection',
    tagline: 'Gift a Pause',
    description: 'Thoughtfully curated candles perfect for gifting.',
    longDescription: 'The Moments Collection is designed for those special occasions when you want to gift more than just a candle — you want to gift an experience. From birthdays to housewarmings, anniversaries to "just because" moments, each candle in this collection comes beautifully packaged and ready to create lasting memories.',
    image: placeholderImages.collections.essence,
    mood: 'Heartfelt & Celebratory',
    priceRange: '₹999 - ₹2,499',
  },
  ritual: {
    name: 'The Ritual Edit',
    tagline: 'Daily Sacred Moments',
    description: 'Candles designed for your daily rituals and self-care.',
    longDescription: 'The Ritual Edit is a curated selection for those who understand that luxury lies in the everyday. These candles are designed to elevate your morning coffee, your evening wind-down, your meditation practice, and every quiet moment in between. Light one, breathe deep, and make the ordinary extraordinary.',
    image: placeholderImages.collections.serene,
    mood: 'Calm & Intentional',
    priceRange: '₹899 - ₹1,999',
  },
}

// Products by collection
const productsByCollection: Record<string, ProductCardProps[]> = {
  signature: [
    {
      id: '1',
      name: 'Vanilla Dreams',
      slug: 'vanilla-dreams',
      tagline: 'A warm embrace of comfort',
      price: 1299,
      compareAtPrice: 1599,
      image: placeholderImages.products.vanillaDreams,
      collection: 'Signature',
      fragrance: { topNotes: ['Vanilla Bean', 'Caramel'] },
      specifications: { burnTime: { minimum: 45, maximum: 55 }, weight: { value: 200, unit: 'g' } },
      isBestSeller: true,
      inStock: true,
    },
    {
      id: '3',
      name: 'Midnight Oud',
      slug: 'midnight-oud',
      tagline: 'Mystery in every flame',
      price: 2499,
      image: placeholderImages.products.midnightOud,
      collection: 'Signature',
      fragrance: { topNotes: ['Bergamot', 'Saffron'] },
      specifications: { burnTime: { minimum: 55, maximum: 65 }, weight: { value: 300, unit: 'g' } },
      inStock: true,
    },
    {
      id: '9',
      name: 'Royal Jasmine',
      slug: 'royal-jasmine',
      tagline: 'Elegance personified',
      price: 2999,
      image: placeholderImages.products.royalJasmine,
      collection: 'Signature',
      fragrance: { topNotes: ['Indian Jasmine', 'Neroli'] },
      specifications: { burnTime: { minimum: 60, maximum: 70 }, weight: { value: 350, unit: 'g' } },
      isNew: true,
      inStock: true,
    },
  ],
  moments: [
    {
      id: '2',
      name: 'Rose Garden',
      slug: 'rose-garden',
      tagline: 'Petals of pure elegance',
      price: 1499,
      image: placeholderImages.products.roseGarden,
      collection: 'Moments',
      fragrance: { topNotes: ['Bulgarian Rose', 'Peony'] },
      specifications: { burnTime: { minimum: 50, maximum: 60 }, weight: { value: 250, unit: 'g' } },
      isNew: true,
      inStock: true,
    },
    {
      id: '7',
      name: 'Warm Amber',
      slug: 'warm-amber',
      tagline: 'Golden warmth within',
      price: 1399,
      image: placeholderImages.products.warmAmber,
      collection: 'Moments',
      fragrance: { topNotes: ['Orange Zest', 'Cinnamon'] },
      specifications: { burnTime: { minimum: 45, maximum: 55 }, weight: { value: 200, unit: 'g' } },
      isBestSeller: true,
      inStock: true,
    },
    {
      id: '8',
      name: 'Forest Pine',
      slug: 'forest-pine',
      tagline: 'Nature\'s embrace',
      price: 1299,
      image: placeholderImages.products.forestPine,
      collection: 'Moments',
      fragrance: { topNotes: ['Pine Needle', 'Eucalyptus'] },
      specifications: { burnTime: { minimum: 45, maximum: 55 }, weight: { value: 200, unit: 'g' } },
      inStock: true,
    },
  ],
  ritual: [
    {
      id: '4',
      name: 'Citrus Burst',
      slug: 'citrus-burst',
      tagline: 'Morning sunshine captured',
      price: 999,
      image: placeholderImages.products.citrusBurst,
      collection: 'Ritual',
      fragrance: { topNotes: ['Lemon', 'Orange', 'Grapefruit'] },
      specifications: { burnTime: { minimum: 35, maximum: 45 }, weight: { value: 150, unit: 'g' } },
      inStock: true,
    },
    {
      id: '5',
      name: 'Lavender Fields',
      slug: 'lavender-fields',
      tagline: 'Peace in purple blooms',
      price: 1199,
      image: placeholderImages.products.lavenderFields,
      collection: 'Ritual',
      fragrance: { topNotes: ['French Lavender', 'Eucalyptus'] },
      specifications: { burnTime: { minimum: 40, maximum: 50 }, weight: { value: 180, unit: 'g' } },
      inStock: true,
    },
    {
      id: '6',
      name: 'Ocean Breeze',
      slug: 'ocean-breeze',
      tagline: 'Waves of tranquility',
      price: 1099,
      image: placeholderImages.products.oceanBreeze,
      collection: 'Ritual',
      fragrance: { topNotes: ['Sea Salt', 'Bergamot'] },
      specifications: { burnTime: { minimum: 40, maximum: 50 }, weight: { value: 180, unit: 'g' } },
      inStock: true,
    },
  ],
}

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [sortBy, setSortBy] = useState('featured')

  const collection = collectionsData[slug]
  const products = productsByCollection[slug] || []

  if (!collection) {
    notFound()
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'newest':
        return a.isNew ? -1 : 1
      default:
        return a.isBestSeller ? -1 : 1
    }
  })

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative h-80 md:h-96 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-burgundy-700/80 via-burgundy-700/50 to-transparent" />
          </div>

          <div className="section-container h-full flex items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <p className="text-sm font-sans tracking-wide-luxury uppercase text-cream-100/70 mb-2">
                {collection.mood}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-cream-100 mb-2">
                {collection.name}
              </h1>
              <p className="font-serif text-xl text-champagne-400 italic mb-4">
                {collection.tagline}
              </p>
              <p className="text-cream-100/80 font-sans leading-relaxed">
                {collection.longDescription}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="bg-cream-200/50 py-4">
          <div className="section-container">
            <nav className="flex items-center gap-2 text-sm font-sans">
              <Link href="/" className="text-burgundy-700/50 hover:text-burgundy-700">
                Home
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <Link href="/collections" className="text-burgundy-700/50 hover:text-burgundy-700">
                Collections
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <span className="text-burgundy-700">{collection.name}</span>
            </nav>
          </div>
        </div>

        {/* Products */}
        <section className="section-spacing bg-cream-100">
          <div className="section-container">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-burgundy-700/10">
              <p className="text-burgundy-700/60 font-sans">
                {sortedProducts.length} products
              </p>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-ivory-100 border border-burgundy-700/20 px-4 py-2 pr-10 text-sm font-sans text-burgundy-700 focus:outline-none focus:border-burgundy-700 cursor-pointer"
                  style={{ backgroundColor: '#F6F1EB' }}
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-ivory-100 text-charcoal-900 py-2 font-sans"
                      style={{
                        backgroundColor: '#F6F1EB',
                        color: '#1C1C1C',
                        padding: '8px 16px'
                      }}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy-700/60 pointer-events-none" />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-burgundy-700/60 font-sans">
                  No products available in this collection yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Other Collections */}
        <section className="py-16 bg-cream-200/50">
          <div className="section-container">
            <h2 className="font-serif text-2xl text-burgundy-700 text-center mb-8">
              Explore Other Collections
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(collectionsData)
                .filter(([key]) => key !== slug)
                .map(([key, col]) => (
                  <Link
                    key={key}
                    href={`/collections/${key}`}
                    className="px-6 py-3 border border-burgundy-700/20 text-burgundy-700 font-sans hover:bg-burgundy-700 hover:text-cream-100 transition-all duration-300"
                  >
                    {col.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
