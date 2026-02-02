import { Header, Footer } from '@/components/layout'
import {
  Hero,
  LumeraRitual,
  Collections,
  OurStory,
  FAQ,
} from '@/components/sections'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Light Meets Soul */}
        <Hero />

        {/* The Lumera Ritual - 5-Step Process */}
        <LumeraRitual />

        {/* Product Collections - Prestige, State of Being, Mineral & Texture */}
        <Collections />

        {/* Our Story - Heartfelt Brand Story */}
        <OurStory />

        {/* FAQ with Accordions */}
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
