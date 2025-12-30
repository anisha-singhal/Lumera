'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard, { ProductCardProps } from '@/components/ui/ProductCard'
import { placeholderImages } from '@/lib/placeholders'

// Sample featured products data
const featuredProducts: ProductCardProps[] = [
  {
    id: '1',
    name: 'Vanilla Dreams',
    slug: 'vanilla-dreams',
    tagline: 'A warm embrace of comfort',
    price: 1299,
    compareAtPrice: 1599,
    image: placeholderImages.products.vanillaDreams,
    hoverImage: placeholderImages.products.vanillaDreamsAlt,
    collection: 'Signature',
    fragrance: {
      topNotes: ['Vanilla Bean', 'Caramel'],
      heartNotes: ['Sandalwood', 'Coconut'],
      baseNotes: ['Musk', 'Amber'],
    },
    specifications: {
      burnTime: { minimum: 45, maximum: 55 },
      weight: { value: 200, unit: 'g' },
      waxType: 'soy-coconut',
    },
    isBestSeller: true,
    inStock: true,
  },
  {
    id: '2',
    name: 'Rose Garden',
    slug: 'rose-garden',
    tagline: 'Petals of pure elegance',
    price: 1499,
    image: placeholderImages.products.roseGarden,
    hoverImage: placeholderImages.products.roseGardenAlt,
    collection: 'Moments',
    fragrance: {
      topNotes: ['Bulgarian Rose', 'Peony'],
      heartNotes: ['Jasmine', 'Lily'],
      baseNotes: ['White Musk', 'Cedar'],
    },
    specifications: {
      burnTime: { minimum: 50, maximum: 60 },
      weight: { value: 250, unit: 'g' },
      waxType: 'soy-coconut',
    },
    isNew: true,
    inStock: true,
  },
  {
    id: '3',
    name: 'Midnight Oud',
    slug: 'midnight-oud',
    tagline: 'Mystery in every flame',
    price: 2499,
    image: placeholderImages.products.midnightOud,
    hoverImage: placeholderImages.products.midnightOudAlt,
    collection: 'Signature',
    fragrance: {
      topNotes: ['Bergamot', 'Saffron'],
      heartNotes: ['Oud', 'Rose'],
      baseNotes: ['Sandalwood', 'Amber'],
    },
    specifications: {
      burnTime: { minimum: 55, maximum: 65 },
      weight: { value: 300, unit: 'g' },
      waxType: 'soy-coconut',
    },
    inStock: true,
  },
  {
    id: '4',
    name: 'Citrus Burst',
    slug: 'citrus-burst',
    tagline: 'Morning sunshine captured',
    price: 999,
    image: placeholderImages.products.citrusBurst,
    hoverImage: placeholderImages.products.citrusBurstAlt,
    collection: 'Ritual',
    fragrance: {
      topNotes: ['Lemon', 'Orange', 'Grapefruit'],
      heartNotes: ['Green Tea', 'Mint'],
      baseNotes: ['White Cedar', 'Musk'],
    },
    specifications: {
      burnTime: { minimum: 35, maximum: 45 },
      weight: { value: 150, unit: 'g' },
      waxType: 'soy',
    },
    inStock: true,
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-lumera-ivory">
      <div className="px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <p 
            className="text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-4"
            style={{ color: 'rgba(128, 0, 32, 0.6)' }}
          >
            Handpicked for You
          </p>
          <h2 
            className="font-serif mb-4 md:mb-6"
            style={{ color: '#800020' }}
          >
            Featured Candles
          </h2>
          <div 
            className="w-16 h-0.5 mx-auto mb-4 md:mb-6"
            style={{ background: 'linear-gradient(to right, #800020, #C9A24D)' }}
          />
          <p 
            className="max-w-xl md:max-w-2xl mx-auto font-sans text-base leading-relaxed"
            style={{ color: 'rgba(128, 0, 32, 0.7)' }}
          >
            Discover our most loved fragrances — each one crafted to transform your
            space and elevate your everyday moments.
          </p>
        </motion.div>

        {/* Products Grid - Single column on mobile, responsive grid on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 md:mt-12"
        >
          <Link
            href="/collections"
            className="btn-primary"
            style={{ backgroundColor: '#800020', color: '#C9A24D' }}
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
