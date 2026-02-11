'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Collection {
  id: number
  name: string
  slug: string
  tagline: string
  description: string
  image: string
  productCount: number
  priceRange: string
  mood: string
}

const collections: Collection[] = [
  {
    id: 1,
    name: 'The Prestige Collection',
    slug: 'prestige',
    tagline: 'Luxury Redefined',
    description:
      'Our most exquisite creations. Complex, sophisticated fragrances for those who demand excellence.',
    image: '/images/collections/prestige.png',
    productCount: 3,
    priceRange: '₹1,499 - ₹4,999',
    mood: 'Bold & Luxurious',
  },
  {
    id: 2,
    name: 'The State of Being Series',
    slug: 'state-of-being',
    tagline: 'Embrace Every Emotion',
    description:
      'Candles that capture the essence of human emotions. From calm to passion, find your state.',
    image: '/images/collections/state-of-being.png',
    productCount: 3,
    priceRange: '₹999 - ₹2,499',
    mood: 'Emotional & Expressive',
  },
  {
    id: 3,
    name: 'The Mineral & Texture Edit',
    slug: 'mineral-texture',
    tagline: 'Earth\'s Refined Elements',
    description:
      'Inspired by nature\'s raw beauty. Earthy, grounding fragrances with unique textural experiences.',
    image: '/images/collections/mineral-texture.png',
    productCount: 3,
    priceRange: '₹899 - ₹1,999',
    mood: 'Grounded & Natural',
  },
  {
    id: 4,
    name: 'Valentine\'s Collection',
    slug: 'valentines',
    tagline: 'Love in Every Scent',
    description:
      'Romantic fragrances crafted for moments of connection. Express your love with scents that speak from the heart.',
    image: '/images/collections/valentines.png',
    productCount: 3,
    priceRange: '₹999 - ₹2,999',
    mood: 'Romantic & Intimate',
  },
]

export default function CollectionsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.85
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="section-spacing bg-gradient-to-b from-cream-100 to-cream-200 overflow-hidden">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-sans tracking-wide-luxury uppercase text-burgundy-700/60 mb-4">
            Our Collections
          </p>
          <h2 className="font-serif text-burgundy-700 mb-6">
            Curated for Every Moment
          </h2>
          <div className="line-accent mx-auto mb-6" />
          <p className="max-w-2xl mx-auto text-burgundy-700/70 font-sans leading-relaxed">
            Four distinctive collections, each crafted to evoke a unique atmosphere.
            Find the perfect fragrance to complement your lifestyle.
          </p>
        </motion.div>

        {/* Collections - Horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              canScrollLeft
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
            style={{
              backgroundColor: '#800020',
              border: '1px solid rgba(201, 162, 77, 0.4)'
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-[#C9A24D]" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              canScrollRight
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
            style={{
              backgroundColor: '#800020',
              border: '1px solid rgba(201, 162, 77, 0.4)'
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-[#C9A24D]" />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-6 lg:gap-8 overflow-x-auto pb-4 -mx-4 px-4 lg:px-0 snap-x snap-mandatory scrollbar-hide"
          >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group flex-shrink-0 w-[85vw] sm:w-[70vw] lg:w-[calc(33.333%-1.5rem)] snap-center"
            >
              <Link href={`/collections?collection=${collection.slug}`} className="block h-full">
                <div className="relative overflow-hidden bg-white border border-burgundy-700/10 hover:border-[#C9A24D]/40 transition-all duration-500 shadow-lg hover:shadow-2xl h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-64 sm:h-80 overflow-hidden flex-shrink-0 bg-cream-200">
                    <Image
                      src={imageErrors[collection.id] ? '/images/collections/prestige.png' : collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                      sizes="(max-width: 1024px) 85vw, 33vw"
                      onError={() => {
                        // Set error state to use fallback image
                        setImageErrors(prev => ({ ...prev, [collection.id]: true }))
                      }}
                    />

                  </div>

                  {/* Collection Name & CTA - Premium Style */}
                  <div
                    className="p-6 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #800020 0%, #5c0017 50%, #800020 100%)',
                    }}
                  >
                    {/* Subtle texture overlay */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A24D' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Gold accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #C9A24D, transparent)',
                      }}
                    />

                    <div className="relative flex items-center justify-between">
                      <div>
                        <p
                          className="text-[10px] font-sans tracking-[0.3em] uppercase mb-2"
                          style={{ color: '#C9A24D' }}
                        >
                          Collection
                        </p>
                        <h3
                          className="font-serif text-xl md:text-2xl leading-tight"
                          style={{ color: '#F6F1EB' }}
                        >
                          {collection.name}
                        </h3>
                      </div>
                      <span
                        className="inline-flex items-center gap-2 text-sm font-sans font-medium transition-all duration-300 group-hover:gap-3"
                        style={{ color: '#C9A24D' }}
                      >
                        Explore
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Featured Products CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/collections" className="btn-primary">
            View All Collections
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
