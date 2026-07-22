'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Star,
  Quote,
  Heart,
  ShieldCheck,
  Leaf,
  Gift,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Instagram,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'

interface Review {
  id: string
  author: string
  location?: string
  rating: number
  content: string
  verifiedBuyer?: boolean
}

const CHARCOAL = '#1C1C1C'
const GOLD = '#C9A24D'

// Marketing headline stats (shown in the image)
const STATS = [
  { icon: Heart, value: '250+', label: 'Happy Customers' },
  { icon: ShieldCheck, value: '98%', label: 'Would Recommend' },
  { icon: Leaf, value: '95+', label: 'Fragrances' },
  { icon: Gift, value: '30+', label: 'Design Styles' },
]

const GALLERY = [
  '/images/linger-candle.jpg',
  '/images/sit-candle.jpg',
  '/images/our-story-candes.jpg',
  '/images/collections/prestige.png',
  '/images/collections/serene.jpg',
  '/images/collections/essence.jpg',
  '/images/collections/valentines.png',
  '/images/collections/state-of-being.png',
  '/images/collections/signature.jpg',
]

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Stars({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} width={size} height={size} fill={GOLD} stroke={GOLD} />
      ))}
    </div>
  )
}

// Fallback reviews so the page always looks complete (matches the image)
const FALLBACK: Review[] = [
  { id: 'f1', author: 'Priya M.', location: 'Delhi', rating: 5, verifiedBuyer: true, content: 'The packaging, the fragrance, everything feels so premium. Lumera is now my go-to!' },
  { id: 'f2', author: 'Arjun S.', location: 'Mumbai', rating: 5, verifiedBuyer: true, content: 'Absolutely loved the aroma of Iced Coffee Latte. It fills the whole room with such a cozy vibe.' },
  { id: 'f3', author: 'Mehak K.', location: 'Bangalore', rating: 5, verifiedBuyer: true, content: 'I ordered it as a gift and the person just loved it. The most elegant candle brand out there!' },
  { id: 'f4', author: 'Rohan T.', location: 'Pune', rating: 5, verifiedBuyer: true, content: 'Clean burn, no soot, and the scent lingers for hours. Worth every rupee.' },
  { id: 'f5', author: 'Ananya R.', location: 'Hyderabad', rating: 5, verifiedBuyer: true, content: 'Beautifully crafted and the fragrance is subtle yet luxurious. Reordering already!' },
  { id: 'f6', author: 'Kabir V.', location: 'Chennai', rating: 5, verifiedBuyer: true, content: 'The gift box experience is unmatched. Felt like unwrapping something truly special.' },
  { id: 'f7', author: 'Sneha P.', location: 'Kolkata', rating: 5, verifiedBuyer: true, content: 'My home has never smelled better. Elegant, calming, and long-lasting.' },
]

