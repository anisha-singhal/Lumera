import { Header, Footer } from '@/components/layout'
import Link from 'next/link'

export const metadata = {
  title: 'Shipping Policy | Lumera',
  description: 'Learn about Lumera\'s shipping policies, delivery times, and shipping options across India.',
}

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-burgundy-700 mb-4">Shipping Policy</h1>
              <div className="line-accent mx-auto" />
            </div>

            <div className="prose prose-burgundy max-w-none space-y-8 text-burgundy-700/80 font-sans">
              <section>
                <p>Orders are processed within 2–3 business days.</p>
                <p>Delivery timelines vary between 4–7 business days depending on location.</p>
                <p>We ensure every order is packed with utmost care.</p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-burgundy-700 mb-4">Need help?</h2>
                <p>
                  For shipping queries or concerns, please contact us at{' '}
                  <a href="mailto:Info@lumeracandles.in" className="text-burgundy-700 underline">
                    Info@lumeracandles.in
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+919625205260" className="text-burgundy-700 underline">
                    +91 9625205260
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
