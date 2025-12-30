'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const pillars = [
  {
    number: '01',
    title: 'Thoughtful Design',
    description: 'Every element is considered — the weight of the vessel, the curve of the label, the way light catches the wax.',
  },
  {
    number: '02',
    title: 'Emotion Over Trends',
    description: 'Our fragrances evoke memory and feeling. A Lumera scent transports you somewhere true.',
  },
  {
    number: '03',
    title: 'Intention Over Impulse',
    description: 'Lighting a candle should be a choice. We encourage presence in every ritual.',
  },
]

export default function OurStory() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-[#F6F1EB]">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(128,0,32,0.02),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(201,162,77,0.05),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-6">
            Our Story
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#800020] leading-[1.15] mb-6">
            Light, created with intention.
          </h2>
          <div className="flex justify-center">
            <div className="w-20 h-[1px] bg-[#C9A24D]" />
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 md:mb-28">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <Image
                src="/images/linger-candle.jpg"
                alt="Lumera candle glowing in soft light"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/10 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-6 md:space-y-8">
              <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                Lumera was born from a quiet idea: that light should mean something. 
                In a world that moves too fast, we create spaces of intentional calm — 
                one flame at a time.
              </p>
              
              <p className="font-sans text-base md:text-lg text-[#1C1C1C]/70 leading-[1.9] tracking-wide">
                Each candle is poured in small batches of twelve. Never more. 
                Our artisans know each vessel by touch, each fragrance by heart. 
                We use a proprietary blend of natural soy and coconut wax — 
                chosen for its clean burn and superior scent throw.
              </p>
              
              <p className="font-serif text-lg md:text-xl text-[#800020] leading-relaxed italic">
                "We don't make candles to fill rooms. We make them to create space."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Philosophy Pillars */}
        <div className="border-t border-[#C9A24D]/20 pt-16 md:pt-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C9A24D] mb-10 md:mb-14 text-center"
          >
            What We Believe
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center md:text-left"
              >
                <span className="font-serif text-4xl md:text-5xl text-[#C9A24D] mb-4 block">
                  {pillar.number}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-[#800020] mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm md:text-base text-[#1C1C1C]/60 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 md:mt-20"
        >
          <Link 
            href="/about" 
            className="inline-block px-10 py-4 bg-[#800020] font-sans text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#5c0017]"
            style={{ color: '#C9A24D' }}
          >
            Read Our Full Story
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
