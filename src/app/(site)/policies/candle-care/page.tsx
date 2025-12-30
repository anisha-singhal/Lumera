import { Header, Footer } from '@/components/layout'
import Link from 'next/link'

export const metadata = {
  title: 'Candle Care & Safety | Lumera',
  description: 'Guidelines to safely enjoy your Lumera candles.',
}

export default function CandleCarePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-burgundy-700 mb-4">Candle Care & Safety</h1>
              <div className="line-accent mx-auto" />
            </div>

            <div className="prose prose-burgundy max-w-none space-y-8 text-burgundy-700/80 font-sans">
              <ul className="list-disc pl-6">
                <li>Burn within sight</li>
                <li>Keep away from children & pets</li>
                <li>Trim wick to 5mm before every burn</li>
                <li>Do not burn for more than 3 hours at a time</li>
              </ul>
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
