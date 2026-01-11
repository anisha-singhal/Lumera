"use client"

import React from 'react'

const WhatsAppButton: React.FC = () => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919625205260'
  const href = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed z-50 right-5 bottom-5 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:opacity-95"
      style={{ backgroundColor: '#800020', border: '1px solid rgba(201, 162, 77, 0.4)' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M20.5 3.5L3.5 21.5" stroke="white" strokeWidth="0" />
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.668.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.885-.788-1.482-1.761-1.655-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.297.298-.495.099-.198.05-.371-.025-.52-.074-.149-.668-1.611-.915-2.207-.242-.579-.487-.5-.668-.51l-.57-.01c-.198 0-.52.074-.792.371s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487 2.985 1.288 3.31 1.117 3.9 1.05.59-.066 1.87-.763 2.135-1.5.265-.737.265-1.368.186-1.5-.08-.132-.297-.198-.594-.347z" fill="white" />
      </svg>
    </a>
  )
}

export default WhatsAppButton
