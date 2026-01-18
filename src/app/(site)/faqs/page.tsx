'use client'

import { useState } from 'react'
import { Header, Footer } from '@/components/layout'
import Link from 'next/link'
import { ChevronDown, Sparkles, Leaf, Shield, Package, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    icon: Sparkles,
    question: 'What defines a LUMERA candle?',
    answer: `Each Lumera candle is hand-poured with care, made with love and a simple intention to create something that feels special not just to us, but to the people who light it. Lumera is about the emotion of gifting and finding a quiet pause in a fast-moving world. Our candles are meant to bring peace, calm, and comfort into everyday moments. Made with cruelty-free fragrances and Grade-A soy wax, each candle burns gently and cleanly — something you light not just for how it smells, but for how it makes you feel.`,
  },
  {
    icon: Shield,
    question: 'What makes LUMERA candles different?',
    answer: `At Lumera, we focus on details that truly matter. Our candles are made using premium fragrances sourced from some of the best fragrance manufacturers around the world, with a collection of 95+ unique scents to suit different moods and moments. We use imported glass jars, refined packaging, and thoughtful presentation, making our candles perfect for gifting or personal rituals. Along with quality products, we believe in offering genuine customer service and creating candles that help you slow down, breathe, and find a small pause in a constantly moving world.`,
  },
  {
    icon: Shield,
    question: 'Are LUMERA candles safe for indoor use?',
    answer: `Yes, they are. Lumera candles are made with care for both your space and your well-being. We use a clean-burning natural wax blend, lead-free cotton wicks, and cruelty-free, IFRA-compliant fragrances, so they're gentle and safe for everyday indoor use. We always recommend burning your candle in a well-ventilated room and keeping it within sight. When used mindfully, a Lumera candle is meant to bring comfort, calm, and a sense of ease into your home.`,
  },
  {
    icon: Leaf,
    question: 'What wax do you use?',
    answer: `We use Grade-A natural soy wax because it burns cleanly and feels gentle in your space. It doesn't release harsh fumes and helps the candle burn evenly and last longer. We chose soy wax intentionally — so when you light a Lumera candle, it feels calm, comfortable, and easy to enjoy, without anything heavy or overpowering.`,
  },
  {
    icon: Truck,
    question: 'Do you ship across India?',
    answer: `Yes, we ship across India. Standard delivery usually takes 4–6 business days, depending on your location. If you're based in Delhi and need your order sooner, you can contact our team for express delivery. We'll check what's possible and confirm timelines on a best-effort basis. Even with express handling, delivery may still take up to 4–6 days. Every Lumera order is carefully packed to ensure it reaches you safely and in perfect condition.`,
  },
]

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0], isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border-b border-burgundy-700/10">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-start gap-4 text-left group"
      >
        <div className="w-10 h-10 rounded-full bg-burgundy-700/5 flex items-center justify-center flex-shrink-0 group-hover:bg-burgundy-700/10 transition-colors">
          <faq.icon className="w-5 h-5 text-[#C9A24D]" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg text-burgundy-700 pr-8">
            {faq.question}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-burgundy-700/50 transition-transform duration-300 flex-shrink-0 mt-1 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 pl-14 pr-8 font-sans text-burgundy-700/70 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <p className="text-sm font-sans tracking-wide-luxury uppercase text-[#C9A24D] mb-4">
                Got Questions?
              </p>
              <h1 className="font-serif text-burgundy-700 mb-4">Frequently Asked Questions</h1>
              <div className="line-accent mx-auto mb-6" />
              <p className="text-burgundy-700/70 font-sans max-w-xl mx-auto">
                Everything you need to know about Lumera candles. Can't find your answer?
                Feel free to reach out to us.
              </p>
            </div>

            <div className="bg-white shadow-luxury">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center p-8 bg-cream-200/50 border border-burgundy-700/10">
              <h2 className="font-serif text-xl text-burgundy-700 mb-3">
                Still have questions?
              </h2>
              <p className="text-sm font-sans text-burgundy-700/70 mb-6">
                We're here to help. Reach out to us anytime.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
            </div>

            <div className="mt-12 text-center">
              <Link href="/" className="btn-ghost">
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
