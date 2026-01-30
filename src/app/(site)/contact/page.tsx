'use client'

import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/layout'
import { Mail, Phone, MessageCircle } from 'lucide-react'

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email Us',
    value: 'Info@lumeracandles.in',
    href: 'mailto:Info@lumeracandles.in',
    description: 'We\'ll respond within 24 hours',
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Call Us',
    value: '+91 9625205260 / +91 81789 47955',
    href: 'tel:+919625205260',
    description: 'Mon-Sat, 10 AM - 6 PM IST',
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: 'WhatsApp',
    value: '+91 9625205260',
    href: 'https://wa.me/9625205260',
    description: 'Quick responses via WhatsApp',
  },
]

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-cream-100 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(128,0,32,0.03),transparent_50%)]" />

          <div className="section-container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm font-sans tracking-wide-luxury uppercase text-burgundy-700/60 mb-4">
                Get in Touch
              </p>
              <h1 className="font-serif text-burgundy-700 mb-6">Contact Us</h1>
              <div className="line-accent mx-auto mb-6" />
              <p className="max-w-xl mx-auto text-burgundy-700/70 font-sans leading-relaxed">
                Have a question, feedback, or just want to say hello? We'd love to hear from you.
                Our team is here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-cream-200/50">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white p-6 border border-burgundy-700/10 hover:border-burgundy-700/30 hover:shadow-luxury transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-lumera-beige flex items-center justify-center text-lumera-burgundy group-hover:bg-lumera-burgundy group-hover:text-lumera-ivory transition-all duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-burgundy-700 mb-1">
                        {info.title}
                      </h3>
                      <p className="font-sans text-burgundy-700 font-medium mb-1">
                        {info.value}
                      </p>
                      <p className="text-sm font-sans text-burgundy-700/50">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}