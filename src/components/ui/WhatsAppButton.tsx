'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

/**
 * Floating WhatsApp Button
 * - Position: bottom-6 right-6 (24px from edges)
 * - Size: 48x48px (touch-friendly)
 */
export default function WhatsAppButton({ 
  phoneNumber = '919625205260',
  message = 'Hello! I\'m interested in Lumera candles.'
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{
        backgroundColor: '#25D366',
        width: '48px',
        height: '48px',
        minWidth: '48px',
        minHeight: '48px',
        bottom: '24px', /* bottom-6 */
        right: '24px',  /* right-6 */
      }}
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-5 h-5 text-white" />
    </motion.a>
  )
}