interface VideoReview {
  id: string
  videoUrl: string
  posterUrl?: string | null
  author?: string
  location?: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK)
  const [gallery, setGallery] = useState<string[]>(GALLERY)
  const [videos, setVideos] = useState<VideoReview[]>([])
  const [current, setCurrent] = useState(0)
  const [perView, setPerView] = useState(3)
  // Use the supplied hero banner photo if present; otherwise fall back to the built hero
  const [heroImgOk, setHeroImgOk] = useState(true)

  useEffect(() => {
    fetch('/api/reviews?featured=true')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const docs: Review[] = data?.docs || []
        if (docs.length > 0) setReviews(docs)
      })
      .catch(() => {})

    fetch('/api/review-gallery')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const urls: string[] = (data?.docs || []).map((d: any) => d.url).filter(Boolean)
        if (urls.length > 0) setGallery(urls)
      })
      .catch(() => {})

    fetch('/api/video-reviews')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const vids: VideoReview[] = (data?.docs || []).filter((v: any) => v.videoUrl)
        if (vids.length > 0) setVideos(vids)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, reviews.length - perView)
  const clamped = Math.min(current, maxIndex)
  const prev = () => setCurrent((c) => (c <= 0 ? maxIndex : c - 1))
  const next = () => setCurrent((c) => (c >= maxIndex ? 0 : c + 1))

  return (
    <>
      <Header />
      <main className="reviews-page bg-[#F6F1EB] min-h-screen pt-20 overflow-x-hidden">
        {/* Defeat storefront's global `.lumera-site a { color: inherit }` on button-links */}
        <style>{`
          .reviews-page a.btn-dark, .reviews-page a.btn-dark:hover { color:#fff !important; }
          .reviews-page a.btn-outline { color:#1C1C1C !important; }
          .reviews-page a.btn-outline:hover { color:#fff !important; }
          .reviews-page a.btn-light, .reviews-page a.btn-light:hover { color:#1C1C1C !important; }
        `}</style>
        {/* ================= HERO ================= */}
        {heroImgOk ? (
          <section className="w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/reviews-hero.jpg"
              alt="Words That Stay With Us — Real stories. Real moments. Real Lumera."
              className="block w-full h-auto"
              onError={() => setHeroImgOk(false)}
            />
          </section>
        ) : (
        <section className="max-w-7xl mx-auto px-6 md:px-8 pt-10 md:pt-16 pb-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-sans text-[11px] tracking-[0.4em] uppercase mb-6" style={{ color: GOLD }}>
                Reviews
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05]" style={{ color: CHARCOAL }}>
                Words That<br />Stay With Us
              </h1>
              <p className="mt-6 font-sans text-base md:text-lg text-[#6E6E6E]">
                Real stories. Real moments. Real Lumera.
              </p>

              <div className="mt-8 h-px w-40 bg-[#1C1C1C]/15" />

              <div className="mt-6 flex items-center gap-6">
                <div>
                  <div className="flex items-end gap-3">
                    <span className="font-serif text-5xl leading-none" style={{ color: CHARCOAL }}>4.9</span>
                    <div className="mb-1"><Stars size={20} /></div>
                  </div>
                  <p className="mt-2 font-sans text-xs tracking-wider uppercase text-[#6E6E6E]">Average Rating</p>
                </div>
                <div className="h-12 w-px bg-[#1C1C1C]/15" />
                <p className="font-sans text-sm text-[#6E6E6E]">Based on 250+ reviews</p>
              </div>
            </div>

            <FadeIn className="relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-luxury-lg">
                <Image src="/images/linger-candle.jpg" alt="Lumera candle" fill className="object-cover" priority />
              </div>
            </FadeIn>
          </div>
        </section>
        )}

        {/* ================= STATS BAR ================= */}
        <section className="border-y border-[#1C1C1C]/10 bg-white/40">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#1C1C1C]/10">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center px-4 py-8 md:py-10">
                <s.icon className="w-7 h-7 mb-3" style={{ color: GOLD }} strokeWidth={1.5} />
                <span className="font-serif text-3xl md:text-4xl" style={{ color: CHARCOAL }}>{s.value}</span>
                <span className="mt-1 font-sans text-xs md:text-sm tracking-wide text-[#6E6E6E]">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CAROUSEL ================= */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
          <FadeIn className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl" style={{ color: CHARCOAL }}>What Our Customers Say</h2>
            <div className="mt-4 mx-auto w-16 h-px" style={{ backgroundColor: GOLD }} />
          </FadeIn>

          <div className="relative">
            {/* Arrows */}
            <button
              onClick={prev}
              aria-label="Previous reviews"
              className="hidden md:flex absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border border-[#1C1C1C]/15 bg-white text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next reviews"
              className="hidden md:flex absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full border border-[#1C1C1C]/15 bg-white text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Track */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${clamped * (100 / perView)}%)` }}
              >
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 px-3"
                  >
                    <div className="h-full bg-white border border-[#1C1C1C]/10 p-8 flex flex-col items-center text-center">
                      <div className="mb-5"><Stars /></div>
                      <Quote className="w-8 h-8 mb-4" style={{ color: GOLD }} fill={GOLD} />
                      <p className="font-sans text-[15px] leading-relaxed text-[#3a3a3a] flex-1">
                        {rev.content}
                      </p>
                      <div className="mt-6">
                        <p className="font-serif text-lg tracking-wide" style={{ color: CHARCOAL }}>
                          {rev.author}
                        </p>
                        {rev.location && (
                          <p className="font-sans text-xs text-[#6E6E6E] mt-0.5">{rev.location}</p>
                        )}
                      </div>
                      {rev.verifiedBuyer && (
                        <div className="mt-5 pt-4 border-t border-[#1C1C1C]/10 w-full flex items-center justify-center gap-1.5" style={{ color: GOLD }}>
                          <BadgeCheck className="w-4 h-4" />
                          <span className="font-sans text-xs tracking-wide">Verified Buyer</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{ minHeight: 0, minWidth: 0, height: 8 }}
                  className={`rounded-full transition-all ${
                    i === clamped ? 'w-6 bg-[#800020]' : 'w-2 bg-[#1C1C1C]/20 hover:bg-[#1C1C1C]/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="#all-reviews"
              className="btn-dark inline-flex items-center justify-center px-10 py-4 bg-[#800020] text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#5c0017] transition-colors"
            >
              View All Reviews
            </Link>
          </div>
        </section>

        {/* ================= VIDEO REVIEWS ================= */}
        {videos.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-8 pb-4 md:pb-8">
            <FadeIn className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl" style={{ color: CHARCOAL }}>Video Reviews</h2>
              <p className="mt-3 font-sans text-sm text-[#6E6E6E]">Hear it straight from our community</p>
              <div className="mt-4 mx-auto w-16 h-px" style={{ backgroundColor: GOLD }} />
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {videos.map((v) => (
                <FadeIn key={v.id} className="group">
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#1C1C1C] shadow-luxury">
                    <video
                      src={v.videoUrl}
                      poster={v.posterUrl || undefined}
                      controls
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  {(v.author || v.location) && (
                    <div className="mt-3 text-center">
                      {v.author && (
                        <p className="font-serif text-base tracking-wide" style={{ color: CHARCOAL }}>{v.author}</p>
                      )}
                      {v.location && <p className="font-sans text-xs text-[#6E6E6E]">{v.location}</p>}
                    </div>
                  )}
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {/* ================= GALLERY ================= */}
        <section id="all-reviews" className="bg-white/50 border-t border-[#1C1C1C]/10 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <FadeIn className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl" style={{ color: CHARCOAL }}>Loved in Real Life</h2>
              <p className="mt-3 font-sans text-sm text-[#6E6E6E]">Real moments shared by our beautiful community</p>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {gallery.map((src, i) => (
                <FadeIn key={src + i} delay={(i % 5) * 0.05} className="relative overflow-hidden rounded-lg group">
                  <div className="relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt="Lumera moment"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>

            <div className="flex flex-col items-center mt-10">
              <a
                href="https://www.instagram.com/lumeracandles.in/"
                target="_blank"
                rel="noreferrer"
                className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 border border-[#1C1C1C]/30 text-[#1C1C1C] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#1C1C1C] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Share Your Lumera Moment
              </a>
              <p className="mt-4 font-sans text-xs text-[#6E6E6E]">Tag us @lumeracandles.in to get featured</p>
            </div>
          </div>
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-14 md:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-[#1C1C1C]">
            <div className="grid md:grid-cols-2 items-center">
              <div className="relative h-56 md:h-full min-h-[220px]">
                <Image src="/images/our-story-candes.jpg" alt="Lumera candles" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1C1C]" />
              </div>
              <div className="p-8 md:p-14">
                <h2 className="font-serif text-3xl md:text-4xl text-white">Ready to Create Your Own Moments?</h2>
                <p className="mt-4 font-sans text-sm md:text-base text-white/70">
                  Find your perfect fragrance and make every moment memorable.
                </p>
                <Link
                  href="/collections"
                  className="btn-light mt-8 inline-flex items-center justify-center px-10 py-4 bg-white text-[#1C1C1C] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#C9A24D] hover:text-[#1C1C1C] transition-colors"
                >
                  Shop the Collection
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
