import { Header, Footer } from '@/components/layout'
import {
  Hero,
  LumeraRitual,
  Rituals,
  Collections,
  FeaturedProducts,
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

        {/* Featured Products Section */}
        <FeaturedProducts />

        {/* The Lumera Ritual - 5-Step Process */}
        <LumeraRitual />

        {/* The Rituals by Time - Lifestyle/UX Section */}
        <Rituals />

        {/* Product Collections - Serene, Essence, Signature */}
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
