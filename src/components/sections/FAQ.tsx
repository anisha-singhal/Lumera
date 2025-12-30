'use client'

import { useState } from 'react'
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
      'A redefined balance of fragrance, craftsmanship, and quiet luxury — created to elevate everyday moments. Each Lumera candle is hand-poured using premium natural waxes, lead-free cotton wicks, and carefully curated fragrance blends that fill your space with sophisticated scents.',
  },
  {
    id: 2,
    question: 'What makes LUMERA candles different?',
    answer:
      'Lumera candles stand apart through our commitment to quality at every step. We use a proprietary soy and coconut wax blend for a cleaner, longer burn. Our fragrances are crafted by expert perfumers using the finest essential and fragrance oils. Every candle is hand-poured in small batches to ensure consistency and quality. Plus, our elegant containers are designed to be reused, making luxury sustainable.',
  },
  {
    id: 3,
    question: 'Are LUMERA candles safe for indoor use?',
    answer:
      'Absolutely. Lumera candles are designed with your safety and well-being in mind. Our natural wax blend produces minimal soot and doesn\'t release harmful toxins. We use lead-free, 100% cotton wicks. All our fragrances are phthalate-free and comply with IFRA (International Fragrance Association) standards. However, we always recommend burning candles in a well-ventilated area and never leaving them unattended.',
  },
  {
    id: 4,
    question: 'What wax do you use?',
    answer:
      'We use a premium blend of natural soy wax and coconut wax. This combination offers the best of both worlds: soy wax provides an excellent fragrance throw and clean burn, while coconut wax adds a creamy texture and helps the candle burn more evenly. Our wax is 100% natural, renewable, biodegradable, and free from paraffin, ensuring a cleaner burning experience.',
  },
  {
    id: 5,
    question: 'Are the candles handmade?',
    answer:
      'Yes, every Lumera candle is handcrafted with love. From measuring and blending our signature wax to hand-pouring each vessel and carefully placing the wick — every step is done by our skilled artisans. This hands-on approach allows us to maintain the highest quality standards and ensures each candle is truly unique.',
  },
  {
    id: 6,
    question: 'Do you ship across India?',
    answer:
      'Yes, we ship to all major cities and towns across India! We offer free standard shipping on orders above ₹999. Standard delivery typically takes 5-7 business days, while express delivery (available for select locations) takes 2-3 business days. All orders are carefully packaged to ensure your candles arrive in perfect condition.',
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
                className={`border transition-all duration-300 ${
                  openId === item.id
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
          <a
            href="mailto:lumeracandlesinfo@gmail.com"
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
          </a>
        </motion.div>
      </div>
    </section>
  )
}
