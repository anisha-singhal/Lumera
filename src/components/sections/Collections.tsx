'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

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
    name: 'The Signature Collection',
    slug: 'signature',
    tagline: 'Luxury Redefined',
    description:
      'Our most exquisite creations. Complex, sophisticated fragrances for those who demand excellence.',
    image: '/images/collections/signature.jpg',
    productCount: 3,
    priceRange: '₹1,499 - ₹4,999',
    mood: 'Bold & Luxurious',
  },
  {
    id: 2,
    name: 'Moments Collection',
    slug: 'moments',
    tagline: 'Gift a Pause',
    description:
      'Thoughtfully curated candles perfect for gifting. Create lasting memories with every flame.',
    image: '/images/collections/essence.jpg',
    productCount: 3,
    priceRange: '₹999 - ₹2,499',
    mood: 'Heartfelt & Celebratory',
  },
  {
    id: 3,
    name: 'The Ritual Edit',
    slug: 'ritual',
    tagline: 'Daily Sacred Moments',
    description:
      'Candles designed for your daily rituals and self-care. Make the ordinary extraordinary.',
    image: '/images/collections/serene.jpg',
    productCount: 3,
    priceRange: '₹899 - ₹1,999',
    mood: 'Calm & Intentional',
  },
]

export default function CollectionsSection() {
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
            Three distinctive collections, each crafted to evoke a unique atmosphere.
            Find the perfect fragrance to complement your lifestyle.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <Link href={`/collections/${collection.slug}`} className="block">
                <div className="relative overflow-hidden bg-white border border-burgundy-700/10 hover:border-burgundy-700/20 transition-all duration-500 hover:shadow-luxury-lg">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-700/80 via-burgundy-700/20 to-transparent" />

                    {/* Collection Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs font-sans tracking-wider uppercase text-cream-100/70 mb-2">
                        {collection.mood}
                      </p>
                      <h3 className="font-serif text-3xl text-cream-100 mb-1">
                        {collection.name}
                      </h3>
                      <p className="font-serif text-lg text-champagne-400 italic">
                        {collection.tagline}
                      </p>
                    </div>

                    {/* Product Count Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-cream-100/90 backdrop-blur-sm text-xs font-sans tracking-wider text-burgundy-700">
                        {collection.productCount} Products
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Description */}
                    <p className="text-sm font-sans text-burgundy-700/70 mb-4 leading-relaxed">
                      {collection.description}
                    </p>

                    {/* Price Range & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-burgundy-700/10">
                      <span className="text-sm font-sans text-burgundy-700/60">
                        {collection.priceRange}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-sans font-medium text-burgundy-700 group-hover:text-burgundy-600 transition-colors">
                        Explore
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
