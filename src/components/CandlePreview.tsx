'use client'

import React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

const DEFAULT_WAX_COLOR = '#F4E8DB'

const VESSEL_CONFIG: Record<
  string,
  {
    id: string
    label: string
    imageSrc: string
    jarClassName?: string
    waxBoundsClassName?: string
  }
> = {
  'frosted-glass': {
    id: 'frosted-glass',
    label: 'Matte Frosted Glass',
    // Matches vesselOptions image path in CustomCandleBuilder
    imageSrc: '/images/custom/vessels/frosted-glass.png',
    jarClassName:
      'bg-[radial-gradient(circle_at_30%_0,rgba(255,255,255,0.9),transparent_55%),radial-gradient(circle_at_80%_120%,rgba(0,0,0,0.25),transparent_60%)]',
    // Narrower and slightly lower so the wax sits inside the glass, not across the middle
    waxBoundsClassName: 'left-1/2 -translate-x-1/2 bottom-9 w-[64%] h-16 rounded-t-[999px]',
  },
  ceramic: {
    id: 'ceramic',
    label: 'Hand-Glazed Ceramic',
    imageSrc: '/images/custom/vessels/ceramic.png',
    jarClassName:
      'bg-[radial-gradient(circle_at_15%_0,rgba(255,255,255,0.8),transparent_55%),radial-gradient(circle_at_80%_120%,rgba(0,0,0,0.28),transparent_60%)]',
    waxBoundsClassName: 'left-1/2 -translate-x-1/2 bottom-8 w-[70%] h-14 rounded-t-[999px]',
  },
  'hammered-metal': {
    id: 'hammered-metal',
    label: 'Hand-Hammered Brass',
    imageSrc: '/images/custom/vessels/hammered-metal.png',
    jarClassName:
      'bg-[radial-gradient(circle_at_20%_0,rgba(255,255,255,0.85),transparent_55%),radial-gradient(circle_at_80%_120%,rgba(0,0,0,0.3),transparent_60%)]',
    waxBoundsClassName: 'left-1/2 -translate-x-1/2 bottom-10 w-[68%] h-18 rounded-t-[999px]',
  },
}

export type CandlePreviewProps = {
  /** Key for the vessel variant, e.g. 'hammered-brass' | 'frosted-glass' */
  vesselType: string
  /** Any valid CSS color (hex, rgb, hsl, css var) for the wax */
  waxColor?: string
  /** Text rendered on the label overlay */
  labelText?: string
  /**
   * When true, keeps the preview visible near the top of the viewport on mobile
   * while the user scrolls through options.
   */
  mobileSticky?: boolean
}

export function CandlePreview({
  vesselType,
  waxColor = DEFAULT_WAX_COLOR,
  labelText = 'For My Ritual',
  mobileSticky = true,
}: CandlePreviewProps) {
  const vessel = VESSEL_CONFIG[vesselType] ?? VESSEL_CONFIG['hammered-brass']

  const containerClasses = clsx(
    'relative w-full max-w-md md:max-w-none',
    'bg-[#F6F1EB] shadow-[0_28px_70px_rgba(0,0,0,0.22)]',
    'px-6 pt-6 pb-8 md:px-8 md:pt-8 md:pb-10',
    'flex items-center justify-center',
    mobileSticky
      ? 'sticky top-20 z-20 md:static md:z-0'
      : 'md:static md:z-0',
  )

  return (
    <section aria-label="Live candle preview" className={containerClasses}>
      {/* Soft vignette around the whole preview */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_20%_0,rgba(255,255,255,0.85),transparent_55%),radial-gradient(circle_at_80%_120%,rgba(0,0,0,0.28),transparent_60%)] opacity-70 mix-blend-soft-light" />

      {/* Candle stack */}
      <div className="relative w-full max-w-xs aspect-[3/4] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={vessel.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Base jar image with subtle lighting overlays */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Glow from the flame on the rim */}
              <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-10 bg-[radial-gradient(circle_at_50%_0,rgba(201,162,77,0.7),transparent_65%)] opacity-60 mix-blend-screen" />

              {/* Jar lighting gradient (simulates frosted/metal surface) */}
              <div
                className={clsx(
                  'absolute inset-[10%] rounded-[32px] backdrop-blur-[1.5px] mix-blend-soft-light',
                  vessel.jarClassName,
                )}
              />

              {/* Base vessel image */}
              <Image
                src={vessel.imageSrc}
                alt={vessel.label}
                fill
                sizes="(max-width: 768px) 70vw, 320px"
                className="object-contain relative z-10 select-none pointer-events-none"
                priority={false}
              />

              {/* Wax overlay (semi-translucent soy texture) */}
              <div
                className={clsx(
                  'pointer-events-none absolute z-20 opacity-90 mix-blend-multiply',
                  'bg-[radial-gradient(circle_at_20%_0,rgba(255,255,255,0.6),transparent_55%),radial-gradient(circle_at_80%_120%,rgba(0,0,0,0.2),transparent_70%)]',
                  vessel.waxBoundsClassName ?? 'inset-x-12 bottom-14 h-12 rounded-t-[999px]',
                )}
                style={{ backgroundColor: waxColor }}
              />

              {/* Label overlay */}
              <div className="pointer-events-none absolute z-30 inset-x-[17%] bottom-10 h-9 bg-[rgba(246,241,235,0.88)] border border-[rgba(0,0,0,0.04)] shadow-[0_6px_14px_rgba(0,0,0,0.12)] flex items-center justify-center px-3">
                <p
                  className="font-serif text-[11px] md:text-xs tracking-[0.18em] uppercase text-[#1E1B18] text-center truncate"
                  title={labelText}
                >
                  {labelText || 'For My Ritual'}
                </p>
              </div>

              {/* Animated flame */}
              <motion.div
                className="pointer-events-none absolute top-[19%] left-1/2 -translate-x-1/2 z-40 w-5 h-10 flex items-center justify-center"
                animate={{
                  scaleY: [0.9, 1.05, 0.95, 1],
                  scaleX: [0.85, 1, 0.95, 0.9],
                  y: [0, -2, 1, 0],
                  opacity: [0.9, 1, 0.95, 1],
                }}
                transition={{
                  duration: 1.9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-3 h-7 rounded-full bg-gradient-to-t from-[#F0B35C] via-[#FFE6A4] to-white shadow-[0_0_18px_rgba(201,162,77,0.9)] blur-[0.5px]" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Soft base shadow to make candle sit on surface */}
      <div className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-6 bg-[radial-gradient(circle,rgba(0,0,0,0.25),transparent_60%)] opacity-60" />
    </section>
  )
}
