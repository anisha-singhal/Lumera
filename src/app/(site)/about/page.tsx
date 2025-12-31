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
            Light, created with intention.
          </motion.h1>
          
              <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GoldDivider className="mb-10 md:mb-14" />
              </motion.div>

          {/* The Quiet Idea */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-sans text-base md:text-lg lg:text-xl text-[#1C1C1C]/70 leading-relaxed max-w-2xl mx-auto tracking-wide"
          >
            In a world that moves too fast, Lumera was born from a quiet idea: 
            that light should mean something. That fragrance should tell a story. 
            That every flicker of flame can become a moment of presence.
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
                It started with stillness.
              </h2>
              
              <div className="space-y-6 md:space-y-8">
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  We weren't looking to build a brand. We were searching for a 
                  pause — a way to carve out quiet in lives that had grown too loud. 
                  The answer came in the form of a flame.
                </p>
                
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  That first candle, poured by hand in a small kitchen, wasn't 
                  meant for anyone else. It was a ritual. A way to signal to 
                  ourselves that this moment mattered. And from that single 
                  flame, Lumera was born.
                </p>
                
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/60 leading-[1.9] tracking-wide italic">
                  "We don't make candles to fill rooms. We make them to create space."
                </p>
              </div>
            </FadeIn>
          </div>
          </div>
        </section>

      {/* ============ THE PHILOSOPHY ============ */}
      <section className="py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 bg-white/30">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16 md:mb-24">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-6">
              The Philosophy
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15]">
              What we believe
            </h2>
          </FadeIn>
          
          {/* Three Pillars */}
          <div className="space-y-16 md:space-y-20">
            {/* Pillar 1 */}
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-baseline">
                <div className="md:col-span-1">
                  <span className="font-serif text-5xl md:text-6xl text-[#C9A24D]">01</span>
                </div>
                <div className="md:col-span-11">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#800020] mb-4 md:mb-6">
                    Thoughtful design over excess
                  </h3>
                  <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide max-w-2xl">
                    Every element of a Lumera candle is considered. The weight of the vessel, 
                    the curve of the label, the way light catches the wax. We believe restraint 
                    is the highest form of luxury.
                  </p>
                </div>
              </div>
            </FadeIn>
            
            {/* Pillar 2 */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-baseline">
                <div className="md:col-span-1">
                  <span className="font-serif text-5xl md:text-6xl text-[#C9A24D]">02</span>
                </div>
                <div className="md:col-span-11">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#800020] mb-4 md:mb-6">
                    Emotion over trends
                  </h3>
                  <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide max-w-2xl">
                    We don't chase what's popular. Our fragrances are composed to evoke 
                    memory, stillness, and feeling. A Lumera scent should transport you 
                    somewhere true — not somewhere everyone else is going.
                  </p>
                </div>
              </div>
            </FadeIn>
            
            {/* Pillar 3 */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-baseline">
                <div className="md:col-span-1">
                  <span className="font-serif text-5xl md:text-6xl text-[#C9A24D]">03</span>
                  </div>
                <div className="md:col-span-11">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#800020] mb-4 md:mb-6">
                    Intention over impulse
                  </h3>
                  <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide max-w-2xl">
                    Lighting a candle should be a choice, not a habit. We encourage our 
                    community to be present with their rituals — to notice the flame, 
                    breathe the fragrance, and find stillness in the glow.
                  </p>
                </div>
              </div>
            </FadeIn>
            </div>
          </div>
        </section>

      {/* ============ THE ART OF CRAFT ============ */}
      <section className="py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
            
            {/* Text Column */}
            <FadeIn delay={0.2} className="order-2 lg:order-1 lg:pr-8">
              <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-6 md:mb-8">
                The Art of Craft
              </p>
              
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15] mb-8 md:mb-10">
                Made slowly, by hand.
              </h2>
              
              <div className="space-y-6 md:space-y-8">
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  Each Lumera candle is poured in small batches of fifty. Never more. 
                  This isn't efficiency — it's intimacy. Our artisans know each vessel 
                  by touch, each fragrance by heart.
                </p>
                
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  We use a proprietary blend of natural soy and coconut wax — chosen 
                  for its clean burn, superior scent throw, and the way it pools into 
                  a perfect, glowing circle. Our wicks are lead-free cotton, trimmed 
                  by hand before every candle leaves our studio.
                </p>
                
                <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                  No shortcuts. No compromise. Just fire, wax, and the quiet devotion 
                  of people who care deeply about what they make.
                </p>
              </div>
              
              {/* Stats */}
              <div className="mt-12 md:mt-16 pt-8 border-t border-[#C9A24D]/20">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="font-serif text-3xl md:text-4xl text-[#800020]">12</span>
                    <p className="font-sans text-xs md:text-sm text-[#1C1C1C]/50 tracking-wide mt-1">
                      candles per batch
                    </p>
                  </div>
                  <div>
                    <span className="font-serif text-3xl md:text-4xl text-[#800020]">50+</span>
                    <p className="font-sans text-xs md:text-sm text-[#1C1C1C]/50 tracking-wide mt-1">
                      hours burn time
                    </p>
                  </div>
                  <div>
                    <span className="font-serif text-3xl md:text-4xl text-[#800020]">zero</span>
                    <p className="font-sans text-xs md:text-sm text-[#1C1C1C]/50 tracking-wide mt-1">
                      synthetic additives
                    </p>
                  </div>
            </div>
          </div>
            </FadeIn>
            
            {/* Image Column */}
            <FadeIn delay={0.4} className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
                    <Image
                  src="/images/sit-candle.jpg"
                  alt="Artisan pouring wax into a candle vessel"
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

      {/* ============ OUR PROMISE TO YOU ============ */}
      <section className="py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#800020]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Promise Checklist */}
            <FadeIn>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#F6F1EB] mb-10 md:mb-12 tracking-wide">
                OUR PROMISE TO YOU
              </h2>
              
              <ul className="space-y-6 md:space-y-8">
                {[
                  'Every candle hand poured with care',
                  '100% natural soy-coconut wax blend',
                  'Thoughtfully packaged, always giftable',
                  'Cruelty-free and vegan',
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
                {/* Card 1 - Crafted in small batches */}
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
                    Thoughtfully<br />crafted in small batches
                  </p>
                </div>
                
                {/* Card 2 - Clean-burning */}
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
                    Clean-burning,<br />premium ingredients
                  </p>
                </div>
                
                {/* Card 3 - Plastic-free packaging */}
                <div className="text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-[#F6F1EB]">
                    <Image
                      src="/images/sit-candle.jpg"
                      alt="Plastic-free packaging"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-serif text-xs md:text-sm leading-relaxed" style={{ color: '#C9A24D' }}>
                    Plastic-free package<br />pledge
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
            Begin Your Ritual
          </p>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15] mb-8 md:mb-10">
            Ready to find your light?
              </h2>
          
          <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide mb-10 md:mb-14">
            Explore our collections and discover the fragrance that speaks to you.
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
