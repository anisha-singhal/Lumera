import { Header, Footer } from '@/components/layout'
import Link from 'next/link'

export const metadata = {
  title: 'Return and Exchange Policy | Lumera',
  description: 'Learn about Lumera\'s return and exchange policies for candle products.',
}

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-burgundy-700 mb-4">Return and Exchange Policy</h1>
              <div className="line-accent mx-auto" />
            </div>

            <div className="prose prose-burgundy max-w-none space-y-8 text-burgundy-700/80 font-sans">
              <section>
                <p>
                  Due to the nature of our products, returns are not accepted. Candles are
                  intimate, scent-driven items and cannot be resold once opened or used.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-burgundy-700 mb-4">Transit Damage</h2>
                <p>
                  If your order arrives damaged in transit, please contact us within 48 hours of
                  delivery with clear images of the packaging and the damaged item. Email us at{' '}
                  <a href="mailto:lumeracandlesinfo@gmail.com" className="text-burgundy-700 underline">
                    lumeracandlesinfo@gmail.com
                  </a>
                  .
                </p>
              </section>
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
