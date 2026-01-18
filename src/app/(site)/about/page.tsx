'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'

// Fade-in animation component for scroll-triggered effects
function FadeIn({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Thin champagne gold divider
function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-24 md:w-32 h-[1px] bg-[#C9A24D]" />
    </div>
  )
}

export default function OurStoryPage() {
  return (
    <>
      <Header />
      <main className="bg-[#F6F1EB] min-h-screen pt-20">

      {/* ============ HERO SECTION ============ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 py-32 md:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-8 md:mb-12"
          >
            Our Story
          </motion.p>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#800020] leading-[1.1] mb-10 md:mb-14"
          >
            Light, done right.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GoldDivider className="mb-10 md:mb-14" />
          </motion.div>

          {/* The Opening */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-sans text-base md:text-lg lg:text-xl text-[#1C1C1C]/70 leading-relaxed max-w-2xl mx-auto tracking-wide"
          >
            Born from obsession. Built for those who notice the details.
          </motion.p>
        </div>
      </section>

      {/* ============ THE BEGINNING ============ */}
      <section className="py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

            {/* Image Column */}
            <FadeIn delay={0.2}>
              <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-lg mx-auto lg:mx-0">
                <Image
                  src="/images/linger-candle.jpg"
                  alt="A single candle flame in darkness"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/20 via-transparent to-transparent" />
              </div>
            </FadeIn>

            {/* Text Column */}
            <FadeIn delay={0.4} className="lg:pl-8">
              <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-6 md:mb-8">
                The Beginning
              </p>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15] mb-8 md:mb-10">
                It started with a habit.
              </h2>

              <div className="space-y-6 md:space-y-8">
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  Lumera didn't start with a business plan. It started with a habit.
                  We, the founders of Lumera candles, have always loved candles. Not
                  just lighting them, but choosing them. Smelling them. Placing them.
                  Letting them set the mood of a room.
                </p>

                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  Over time, buying candles became a small ritual for us. But there
                  was a problem. Every time we searched, something felt off.
                  Sometimes the fragrance was underwhelming. Sometimes the jar looked
                  cheap. Sometimes the candle smelled good but didn't feel premium.
                </p>

                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/60 leading-[1.9] tracking-wide italic">
                  And most of the time, it just didn't feel… intentional.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============ THE REALIZATION ============ */}
      <section className="py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 bg-white/30">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-6 md:mb-8">
              The Realization
            </p>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15] mb-8 md:mb-10">
              If we can't find it, maybe it doesn't exist. Yet.
            </h2>

            <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
              <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                We kept asking ourselves the same question: Why is it so hard to find
                truly premium candles in India — the kind you see abroad? Candles that
                smell rich, look elegant, and feel like an experience, not just a product.
              </p>

              <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                That thought stayed with us. We realized we weren't alone. There were
                people like us — who cared about fragrance depth, glass quality,
                aesthetics, and the emotion a candle creates. People who wanted more
                than "just a candle."
              </p>

              <p className="font-sans text-xl md:text-2xl text-[#800020] leading-[1.6] tracking-wide font-serif mt-10">
                So instead of settling, we decided to build what we were searching for.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ WHY LUMERA ============ */}
      <section className="py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

            {/* Text Column */}
            <FadeIn delay={0.2} className="order-2 lg:order-1 lg:pr-8">
              <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-6 md:mb-8">
                Why Lumera
              </p>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15] mb-8 md:mb-10">
                Crafted to feel international. Made for India.
              </h2>

              <div className="space-y-6 md:space-y-8">
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  Lumera was created to bring world-class candle experiences closer
                  to home. From carefully selected glass jars to fragrances that feel
                  layered, luxurious, and long-lasting — every detail is intentional.
                </p>

                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  We now work with <strong className="text-[#800020]">95+ finely curated fragrances</strong>,
                  because scent is personal. One fragrance can't speak to everyone —
                  but the right one can speak to you.
                </p>

                <div className="pt-6 border-t border-[#C9A24D]/20">
                  <p className="font-sans text-sm md:text-base text-[#1C1C1C]/60 leading-[1.9] tracking-wide mb-4">
                    Lumera is about candles that:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Smell refined, not artificial',
                      'Look premium, not mass-produced',
                      'Feel special, not forgettable'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3 font-sans text-base md:text-lg text-[#1C1C1C]/70">
                        <span className="w-2 h-2 rounded-full bg-[#C9A24D]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* Image Column */}
            <FadeIn delay={0.4} className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
                <Image
                  src="/images/sit-candle.jpg"
                  alt="Premium Lumera candle collection"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1C1C1C]/10" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE BELIEVE ============ */}
      <section className="py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 bg-white/30">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16 md:mb-24">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-6">
              What We Believe
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15]">
              More than just candles
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="max-w-3xl mx-auto space-y-8 text-center">
              <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                We don't believe candles are background objects. We believe they
                create moods, mark moments, and elevate everyday life.
              </p>

              <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                Lumera is for late-night thinkers, slow mornings, deep conversations,
                solo moments, and quiet celebrations. It's for people who notice the
                small things — because small things change how life feels.
              </p>

              <div className="pt-10">
                <p className="font-serif text-xl md:text-2xl text-[#800020] leading-[1.6] tracking-wide italic">
                  "We didn't find the candles we were looking for.<br />
                  So we decided to make them."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ OUR PROMISE ============ */}
      <section className="py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#800020]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column - Promise Checklist */}
            <FadeIn>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#F6F1EB] mb-10 md:mb-12 tracking-wide">
                Our Promise to You
              </h2>

              <ul className="space-y-6 md:space-y-8">
                {[
                  'Each candle hand-poured with care',
                  'Grade-A natural soy wax',
                  '95+ curated premium fragrances',
                  'Cruelty-free and IFRA-compliant',
                  'Thoughtfully packaged, always giftable',
                ].map((promise, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4"
                  >
                    <span className="w-6 h-6 rounded-full border border-[#C9A24D] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="#C9A24D"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="font-serif text-base md:text-lg text-[#F6F1EB]/90 tracking-wide">
                      {promise}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Right Column - Image Cards */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {/* Card 1 */}
                <div className="text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-[#F6F1EB]">
                    <Image
                      src="/images/custom/vessels/frosted-glass.png"
                      alt="Thoughtfully crafted"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-serif text-xs md:text-sm leading-relaxed" style={{ color: '#C9A24D' }}>
                    Small batch<br />craftsmanship
                  </p>
                </div>

                {/* Card 2 */}
                <div className="text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-[#F6F1EB]">
                    <Image
                      src="/images/linger-candle.jpg"
                      alt="Clean-burning"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-serif text-xs md:text-sm leading-relaxed" style={{ color: '#C9A24D' }}>
                    Premium<br />ingredients
                  </p>
                </div>

                {/* Card 3 */}
                <div className="text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-[#F6F1EB]">
                    <Image
                      src="/images/sit-candle.jpg"
                      alt="Imported glass jars"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-serif text-xs md:text-sm leading-relaxed" style={{ color: '#C9A24D' }}>
                    Imported<br />glass jars
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-8">
            Welcome to Lumera
          </p>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15] mb-8 md:mb-10">
            Light, done right.
          </h2>

          <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide mb-10 md:mb-14">
            Discover the fragrance that speaks to you.
          </p>

          <Link
            href="/collections"
            className="inline-block px-10 py-4 bg-[#800020] font-sans text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#5c0017]"
            style={{ color: '#C9A24D' }}
          >
            Explore Collections
          </Link>
        </FadeIn>
      </section>

      </main>
      <Footer />
    </>
  )
}
