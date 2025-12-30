'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { useCart } from '@/context'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const shippingThreshold = 999
  const freeShipping = subtotal >= shippingThreshold
  const shipping = freeShipping ? 0 : 99
  const total = subtotal + shipping

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
              <span className="text-burgundy-700">Cart</span>
            </nav>
          </div>
        </div>

        <section className="section-spacing bg-cream-100">
          <div className="section-container">
            <h1 className="font-serif text-3xl text-burgundy-700 mb-8">
              Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h1>

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <ShoppingBag className="w-20 h-20 mx-auto text-burgundy-700/20 mb-6" />
                <h2 className="font-serif text-2xl text-burgundy-700 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-burgundy-700/60 font-sans mb-8 max-w-md mx-auto">
                  Looks like you haven't added any candles to your cart yet.
                  Explore our collections and find your perfect fragrance.
                </p>
                <Link href="/collections" className="btn-primary">
                  Shop Collections
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  {/* Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-burgundy-700/10 text-sm font-sans text-burgundy-700/60 uppercase tracking-wider">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-burgundy-700/10">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                      >
                        {/* Product */}
                        <div className="md:col-span-6 flex gap-4">
                          <Link
                            href={`/products/${item.slug}`}
                            className="relative w-24 h-24 flex-shrink-0 bg-cream-200 overflow-hidden"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          <div>
                            {item.collection && (
                              <p className="text-xs font-sans text-burgundy-700/50 uppercase tracking-wider">
                                {item.collection}
                              </p>
                            )}
                            <Link
                              href={`/products/${item.slug}`}
                              className="font-serif text-lg text-burgundy-700 hover:text-burgundy-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1 mt-2 text-xs font-sans text-burgundy-700/50 hover:text-burgundy-700 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="md:col-span-2 text-center">
                          <span className="md:hidden text-sm font-sans text-burgundy-700/60 mr-2">
                            Price:
                          </span>
                          <span className="font-serif text-burgundy-700">
                            {formatPrice(item.price)}
                          </span>
                          {item.compareAtPrice && (
                            <span className="block text-sm font-serif text-burgundy-700/40 line-through">
                              {formatPrice(item.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-2 flex justify-center">
                          <div className="flex items-center border border-burgundy-700/20">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-burgundy-700/5 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-burgundy-700" />
                            </button>
                            <span className="w-10 text-center font-sans text-burgundy-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-burgundy-700/5 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-burgundy-700" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="md:col-span-2 text-right">
                          <span className="md:hidden text-sm font-sans text-burgundy-700/60 mr-2">
                            Total:
                          </span>
                          <span className="font-sans font-medium text-burgundy-700">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                    <Link
                      href="/collections"
                      className="btn-ghost inline-flex items-center gap-2"
                    >
                      ← Continue Shopping
                    </Link>
                    <button
                      onClick={clearCart}
                      className="text-sm font-sans text-burgundy-700/60 hover:text-burgundy-700 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-cream-200/50 p-6 border border-burgundy-700/10 sticky top-24">
                    <h2 className="font-serif text-xl text-burgundy-700 mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-burgundy-700/70">Subtotal</span>
                        <span className="font-serif text-burgundy-700">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-sans">
                        <span className="text-burgundy-700/70">Shipping</span>
                        <span className="font-serif text-burgundy-700">
                          {freeShipping ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatPrice(shipping)
                          )}
                        </span>
                      </div>
                      {!freeShipping && (
                        <p className="text-xs font-sans text-burgundy-700/50">
                          Add <span className="font-serif">{formatPrice(shippingThreshold - subtotal)}</span> more for free shipping
                        </p>
                      )}
                      <div className="pt-4 border-t border-burgundy-700/10 flex justify-between">
                        <span className="font-sans font-medium text-burgundy-700">Total</span>
                        <span className="font-serif text-xl text-burgundy-700">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      className="btn-primary w-full text-center flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t border-burgundy-700/10">
                      <div className="flex items-center justify-center gap-4 text-xs font-sans text-burgundy-700/50">
                        <span>🔒 Secure Checkout</span>
                        <span>•</span>
                        <span>Free Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
