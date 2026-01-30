'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'What defines a LUMERA candle?',
    answer:
      'Each Lumera candle is hand-poured with care, made with love and a simple intention to create something that feels special not just to us, but to the people who light it. Lumera is about the emotion of gifting and finding a quiet pause in a fast-moving world. Our candles are meant to bring peace, calm, and comfort into everyday moments. Made with cruelty-free fragrances and Grade-A soy wax, each candle burns gently and cleanly something you light not just for how it smells, but for how it makes you feel.'
  },
  {
    id: 2,
    question: 'What makes LUMERA candles different?',
    answer:
      'At Lumera, we focus on details that truly matter. Our candles are made using premium fragrances sourced from some of the best fragrance manufacturers around the world, with a collection of 95+ unique scents to suit different moods and moments.We use imported glass jars, refined packaging, and thoughtful presentation, making our candles perfect for gifting or personal rituals. Along with quality products, we believe in offering genuine customer service and creating candles that help you slow down, breathe, and find a small pause in a constantly moving world.'
  },
  {
    id: 3,
    question: 'Are LUMERA candles safe for indoor use?',
    answer:
      'Yes, they are. Lumera candles are made with care for both your space and your well-being. We use a clean-burning natural wax blend, lead-free cotton wicks, and cruelty-free, IFRA-compliant fragrances, so they’re gentle and safe for everyday indoor use.We always recommend burning your candle in a well-ventilated room and keeping it within sight. When used mindfully, a Lumera candle is meant to bring comfort, calm, and a sense of ease into your home.',
  },
  {
    id: 4,
    question: 'What wax do you use?',
    answer:
      'We use Grade-A natural soy wax because it burns cleanly and feels gentle in your space. It doesn’t release harsh fumes and helps the candle burn evenly and last longer.We chose soy wax intentionally ,so when you light a Lumera candle, it feels calm, comfortable, and easy to enjoy, without anything heavy or overpowering.',
  },
  // {
  //   id: 5,
  //   question: 'Are the candles handmade?',
  //   answer:
  //     'Yes, every Lumera candle is handcrafted with love. From measuring and blending our signature wax to hand-pouring each vessel and carefully placing the wick — every step is done by our skilled artisans. This hands-on approach allows us to maintain the highest quality standards and ensures each candle is truly unique.',
  // },
  {
    id: 5,
    question: 'Do you ship across India?',
    answer:
      'Yes, we ship across India. Standard delivery usually takes 4–6 business days, depending on your location. If you’re based in Delhi and need your order sooner, you can contact our team for express delivery. We’ll check what’s possible and confirm timelines on a best-effort basis. Even with express handling, delivery may still take up to 4–6 days. Every Lumera order is carefully packed to ensure it reaches you safely and in perfect condition.',
  },
]

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1)

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="section-spacing bg-ivory-100">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-sans tracking-wide-luxury uppercase text-burgundy-700/60 mb-4">
            Have Questions?
          </p>
          <h2 className="font-serif text-burgundy-700 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="line-accent mx-auto" />
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div
                className={`border transition-all duration-300 ${openId === item.id
                  ? 'border-burgundy-700/30 bg-white shadow-luxury'
                  : 'border-burgundy-700/10 bg-transparent hover:border-burgundy-700/20'
                  }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-700 focus-visible:ring-offset-2"
                  aria-expanded={openId === item.id}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="font-serif text-lg text-burgundy-700 pr-8">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full border border-burgundy-700/20 flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-burgundy-700" />
                  </motion.span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openId === item.id && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="pt-2 border-t border-burgundy-700/10">
                          <p className="pt-4 text-burgundy-700/70 font-sans leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-burgundy-700/60 font-sans mb-4">
            Still have questions?
          </p>
          <Link
            href="/contact"
            className="btn-ghost inline-flex items-center gap-2"
          >
            Contact Us
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
