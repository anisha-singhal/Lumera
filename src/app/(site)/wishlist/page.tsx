'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { useWishlist, useCart } from '@/context'
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react'

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart, setIsCartOpen } = useCart()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      image: item.image,
      collection: item.collection,
    })
    removeFromWishlist(item.id)
  }

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        image: item.image,
        collection: item.collection,
      })
    })
    clearWishlist()
    setIsCartOpen(true)
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-cream-200/50 py-4">
          <div className="section-container">
            <nav className="flex items-center gap-2 text-sm font-sans">
              <Link href="/" className="text-burgundy-700/50 hover:text-burgundy-700">
                Home
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <span className="text-burgundy-700">Wishlist</span>
            </nav>
          </div>
        </div>

        <section className="section-spacing bg-cream-100">
          <div className="section-container">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-serif text-3xl text-burgundy-700">
                My Wishlist ({items.length})
              </h1>
              {items.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="text-sm font-sans text-burgundy-700/60 hover:text-burgundy-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Heart className="w-20 h-20 mx-auto text-burgundy-700/20 mb-6" />
                <h2 className="font-serif text-2xl text-burgundy-700 mb-3">
                  Your wishlist is empty
                </h2>
                <p className="text-burgundy-700/60 font-sans mb-8 max-w-md mx-auto">
                  Save your favorite candles here by clicking the heart icon on any product.
                </p>
                <Link href="/collections" className="btn-primary">
                  Explore Collections
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Add All to Cart Button */}
                <div className="mb-8">
                  <button
                    onClick={handleAddAllToCart}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add All to Cart
                  </button>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-white border border-burgundy-700/10"
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-burgundy-700/60 hover:text-burgundy-700 hover:bg-white transition-all shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Image */}
                      <Link href={`/products/${item.slug}`} className="block">
                        <div className="relative aspect-square overflow-hidden bg-cream-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="p-4">
                        {item.collection && (
                          <p className="text-xs font-sans text-burgundy-700/50 uppercase tracking-wider mb-1">
                            {item.collection}
                          </p>
                        )}
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="font-serif text-lg text-burgundy-700 hover:text-burgundy-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        {item.tagline && (
                          <p className="text-sm font-sans text-burgundy-700/60 italic mt-1">
                            {item.tagline}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-sans font-medium text-burgundy-700">
                            {formatPrice(item.price)}
                          </span>
                          {item.compareAtPrice && (
                            <span className="font-sans text-sm text-burgundy-700/40 line-through">
                              {formatPrice(item.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart */}
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full mt-4 py-2 flex items-center justify-center gap-2 bg-burgundy-700 text-cream-100 text-sm font-sans tracking-wider uppercase hover:bg-burgundy-600 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
