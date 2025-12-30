// Placeholder images from Unsplash - replace with your actual product images
// To use your own images, place them in public/images/ folder and update these paths

export const placeholderImages = {
  // Hero images - candle/lifestyle shots
  hero: {
    hero1: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=1920&h=1080&fit=crop&q=80',
    hero2: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1920&h=1080&fit=crop&q=80',
    hero3: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=1920&h=1080&fit=crop&q=80',
  },

  // Product images - candles
  products: {
    vanillaDreams: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=600&h=600&fit=crop&q=90',
    vanillaDreamsAlt: 'https://images.unsplash.com/photo-1596082927514-0aa64e6a89d2?w=600&h=600&fit=crop&q=90',
    roseGarden: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&h=600&fit=crop&q=90',
    roseGardenAlt: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=600&h=600&fit=crop&q=90',
    midnightOud: 'https://images.unsplash.com/photo-1603905179674-0d5c5c8e4f9b?w=600&h=600&fit=crop&q=90',
    midnightOudAlt: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&h=600&fit=crop&q=90',
    citrusBurst: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=600&h=600&fit=crop&q=90',
    citrusBurstAlt: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop&q=90',
    lavenderFields: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=600&h=600&fit=crop&q=90',
    lavenderFieldsAlt: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=600&h=600&fit=crop&q=90',
    oceanBreeze: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&h=600&fit=crop&q=90',
    oceanBreezeAlt: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop&q=90',
    warmAmber: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=600&h=600&fit=crop&q=90',
    warmAmberAlt: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=600&h=600&fit=crop&q=90',
    forestPine: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop&q=90',
    forestPineAlt: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=600&h=600&fit=crop&q=90',
    royalJasmine: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&h=600&fit=crop&q=90',
    royalJasmineAlt: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=600&h=600&fit=crop&q=90',
  },

  // Collection banners
  collections: {
    serene: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=1200&h=600&fit=crop&q=80',
    essence: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=1200&h=600&fit=crop&q=80',
    signature: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&h=600&fit=crop&q=80',
  },

  // About/Story images
  about: {
    story: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=800&h=600&fit=crop&q=80',
    craftsmanship: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=600&fit=crop&q=80',
    founder: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80',
  },

  // Rituals images
  rituals: {
    morning: 'https://images.unsplash.com/photo-1602607434266-252e574a9468?w=600&h=400&fit=crop&q=80',
    evening: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=600&h=400&fit=crop&q=80',
    meditation: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=400&fit=crop&q=80',
  },
}

// Helper function to get product image
export function getProductImage(slug: string, isAlt = false): string {
  const key = slug.replace(/-/g, '') + (isAlt ? 'Alt' : '')
  const camelKey = key.charAt(0).toLowerCase() + key.slice(1)
  return (placeholderImages.products as Record<string, string>)[camelKey] || placeholderImages.products.vanillaDreams
}
