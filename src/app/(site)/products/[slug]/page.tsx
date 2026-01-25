'use client'

import { use, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Clock,
  Share2,
  Check
} from 'lucide-react'
import { placeholderImages } from '@/lib/placeholders'
import { useCart, useWishlist } from '@/context'

// Sample product data - in production this would come from Payload CMS
const productsData: Record<string, {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  collection: string
  collectionSlug: string
  fragrance: {
    topNotes: string[]
    heartNotes: string[]
    baseNotes: string[]
    family: string
    intensity: string
  }
  specifications: {
    burnTime: { minimum: number; maximum: number }
    weight: { value: number; unit: string }
    dimensions: { height: number; diameter: number }
    waxType: string
    wickType: string
    container: string
  }
  features: string[]
  careInstructions: string[]
  isNew?: boolean
  isBestSeller?: boolean
  inStock: boolean
  stockQuantity: number
  promoTag?: string
}> = {
  'vanilla-dreams': {
    id: '1',
    name: 'Vanilla Dreams',
    tagline: 'A warm embrace of comfort',
    description: 'Indulge in the rich, creamy sweetness of our Vanilla Dreams candle. This luxurious blend combines the warmth of pure vanilla bean with hints of caramel and sandalwood, creating a comforting atmosphere that wraps around you like a cozy blanket. Perfect for quiet evenings and moments of self-care.',
    price: 1299,
    compareAtPrice: 1599,
    images: [
      placeholderImages.products.vanillaDreams,
      placeholderImages.products.vanillaDreamsAlt,
      placeholderImages.products.roseGarden,
    ],
    collection: 'Signature',
    collectionSlug: 'signature',
    fragrance: {
      topNotes: ['Vanilla Bean', 'Caramel', 'Bergamot'],
      heartNotes: ['Sandalwood', 'Coconut Milk', 'Jasmine'],
      baseNotes: ['Musk', 'Amber', 'Tonka Bean'],
      family: 'Gourmand',
      intensity: 'Moderate',
    },
    specifications: {
      burnTime: { minimum: 45, maximum: 55 },
      weight: { value: 200, unit: 'g' },
      dimensions: { height: 10, diameter: 8 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Phthalate-free fragrance',
      'Vegan & Cruelty-free',
      'Reusable glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    isBestSeller: true,
    inStock: true,
    stockQuantity: 25,
  },
  'midnight-oud': {
    id: '3',
    name: 'Midnight Oud',
    tagline: 'Mystery in every flame',
    description: 'Experience the exotic allure of Midnight Oud. This sophisticated fragrance opens with the brightness of bergamot and saffron, unfolding into a heart of precious oud and damask rose. The base of sandalwood and amber creates a lasting impression of mystery and luxury.',
    price: 2499,
    images: [
      placeholderImages.products.midnightOud,
      placeholderImages.products.midnightOudAlt,
      placeholderImages.products.warmAmber,
    ],
    collection: 'Signature',
    collectionSlug: 'signature',
    fragrance: {
      topNotes: ['Bergamot', 'Saffron', 'Pink Pepper'],
      heartNotes: ['Oud', 'Damask Rose', 'Geranium'],
      baseNotes: ['Sandalwood', 'Amber', 'Leather'],
      family: 'Oriental',
      intensity: 'Strong',
    },
    specifications: {
      burnTime: { minimum: 55, maximum: 65 },
      weight: { value: 300, unit: 'g' },
      dimensions: { height: 12, diameter: 9 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Premium fragrance oils',
      'Vegan & Cruelty-free',
      'Luxury glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    inStock: true,
    stockQuantity: 15,
  },
  'rose-garden': {
    id: '2',
    name: 'Rose Garden',
    tagline: 'Petals of pure elegance',
    description: 'Step into a blooming rose garden with this exquisite floral candle. Bulgarian rose and peony create a romantic heart, while jasmine and lily add depth. The subtle base of white musk ensures this fragrance remains elegant and never overwhelming.',
    price: 1499,
    images: [
      placeholderImages.products.roseGarden,
      placeholderImages.products.roseGardenAlt,
      placeholderImages.products.lavenderFields,
    ],
    collection: 'Moments',
    collectionSlug: 'moments',
    fragrance: {
      topNotes: ['Bulgarian Rose', 'Peony', 'Green Leaves'],
      heartNotes: ['Jasmine', 'Lily of the Valley', 'Magnolia'],
      baseNotes: ['White Musk', 'Cedar', 'Soft Woods'],
      family: 'Floral',
      intensity: 'Moderate',
    },
    specifications: {
      burnTime: { minimum: 50, maximum: 60 },
      weight: { value: 250, unit: 'g' },
      dimensions: { height: 11, diameter: 8.5 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Phthalate-free fragrance',
      'Vegan & Cruelty-free',
      'Elegant glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    isNew: true,
    inStock: true,
    stockQuantity: 20,
  },
  'citrus-burst': {
    id: '4',
    name: 'Citrus Burst',
    tagline: 'Morning sunshine captured',
    description: 'Wake up to the refreshing energy of Citrus Burst. This vibrant candle combines zesty lemon, sweet orange, and tangy grapefruit to create an invigorating atmosphere. Perfect for morning rituals or whenever you need a boost of positivity.',
    price: 999,
    images: [
      placeholderImages.products.citrusBurst,
      placeholderImages.products.vanillaDreams,
      placeholderImages.products.oceanBreeze,
    ],
    collection: 'Ritual',
    collectionSlug: 'ritual',
    fragrance: {
      topNotes: ['Lemon', 'Orange', 'Grapefruit'],
      heartNotes: ['Lemongrass', 'Green Tea', 'Mint'],
      baseNotes: ['White Cedar', 'Light Musk', 'Vetiver'],
      family: 'Citrus',
      intensity: 'Light',
    },
    specifications: {
      burnTime: { minimum: 35, maximum: 45 },
      weight: { value: 150, unit: 'g' },
      dimensions: { height: 8, diameter: 7 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Phthalate-free fragrance',
      'Vegan & Cruelty-free',
      'Reusable glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    inStock: true,
    stockQuantity: 30,
  },
  'lavender-fields': {
    id: '5',
    name: 'Lavender Fields',
    tagline: 'Peace in purple blooms',
    description: 'Transport yourself to the lavender fields of Provence with this calming candle. French lavender blends with eucalyptus and chamomile to create a soothing sanctuary. Ideal for unwinding after a long day or creating a peaceful bedtime ritual.',
    price: 1199,
    images: [
      placeholderImages.products.lavenderFields,
      placeholderImages.products.roseGarden,
      placeholderImages.products.oceanBreeze,
    ],
    collection: 'Ritual',
    collectionSlug: 'ritual',
    fragrance: {
      topNotes: ['French Lavender', 'Eucalyptus', 'Bergamot'],
      heartNotes: ['Chamomile', 'Geranium', 'Clary Sage'],
      baseNotes: ['Sandalwood', 'Vanilla', 'Soft Musk'],
      family: 'Floral Herbal',
      intensity: 'Moderate',
    },
    specifications: {
      burnTime: { minimum: 40, maximum: 50 },
      weight: { value: 180, unit: 'g' },
      dimensions: { height: 9, diameter: 7.5 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Phthalate-free fragrance',
      'Vegan & Cruelty-free',
      'Reusable glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    inStock: true,
    stockQuantity: 25,
  },
  'ocean-breeze': {
    id: '6',
    name: 'Ocean Breeze',
    tagline: 'Waves of tranquility',
    description: 'Feel the calming embrace of the ocean with this refreshing candle. Sea salt mingles with bergamot and aquatic notes to bring the serenity of coastal mornings into your home. Close your eyes and let the waves wash your worries away.',
    price: 1099,
    images: [
      placeholderImages.products.oceanBreeze,
      placeholderImages.products.citrusBurst,
      placeholderImages.products.lavenderFields,
    ],
    collection: 'Ritual',
    collectionSlug: 'ritual',
    fragrance: {
      topNotes: ['Sea Salt', 'Bergamot', 'Ozone'],
      heartNotes: ['Water Lily', 'Jasmine', 'Sea Moss'],
      baseNotes: ['Driftwood', 'White Amber', 'Musk'],
      family: 'Aquatic',
      intensity: 'Light',
    },
    specifications: {
      burnTime: { minimum: 40, maximum: 50 },
      weight: { value: 180, unit: 'g' },
      dimensions: { height: 9, diameter: 7.5 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Phthalate-free fragrance',
      'Vegan & Cruelty-free',
      'Reusable glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    inStock: true,
    stockQuantity: 22,
  },
  'warm-amber': {
    id: '7',
    name: 'Warm Amber',
    tagline: 'Golden warmth within',
    description: 'Bask in the warm glow of Warm Amber. This cozy candle opens with orange zest and cinnamon, warming into a heart of rich amber and honey. The sandalwood and vanilla base creates a comforting atmosphere perfect for cold evenings.',
    price: 1399,
    images: [
      placeholderImages.products.warmAmber,
      placeholderImages.products.vanillaDreams,
      placeholderImages.products.midnightOud,
    ],
    collection: 'Moments',
    collectionSlug: 'moments',
    fragrance: {
      topNotes: ['Orange Zest', 'Cinnamon', 'Cardamom'],
      heartNotes: ['Amber', 'Honey', 'Ginger'],
      baseNotes: ['Sandalwood', 'Vanilla', 'Benzoin'],
      family: 'Oriental',
      intensity: 'Moderate',
    },
    specifications: {
      burnTime: { minimum: 45, maximum: 55 },
      weight: { value: 200, unit: 'g' },
      dimensions: { height: 10, diameter: 8 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Premium fragrance oils',
      'Vegan & Cruelty-free',
      'Elegant glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    isBestSeller: true,
    inStock: true,
    stockQuantity: 18,
  },
  'forest-pine': {
    id: '8',
    name: 'Forest Pine',
    tagline: "Nature's embrace",
    description: 'Escape to a serene forest with Forest Pine. Pine needle and eucalyptus create a crisp, clean opening, while cedar and fir balsam add depth. The earthy base of moss and oakwood makes every breath feel like a walk among the trees.',
    price: 1299,
    images: [
      placeholderImages.products.forestPine,
      placeholderImages.products.warmAmber,
      placeholderImages.products.oceanBreeze,
    ],
    collection: 'Moments',
    collectionSlug: 'moments',
    fragrance: {
      topNotes: ['Pine Needle', 'Eucalyptus', 'Fir Balsam'],
      heartNotes: ['Cedar', 'Juniper Berry', 'Rosemary'],
      baseNotes: ['Forest Moss', 'Oakwood', 'Vetiver'],
      family: 'Woody',
      intensity: 'Strong',
    },
    specifications: {
      burnTime: { minimum: 45, maximum: 55 },
      weight: { value: 200, unit: 'g' },
      dimensions: { height: 10, diameter: 8 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Premium fragrance oils',
      'Vegan & Cruelty-free',
      'Rustic glass container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    inStock: true,
    stockQuantity: 20,
  },
  'royal-jasmine': {
    id: '9',
    name: 'Royal Jasmine',
    tagline: 'Elegance personified',
    description: 'Experience the intoxicating beauty of Royal Jasmine. Indian jasmine and neroli create a luxurious floral bouquet, while ylang-ylang adds exotic depth. The base of white sandalwood and golden amber makes this a truly regal experience.',
    price: 2999,
    images: [
      placeholderImages.products.royalJasmine,
      placeholderImages.products.roseGarden,
      placeholderImages.products.midnightOud,
    ],
    collection: 'Signature',
    collectionSlug: 'signature',
    fragrance: {
      topNotes: ['Indian Jasmine', 'Neroli', 'Mandarin'],
      heartNotes: ['Ylang-Ylang', 'Tuberose', 'Orange Blossom'],
      baseNotes: ['White Sandalwood', 'Golden Amber', 'Musk'],
      family: 'Floral Oriental',
      intensity: 'Strong',
    },
    specifications: {
      burnTime: { minimum: 60, maximum: 70 },
      weight: { value: 350, unit: 'g' },
      dimensions: { height: 12, diameter: 10 },
      waxType: 'Soy & Coconut Blend',
      wickType: 'Cotton Wick',
      container: 'Luxury Glass Jar',
    },
    features: [
      '100% Natural Soy-Coconut Wax',
      'Hand-poured in small batches',
      'Lead-free cotton wick',
      'Rare fragrance ingredients',
      'Vegan & Cruelty-free',
      'Premium luxury container',
    ],
    careInstructions: [
      'Trim wick to 1/4 inch before each lighting',
      'Allow wax to melt to edges on first burn',
      'Burn for no more than 4 hours at a time',
      'Keep away from drafts and flammable materials',
      'Never leave a burning candle unattended',
    ],
    isNew: true,
    inStock: true,
    stockQuantity: 12,
  },
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'care'>('description')
  const [isAdded, setIsAdded] = useState(false)
  
  const { addToCart, setIsCartOpen } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const product = productsData[slug]

  if (!product) {
    notFound()
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
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
              <Link href="/collections" className="text-burgundy-700/50 hover:text-burgundy-700">
                Collections
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <Link href={`/collections?collection=${product.collectionSlug}`} className="text-burgundy-700/50 hover:text-burgundy-700">
                {product.collection}
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <span className="text-burgundy-700">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="section-spacing bg-cream-100">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Main Image */}
                <div className="relative aspect-square overflow-hidden bg-cream-200 mb-4">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.promoTag && (
                      <span className="px-3 py-1 bg-[#1e3a5f] text-white text-xs font-sans font-bold tracking-wider uppercase animate-pulse">
                        {product.promoTag}
                      </span>
                    )}
                    {product.isNew && (
                      <span className="px-3 py-1 bg-burgundy-700 text-cream-100 text-xs font-sans tracking-wider uppercase">
                        New
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="px-3 py-1 bg-champagne-500 text-burgundy-700 text-xs font-sans tracking-wider uppercase">
                        Best Seller
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-3 py-1 bg-burgundy-700/90 text-cream-100 text-xs font-sans tracking-wider">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails - Larger on mobile for touch targets */}
                <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-burgundy-700'
                          : 'border-transparent hover:border-burgundy-700/30'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link
                  href={`/collections?collection=${product.collectionSlug}`}
                  className="text-sm font-sans tracking-wider uppercase text-burgundy-700/50 hover:text-burgundy-700 transition-colors"
                >
                  {product.collection} Collection
                </Link>

                <h1 className="font-serif text-3xl md:text-4xl text-burgundy-700 mt-2 mb-2">
                  {product.name}
                </h1>

                <p className="font-serif text-lg text-champagne-600 italic mb-4">
                  {product.tagline}
                </p>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-serif text-3xl text-burgundy-700">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-sans text-lg text-burgundy-700/40 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>

                {/* Fragrance Family */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 text-sm font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-burgundy-700/60">Fragrance Family:</span>
                    <span className="text-burgundy-700">{product.fragrance.family}</span>
                  </div>
                  <span className="hidden sm:inline text-burgundy-700/30">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-burgundy-700/60">Intensity:</span>
                    <span className="text-burgundy-700">{product.fragrance.intensity}</span>
                  </div>
                </div>

                {/* Fragrance Notes */}
                <div className="mb-6 p-4 bg-cream-200/50 border border-burgundy-700/10">
                  <p className="text-xs font-sans tracking-wider uppercase text-burgundy-700/50 mb-3">
                    Fragrance Notes
                  </p>
                  <div className="space-y-2 text-sm font-sans">
                    <p>
                      <span className="text-burgundy-700/60">Top:</span>{' '}
                      <span className="text-burgundy-700">{product.fragrance.topNotes.join(', ')}</span>
                    </p>
                    <p>
                      <span className="text-burgundy-700/60">Heart:</span>{' '}
                      <span className="text-burgundy-700">{product.fragrance.heartNotes.join(', ')}</span>
                    </p>
                    <p>
                      <span className="text-burgundy-700/60">Base:</span>{' '}
                      <span className="text-burgundy-700">{product.fragrance.baseNotes.join(', ')}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Quantity - Touch-friendly buttons */}
                  <div className="flex items-center border border-burgundy-700/20">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 min-w-[48px] min-h-[48px] hover:bg-burgundy-700/5 transition-colors flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-burgundy-700" />
                    </button>
                    <span className="w-14 text-center font-sans text-burgundy-700">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-4 min-w-[48px] min-h-[48px] hover:bg-burgundy-700/5 transition-colors flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-burgundy-700" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    disabled={!product.inStock || isAdded}
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        slug: slug,
                        price: product.price,
                        image: product.images[0],
                        collection: product.collection,
                      }, quantity)
                      setIsAdded(true)
                      setTimeout(() => {
                        setIsAdded(false)
                        setIsCartOpen(true)
                      }, 500)
                    }}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id)
                      } else {
                        addToWishlist({
                          id: product.id,
                          name: product.name,
                          slug: slug,
                          price: product.price,
                          image: product.images[0],
                          collection: product.collection,
                        })
                      }
                    }}
                    className={`p-3 border transition-all duration-300 ${
                      isInWishlist(product.id)
                        ? 'bg-burgundy-700 border-burgundy-700 text-cream-100'
                        : 'border-burgundy-700/20 text-burgundy-700 hover:border-burgundy-700'
                    }`}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Stock Status */}
                {product.inStock && product.stockQuantity <= 10 && (
                  <p className="text-sm font-sans text-burgundy-700/70 mb-6">
                    Only {product.stockQuantity} left in stock
                  </p>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <Truck className="w-5 h-5 text-burgundy-700" />
                    <span>Free shipping over ₹999</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <RotateCcw className="w-5 h-5 text-burgundy-700" />
                    <span>7-day returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <Shield className="w-5 h-5 text-burgundy-700" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <Clock className="w-5 h-5 text-burgundy-700" />
                    <span>{product.specifications.burnTime.minimum}-{product.specifications.burnTime.maximum}h burn time</span>
                  </div>
                </div>

                {/* Share */}
                <button className="flex items-center gap-2 text-sm font-sans text-burgundy-700/60 hover:text-burgundy-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share this product
                </button>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="mt-16">
              <div className="flex border-b border-burgundy-700/10">
                {(['description', 'details', 'care'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-sans tracking-wider uppercase transition-all ${
                      activeTab === tab
                        ? 'text-burgundy-700 border-b-2 border-burgundy-700'
                        : 'text-burgundy-700/50 hover:text-burgundy-700'
                    }`}
                  >
                    {tab === 'description' ? 'Description' : tab === 'details' ? 'Details' : 'Care Instructions'}
                  </button>
                ))}
              </div>

              <div className="py-8">
                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-3xl"
                  >
                    <p className="text-burgundy-700/70 font-sans leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <h4 className="font-serif text-lg text-burgundy-700 mb-4">Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm font-sans text-burgundy-700/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-champagne-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-xl"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-burgundy-700/10">
                        <span className="text-burgundy-700/60 font-sans">Weight</span>
                        <span className="text-burgundy-700 font-sans">{product.specifications.weight.value}{product.specifications.weight.unit}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-burgundy-700/10">
                        <span className="text-burgundy-700/60 font-sans">Dimensions</span>
                        <span className="text-burgundy-700 font-sans">{product.specifications.dimensions.height}cm H x {product.specifications.dimensions.diameter}cm D</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-burgundy-700/10">
                        <span className="text-burgundy-700/60 font-sans">Burn Time</span>
                        <span className="text-burgundy-700 font-sans">{product.specifications.burnTime.minimum}-{product.specifications.burnTime.maximum} hours</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-burgundy-700/10">
                        <span className="text-burgundy-700/60 font-sans">Wax Type</span>
                        <span className="text-burgundy-700 font-sans">{product.specifications.waxType}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-burgundy-700/10">
                        <span className="text-burgundy-700/60 font-sans">Wick</span>
                        <span className="text-burgundy-700 font-sans">{product.specifications.wickType}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-burgundy-700/10">
                        <span className="text-burgundy-700/60 font-sans">Container</span>
                        <span className="text-burgundy-700 font-sans">{product.specifications.container}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'care' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-xl"
                  >
                    <ul className="space-y-4">
                      {product.careInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3 text-burgundy-700/70 font-sans">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-burgundy-700 text-cream-100 flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
